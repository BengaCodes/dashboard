import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { months } from '../../utils/utils'
import type { ChangeEvent } from 'react'

type TransactionFilterProps = {
  selectedDate: Date
  onChangeDate: (date: Date) => void
}

const TransactionFilter = ({
  selectedDate,
  onChangeDate
}: TransactionFilterProps) => {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i)

  const move = (direction: 'prev' | 'next') => {
    const d = new Date(selectedDate)
    if (direction === 'prev') {
      d.setMonth(d.getMonth() - 1)
    } else {
      d.setMonth(d.getMonth() + 1)
    }
    onChangeDate(d)
  }

  const handleMonthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const d = new Date(selectedDate)
    d.setMonth(+e.target.value)
    onChangeDate(d)
  }

  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const d = new Date(selectedDate)
    d.setFullYear(+e.target.value)
    onChangeDate(d)
  }

  const isFirst =
    selectedDate.getMonth() === 0 && selectedDate.getFullYear() === years[0]
  const isLast =
    selectedDate.getMonth() === 11 &&
    selectedDate.getFullYear() === years[years.length - 1]

  const selectClass =
    'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-300 transition-colors cursor-pointer'

  return (
    <div className='bg-white rounded-xl shadow-sm border border-slate-100 px-5 py-3'>
      <div className='flex items-center gap-3'>
        <CalendarDays size={18} className='text-slate-400 shrink-0' />
        <div className='flex items-center gap-2 flex-1'>
          <button
            onClick={() => move('prev')}
            disabled={isFirst}
            aria-label='Previous month'
            className='p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
          >
            <ChevronLeft size={16} className='text-slate-600' />
          </button>

          <select
            value={selectedDate.getMonth()}
            onChange={handleMonthChange}
            className={`${selectClass} flex-1`}
          >
            {months.map((month, i) => (
              <option key={month} value={i}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={selectedDate.getFullYear()}
            onChange={handleYearChange}
            className={selectClass}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <button
            onClick={() => move('next')}
            disabled={isLast}
            aria-label='Next month'
            className='p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
          >
            <ChevronRight size={16} className='text-slate-600' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionFilter
