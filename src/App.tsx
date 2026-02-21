import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from './components/dashboard/Dashboard'
import { useAuth } from './state/useAuth'
import AuthPage from './components/auth/AuthPage'

const queryClient = new QueryClient()

const App = () => {
  const { user } = useAuth()
  return (
    <>
      {user ? (
        <QueryClientProvider client={queryClient}>
          <Dashboard />
        </QueryClientProvider>
      ) : (
        <AuthPage />
      )}
    </>
  )
}

export default App
