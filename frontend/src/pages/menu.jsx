import { useState, useEffect, useMemo } from 'react'
import '../styles/menu.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export function FullMenu({ cart, setCart, menuItems, setLoggedIn }) {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [recommendations, setRecommendations] = useState([])
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello 👋 I am your canteen assistant.' },
    { sender: 'bot', text: 'Try: suggest under 50, add samosa, total' },
  ])
  const [input, setInput] = useState('')

  // 🔥 Normalize backend data ONCE

  // Prevent crash while loading

  const addToCart = (id, qty = 1) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + qty,
    }))
  }

  const getCartTotal = () =>
    Object.entries(cart).reduce((total, [id, qty]) => {
      const item = menuItems.find((i) => i.id === Number(id))
      return total + (item?.price || 0) * qty
    }, 0)

  const handleLogout = async () => {
    await axios.get('http://localhost:5000/app/logout', { withCredentials: true })
    await setLoggedIn(false)
    navigate('/login')
  }

  const filteredItems = menuItems.filter((item) => {
    const byCategory = activeCategory === 'All' || item.category === activeCategory
    const bySearch = item.name.toLowerCase().includes(search.toLowerCase())
    return byCategory && bySearch
  })

  // 🔥 AI Picks (Cheapest 3)
  useEffect(() => {
    const cheapest = [...menuItems].sort((a, b) => a.price - b.price).slice(0, 3)

    setRecommendations(cheapest)
  }, [menuItems])

  // 🔥 Chatbot Logic
  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = input
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }])
    setInput('')

    const text = userMessage.toLowerCase()

    if (text.includes('suggest') && text.includes('under')) {
      const match = text.match(/under\s+(\d+)/)
      const limit = match ? Number(match[1]) : 50

      const filtered = menuItems.filter((item) => item.price <= limit).sort((a, b) => a.price - b.price)

      if (filtered.length === 0) {
        setMessages((prev) => [...prev, { sender: 'bot', text: `No items found under ₹${limit}` }])
      } else {
        const reply = filtered.map((i) => `${i.name} (₹${i.price})`).join(', ')

        setMessages((prev) => [...prev, { sender: 'bot', text: `Here are items under ₹${limit}: ${reply}` }])
      }

      return
    }

    if (text.startsWith('add ')) {
      const name = text.replace('add ', '').trim()

      const item = menuItems.find((i) => i.name.toLowerCase() === name)

      if (item) {
        addToCart(item.id)
        setMessages((prev) => [...prev, { sender: 'bot', text: `${item.name} added to cart 🛒` }])
      } else {
        setMessages((prev) => [...prev, { sender: 'bot', text: 'Item not found.' }])
      }
      return
    }

    if (text.includes('total')) {
      setMessages((prev) => [...prev, { sender: 'bot', text: `Your total is ₹${getCartTotal()}` }])
      return
    }

    setMessages((prev) => [...prev, { sender: 'bot', text: 'Try: suggest under 50, add samosa, total' }])
  }
  if (!menuItems || menuItems.length === 0) {
    return <h2 style={{ textAlign: 'center' }}>Loading menu...</h2>
  }

  return (
    <div className='menu-container'>
      <nav className='navbar'>
        <div className='nav-content'>
          <div className='brand'>🍽 Smart Canteen</div>

          <div className='cart-info clickable' onClick={() => navigate('/cart')}>
            Cart 🛒 ({Object.values(cart).reduce((a, b) => a + b, 0)})
          </div>
        </div>
      </nav>
      <button className='home-btn' type='submit' onClick={handleLogout}>
        log out
      </button>

      {/* MENU SECTION */}
      <section className='menu-section'>
        <h2>Full Menu</h2>

        <input type='text' placeholder='Search food...' className='search' value={search} onChange={(e) => setSearch(e.target.value)} />

        <div className='filters'>
          {['All', ...new Set(menuItems.map((i) => i.category))].map((cat) => (
            <button key={cat} className={`filter-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        <div className='card-grid'>
          {filteredItems.map((item) => (
            <div key={item.id} className='card'>
              <span className='tag'>{item.category}</span>
              <h3>{item.name}</h3>
              <p className='price'>₹{item.price}</p>

              {!item.available && <p style={{ color: 'red' }}>Out of Stock</p>}

              <button onClick={() => addToCart(item.id)} className='add-btn' disabled={!item.available}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* AI PICKS */}
      <section className='menu-section'>
        <h2>Most Popular</h2>
        <div className='card-grid'>
          {recommendations.map((item) => (
            <div key={item.id} className='card'>
              <h3>{item.name}</h3>
              <p className='price'>₹{item.price}</p>
              <button onClick={() => addToCart(item.id)} className='add-btn'>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CHATBOT */}
      <section className='menu-section'>
        <h2>💬 AI Chatbot</h2>

        <div className='chat-box'>
          {messages.map((msg, index) => (
            <div key={index} className={`chat-msg ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className='chat-input-row'>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && input.trim() !== '') {
                handleSend()
              }
            }}
            placeholder='Type message...'
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </section>

      <section className='cart-section'>Total: ₹{getCartTotal()}</section>
    </div>
  )
}
