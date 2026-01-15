import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/iridescent-button.css'
import App from './App.tsx'

// GitHub Pages SPA redirect restoration
// This checks if we were redirected from 404.html and restores the original URL
(function() {
  const redirect = sessionStorage.getItem('redirect');
  if (redirect && redirect !== '/') {
    sessionStorage.removeItem('redirect');
    // Use history.replaceState to restore the URL without triggering a reload
    history.replaceState(null, '', redirect);
  }
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
