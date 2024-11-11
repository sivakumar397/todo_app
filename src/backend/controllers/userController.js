// src/backend/controllers/userController.js
import db from '../config/db.js'

// Endpoint to find user ID by username
export const findUserIdByUsername = async (req, res) => {
  const { user_name } = req.body

  try {
    // Query to find the user by username
    const result = await db.query('SELECT user_id, user_name FROM users WHERE user_name = $1', [
      user_name,
    ])

    if (result.rows.length > 0) {
      const user = result.rows[0]
      console.log('userController user_id:', user.user_id)
      console.log('userController user_name:', user.user_name)

      return res.json({ user_id: user.user_id })
    } else {
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    console.error('Error finding user by username:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
