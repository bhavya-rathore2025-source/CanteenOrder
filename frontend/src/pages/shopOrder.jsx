import { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/shopOrder.css'
export function ShopOrders() {
  const [orders, setOrders] = useState([])

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/app/shop-orders', { withCredentials: true })

      setOrders(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // 🔥 Group orders by OrderId
  const groupedOrders = orders.reduce((acc, item) => {
    if (!acc[item.OrderId]) {
      acc[item.OrderId] = {
        orderId: item.OrderId,
        student: item.StudentUsername,
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

  const updateStatus = async (orderId) => {
    try {
      await axios.put('http://localhost:5000/app/update-order-status', { orderId, status: 'Cooked' }, { withCredentials: true })

      fetchOrders()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='orders-page'>
      <h2>📦 Incoming Orders</h2>

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
              <strong>Student:</strong> {order.student}
            </p>
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

            {order.status === 'Pending' && (
              <button className='cook-btn' onClick={() => updateStatus(order.orderId)}>
                Mark as Cooked
              </button>
            )}
          </div>
        ))
      )}
    </div>
  )
}
