import React from 'react'
import ReactDOM, { hydrateRoot } from 'react-dom/client'
import { inject } from '@vercel/analytics'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'

inject()

const root = document.getElementById('root')
const initialData = window.__AE_DATA__
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App initialData={initialData} />
    </BrowserRouter>
  </React.StrictMode>
)

if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  ReactDOM.createRoot(root).render(app)
}
