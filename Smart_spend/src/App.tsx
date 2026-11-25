import './App.css'
import SummaryCards from './Components/SummaryCards'
import TransactionForm from './Components/TransactionForm'
import TransactionList from './Components/TransactionList'
import { useBudget } from './hooks/useBudget'

export default function App() {
  const {
    budgetLimit,
    transactions,
    totalSpent,
    remaining,
    addTransaction,
    deleteTransaction,
    updateBudget,
  } = useBudget()

  return (
    <main className="app-shell">
      <SummaryCards
        budgetLimit={budgetLimit}
        totalSpent={totalSpent}
        remaining={remaining}
        transactionCount={transactions.length}
        onUpdateBudget={updateBudget}
      />
      <TransactionForm onAddTransaction={addTransaction} />
      <TransactionList
        transactions={transactions}
        onDeleteTransaction={deleteTransaction}
      />
    </main>
  )
}