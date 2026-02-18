import { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/shopDashboard.css'

export function ShopDashboard() {
  const [items, setItems] = useState([])
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [loading, setLoading] = useState(true)

  // 🔥 Fetch Only His Items
  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/app/my-items', { withCredentials: true })

      setItems(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  // 🔥 Add Item
  const handleAdd = async () => {
    if (!newName || !newPrice) return

    try {
      await axios.post('http://localhost:5000/app/add-item', { name: newName, price: newPrice }, { withCredentials: true })

      setNewName('')
      setNewPrice('')
      fetchItems()
    } catch (err) {
      console.log(err)
    }
  }

  // 🔥 Update Price
  const updatePrice = async (id, price) => {
    try {
      await axios.put('http://localhost:5000/app/update-price', { id, price }, { withCredentials: true })

      fetchItems()
    } catch (err) {
      console.log(err)
    }
  }

  // 🔥 Delete Item
  const deleteItem = async (id) => {
    try {
      await axios.delete('http://localhost:5000/app/delete-item', {
        data: { id },
        withCredentials: true,
      })

      fetchItems()
    } catch (err) {
      console.log(err)
    }
  }

  // 🔥 Toggle Availability
  const toggleAvailability = async (id, current) => {
    try {
      await axios.put('http://localhost:5000/app/toggle-availability', { id, available: !current }, { withCredentials: true })

      fetchItems()
    } catch (err) {
      console.log(err)
    }
  }

  if (loading) return <h2 style={{ textAlign: 'center' }}>Loading...</h2>

  return (
    <div className='shop-page'>
      <h2>👨‍🍳 Shop Dashboard</h2>

      {/* Add Item Section */}
      <div className='add-section'>
        <input placeholder='Item name' value={newName} onChange={(e) => setNewName(e.target.value)} />
        <input placeholder='Price' type='number' value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
        <button onClick={handleAdd}>Add Item</button>
      </div>

      {/* Item List */}
      <div className='shop-grid'>
        {items.map((item) => (
          <div key={item.Id} className='shop-card'>
            <h3>{item.Name}</h3>
            <p>₹{item.Price}</p>
            <p>Status: {item.IsAvailable ? '✅ Available' : '❌ Out of Stock'}</p>

            <div className='actions'>
              <button onClick={() => updatePrice(item.Id, prompt('Enter new price:', item.Price))}>Change Price</button>

              <button onClick={() => toggleAvailability(item.Id, item.IsAvailable)}>Toggle Stock</button>

              <button className='delete-btn' onClick={() => deleteItem(item.Id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
