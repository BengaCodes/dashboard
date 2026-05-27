import { ChevronDown } from 'lucide-react'
import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: string[]
  error?: string
}

const Select = ({ label, options, error, id, ...props }: SelectProps) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className='flex flex-col gap-1.5'>
      {label && (
        <label
          htmlFor={selectId}
          className='text-xs font-semibold uppercase tracking-wide text-slate-600'
        >
          {label}
          {props.required && <span className='ml-1 text-red-500'>*</span>}
        </label>
      )}
      <div className='relative'>
        <select
          id={selectId}
          className={`
            w-full appearance-none rounded-lg border bg-white px-3 py-2.5 pr-9
            text-sm text-slate-900 transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-slate-50 disabled:text-slate-400
            ${error ? 'border-red-400' : 'border-slate-300 hover:border-slate-400'}
          `}
          {...props}
        >
          {options.map((o) => (
            <option value={o.toLowerCase()} key={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'
        />
      </div>
      {error && <p className='text-xs text-red-600'>{error}</p>}
    </div>
  )
}

export default Select
