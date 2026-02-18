import { poolPromise } from '../db/sql.js'

export const getMyItems = async (req, res) => {
  try {
    const role = req.user.role

    if (role === 'student') {
      return res.status(403).json({ error: 'Access denied' })
    }

    const pool = await poolPromise

    const result = await pool.request().input('shop', role).query(`
        SELECT * FROM menu
        WHERE ShopName = @shop
      `)

    res.json(result.recordset)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Server error' })
  }
}
export const addItem = async (req, res) => {
  try {
    const role = req.user.role
    const { name, price } = req.body

    if (role === 'student') {
      return res.status(403).json({ error: 'Access denied' })
    }

    const pool = await poolPromise

    await pool.request().input('name', name).input('price', price).input('shop', role).query(`
        INSERT INTO menu (Name, Price, ShopName, IsAvailable)
        VALUES (@name, @price, @shop, 1)
      `)

    res.json({ success: true })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Server error' })
  }
}
export const updatePrice = async (req, res) => {
  try {
    const role = req.user.role
    const { id, price } = req.body

    const pool = await poolPromise

    await pool.request().input('id', id).input('price', price).input('shop', role).query(`
        UPDATE menu
        SET Price = @price
        WHERE Id = @id AND ShopName = @shop
      `)

    res.json({ success: true })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Server error' })
  }
}
export const deleteItem = async (req, res) => {
  try {
    const role = req.user.role
    const { id } = req.body

    const pool = await poolPromise

    await pool.request().input('id', id).input('shop', role).query(`
        DELETE FROM menu
        WHERE Id = @id AND ShopName = @shop
      `)

    res.json({ success: true })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Server error' })
  }
}
export const toggleAvailability = async (req, res) => {
  const role = req.user.role
  const { id, available } = req.body

  const pool = await poolPromise

  await pool
    .request()
    .input('id', id)
    .input('shop', role)
    .input('available', available ? 1 : 0).query(`
      UPDATE menu
      SET IsAvailable = @available
      WHERE Id = @id AND ShopName = @shop
    `)

  res.json({ success: true })
}
