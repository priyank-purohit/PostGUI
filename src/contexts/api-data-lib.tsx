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

export interface IParsedColumnSchema {
  isPrimaryKey: boolean
  type: 'string' | 'integer' | 'boolean' | 'number' | 'object'
  // TODO: this should be an array, right? Multiple columns could have it as a FK.
  foreignKeyTo: {
    table: string
    column: string
  }
}

export interface IParsedTableSchema {
  [columnName: string]: IParsedColumnSchema
}

export interface IParsedDatabaseSchema {
  [tableName: string]: IParsedTableSchema
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

      const isPrimaryKey =
        columnProperties.description?.includes('<pk/>') ?? false

      const type = columnProperties.type

      const foreignKeyTo =
        (columnProperties.description?.includes('<fk') && {
          table: columnProperties.description.match(regex)[1],
          column: columnProperties.description.match(regex)[2]
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
