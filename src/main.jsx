import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#f5f0e8',
              border: '1px solid #292929',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#d6ad58', secondary: '#070707' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#070707' },
            },
          }}
        />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
