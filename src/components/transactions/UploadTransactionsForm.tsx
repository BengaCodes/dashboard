import { read, utils } from 'xlsx'
import Button from '../common/Button'
import { useState, type ChangeEvent } from 'react'
import type { Category, Transaction } from '../../utils/database.types'
import { useQueryClient } from '@tanstack/react-query'
import { categoryQueries, transactionQueries } from '../../utils/dataQuery'
import useMutationQuery from '../../hooks/api/useMutationQuery'

type UploadTransactionsFormProps = {
  label: string
  note: string
  handleModalClose: () => void
}

type CSVTransaction = Omit<Transaction, 'id' | 'created_at'>

const UploadTransactionsForm = ({
  label,
  note,
  handleModalClose
}: UploadTransactionsFormProps) => {
  const [transactions, setTransactions] = useState<CSVTransaction[]>([])

  const queryClient = useQueryClient()

  const categories = queryClient.getQueryData<Category[]>(categoryQueries.all())

  const { mutation } = useMutationQuery({
    mutationFn: transactionQueries.addTransaction,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: transactionQueries.all() })
        handleModalClose()
      },
      onError: (error) => {
        console.error({ error })
      }
    }
  })

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>
  ) => {
    const file = e.target.files
    if (file && file[0]) {
      handleFileReader(file[0])
    }
  }

  const handleFileReader = (file: File) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = (e) => {
      const data = e.target?.result
      const workBook = read(data, { type: 'binary' })
      const sheetName = workBook.SheetNames[0]
      const sheet = workBook.Sheets[sheetName]
      const csvData = utils.sheet_to_json(sheet) as CSVTransaction[]

      const parsedData: CSVTransaction[] = csvData.map((d) => {
        const catId = categories?.find(
          (c) => c.name === d.category_id?.toString()
        )?.id
        return {
          ...d,
          category_id: catId ?? null
        }
      })

      if (parsedData) {
        setTransactions(parsedData)
      } else {
        console.error('There has been an error uploading the file')
      }
    }
  }

  const handleUpload = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate(transactions)
  }

  return (
    <form onSubmit={handleUpload}>
      <label
        className='block mb-2.5 text-sm font-medium text-heading'
        htmlFor={label}
      >
        {label}
      </label>
      <input
        className='cursor-pointer bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full shadow-xs placeholder:text-body'
        id='small_size'
        type='file'
        accept='.xlsx,.xls'
        onChange={handleFileChange}
      />

      <cite
        className='mt-2 text-sm text-gray-500 dark:text-gray-500'
        id='file_input_help'
      >
        {note}
      </cite>
      <div className='flex justify-end mt-2'>
        <Button>Upload Transactions</Button>
      </div>
    </form>
  )
}

export default UploadTransactionsForm
