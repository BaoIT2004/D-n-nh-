import { Route } from 'react-router-dom'
import '../styles/home.css'
import { Navigate } from 'react-router-dom'
import React from 'react'

function Home() {
  const [goToRegister, setRegister] = React.useState(false);
  const [goToLogin, setLogin] = React.useState(false);

  if (goToRegister) {
    return <Navigate to="/register" />
  }

  if (goToLogin) {
    return <Navigate to="/login" />
  }
  return (
    <main>
      <div className="navbar">
        <div className="navbar_buttons">
          <button onClick={() => setRegister(true)}>Đăng ký</button>
          <button onClick={() => setLogin(true)}>Đăng nhập</button>
        </div>
      </div>
    </main>
  )
}

export default Home
