import pg from 'pg' // Default import
import dotenv from 'dotenv'

const { Pool } = pg // Destructure the Pool from the default export
dotenv.config()

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
})

// Check database connection
pool
  .connect()
  .then(() => {
    console.log('DB connected successfully')
  })
  .catch((err) => {
    console.error('Error connecting to the DB:', err)
  })

export default {
  query: (text, params) => pool.query(text, params),
}
