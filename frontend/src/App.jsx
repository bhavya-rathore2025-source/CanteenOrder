import { AdminPage } from './pages/page1'
import { AdminPage2 } from './pages/page2'
import { LoginPage } from './pages/login'
import { Route, Routes } from 'react-router'
function App() {
  return (
    <Routes>
      <Route path='/' element={<AdminPage />} />
      <Route path='/page2' element={<AdminPage2 />} />
      <Route path='/login' element={<LoginPage />} />
    </Routes>
  )
}

export default App
