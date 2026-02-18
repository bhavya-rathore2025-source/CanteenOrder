import { AdminPage } from './pages/page1'
import { AdminPage2 } from './pages/page2'
import { LoginPage } from './pages/login'
import { RegisterPage } from './pages/register'
import { Cart } from './pages/cart'
import { FullMenu } from './pages/menu'
import { Route, Routes } from 'react-router'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { ProtectedRoute } from './pages/protected'
import { ShopDashboard } from './pages/shopDashboard'
function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  const [cart, setCart] = useState({})
  const [menuItems, setMenuItems] = useState([])
  const getFood = async () => {
    try {
      const res = await axios.get('http://localhost:5000/app/food', { withCredentials: true })

      const formatted = res.data.map((item) => ({
        id: item.Id,
        name: item.Name,
        price: item.Price,
        available: item.IsAvailable,
        category: item.ShopName,
        image: item.ImageUrl,
      }))

      setMenuItems(formatted)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getFood()
  }, [])
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.post('http://localhost:5000/app/verify', { withCredentials: true })
        console.log(res.data)

        if (res.data.authenticated) {
          setLoggedIn(true)
        }
      } catch (err) {
        setLoggedIn(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <Routes>
      <Route path='/' element={<AdminPage />} />
      <Route path='/page2' element={<AdminPage2 />} />
      <Route path='/login' element={<LoginPage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route
        path='/menu'
        element={
          <ProtectedRoute loggedIn={loggedIn}>
            <FullMenu cart={cart} setCart={setCart} menuItems={menuItems} setLoggedIn={setLoggedIn} />{' '}
          </ProtectedRoute>
        }
      />
      <Route path='/cart' element={<Cart cart={cart} setCart={setCart} menuItems={menuItems} />} />
      <Route path='/shop-dashboard' element={<ShopDashboard />} />
    </Routes>
  )
}

export default App
