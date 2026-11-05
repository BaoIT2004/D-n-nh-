import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'
import { Toaster } from 'react-hot-toast'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Không tìm thấy phần tử #root trong index.html')
}



createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" />
    </BrowserRouter>
  </StrictMode>,
)
