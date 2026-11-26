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
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    filteredTransactions,
    categoryTotals,
    addTransaction,
    deleteTransaction,
    editTransaction,
    clearTransactions,
    updateBudget,
  } = useBudget()

  return (
    <main className="app-shell">
      <SummaryCards
        budgetLimit={budgetLimit}
        totalSpent={totalSpent}
        remaining={remaining}
        transactionCount={transactions.length}
        categoryTotals={categoryTotals}
        onUpdateBudget={updateBudget}
      />
      <TransactionForm onAddTransaction={addTransaction} />
      <TransactionList
        filteredTransactions={filteredTransactions}
        totalTransactionCount={transactions.length}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onEditTransaction={editTransaction}
        onDeleteTransaction={deleteTransaction}
        onClearTransactions={clearTransactions}
      />
    </main>
  )
}