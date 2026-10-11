import { Route, Routes } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import React from 'react'
import Login from "./pages/login"
import Register from './pages/register'
import Home from './pages/home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App
