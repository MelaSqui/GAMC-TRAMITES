import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

const el = document.getElementById('root')
if (!el) {
  throw new Error('No se encontró <div id="root"></div> en index.html')
}

ReactDOM.createRoot(el).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)