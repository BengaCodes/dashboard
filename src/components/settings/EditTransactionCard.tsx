import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Button from '../common/Button'
import useMutationQuery from '../../hooks/api/useMutationQuery'
import { transactionQueries, categoryQueries } from '../../utils/dataQuery'
import type { TransactionWithCategory, Category } from '../../types'
import { card, sectionLabel, fieldLabel, inputStyle, focusIn, focusOut } from './settingsShared'

const EditTransactionCard = ({
  transaction,
}: {
  transaction: TransactionWithCategory | undefined
}) => {
  const navigate     = useNavigate()
  const queryClient  = useQueryClient()

  const [description, setDescription] = useState(transaction?.description ?? '')
  const [amount,      setAmount]      = useState(String(transaction?.amount ?? ''))
  const [date,        setDate]        = useState(transaction?.date?.slice(0, 10) ?? '')
  const [type,        setType]        = useState<'income' | 'expense'>(transaction?.type ?? 'expense')
  const [categoryId,  setCategoryId]  = useState(String(transaction?.category_id ?? ''))

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: categoryQueries.all(),
    queryFn:  categoryQueries.getCategories,
  })

  const invalidateAndBack = async () => {
    await queryClient.invalidateQueries({ queryKey: transactionQueries.all() })
    navigate(-1)
  }

  const { mutation: updateMutation } = useMutationQuery({
    mutationFn: transactionQueries.updateTransaction,
    options: { onSuccess: invalidateAndBack },
  })

  const { mutation: deleteMutation } = useMutationQuery({
    mutationFn: transactionQueries.deleteTransaction,
    options: { onSuccess: invalidateAndBack },
  })

  if (!transaction) {
    return (
      <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px' }}>
        <p style={{ ...sectionLabel, marginBottom: '12px' }}>Edit Transaction</p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-muted)' }}>
          Select a transaction to edit
        </p>
      </div>
    )
  }

  const isPending = updateMutation.isPending || deleteMutation.isPending

  const handleSave = () => {
    updateMutation.mutate({
      id: transaction.id,
      data: {
        description,
        amount:      Number(amount),
        date,
        type,
        category_id: categoryId ? Number(categoryId) : null,
      },
    })
  }

  return (
    <div style={card}>
      <p style={sectionLabel}>Edit Transaction</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <p style={fieldLabel}>Description</p>
          <input style={inputStyle} value={description} onChange={(e) => setDescription(e.target.value)} onFocus={focusIn} onBlur={focusOut} />
        </div>

        <div>
          <p style={fieldLabel}>Amount (£)</p>
          <input type='number' min='0' step='0.01' style={inputStyle} value={amount} onChange={(e) => setAmount(e.target.value)} onFocus={focusIn} onBlur={focusOut} />
        </div>

        <div>
          <p style={fieldLabel}>Date</p>
          <input type='date' style={{ ...inputStyle, colorScheme: 'dark' }} value={date} onChange={(e) => setDate(e.target.value)} onFocus={focusIn} onBlur={focusOut} />
        </div>

        <div>
          <p style={fieldLabel}>Type</p>
          <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')} onFocus={focusIn} onBlur={focusOut}>
            <option value='income'>Income</option>
            <option value='expense'>Expense</option>
          </select>
        </div>

        <div>
          <p style={fieldLabel}>Category</p>
          <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} onFocus={focusIn} onBlur={focusOut}>
            <option value=''>Uncategorised</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
        <Button variant='primary' onClick={handleSave} disabled={isPending}>
          {updateMutation.isPending ? 'Saving…' : 'Save changes'}
        </Button>
        <Button variant='danger' onClick={() => deleteMutation.mutate(transaction.id)} disabled={isPending}>
          {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
        </Button>
      </div>
    </div>
  )
}

export default EditTransactionCard
