import useInput, { type TransactionType } from '../../hooks/common/useInput'
import type { Category, Transaction } from '../../utils/database.types'
import Input from '../common/Input'
import Select from '../common/Select'
import { useMemo, useState } from 'react'
import useMutationQuery from '../../hooks/api/useMutationQuery'
import {
  budgetQueries,
  categoryQueries,
  transactionQueries
} from '../../utils/dataQuery'
import { useQueryClient } from '@tanstack/react-query'
import Button from '../common/Button'

type TransactionFormProps = {
  handleModalClose: () => void
  selectedDate: Date
}

type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

const TransactionForm = ({
  handleModalClose,
  selectedDate
}: TransactionFormProps) => {
  const [recurring, setRecurring] = useState(false)
  const queryClient = useQueryClient()

  const categories = queryClient.getQueryData<Category[]>(categoryQueries.all())

  const currentMonthDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  )
    .toISOString()
    .split('T')[0]

  const today = new Date().toISOString().split('T')[0]

  const { value: description, handleChange: descriptionChange } = useInput('')
  const { value: amount, handleChange: amountChange } = useInput('')
  const { value: date, handleChange: dateChange } = useInput(currentMonthDate)
  const { value: recurringEndDate, handleChange: recurringEndDateChange } =
    useInput('')
  const { value: type, handleChange: typeChange } = useInput('expense')
  const { value: category, handleChange: categoryChange } =
    useInput('Select Category')
  const { value: frequency, handleChange: frequencyChange } =
    useInput('monthly')

  const { mutation: addMutation } = useMutationQuery({
    mutationFn: transactionQueries.addTransaction,
    options: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: transactionQueries.all()
        })
        await queryClient.invalidateQueries({
          queryKey: budgetQueries.all()
        })
        handleModalClose()
      },
      onError: (error) => {
        console.log({ error })
      }
    }
  })

  const isValidInputs = useMemo(() => {
    return (
      String(description || '').trim() &&
      String(amount || '').trim() &&
      String(date) <= today &&
      String(date || '').trim() &&
      String(category || '').trim() &&
      category !== 'Select Category'
    )
  }, [description, amount, date, category, today])

  const categoriesOptions = useMemo(() => {
    if (!categories) return []
    return categories?.map((c) => c.name)
  }, [categories])

  const calculateNextDate = (startDate: string, frequency: string): string => {
    const date = new Date(startDate)

    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + 1)
        break
      case 'weekly':
        date.setDate(date.getDate() + 7)
        break
      case 'monthly':
        date.setMonth(date.getMonth() + 1)
        break
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1)
        break
    }

    return date.toISOString().split('T')[0]
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const categoryId = categories?.find(
      (c) => c.name.toLowerCase() === category
    )?.id
    const transaction: Omit<Transaction, 'id' | 'created_at'> = {
      description: String(description),
      amount: Number(amount),
      date: String(date),
      type: type as TransactionType,
      category_id: categoryId ?? null,
      recurring: recurring,
      recurring_end_date: String(recurringEndDate),
      recurring_frequency: frequency as Frequency,
      recurring_next_date: recurring
        ? calculateNextDate(String(date), String(frequency))
        : null
    }

    if (isValidInputs) {
      addMutation.mutate(transaction)
    } else {
      console.error('invalid inputs')
    }
  }

  return (
    <form onSubmit={handleSubmit} className='w-full'>
      <div className='flex flex-wrap -mx-3 mb-2 w-full'>
        <div className='w-full flex flex-col md:w-4/6 px-3 mb-4 md:mb-0'>
          <Input
            placeholder='Enter Description'
            label='Description'
            type='text'
            required
            value={description}
            onChange={descriptionChange}
          />
          <div className='flex w-1/4 justify-between align-middle items-center'>
            <label
              className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
              htmlFor='recurring'
            >
              RECURRING
            </label>
            <input
              type='checkbox'
              name='recurring'
              id='recurring'
              onChange={(e) => setRecurring(e.target.checked)}
              checked={recurring}
            />
          </div>
        </div>
        <div className='w-full md:w-1/3 px-3 mb-4 md:mb-0'>
          <Input
            label='Amount'
            placeholder='Enter Amount'
            type='text'
            value={amount}
            required
            onChange={amountChange}
          />
        </div>
      </div>
      <div className='flex flex-wrap -mx-3 mb-2 w-full'>
        <div className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
          <Select
            label='Type'
            options={['Income', 'Expense']}
            onChange={typeChange}
            value={type}
          />
        </div>
        <div className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
          <Select
            label='Category'
            options={['Select Category', ...categoriesOptions]}
            value={category}
            onChange={categoryChange}
          />
        </div>
        <div className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
          <Input
            label='Date'
            placeholder='Enter Date'
            type='date'
            value={date}
            onChange={dateChange}
            required
            max={today}
          />
        </div>
      </div>
      {recurring && (
        <div className='flex -mx-3 mb-2 w-4/6'>
          <div className='w-full md:w-full px-3 mb-6 md:mb-0'>
            <Select
              label='Frequency'
              options={['daily', 'weekly', 'monthly', 'yearly']}
              value={frequency}
              onChange={frequencyChange}
            />
          </div>
          <div className='w-full md:w-full px-3 mb-6 md:mb-0'>
            <Input
              label='End Date'
              placeholder='Enter Date'
              type='date'
              value={recurringEndDate}
              onChange={recurringEndDateChange}
              required
              min={today}
            />
          </div>
        </div>
      )}
      <div className='flex justify-end'>
        <Button className=' cursor-pointer'>Add Transaction</Button>
      </div>
    </form>
  )
}

export default TransactionForm
