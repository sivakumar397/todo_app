import db from '../config/db.js'

const User = {
  register: async (userData) => {
    const { user_name, email, password } = userData
    const result = await db.query(
      'INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [user_name, email, password],
    )
    return result.rows[0]
  },

  /*findById: async (user_id) => {
    const result = await db.query('SELECT * FROM users WHERE user_id = $1', [user_id])
    return result.rows[0]
  },*/

  // Find user by email
  findByEmail: async (email) => {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email])
    return result.rows[0]
  },
}

//module.exports = User
export default User
