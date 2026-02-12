import { useState, type ChangeEvent } from 'react'

export type TransactionType = 'income' | 'expense'

const useInput = (
  initialValue: string | number | TransactionType | undefined
) => {
  const [value, setValue] = useState(initialValue)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setValue(e.target.value)
  }
  return { value, handleChange }
}

export default useInput
