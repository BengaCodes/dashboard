import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from './components/dashboard/Dashboard'
import { useAuth } from './state/useAuth'
import AuthPage from './components/auth/AuthPage'

const queryClient = new QueryClient()

const App = () => {
  const activeSession = JSON.parse(
    localStorage.getItem('sb-aahhzpfnqjkkssucoddo-auth-token')!
  )

  const { user } = useAuth()

  if (!user && !activeSession) {
    return <AuthPage />
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    </>
  )
}

export default App
