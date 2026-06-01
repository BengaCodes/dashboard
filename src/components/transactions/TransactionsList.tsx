import { useMemo, useState } from 'react'
import { Plus, Upload } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import useMutationQuery from '../../hooks/api/useMutationQuery'
import type { TransactionWithCategory } from '../../types'
import { budgetQueries, transactionQueries } from '../../utils/dataQuery'
import TransactionCell from './TransactionCells'
import Modal from '../modal/Modal'
import TransactionForm from './AddTransactionForm'
import UploadTransactionsForm from './UploadTransactionsForm'
import { SkeletonRow } from '../ui/Skeleton'

const FILTER_OPTIONS = ['All', 'Income', 'Expense'] as const

const TransactionsList = ({
  transactions,
  selectedDate
}: {
  transactions: TransactionWithCategory[]
  selectedDate: Date
}) => {
  const [openAdd, setOpenAdd] = useState(false)
  const [openUpload, setOpenUpload] = useState(false)
  const [filterType, setFilterType] = useState<(typeof FILTER_OPTIONS)[number]>('All')

  const queryClient = useQueryClient()

  const filtered = useMemo(() => {
    if (filterType === 'All') return transactions
    return transactions.filter((t) => t.type === filterType.toLowerCase())
  }, [transactions, filterType])

  const { mutation: deleteMutation } = useMutationQuery({
    mutationFn: transactionQueries.deleteTransaction,
    options: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: transactionQueries.all() })
        await queryClient.invalidateQueries({ queryKey: budgetQueries.all() })
        await queryClient.invalidateQueries({ queryKey: budgetQueries.allWithSpent() })
      }
    }
  })

  return (
    <>
      <div
        style={{
          background: 'var(--color-bg-surface)',
          border: '0.5px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: '0.5px solid rgba(255,255,255,0.06)',
            gap: '12px',
          }}
        >
          {/* Left — title + pill tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
                fontSize: '15px',
                color: 'var(--color-text-primary)',
                whiteSpace: 'nowrap',
              }}
            >
              Transactions
            </h2>

            {/* Pill tab switcher */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '10px',
                padding: '3px',
                gap: '2px',
              }}
            >
              {FILTER_OPTIONS.map((opt) => {
                const isActive = filterType === opt
                return (
                  <button
                    key={opt}
                    onClick={() => setFilterType(opt)}
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '12px',
                      fontWeight: isActive ? 600 : 400,
                      padding: '5px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                      background: isActive ? 'rgba(77,255,195,0.12)' : 'transparent',
                      color: isActive ? '#4DFFC3' : 'var(--color-text-muted)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right — upload + add */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => setOpenUpload(true)}
              aria-label='Bulk upload'
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '0.5px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.color = 'var(--color-text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.color = 'var(--color-text-muted)'
              }}
            >
              <Upload size={14} />
            </button>

            <button
              onClick={() => setOpenAdd(true)}
              aria-label='Add transaction'
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '0 12px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                background: '#4DFFC3',
                cursor: 'pointer',
                color: '#0B0F1A',
                fontFamily: 'var(--font-ui)',
                fontWeight: 700,
                fontSize: '13px',
                transition: 'opacity 150ms ease, transform 150ms ease',
                transform: 'scale(1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <Plus size={14} />
              Add
            </button>
          </div>
        </div>

        {/* ── List ───────────────────────────────────────── */}
        <div style={{ maxHeight: 'calc(100vh - 340px)', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '64px 20px', textAlign: 'center' }}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: 'var(--color-text-muted)',
                }}
              >
                No transactions for this period
              </p>
            </div>
          ) : (
            filtered.map((tr, index) => (
              <TransactionCell
                key={`${filterType}-${tr.id}`}
                index={index}
                transaction={tr}
                handleDelete={() => deleteMutation.mutate(tr.id)}
              />
            ))
          )}
        </div>
      </div>

      <Modal
        title='Add Transaction'
        isOpen={openAdd}
        onClose={() => setOpenAdd(false)}
        size='lg'
      >
        <TransactionForm
          selectedDate={selectedDate}
          handleModalClose={() => setOpenAdd(false)}
        />
      </Modal>

      <Modal
        title='Upload Transactions'
        isOpen={openUpload}
        onClose={() => setOpenUpload(false)}
      >
        <UploadTransactionsForm handleModalClose={() => setOpenUpload(false)} />
      </Modal>
    </>
  )
}

export { SkeletonRow }
export default TransactionsList
