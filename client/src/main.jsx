import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter} from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>// BrowserRouter is a component that wraps the entire application. It provides the routing functionality to the application.
      <App />
    </BrowserRouter>
  </StrictMode>,
)
