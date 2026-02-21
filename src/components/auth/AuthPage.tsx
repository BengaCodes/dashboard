import { Wallet } from 'lucide-react'
import Input from '../common/Input'
import Button from '../common/Button'
import { useState } from 'react'
import useInput from '../../hooks/common/useInput'
import { useAuth } from '../../state/useAuth'

const AuthPage = () => {
  const { signUp, signIn } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { value: email, handleChange: emailChange } = useInput('')
  const { value: password, handleChange: passwordChange } = useInput('')
  const { value: confirmPassword, handleChange: confirmPasswordChange } =
    useInput('')

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          throw new Error('Passwords do not match')
        }
        await signUp(String(email), String(password))
      } else {
        await signIn(String(email), String(password))
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen bg-linear-to-br from-blue-50 to-blue-100 items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-xl shadow-lg p-8'>
          <div className='flex items-center justify-center mb-8'>
            <Wallet className='w-10 h-10 text-blue-600 mr-3' />
            <h1 className='text-2xl font-bold text-gray-900'>FinTrack</h1>
          </div>

          <h2 className='text-xl font-semibold text-gray-900 mb-6 text-center'>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>

          <form action='' className='space-y-4' onSubmit={handleSubmit}>
            <div>
              <Input
                label='Email'
                type='email'
                required
                placeholder='you@example.com'
                value={email}
                onChange={emailChange}
              />
            </div>
            <div>
              <Input
                label='Password'
                type='password'
                required
                placeholder='••••••••'
                value={password}
                onChange={passwordChange}
              />
            </div>

            {isSignUp && (
              <div>
                <Input
                  label='Confirm Password'
                  type='Password'
                  placeholder='••••••••'
                  value={confirmPassword}
                  onChange={confirmPasswordChange}
                />
              </div>
            )}

            {error && (
              <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
                <p className='text-sm text-red-red-600'>{error}</p>
              </div>
            )}

            <Button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors'
            >
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-gray-600 text-sm'>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
