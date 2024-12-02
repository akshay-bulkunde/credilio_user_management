import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RemoveFullNameFromUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('full_name')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('full_name').nullable()
    })
  }
}
