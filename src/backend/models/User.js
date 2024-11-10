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

  findByUsername: async (user_name) => {
    const result = await db.query('SELECT * FROM users WHERE user_name = $1', [user_name])
    return result.rows[0]
  },
}

//module.exports = User
export default User
