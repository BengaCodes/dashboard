import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from 'react'
import Dashboard from './components/dashboard/Dashboard'
import { useAuth } from './state/useAuth'
import AuthPage from './components/auth/AuthPage'
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
  if (!user) return <AuthPage />

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Loading />}>
        <Dashboard />
      </Suspense>
    </QueryClientProvider>
  )
}

export default App
