import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('name', 30).notNullable()
      table.string('mobile', 10).notNullable()
      table.string('email', 254).notNullable().unique()
      table.enu('gender', ['MALE', 'FEMALE']).notNullable()
      table.date('date_of_birth').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
