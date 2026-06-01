import { read, utils } from 'xlsx'
import { useState, type ChangeEvent } from 'react'
import { FileSpreadsheet, UploadCloud } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import type { Category, Transaction } from '../../types'
import { budgetQueries, categoryQueries, transactionQueries } from '../../utils/dataQuery'
import useMutationQuery from '../../hooks/api/useMutationQuery'
import Button from '../common/Button'
import Alert from '../ui/Alert'

type Props = { handleModalClose: () => void }

type RawRow = Record<string, string | number>

const UploadTransactionsForm = ({ handleModalClose }: Props) => {
  const [transactions, setTransactions] = useState<Omit<Transaction, 'id'>[]>([])
  const [parseError, setParseError] = useState('')
  const [fileName, setFileName] = useState('')

  const queryClient = useQueryClient()
  const categories = queryClient.getQueryData<Category[]>(categoryQueries.all())

  const { mutation } = useMutationQuery({
    mutationFn: transactionQueries.bulkAddTransactions,
    options: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: transactionQueries.all() })
        await queryClient.invalidateQueries({ queryKey: budgetQueries.all() })
        await queryClient.invalidateQueries({ queryKey: budgetQueries.allWithSpent() })
        handleModalClose()
      },
      onError: (err) => {
        setParseError(err instanceof Error ? err.message : 'Upload failed')
      }
    }
  })

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setParseError('')

    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = (ev) => {
      try {
        const workBook = read(ev.target?.result, { type: 'array' })
        const sheet = workBook.Sheets[workBook.SheetNames[0]]
        const rows = utils.sheet_to_json<RawRow>(sheet)

        const parsed = rows.map((row) => {
          const categoryName = String(row.Category_id || row.category_id || '')
          const catId = categories?.find(
            (c) => c.name.toLowerCase() === categoryName.toLowerCase()
          )?.id

          return {
            description: String(row.Description || row.description || ''),
            amount: Number(row.Amount || row.amount || 0),
            date: String(row.Date || row.date || ''),
            type: String(row.Type || row.type || 'expense') as 'income' | 'expense',
            category_id: catId ?? null
          }
        })

        const invalid = parsed.filter((t) => !t.description || !t.date || !t.amount)
        if (invalid.length > 0) {
          setParseError(`${invalid.length} row(s) are missing required fields (Description, Amount, Date).`)
        }

        setTransactions(parsed)
      } catch {
        setParseError('Failed to parse the file. Please check the format.')
      }
    }
  }

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (transactions.length > 0) {
      mutation.mutate(transactions)
    }
  }

  return (
    <form onSubmit={handleUpload} className='space-y-5'>
      <div>
        <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors'>
          <div className='flex flex-col items-center gap-2 text-slate-400'>
            <UploadCloud size={28} />
            <span className='text-sm'>
              {fileName ? (
                <span className='text-slate-700 font-medium flex items-center gap-1.5'>
                  <FileSpreadsheet size={14} className='text-emerald-600' />
                  {fileName}
                </span>
              ) : (
                'Click to upload .xlsx or .xls'
              )}
            </span>
          </div>
          <input
            type='file'
            accept='.xlsx,.xls'
            onChange={handleFileChange}
            className='hidden'
          />
        </label>
      </div>

      <Alert variant='info' title='Required columns'>
        Description, Amount, Date, Type (income/expense), Category_id (category name)
      </Alert>

      {parseError && <Alert variant='warning'>{parseError}</Alert>}

      {transactions.length > 0 && !parseError && (
        <Alert variant='success'>
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} ready to import
        </Alert>
      )}

      <div className='flex justify-end gap-3 pt-1'>
        <Button type='button' variant='secondary' onClick={handleModalClose}>
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={!transactions.length || !!parseError || mutation.isPending}
          variant='success'
        >
          {mutation.isPending ? 'Uploading…' : `Upload ${transactions.length || ''} Transactions`}
        </Button>
      </div>
    </form>
  )
}

export default UploadTransactionsForm
