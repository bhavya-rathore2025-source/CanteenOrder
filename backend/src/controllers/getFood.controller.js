import { poolPromise } from '../db/sql.js'

export const getFood = async (req, res) => {
  try {
    const pool = await poolPromise

    const result = await pool.request().query(`
        SELECT Id, Name, Price, ShopName, IsAvailable, ImageUrl
        FROM Menu
      `)

    res.status(200).json(result.recordset)
  } catch (error) {
    console.error('Error fetching food:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
