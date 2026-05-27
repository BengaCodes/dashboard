import { useState } from 'react'
import { Wallet } from 'lucide-react'
import Input from '../common/Input'
import Button from '../common/Button'
import Alert from '../ui/Alert'
import { useAuth } from '../../state/useAuth'
import useInput from '../../hooks/common/useInput'

const AuthPage = () => {
  const { signUp, signIn } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { value: email, handleChange: emailChange } = useInput('')
  const { value: password, handleChange: passwordChange } = useInput('')
  const { value: confirmPassword, handleChange: confirmPasswordChange } =
    useInput('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          return
        }
        await signUp(String(email), String(password))
      } else {
        await signIn(String(email), String(password))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsSignUp((v) => !v)
    setError('')
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4'>
      <div className='w-full max-w-md animate-fade-in'>
        <div className='bg-white rounded-2xl shadow-lg p-8 space-y-6'>
          <div className='text-center'>
            <div className='inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-xl mb-4'>
              <Wallet className='w-7 h-7 text-white' />
            </div>
            <h1 className='text-2xl font-bold text-slate-900'>FinTraxx</h1>
            <p className='text-sm text-slate-500 mt-1'>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              label='Email'
              type='email'
              required
              placeholder='you@example.com'
              value={email}
              onChange={emailChange}
              autoComplete='email'
            />
            <Input
              label='Password'
              type='password'
              required
              placeholder='••••••••'
              value={password}
              onChange={passwordChange}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
            {isSignUp && (
              <Input
                label='Confirm Password'
                type='password'
                required
                placeholder='••••••••'
                value={confirmPassword}
                onChange={confirmPasswordChange}
                autoComplete='new-password'
              />
            )}

            {error && <Alert variant='danger'>{error}</Alert>}

            <Button
              type='submit'
              disabled={loading}
              size='lg'
              className='w-full mt-2'
            >
              {loading
                ? 'Please wait…'
                : isSignUp
                  ? 'Create Account'
                  : 'Sign In'}
            </Button>
          </form>

          <p className='text-center text-sm text-slate-500'>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type='button'
              onClick={switchMode}
              className='font-medium text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline'
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
