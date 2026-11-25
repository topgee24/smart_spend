import type { Transaction } from '../hooks/useBudget'

interface TransactionListProps {
  transactions: Transaction[]
  onDeleteTransaction: (id: string) => void
}

const amountFormatter = new Intl.NumberFormat('en-GH', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function TransactionList({
  transactions,
  onDeleteTransaction,
}: TransactionListProps) {
  return (
    <section className="transactions-section" aria-labelledby="transaction-list-heading">
      <div className="list-heading">
        <h2 id="transaction-list-heading">Recent Transactions</h2>
        <span className="count-badge">{transactions.length}</span>
      </div>
      {transactions.length === 0 ? (
        <div className="card empty-state">
          <p>No transactions yet</p>
          <p>Your spending will appear here after you add a transaction.</p>
        </div>
      ) : (
        <ul className="transaction-list">
          {transactions.map((transaction) => (
            <li className="card transaction-row" key={transaction.id}>
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
                  aria-label={`Delete ${transaction.title}`}
                  onClick={() => onDeleteTransaction(transaction.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}