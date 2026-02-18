import '../styles/login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'

export function LoginPage({ loggedIn, setLoggedIn }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await axios.post('http://localhost:5000/app/login', { username, password }, { withCredentials: true })

      if (res?.data?.login === 'done') {
        await setLoggedIn(true)
        console.log('login page', loggedIn)
        navigate('/studentDashboard')
      } else {
        setError(res?.data?.message || 'Invalid username or password')
      }
    } catch (err) {
      console.log(err)
      setError('Something went wrong. Try again.')
    }
  }

  return (
    <div className='login-page'>
      <button className='home-btn' type='submit' onClick={() => navigate('/')}>
        Home Page
      </button>
      <div className='login-card'>
        <h1>Welcome back</h1>
        <p className='desc'>Sign in to continue</p>

        <form className='login-form' onSubmit={handleSubmit}>
          <label className='field'>
            <span>Username</span>
            <input type='text' name='username' value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>

          <label className='field'>
            <span>Password</span>
            <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          {error && <p className='login-error'>{error}</p>}

          <button className='btn' type='submit'>
            Login
          </button>
        </form>

        <p className='signup'>
          Don't have an account?{' '}
          <button className='link' onClick={() => navigate('/register')}>
            Register
          </button>
        </p>
      </div>
    </div>
  )
}
