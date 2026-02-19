import { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/studentOrders.css'

export function StudentOrders() {
  const [orders, setOrders] = useState([])

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/app/student-orders', { withCredentials: true })

      setOrders(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchOrders()

    const interval = setInterval(() => {
      fetchOrders()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // 🔥 Group orders by OrderId
  const groupedOrders = orders.reduce((acc, item) => {
    if (!acc[item.OrderId]) {
      acc[item.OrderId] = {
        orderId: item.OrderId,
        status: item.Status,
        createdAt: item.CreatedAt,
        items: [],
      }
    }

    acc[item.OrderId].items.push({
      name: item.ItemName,
      quantity: item.Quantity,
      price: item.Price,
    })

    return acc
  }, {})

  return (
    <div className='student-orders-page'>
      <h2>🧾 My Orders</h2>

      {Object.values(groupedOrders).length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        Object.values(groupedOrders).map((order) => (
          <div key={order.orderId} className='order-card'>
            <div className='order-header'>
              <h3>Order #{order.orderId}</h3>
              <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
            </div>

            <p>
              <strong>Placed At:</strong> {new Date(order.createdAt).toLocaleString()}
            </p>

            <div className='items'>
              {order.items.map((item, index) => (
                <div key={index} className='order-item'>
                  {item.quantity} × {item.name} (₹{item.price})
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
