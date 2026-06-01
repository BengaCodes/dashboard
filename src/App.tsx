import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './components/dashboard/Dashboard'
import SettingsPage from './components/settings/SettingsPage'
import LandingPage from './components/landing/LandingPage'
import Layout from './components/layout/Layout'
import { useAuth } from './state/useAuth'
import Loading from './components/common/Loading'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1
    }
  }
})

const App = () => {
  const { user, loading } = useAuth()

  if (loading) return <Loading />
  if (!user) {
    return (
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path='/'             element={<Dashboard />} />
            <Route path='/transactions' element={<Dashboard />} />
            <Route path='/budgets'      element={<Dashboard />} />
            <Route path='/analytics'   element={<Dashboard />} />
            <Route path='/settings'    element={<SettingsPage />} />
            <Route path='*'            element={<Navigate to='/' replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </QueryClientProvider>
  )
}

export default App
