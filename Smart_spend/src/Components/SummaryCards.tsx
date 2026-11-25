import { useState, type FormEvent } from 'react'

interface SummaryCardsProps {
  budgetLimit: number
  totalSpent: number
  remaining: number
  transactionCount: number
  onUpdateBudget: (budgetLimit: number | string) => boolean
}

const amountFormatter = new Intl.NumberFormat('en-GH', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function SummaryCards({
  budgetLimit,
  totalSpent,
  remaining,
  transactionCount,
  onUpdateBudget,
}: SummaryCardsProps) {
  const [budgetInput, setBudgetInput] = useState(String(budgetLimit))
  const [budgetError, setBudgetError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    const updated = onUpdateBudget(budgetInput)
    if (updated) {
      setBudgetInput(String(Number(budgetInput)))
      setBudgetError('')
    } else {
      setBudgetError('Enter a budget greater than zero.')
    }
  }

  return (
    <>
      <header className="app-header">
        <span className="brand-mark" aria-hidden="true">S</span>
        <div>
          <h1>Smart Spend</h1>
          <p>Personal budget and spending tracker</p>
        </div>
      </header>

      <section className="summary-section" aria-label="Budget summary">
        <div className="summary-grid">
          <article className="card summary-card">
            <div className="summary-card-heading">
              <h2>Monthly Budget Cap</h2>
            </div>
            <p className="summary-value">GHS {amountFormatter.format(budgetLimit)}</p>
            <form className="cap-form" onSubmit={handleSubmit}>
              <label htmlFor="budget-limit">Set monthly budget cap in GHS</label>
              <input
                id="budget-limit"
                name="budgetLimit"
                type="number"
                min="0.01"
                step="any"
                required
                value={budgetInput}
                onChange={(event) => setBudgetInput(event.currentTarget.value)}
              />
              <button className="button button-primary button-small" type="submit">
                Set Cap
              </button>
            </form>
            {budgetError && <p className="budget-error" role="alert">{budgetError}</p>}
          </article>

          <article className="card summary-card summary-card-spent">
            <div className="summary-card-heading">
              <h2>Total Spent</h2>
            </div>
            <p className="summary-value">GHS {amountFormatter.format(totalSpent)}</p>
            <p className="summary-meta">
              {transactionCount} {transactionCount === 1 ? 'transaction' : 'transactions'}
            </p>
          </article>

          <article className="card summary-card">
            <div className="summary-card-heading">
              <h2>Remaining Balance</h2>
              <span className={`status-pill${remaining < 0 ? ' over-budget' : ''}`}>
                {remaining < 0 ? 'Over Budget' : 'On Track'}
              </span>
            </div>
            <p className={`summary-value ${remaining < 0 ? 'negative' : 'positive'}`}>
              GHS {amountFormatter.format(remaining)}
            </p>
            <p className="summary-meta">Available from your monthly cap</p>
          </article>
        </div>
      </section>
    </>
  )
}