export interface IPostgRESTBaseUrlResponse {
  definitions: {
    [tableName: string]: {
      required: string[]
      properties: {
        [columnName: string]: {
          description: string
          format: string
          type: 'string' | 'integer' | 'boolean' | 'number' | 'object'
        }
      }
    }
  }
}

export interface IParsedDatabaseSchema {
  [tableName: string]: {
    [columnName: string]: {
      isPrimaryKey: boolean
      type: 'string' | 'integer' | 'boolean' | 'number' | 'object'
      foreignKeyTo: {
        table: string
        column: string
      }
    }
  }
}

// <fk table='actor' column='actor_id'/>
const regex = /fk table='(.*)'\scolumn='(.*)'/

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

      parsedSchema[dbTable] = {
        ...parsedSchema[dbTable],
        [tableCol]: {
          isPrimaryKey:
            columnProperties.description?.includes('<pk/>') ?? false,
          type: columnProperties.type,
          foreignKeyTo:
            (columnProperties.description?.includes('<fk') && {
              table: columnProperties.description.match(regex)[1],
              column: columnProperties.description.match(regex)[2]
            }) ||
            undefined
        }
      }
    }
  }

  return parsedSchema
}
