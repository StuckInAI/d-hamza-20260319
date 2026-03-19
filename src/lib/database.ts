import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Todo } from './entity/Todo'

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_URL || './database.sqlite',
  synchronize: true,
  logging: false,
  entities: [Todo],
  migrations: [],
  subscribers: [],
})

let initialized = false

export async function initializeDatabase() {
  if (!initialized) {
    try {
      await AppDataSource.initialize()
      console.log('Database initialized')
      initialized = true
    } catch (error) {
      console.error('Error initializing database:', error)
      throw error
    }
  }
  return AppDataSource
}