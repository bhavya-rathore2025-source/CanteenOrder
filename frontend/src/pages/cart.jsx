import { useNavigate } from 'react-router-dom'
import '../styles/cart.css'

export function Cart({ cart, setCart, menuItems }) {
  const navigate = useNavigate()

  const getCartEntries = () => {
    return Object.entries(cart)
      .map(([id, qty]) => ({
        item: menuItems.find((m) => m.id === Number(id)),
        qty,
      }))
      .filter((entry) => entry.item && entry.qty > 0)
  }

  const increaseQty = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }))
  }

  const decreaseQty = (id) => {
    setCart((prev) => {
      const newQty = prev[id] - 1
      if (newQty <= 0) {
        const copy = { ...prev }
        delete copy[id]
        return copy
      }
      return { ...prev, [id]: newQty }
    })
  }

  const removeItem = (id) => {
    setCart((prev) => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
  }

  const getTotal = () => {
    return getCartEntries().reduce((total, entry) => total + entry.item.price * entry.qty, 0)
  }

  const entries = getCartEntries()

  return (
    <div className='cart-page'>
      <div className='cart-header'>
        <h2>🛒 Your Cart</h2>
        <button className='back-btn' onClick={() => navigate('/menu')}>
          ← Back to Menu
        </button>
      </div>

      {entries.length === 0 ? (
        <div className='empty-cart'>Your cart is empty.</div>
      ) : (
        <>
          <div className='cart-list'>
            {entries.map((entry) => (
              <div key={entry.item.id} className='cart-item'>
                <div className='item-info'>
                  <h4>{entry.item.name}</h4>
                  <p>₹{entry.item.price} each</p>
                </div>

                <div className='qty-controls'>
                  <button onClick={() => decreaseQty(entry.item.id)}>-</button>
                  <span>{entry.qty}</span>
                  <button onClick={() => increaseQty(entry.item.id)}>+</button>
                </div>

                <div className='item-total'>₹{entry.item.price * entry.qty}</div>

                <button className='remove-btn' onClick={() => removeItem(entry.item.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className='cart-footer'>
            <h3>Total: ₹{getTotal()}</h3>
            <button className='checkout-btn'>Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  )
}
