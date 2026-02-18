import { poolPromise } from '../db/sql.js'
import bcrypt from 'bcryptjs'

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.json({ register: 'All fields required' })
    }

    const hashedPass = await bcrypt.hash(password, 10)

    const pool = await poolPromise

    // ✅ Check if username exists
    const check = await pool.request().input('username', username).query('SELECT Id FROM Users WHERE Username = @username')

    if (check.recordset.length > 0) {
      return res.json({ register: 'Username already exists' })
    }

    // ✅ Insert new student (role fixed as 'student')
    await pool.request().input('username', username).input('email', email).input('password', hashedPass).query(`
        INSERT INTO Users (Username, Email, PasswordHash, Role)
        VALUES (@username, @email, @password, 'student')
      `)

    return res.json({ register: 'done' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
