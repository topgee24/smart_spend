import { useEffect, useState } from 'react'

export type Category =
  | 'Food'
  | 'Transport'
  | 'Data/Bills'
  | 'Entertainment'
  | 'Other'

export interface Transaction {
  id: string
  title: string
  amount: number
  category: Category
  date: string
}

export interface NewTransaction {
  title: string
  amount: number | string
  category: Category
}

const BUDGET_STORAGE_KEY = 'smart-spend-budget-limit'
const TRANSACTIONS_STORAGE_KEY = 'smart-spend-transactions'
const DEFAULT_BUDGET_LIMIT = 1000
const CATEGORIES: readonly Category[] = [
  'Food',
  'Transport',
  'Data/Bills',
  'Entertainment',
  'Other',
]

function isCategory(value: unknown): value is Category {
  return (
    typeof value === 'string' &&
    CATEGORIES.includes(value as Category)
  )
}

function readStoredValue(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch (error) {
    console.error(`Unable to read ${key} from localStorage.`, error)
    return null
  }
}

function readBudgetLimit(): number {
  const storedValue = readStoredValue(BUDGET_STORAGE_KEY)
  if (storedValue === null || storedValue.trim() === '') {
    return DEFAULT_BUDGET_LIMIT
  }

  try {
    const parsed: unknown = JSON.parse(storedValue)
    const budgetLimit = Number(parsed)
    return Number.isFinite(budgetLimit) && budgetLimit > 0
      ? budgetLimit
      : DEFAULT_BUDGET_LIMIT
  } catch {
    return DEFAULT_BUDGET_LIMIT
  }
}

function isTransaction(value: unknown): value is Transaction {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    candidate.id.length > 0 &&
    typeof candidate.title === 'string' &&
    candidate.title.trim().length > 0 &&
    typeof candidate.amount === 'number' &&
    Number.isFinite(candidate.amount) &&
    candidate.amount > 0 &&
    isCategory(candidate.category) &&
    typeof candidate.date === 'string' &&
    !Number.isNaN(Date.parse(candidate.date))
  )
}

function readTransactions(): Transaction[] {
  const storedValue = readStoredValue(TRANSACTIONS_STORAGE_KEY)
  if (storedValue === null || storedValue.trim() === '') {
    return []
  }

  try {
    const parsed: unknown = JSON.parse(storedValue)
    return Array.isArray(parsed) ? parsed.filter(isTransaction) : []
  } catch {
    return []
  }
}

function writeStoredValue(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch (error) {
    console.error(`Unable to save ${key} to localStorage.`, error)
  }
}

function createTransactionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function useBudget() {
  const [budgetLimit, setBudgetLimit] = useState(readBudgetLimit)
  const [transactions, setTransactions] = useState<Transaction[]>(readTransactions)

  useEffect(() => {
    writeStoredValue(BUDGET_STORAGE_KEY, JSON.stringify(budgetLimit))
  }, [budgetLimit])

  useEffect(() => {
    writeStoredValue(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  const totalSpent = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  )
  const remaining = budgetLimit - totalSpent

  function addTransaction(transaction: NewTransaction): boolean {
    const title = transaction.title.trim()
    const amount = Number(transaction.amount)

    if (
      title.length === 0 ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !isCategory(transaction.category)
    ) {
      return false
    }

    setTransactions((currentTransactions) => [
      ...currentTransactions,
      {
        id: createTransactionId(),
        title,
        amount,
        category: transaction.category,
        date: new Date().toISOString(),
      },
    ])
    return true
  }

  function deleteTransaction(id: string): void {
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== id),
    )
  }

  function updateBudget(value: number | string): boolean {
    const nextBudgetLimit = Number(value)
    if (!Number.isFinite(nextBudgetLimit) || nextBudgetLimit <= 0) {
      return false
    }

    setBudgetLimit(nextBudgetLimit)
    return true
  }

  return {
    budgetLimit,
    transactions,
    totalSpent,
    remaining,
    addTransaction,
    deleteTransaction,
    updateBudget,
  }
}