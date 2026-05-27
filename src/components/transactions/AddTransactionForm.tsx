import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import useInput, { type TransactionType } from '../../hooks/common/useInput'
import type { Category, Transaction } from '../../types'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import useMutationQuery from '../../hooks/api/useMutationQuery'
import { budgetQueries, categoryQueries, transactionQueries } from '../../utils/dataQuery'

type Props = { handleModalClose: () => void; selectedDate: Date }

type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

const calculateNextDate = (startDate: string, freq: string): string => {
  const d = new Date(startDate)
  if (freq === 'daily') d.setDate(d.getDate() + 1)
  else if (freq === 'weekly') d.setDate(d.getDate() + 7)
  else if (freq === 'monthly') d.setMonth(d.getMonth() + 1)
  else if (freq === 'yearly') d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().split('T')[0]
}

const TransactionForm = ({ handleModalClose, selectedDate }: Props) => {
  const [recurring, setRecurring] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const queryClient = useQueryClient()

  const categories = queryClient.getQueryData<Category[]>(categoryQueries.all())

  const defaultDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  )
    .toISOString()
    .split('T')[0]
  const today = new Date().toISOString().split('T')[0]

  const { value: description, handleChange: descriptionChange } = useInput('')
  const { value: amount, handleChange: amountChange } = useInput('')
  const { value: date, handleChange: dateChange } = useInput(defaultDate)
  const { value: recurringEndDate, handleChange: recurringEndDateChange } = useInput('')
  const { value: type, handleChange: typeChange } = useInput('expense')
  const { value: category, handleChange: categoryChange } = useInput('select category')
  const { value: frequency, handleChange: frequencyChange } = useInput('monthly')

  const { mutation: addMutation } = useMutationQuery({
    mutationFn: transactionQueries.addTransaction,
    options: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: transactionQueries.all() })
        await queryClient.invalidateQueries({ queryKey: budgetQueries.all() })
        handleModalClose()
      },
      onError: (err) => {
        setSubmitError(err instanceof Error ? err.message : 'Failed to add transaction')
      }
    }
  })

  const categoryOptions = useMemo(
    () => (categories ?? []).map((c) => c.name),
    [categories]
  )

  const isValid = useMemo(
    () =>
      String(description).trim() &&
      String(amount).trim() &&
      Number(amount) > 0 &&
      String(date).trim() &&
      String(date) <= today &&
      category !== 'select category',
    [description, amount, date, category, today]
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError('')

    const categoryId = categories?.find(
      (c) => c.name.toLowerCase() === String(category)
    )?.id

    const transaction: Omit<Transaction, 'id'> = {
      description: String(description),
      amount: Number(amount),
      date: String(date),
      type: type as TransactionType,
      category_id: categoryId ?? null,
      recurring,
      recurring_frequency: recurring ? (frequency as Frequency) : undefined,
      recurring_end_date: recurring && recurringEndDate ? String(recurringEndDate) : null,
      recurring_next_date: recurring
        ? calculateNextDate(String(date), String(frequency))
        : null
    }

    if (isValid) {
      addMutation.mutate(transaction)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='sm:col-span-2 space-y-4'>
          <Input
            label='Description'
            type='text'
            required
            placeholder='e.g. Groceries at Tesco'
            value={description}
            onChange={descriptionChange}
          />
          <label className='flex items-center gap-3 cursor-pointer w-fit'>
            <div className='relative'>
              <input
                type='checkbox'
                className='sr-only peer'
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
              />
              <div className='w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-colors' />
              <div className='absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4' />
            </div>
            <span className='text-sm font-medium text-slate-700'>
              Recurring transaction
            </span>
          </label>
        </div>
        <Input
          label='Amount (£)'
          type='number'
          min='0.01'
          step='0.01'
          required
          placeholder='0.00'
          value={amount}
          onChange={amountChange}
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <Select
          label='Type'
          options={['Income', 'Expense']}
          value={type}
          onChange={typeChange}
        />
        <Select
          label='Category'
          options={['Select Category', ...categoryOptions]}
          value={category}
          onChange={categoryChange}
        />
        <Input
          label='Date'
          type='date'
          required
          value={date}
          onChange={dateChange}
          max={today}
        />
      </div>

      {recurring && (
        <div className='grid grid-cols-2 gap-4 p-4 rounded-lg bg-blue-50 border border-blue-100'>
          <Select
            label='Frequency'
            options={['Daily', 'Weekly', 'Monthly', 'Yearly']}
            value={frequency}
            onChange={frequencyChange}
          />
          <Input
            label='End Date'
            type='date'
            value={recurringEndDate}
            onChange={recurringEndDateChange}
            min={today}
          />
        </div>
      )}

      {submitError && (
        <p className='text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2'>
          {submitError}
        </p>
      )}

      <div className='flex justify-end gap-3 pt-2'>
        <Button type='button' variant='secondary' onClick={handleModalClose}>
          Cancel
        </Button>
        <Button type='submit' disabled={!isValid || addMutation.isPending}>
          {addMutation.isPending ? 'Adding…' : 'Add Transaction'}
        </Button>
      </div>
    </form>
  )
}

export default TransactionForm
