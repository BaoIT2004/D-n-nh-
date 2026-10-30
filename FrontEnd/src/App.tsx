import { Route, Routes } from 'react-router-dom'
import Login from "./pages/Login"
import Register from './pages/Register'
import Home from './pages/Home'
import BoardPage from './components/BoardPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path='/BoardPage/:id' element={<BoardPage/>}/>
    </Routes>
  )
}

export default App
