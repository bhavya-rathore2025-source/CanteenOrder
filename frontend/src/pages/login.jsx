import React from 'react'
import '../styles/login.css'

export function LoginPage() {
  const handleStudentLogin = () => {
    console.log('Login as Student')
    // navigate("/student-login");
  }

  const handleShopkeeperLogin = () => {
    console.log('Login as Shopkeeper')
    // navigate("/shopkeeper-login");
  }

  return (
    <div className='login-container'>
      <div className='login-box'>
        <h1 className='title'>Smart Canteen System</h1>
        <button className='login-btn' onClick={handleStudentLogin}>
          Login as Student
        </button>
        <button className='login-btn shopkeeper' onClick={handleShopkeeperLogin}>
          Login as Shopkeeper
        </button>
      </div>
    </div>
  )
}
