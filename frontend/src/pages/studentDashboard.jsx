import '../styles/studentDashboard.css'
import { useNavigate } from 'react-router-dom'

export function StudentDashboard() {
  const navigate = useNavigate()

  const shops = [
    { name: 'Cake Shop', emoji: '🎂', route: '/shop/cake' },
    { name: 'Snack Shop', emoji: '🍟', route: '/shop/snack' },
    { name: 'Fast Food Shop', emoji: '🍔', route: '/shop/fastfood' },
    { name: 'Drinks Corner', emoji: '🥤', route: '/shop/drinks' },
  ]

  return (
    <div className='student-page'>
      <h1 className='page-title'>Choose a Shop</h1>

      <div className='shop-grid'>
        {shops.map((shop, index) => (
          <div key={index} className='shop-card' onClick={() => navigate(shop.route)}>
            <div className='shop-emoji'>{shop.emoji}</div>
            <h2>{shop.name}</h2>
            <p>Click to view menu</p>
          </div>
        ))}
      </div>
    </div>
  )
}
