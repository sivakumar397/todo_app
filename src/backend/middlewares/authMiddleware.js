import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']
  if (!token) return res.status(403).json({ error: 'Token required.' })

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized.' })
    req.user = decoded
    next()
  })
}
