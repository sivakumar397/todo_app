import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const register = async (req, res) => {
  try {
    const { user_name, email, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 10)
    const newUser = await User.register({ user_name, email, password: hashedPassword })
    res.status(201).json(newUser)
  } catch (err) {
    res.status(500).json({ error: 'Error registering user:' })
    console.log('err:', err)
  }
}

export const login = async (req, res) => {
  try {
    const { user_name, password } = req.body
    const user = await User.findByUsername(user_name)
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: 'Invalid username or password.' })
    }
    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.json({ token })
  } catch (err) {
    res.status(500).json({ error: 'Error logging in:', err })
  }
}
