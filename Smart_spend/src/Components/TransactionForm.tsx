import { useState, type FormEvent } from 'react'
import type { Category, NewTransaction } from '../hooks/useBudget'

interface TransactionFormProps {
  onAddTransaction: (transaction: NewTransaction) => boolean
}

const categories: readonly Category[] = [
  'Food',
  'Transport',
  'Data/Bills',
  'Entertainment',
  'Other',
]

export default function TransactionForm({
  onAddTransaction,
}: TransactionFormProps) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('Food')
  const [errorMessage, setErrorMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    const numericAmount = Number(amount)

    if (title.trim().length === 0 || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setErrorMessage('Enter a title and an amount greater than zero.')
      return
    }

    const added = onAddTransaction({
      title,
      amount: numericAmount,
      category,
    })

    if (!added) {
      setErrorMessage('The transaction could not be added.')
      return
    }

    setTitle('')
    setAmount('')
    setCategory('Food')
    setErrorMessage('')
  }

  return (
    <section className="card transaction-form-section" aria-labelledby="add-transaction-heading">
      <div className="section-heading">
        <span className="section-mark" aria-hidden="true">+</span>
        <div>
          <h2 id="add-transaction-heading">Quick Add Transaction</h2>
          <p>Record a new expense</p>
        </div>
      </div>
      <form className="transaction-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="transaction-title">Title / Note</label>
          <input
            id="transaction-title"
            name="title"
            type="text"
            placeholder="What did you spend on?"
            required
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="transaction-amount">Amount (GHS)</label>
          <div className="amount-input">
            <span aria-hidden="true">₵</span>
            <input
              id="transaction-amount"
              name="amount"
              type="number"
              min="0.01"
              step="any"
              placeholder="0.00"
              required
              value={amount}
              onChange={(event) => setAmount(event.currentTarget.value)}
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="transaction-category">Category</label>
          <select
            id="transaction-category"
            name="category"
            value={category}
            onChange={(event) => setCategory(event.currentTarget.value as Category)}
          >
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button className="button button-primary submit-transaction" type="submit">
          + Add Transaction
        </button>
        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
      </form>
    </section>
  )
}