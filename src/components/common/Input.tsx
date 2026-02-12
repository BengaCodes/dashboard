import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const Input = ({ label, ...props }: InputProps) => {
  return (
    <>
      <label
        className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
        htmlFor={label}
      >
        {label}
      </label>
      <input
        className='appearance-none block w-full bg-gray-200 text-gray-700 border border-blue-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
        id={label}
        {...props}
      />
    </>
  )
}

export default Input
