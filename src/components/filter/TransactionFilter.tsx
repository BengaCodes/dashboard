import { ChevronLeft, ChevronRight } from 'lucide-react'
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
  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() - 1)
    onChangeDate(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + 1)
    onChangeDate(newDate)
  }

  const handleMonthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(+e.target.value)
    onChangeDate(newDate)
  }

  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value)
    const newDate = new Date(selectedDate)
    newDate.setFullYear(+e.target.value)
    onChangeDate(newDate)
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 3 }, (_, i) => currentYear - 2 + i)

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
      <div className='flex items-center justify-between gap-4'>
        <button
          onClick={handlePrevMonth}
          className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          aria-label='Previous month'
        >
          <ChevronLeft className='w-5 h-5 text-gray-600' />
        </button>

        <div className='flex items-center gap-3 flex-1'>
          <select
            value={selectedDate.getMonth()}
            onChange={handleMonthChange}
            className='flex-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {months.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={selectedDate.getFullYear()}
            onChange={handleYearChange}
            className='px-3 py-2 rounded-lg border border-gray-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleNextMonth}
          className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          aria-label='Next month'
        >
          <ChevronRight className='w-5 h-5 text-gray-600' />
        </button>
      </div>
    </div>
  )
}

export default TransactionFilter
