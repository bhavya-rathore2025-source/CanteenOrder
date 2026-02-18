import { poolPromise } from '../db/sql.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body

    const pool = await poolPromise.connect()

    // ✅ Query only matching user
    const result = await pool.request().input('username', username).query('SELECT * FROM Users WHERE Username = @username')

    const user = result.recordset[0]

    if (!user) {
      return res.json({ login: 'invalid' })
    }

    const isMatch = await bcrypt.compare(password, user.PasswordHash)

    if (!isMatch) {
      return res.json({ login: 'invalid' })
    }

    // Remove password before token
    const token = jwt.sign(
      {
        id: user.Id,
        username: user.Username,
        role: user.Role,
      },
      'anykey',
      { expiresIn: '3d' },
    )

    res.cookie('token', token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false, // true in production
      sameSite: 'lax',
    })

    return res.json({ login: 'done', role: user.Role })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const logOut = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  })

  res.json({ logout: 'done' })
}
