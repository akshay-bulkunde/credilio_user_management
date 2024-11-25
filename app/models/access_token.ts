import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class AccessToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tokenableId: number

  @column()
  declare type: string

  @column()
  declare name: string | null

  @column()
  declare hash: string

  @column()
  declare abilities: string

  @column.dateTime()
  declare createdAt: DateTime

  @column.dateTime()
  declare updatedAt: DateTime

  @column.dateTime()
  declare lastUsedAt: DateTime | null

  @column.dateTime()
  declare expiresAt: DateTime | null

  @belongsTo(() => User, {
    foreignKey: 'tokenableId',
  })
  declare user: BelongsTo<typeof User>
}
