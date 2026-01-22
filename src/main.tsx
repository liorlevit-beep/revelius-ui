import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/iridescent-button.css'
import App from './App.tsx'
// Initialize auth helpers (registers global window.setReveliusToken, etc.)
import './lib/auth'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
