import Dexie, { type Table } from 'dexie'

export class DexieDatabase {
  private dexieInstance: Dexie

    constructor(databaseName: string , version: number = 1, tables: Record<string, string> = {}) {
    this.dexieInstance = new Dexie(databaseName)
    if (version) {
      this.dexieInstance.version(version).stores(tables)
    }
  }

  public getInstance(): Dexie {
    return this.dexieInstance
  }

  public getTable<T>(tableName: string): Table<T> {
    return this.dexieInstance.table(tableName)
  }
}

