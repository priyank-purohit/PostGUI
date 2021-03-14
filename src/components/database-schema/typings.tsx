export interface IPostgRESTBaseUrlResponse {
  definitions?: {
    [tableName: string]: {
      required: string[]
      properties: {
        [columnName: string]: {
          description?: string
          format: string
          type: 'string' | 'integer' | 'boolean' | 'number' | 'object'
          maxLength?: number
        }
      }
    }
  }
}

export interface IParsedColumnSchema {
  isPrimaryKey: boolean
  type: 'string' | 'integer' | 'boolean' | 'number' | 'object'
  // TODO: this should be an array, right? Multiple columns could have it as a FK. Maybe?
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
