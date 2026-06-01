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
        await queryClient.invalidateQueries({ queryKey: budgetQueries.allWithSpent() })
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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label='Description'
            type='text'
            required
            placeholder='e.g. Groceries at Tesco'
            value={description}
            onChange={descriptionChange}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', width: 'fit-content' }}>
            {/* Dark toggle switch */}
            <span
              onClick={() => setRecurring((v) => !v)}
              style={{
                position: 'relative',
                display: 'inline-flex',
                width: '36px',
                height: '20px',
                borderRadius: '99px',
                background: recurring ? '#4DFFC3' : 'rgba(255,255,255,0.12)',
                cursor: 'pointer',
                transition: 'background 200ms ease',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: recurring ? '18px' : '2px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: recurring ? '#0B0F1A' : 'rgba(255,255,255,0.5)',
                  transition: 'left 200ms ease, background 200ms ease',
                }}
              />
            </span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-text-primary)' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px', borderRadius: '10px', background: 'rgba(30,200,255,0.04)', border: '0.5px solid rgba(30,200,255,0.14)' }}>
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
        <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,78,122,0.08)', border: '0.5px solid rgba(255,78,122,0.25)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#FF4E7A' }}>{submitError}</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px' }}>
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
