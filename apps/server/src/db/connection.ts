import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import path from 'path'
import fs from 'fs'

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Initialize SQLite database
const sqlite = new Database(path.join(dataDir, 'motocare.db'))

// Enable WAL mode for better performance
sqlite.pragma('journal_mode = WAL')

// Create Drizzle instance
export const db = drizzle(sqlite, { schema })

// Run migrations on startup (only in development)
// In production, migrations should be run separately
if (process.env.NODE_ENV !== 'production') {
  try {
    migrate(db, { migrationsFolder: './drizzle' })
    console.log('✅ Database migrations completed')
  } catch (error) {
    console.error('❌ Database migration failed:', error)
  }
}

export type { Database } from './schema'