import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatAmount, formatDate } from '../../utils/formatters'
import { Icon } from '../common/Icons'
import type { TransactionWithCategory } from '../../types'
import Modal from '../modal/Modal'
import Button from '../common/Button'

type TransactionCellProps = {
  transaction: TransactionWithCategory
  handleDelete: () => void
  handleDeleteAll?: () => void
  index: number
}

const TransactionCell = ({ transaction, handleDelete, handleDeleteAll, index }: TransactionCellProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const navigate = useNavigate()
  const isIncome = transaction.type === 'income'
  const category = transaction.categories

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          padding: '12px 20px',
          background: isHovered ? 'rgba(255,255,255,0.03)' : 'transparent',
          boxShadow: isHovered ? 'inset 0 0 0 0.5px rgba(255,255,255,0.10)' : 'none',
          transition: 'background 150ms ease, box-shadow 150ms ease',
          animation: 'rowFadeIn 200ms ease both',
          animationDelay: `${Math.min(index, 12) * 50}ms`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

          {/* Category icon square */}
          <div
            style={{
              flexShrink: 0,
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${category?.color}1a`,
            }}
          >
            <Icon
              iconName={category?.icon || 'DollarSign'}
              size={16}
              style={{ color: category?.color }}
            />
          </div>

          {/* Merchant name + category label */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 500,
                fontSize: '13px',
                color: 'var(--color-text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {transaction.description}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '3px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-text-muted)',
                }}
              >
                {category?.name || 'Uncategorised'}
              </span>
              {transaction.recurring && (
                <>
                  <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '10px' }}>
                    ●
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--color-accent-blue)',
                    }}
                  >
                    Recurring
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Amount + date */}
          <div style={{ flexShrink: 0, textAlign: 'right' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '13px',
                color: isIncome ? '#4DFFC3' : '#FF4E7A',
                whiteSpace: 'nowrap',
              }}
            >
              {formatAmount(transaction.amount, transaction.type)}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                marginTop: '3px',
              }}
            >
              {formatDate(transaction.date)}
            </p>
          </div>

          {/* Edit button — fades in on row hover */}
          <button
            onClick={() => navigate('/settings', { state: { transaction } })}
            aria-label='Edit transaction'
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 150ms ease, background 150ms ease, color 150ms ease',
              color: 'var(--color-text-muted)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(30,200,255,0.10)'
              e.currentTarget.style.color = 'var(--color-accent-blue)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--color-text-muted)'
            }}
          >
            <Pencil size={13} />
          </button>

          {/* Delete button — fades in on row hover */}
          <button
            onClick={() => setShowDeleteModal(true)}
            aria-label='Delete transaction'
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 150ms ease, background 150ms ease, color 150ms ease',
              color: 'var(--color-text-muted)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,78,122,0.10)'
              e.currentTarget.style.color = '#FF4E7A'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--color-text-muted)'
            }}
          >
            <Trash2 size={13} />
          </button>

        </div>
      </div>

      <Modal
        title='Delete Transaction'
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        size='sm'
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Are you sure you want to delete{' '}
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
              "{transaction.description}"
            </span>
            ? This cannot be undone.
          </p>

          {transaction.recurring && handleDeleteAll && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-accent-blue)', lineHeight: 1.5 }}>
              This is a recurring transaction. You can delete just this instance or all future occurrences.
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            {transaction.recurring && handleDeleteAll && (
              <Button
                variant='danger'
                onClick={() => {
                  handleDeleteAll()
                  setShowDeleteModal(false)
                }}
              >
                Delete all future
              </Button>
            )}
            <Button
              variant='danger'
              onClick={() => {
                handleDelete()
                setShowDeleteModal(false)
              }}
            >
              {transaction.recurring ? 'Delete this only' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default TransactionCell
