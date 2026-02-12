import useInput, { type TransactionType } from '../../hooks/common/useInput'
import type { Category, Transaction } from '../../utils/database.types'
import Input from '../common/Input'
import Select from '../common/Select'
import { useMemo } from 'react'
import useMutationQuery from '../../hooks/api/useMutationQuery'
import { transactionQueries } from '../../utils/dataQuery'
import { useQueryClient } from '@tanstack/react-query'

type TransactionFormProps = {
  categories: Category[]
  handleModalClose: () => void
}

const TransactionForm = ({
  categories,
  handleModalClose
}: TransactionFormProps) => {
  const queryClient = useQueryClient()

  const { value: description, handleChange: descriptionChange } = useInput('')
  const { value: amount, handleChange: amountChange } = useInput('')
  const { value: date, handleChange: dateChange } = useInput('')
  const { value: type, handleChange: typeChange } = useInput('expense')
  const { value: category, handleChange: categoryChange } =
    useInput('Select Category')

  const { mutation: addMutation } = useMutationQuery({
    mutationFn: transactionQueries.addTransaction,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: transactionQueries.all() })
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
      String(date || '').trim() &&
      String(category || '').trim() &&
      category !== 'Select Category'
    )
  }, [description, amount, date, category])

  const categoriesOptions = useMemo(() => {
    return categories.map((c) => c.name)
  }, [categories])

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
      category_id: categoryId ?? null
    }

    if (isValidInputs) {
      addMutation.mutate(transaction)
    } else {
      console.error('invalid inputs')
    }
  }

  return (
    <form onSubmit={handleSubmit} className='w-full max-w-lg'>
      <div className='flex flex-wrap -mx-3 mb-6'>
        <div className='w-full px-3'>
          <Input
            placeholder='Enter Description'
            label='Description'
            type='text'
            required
            value={description}
            onChange={descriptionChange}
          />
          <p className='text-gray-600 text-xs italic'>
            Make it as long and as crazy as you'd like
          </p>
        </div>
      </div>
      <div className='flex flex-wrap -mx-3 mb-2'>
        <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
          <Input
            label='Amount'
            placeholder='Enter Amount'
            type='text'
            value={amount}
            required
            onChange={amountChange}
          />
        </div>
        <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
          <Input
            label='Date'
            placeholder='Enter Date'
            type='date'
            value={date}
            onChange={dateChange}
            required
          />
        </div>
      </div>
      <div className='flex flex-wrap -mx-3 mb-2'>
        <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
          <Select
            label='Type'
            options={['Income', 'Expense']}
            onChange={typeChange}
            value={type}
          />
        </div>
        <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
          <Select
            label='Category'
            options={['Select Category', ...categoriesOptions]}
            value={category}
            onChange={categoryChange}
          />
        </div>
      </div>
      <div className='flex justify-end'>
        <button className='bg-green-500'>Submit</button>
      </div>
    </form>
  )
}

export default TransactionForm
