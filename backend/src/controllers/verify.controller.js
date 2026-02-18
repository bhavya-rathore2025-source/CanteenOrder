import jwt from 'jsonwebtoken'

export const verifyUser = (req, res) => {
  const token = req.cookies.token

  if (!token) {
    return res.json({ authenticated: false })
  }

  try {
    const decoded = jwt.verify(token, 'anykey')
    return res.json({ authenticated: true, user: decoded })
  } catch (err) {
    return res.json({ authenticated: false })
  }
}
