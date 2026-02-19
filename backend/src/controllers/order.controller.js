import { poolPromise } from '../db/sql.js'

export const placeOrder = async (req, res) => {
  const pool = await poolPromise
  try {
    const username = req.user.username
    const { cart } = req.body // cart object { foodId: quantity }

    if (!cart || Object.keys(cart).length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    const transaction = pool.transaction()
    await transaction.begin()

    try {
      let totalAmount = 0

      // Insert into Orders first
      const orderResult = await transaction.request().input('username', username).input('total', 0).query(`
          INSERT INTO Orders (StudentUsername, TotalAmount)
          OUTPUT INSERTED.Id
          VALUES (@username, @total)
        `)

      const orderId = orderResult.recordset[0].Id

      // Loop through cart items
      for (const foodId in cart) {
        const quantity = cart[foodId]

        // Get price from Food table
        const foodResult = await transaction.request().input('foodId', foodId).query(`
            SELECT Price FROM menu WHERE Id = @foodId
          `)

        const price = foodResult.recordset[0].Price
        totalAmount += price * quantity

        await transaction.request().input('orderId', orderId).input('foodId', foodId).input('qty', quantity).input('price', price).query(`
            INSERT INTO OrderItems (OrderId, FoodId, Quantity, Price)
            VALUES (@orderId, @foodId, @qty, @price)
          `)
      }

      // Update total amount
      await transaction.request().input('orderId', orderId).input('total', totalAmount).query(`
          UPDATE Orders
          SET TotalAmount = @total
          WHERE Id = @orderId
        `)

      await transaction.commit()

      res.json({ success: true, orderId })
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getShopOrders = async (req, res) => {
  const pool = await poolPromise
  try {
    const role = req.user.role // snacks, cakes, etc

    if (role === 'student') {
      return res.status(403).json({ error: 'Access denied' })
    }

    const result = await pool.request().input('shop', role).query(`
        SELECT 
            o.Id AS OrderId,
            o.StudentUsername,
            o.Status,
            o.CreatedAt,
            oi.Quantity,
            oi.Price,
            m.Name AS ItemName
        FROM Orders o
        JOIN OrderItems oi ON o.Id = oi.OrderId
        JOIN Menu m ON oi.FoodId = m.Id
        WHERE m.ShopName = @shop
        ORDER BY o.CreatedAt DESC
      `)

    res.json(result.recordset)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Server error' })
  }
}
export const updateOrderStatus = async (req, res) => {
  try {
    const role = req.user.role
    const { orderId, status } = req.body

    if (role === 'student') {
      return res.status(403).json({ error: 'Access denied' })
    }

    const pool = await poolPromise

    await pool.request().input('orderId', orderId).input('status', status).query(`
        UPDATE Orders
        SET Status = @status
        WHERE Id = @orderId
      `)

    res.json({ success: true })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Server error' })
  }
}
