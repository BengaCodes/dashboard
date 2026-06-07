import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage    from './pages/DashboardPage'
import CalculatorPage   from './pages/CalculatorPage'
import SettingsPage     from './pages/SettingsPage'
import LandingPage      from './pages/LandingPage'
import BudgetsPage      from './pages/BudgetsPage'
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
  const { user } = useAuth()

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
            <Route path='/' element={<DashboardPage />} />
            <Route path='/calculator' element={<CalculatorPage />} />
            <Route path='/budgets' element={<BudgetsPage />} />
            <Route path='/analytics' element={<DashboardPage />} />
            <Route path='/settings' element={<SettingsPage />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </QueryClientProvider>
  )
}

export default App
