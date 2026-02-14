import { useMemo } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import useInput from '../../hooks/common/useInput'
import type { Budget, Category } from '../../utils/database.types'
import useMutationQuery from '../../hooks/api/useMutationQuery'
import { budgetQueries, categoryQueries } from '../../utils/dataQuery'
import { useQueryClient } from '@tanstack/react-query'
import Button from '../common/Button'

type AddBudgetFormType = {
  handleModalClose: () => void
}

const AddBudgetForm = ({ handleModalClose }: AddBudgetFormType) => {
  const { value: amount, handleChange: amountChange } = useInput('')
  const { value: period, handleChange: periodChange } =
    useInput('Select Period')
  const { value: category, handleChange: categoryChange } =
    useInput('Select Category')

  const queryClient = useQueryClient()

  const categories = queryClient.getQueryData<Category[]>(categoryQueries.all())

  const { mutation: addMutation } = useMutationQuery({
    mutationFn: budgetQueries.addBudget,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: budgetQueries.all() })
        handleModalClose()
      },
      onError: (error) => {
        console.log({ error })
      }
    }
  })

  const isValidInputs = useMemo(() => {
    return (
      String(amount || '').trim() &&
      String(period || '').trim() &&
      period !== 'Select Period' &&
      String(category || '').trim() &&
      category !== 'Select Category'
    )
  }, [amount, period, category])

  const categoriesOptions = useMemo(() => {
    if (!categories) return []
    return categories.map((c) => c.name)
  }, [categories])

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const categoryId = categories?.find(
      (c) => c.name.toLowerCase() === category
    )?.id
    const budget: Omit<Budget, 'id' | 'created_at'> = {
      amount: Number(amount),
      period: String(period),
      category_id: categoryId ?? null
    }

    if (isValidInputs) {
      addMutation.mutate(budget)
    } else {
      console.error('invalid inputs')
    }
  }

  return (
    <form onSubmit={handleSubmit} className='w-full max-w-lg'>
      <div className='flex flex-wrap -mx-3 mb-2 flex-col w-full items-center'>
        <div className='w-full md:w-3/4 px-3 mb-6 md:mb-0'>
          <Input
            label='Amount'
            placeholder='Enter Amount'
            type='text'
            value={amount}
            required
            onChange={amountChange}
          />
        </div>
        <div className='w-full md:w-3/4 px-3 mb-6 md:mb-0'>
          <Select
            label='Period'
            options={[
              'Select Period',
              'Daily',
              'Fortnightly',
              'Monthly',
              'Yearly'
            ]}
            value={period}
            onChange={periodChange}
            required
          />
        </div>
        <div className='w-full md:w-3/4 px-3 mb-6 md:mb-0'>
          <Select
            label='Category'
            options={['Select Category', ...categoriesOptions]}
            value={category}
            onChange={categoryChange}
            required
          />
        </div>
      </div>
      <div className='flex justify-end'>
        <Button type='submit'>Add Budget</Button>
      </div>
    </form>
  )
}

export default AddBudgetForm
