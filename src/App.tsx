import Dashboard from './components/dashboard/Dashboard'
import Sidebar from './components/sidebar/Sidebar'

const App = () => {
  return (
    <main className='grid gap-4 p-4 grid-cols-[220px, _1fr]'>
      <Dashboard />
      <Sidebar />
    </main>
  )
}

export default App
