import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Layout from './components/layout/Layout.tsx'
import { AuthProvider } from './state/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Layout>
        <App />
      </Layout>
    </AuthProvider>
  </StrictMode>
)
