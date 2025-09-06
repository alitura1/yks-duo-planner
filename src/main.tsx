import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles.css'
import { UserProvider } from './contexts/UserContext'

// 🎁 toast sistemi
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <App />
      {/* 🎁 global toast bildirimi */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "10px",
            padding: "10px 16px",
          },
        }}
      />
    </UserProvider>
  </React.StrictMode>
)
