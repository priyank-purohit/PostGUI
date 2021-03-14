import { IParsedDatabaseSchema, IPostgRESTBaseUrlResponse } from './typings';


// <fk table='actor' column='actor_id'/>
export const FOREIGN_KEY_REGEX = /fk table='(.*)'\scolumn='(.*)'/

/**
 * Maps the response from GET / to make it easier to work with in this app.
 */
export const parseDatabaseSchema = (
  baseUrlResponse: IPostgRESTBaseUrlResponse
): IParsedDatabaseSchema => {
  if (!baseUrlResponse?.definitions) {
    return {}
  }

  const parsedSchema: IParsedDatabaseSchema = {}

  const databaseTables = Object.keys(baseUrlResponse.definitions)

  for (const dbTable of databaseTables) {
    const tableColumns = Object.keys(
      baseUrlResponse.definitions[dbTable].properties
    )

    for (const tableCol of tableColumns) {
      const columnProperties =
        baseUrlResponse.definitions[dbTable].properties[tableCol]

      const isPrimaryKey =
        columnProperties.description?.includes('<pk/>') ?? false

      const type = columnProperties.type

      const foreignKeyTo =
        (columnProperties.description?.includes('<fk') && {
          table: columnProperties.description.match(FOREIGN_KEY_REGEX)[1],
          column: columnProperties.description.match(FOREIGN_KEY_REGEX)[2]
        }) ||
        undefined

      parsedSchema[dbTable] = {
        ...parsedSchema[dbTable],
        [tableCol]: {
          isPrimaryKey,
          type,
          foreignKeyTo
        }
      }
    }
  }

  return parsedSchema
}
