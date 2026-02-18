import { AdminPage } from './pages/page1'
import { AdminPage2 } from './pages/page2'
import { LoginPage } from './pages/login'
import { RegisterPage } from './pages/register'
import { StudentDashboard } from './pages/studentDashboard'
import { Route, Routes } from 'react-router'
import { useState } from 'react'
function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [admin, setAdmin] = useState(false)
  return (
    <Routes>
      <Route path='/' element={<AdminPage />} />
      <Route path='/page2' element={<AdminPage2 />} />
      <Route path='/login' element={<LoginPage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/studentDashboard' element={<StudentDashboard />} />
    </Routes>
  )
}

export default App
