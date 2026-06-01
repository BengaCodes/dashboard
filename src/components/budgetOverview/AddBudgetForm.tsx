import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import useInput from '../../hooks/common/useInput'
import type { Budget, Category } from '../../types'
import useMutationQuery from '../../hooks/api/useMutationQuery'
import { budgetQueries, categoryQueries } from '../../utils/dataQuery'

const PERIODS = ['Monthly', 'Daily', 'Fortnightly', 'Yearly']

const AddBudgetForm = ({
  handleModalClose
}: {
  handleModalClose: () => void
}) => {
  const [submitError, setSubmitError] = useState('')
  const { value: amount, handleChange: amountChange } = useInput('')
  const { value: period, handleChange: periodChange } = useInput('monthly')
  const { value: category, handleChange: categoryChange } =
    useInput('select category')

  const queryClient = useQueryClient()
  const categories = queryClient.getQueryData<Category[]>(categoryQueries.all())

  const { mutation } = useMutationQuery({
    mutationFn: budgetQueries.addBudget,
    options: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: budgetQueries.all() })
        await queryClient.invalidateQueries({ queryKey: budgetQueries.allWithSpent() })
        handleModalClose()
      },
      onError: (err) => {
        setSubmitError(
          err instanceof Error ? err.message : 'Failed to add budget'
        )
      }
    }
  })

  const categoryOptions = useMemo(
    () =>
      (categories ?? []).filter((c) => c.type === 'expense').map((c) => c.name),
    [categories]
  )

  const isValid = useMemo(
    () =>
      String(amount).trim() &&
      Number(amount) > 0 &&
      category !== 'select category',
    [amount, category]
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError('')

    const categoryId = categories?.find(
      (c) => c.name.toLowerCase() === String(category)
    )?.id

    const budget: Omit<Budget, 'id' | 'created_at'> = {
      amount: Number(amount),
      period: String(period).charAt(0).toUpperCase() + String(period).slice(1),
      category_id: categoryId ?? null
    }

    if (isValid) mutation.mutate(budget)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Input
        label='Amount (£)'
        type='number'
        min='1'
        step='1'
        required
        placeholder='e.g. 500'
        value={amount}
        onChange={amountChange}
      />
      <Select
        label='Period'
        options={PERIODS}
        value={period}
        onChange={periodChange}
        required
      />
      <Select
        label='Category'
        options={['Select Category', ...categoryOptions]}
        value={category}
        onChange={categoryChange}
        required
      />

      {submitError && (
        <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,78,122,0.08)', border: '0.5px solid rgba(255,78,122,0.25)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#FF4E7A' }}>{submitError}</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px' }}>
        <Button type='button' variant='secondary' onClick={handleModalClose}>
          Cancel
        </Button>
        <Button type='submit' disabled={!isValid || mutation.isPending}>
          {mutation.isPending ? 'Adding…' : 'Add Budget'}
        </Button>
      </div>
    </form>
  )
}

export default AddBudgetForm
