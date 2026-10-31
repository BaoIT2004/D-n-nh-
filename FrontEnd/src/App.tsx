import { Navigate, Route, Routes } from 'react-router-dom'
import Login from "./pages/Login"
import Register from './pages/Register'
import Home from './pages/Home'
import BoardPage from './components/Project/AddStatusTask'
import { getStoredUserId } from './services/Api'

function App() {
  const isAuthenticated = Boolean(localStorage.getItem("accessToken")) && getStoredUserId() !== null;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path='/BoardPage/:id' element={isAuthenticated ? <BoardPage /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
