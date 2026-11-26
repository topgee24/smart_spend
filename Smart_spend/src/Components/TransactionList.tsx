import { useState, type FormEvent } from 'react'
import type { Category, CategoryFilter, Transaction } from '../hooks/useBudget'

interface TransactionListProps {
  filteredTransactions: Transaction[]
  totalTransactionCount: number
  selectedCategory: CategoryFilter
  onSelectCategory: (category: CategoryFilter) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onEditTransaction: (
    id: string,
    updated: { title: string; amount: number; category: Category },
  ) => boolean
  onDeleteTransaction: (id: string) => void
  onClearTransactions: () => void
}

const categories: readonly CategoryFilter[] = [
  'All',
  'Food',
  'Transport',
  'Data/Bills',
  'Entertainment',
  'Other',
]

const amountFormatter = new Intl.NumberFormat('en-GH', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function TransactionList({
  filteredTransactions,
  totalTransactionCount,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onEditTransaction,
  onDeleteTransaction,
  onClearTransactions,
}: TransactionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [editCategory, setEditCategory] = useState<Category>('Food')
  const [editError, setEditError] = useState('')

  function beginEditing(transaction: Transaction): void {
    setEditingId(transaction.id)
    setEditTitle(transaction.title)
    setEditAmount(String(transaction.amount))
    setEditCategory(transaction.category)
    setEditError('')
  }

  function cancelEditing(): void {
    setEditingId(null)
    setEditError('')
  }

  function saveEditing(event: FormEvent<HTMLFormElement>, id: string): void {
    event.preventDefault()
    const amount = Number(editAmount)
    if (editTitle.trim().length === 0 || !Number.isFinite(amount) || amount <= 0) {
      setEditError('Enter a title and an amount greater than zero.')
      return
    }

    const saved = onEditTransaction(id, {
      title: editTitle,
      amount,
      category: editCategory,
    })
    if (!saved) {
      setEditError('The transaction could not be updated.')
      return
    }
    cancelEditing()
  }

  function confirmClear(): void {
    if (
      totalTransactionCount > 0 &&
      window.confirm('Clear all transactions? This action cannot be undone.')
    ) {
      onClearTransactions()
      setEditingId(null)
    }
  }

  return (
    <section className="transactions-section" aria-labelledby="transaction-list-heading">
      <div className="list-heading">
        <h2 id="transaction-list-heading">Recent Transactions</h2>
        <span className="count-badge">{totalTransactionCount}</span>
      </div>
      <div className="transaction-controls">
        <label className="visually-hidden" htmlFor="transaction-search">
          Search transactions
        </label>
        <input
          className="transaction-search"
          id="transaction-search"
          type="search"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
        />
        <div className="filter-toolbar">
          <div className="filter-pills" aria-label="Filter by category">
            {categories.map((category) => (
              <button
                className={`filter-pill${selectedCategory === category ? ' active' : ''}`}
                type="button"
                key={category}
                aria-pressed={selectedCategory === category}
                onClick={() => onSelectCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <button
            className="button button-quiet button-small clear-all-button"
            type="button"
            disabled={totalTransactionCount === 0}
            onClick={confirmClear}
          >
            Clear All
          </button>
        </div>
      </div>
      {filteredTransactions.length === 0 && totalTransactionCount === 0 ? (
        <div className="card empty-state">
          <p>No transactions logged yet</p>
          <p>Your spending will appear here after you add a transaction.</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="card empty-state">
          <p>No matching transactions found</p>
          <p>Try changing your search or category filter.</p>
        </div>
      ) : (
        <ul className="transaction-list">
          {filteredTransactions.map((transaction) => (
            <li className="card transaction-row" key={transaction.id}>
              {editingId === transaction.id ? (
                <form
                  className="inline-edit-form"
                  onSubmit={(event) => saveEditing(event, transaction.id)}
                >
                  <div className="inline-edit-fields">
                    <label>
                      <span className="visually-hidden">Transaction title</span>
                      <input
                        type="text"
                        required
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.currentTarget.value)}
                      />
                    </label>
                    <label className="inline-edit-amount">
                      <span>GHS</span>
                      <input
                        type="number"
                        min="0.01"
                        step="any"
                        required
                        value={editAmount}
                        onChange={(event) => setEditAmount(event.currentTarget.value)}
                      />
                    </label>
                    <label>
                      <span className="visually-hidden">Transaction category</span>
                      <select
                        value={editCategory}
                        onChange={(event) =>
                          setEditCategory(event.currentTarget.value as Category)
                        }
                      >
                        {categories.slice(1).map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  {editError && <p className="form-error" role="alert">{editError}</p>}
                  <div className="inline-edit-actions">
                    <button className="button button-primary button-small" type="submit">
                      Save
                    </button>
                    <button
                      className="button button-quiet button-small"
                      type="button"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="transaction-info">
                    <h3>{transaction.title}</h3>
                    <p className="transaction-details">
                      <span className="category-pill">{transaction.category}</span>
                      <time dateTime={transaction.date}>
                        {new Date(transaction.date).toLocaleString()}
                      </time>
                    </p>
                  </div>
                  <div className="transaction-actions">
                    <span className="transaction-amount">
                      − GHS {amountFormatter.format(transaction.amount)}
                    </span>
                    <button
                      className="button button-quiet button-small"
                      type="button"
                      aria-label={`Edit ${transaction.title}`}
                      onClick={() => beginEditing(transaction)}
                    >
                      Edit
                    </button>
                    <button
                      className="button button-quiet button-small"
                      type="button"
                      aria-label={`Delete ${transaction.title}`}
                      onClick={() => onDeleteTransaction(transaction.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}