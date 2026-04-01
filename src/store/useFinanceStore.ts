import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description: string;
}

interface Filters {
  searchTerm: string;
  category: string;
  type: '' | 'income' | 'expense';
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

interface FinanceState {
  transactions: Transaction[];
  role: 'viewer' | 'admin';
  filters: Filters;
  darkMode: boolean;
  setRole: (role: 'viewer' | 'admin') => void;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  toggleDarkMode: () => void;
}

const CATEGORIES = ['Salary', 'Freelance', 'Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Investment', 'Other'];

function generateMockData(): Transaction[] {
  const now = new Date();
  const transactions: Transaction[] = [];
  const incomeCategories = ['Salary', 'Freelance', 'Investment'];
  const expenseCategories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health'];

  for (let i = 0; i < 50; i++) {
    const isIncome = Math.random() > 0.6;
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    const cats = isIncome ? incomeCategories : expenseCategories;

    transactions.push({
      id: `txn-${i + 1}`,
      date: date.toISOString().split('T')[0],
      amount: isIncome
        ? Math.round((Math.random() * 5000 + 1000) * 100) / 100
        : Math.round((Math.random() * 500 + 10) * 100) / 100,
      category: cats[Math.floor(Math.random() * cats.length)],
      type: isIncome ? 'income' : 'expense',
      description: isIncome
        ? `${cats[Math.floor(Math.random() * cats.length)]} payment`
        : `${cats[Math.floor(Math.random() * cats.length)]} expense`,
    });
  }

  return transactions.sort((a, b) => b.date.localeCompare(a.date));
}

const defaultFilters: Filters = {
  searchTerm: '',
  category: '',
  type: '',
  sortBy: 'date',
  sortOrder: 'desc',
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: generateMockData(),
      role: 'admin',
      filters: { ...defaultFilters },
      darkMode: false,
      setRole: (role) => set({ role }),
      setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
      resetFilters: () => set({ filters: { ...defaultFilters } }),
      addTransaction: (t) =>
        set((s) => ({
          transactions: [
            { ...t, id: `txn-${Date.now()}` },
            ...s.transactions,
          ],
        })),
      updateTransaction: (id, updates) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),
      toggleDarkMode: () =>
        set((s) => {
          const next = !s.darkMode;
          document.documentElement.classList.toggle('dark', next);
          return { darkMode: next };
        }),
    }),
    {
      name: 'finance-dashboard',
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        darkMode: state.darkMode,
      }),
    }
  )
);

// Selectors
export const useFilteredTransactions = () => {
  const { transactions, filters } = useFinanceStore();
  let result = [...transactions];

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term) ||
        t.amount.toString().includes(term)
    );
  }
  if (filters.category) {
    result = result.filter((t) => t.category === filters.category);
  }
  if (filters.type) {
    result = result.filter((t) => t.type === filters.type);
  }

  result.sort((a, b) => {
    const mul = filters.sortOrder === 'asc' ? 1 : -1;
    if (filters.sortBy === 'date') return mul * a.date.localeCompare(b.date);
    return mul * (a.amount - b.amount);
  });

  return result;
};

export const useDerivedStats = () => {
  const transactions = useFinanceStore((s) => s.transactions);
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  const categoryBreakdown = transactions
    .filter((t) => t.type === 'expense')
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  // Monthly data for charts
  const monthlyData = transactions.reduce<
    Record<string, { income: number; expense: number }>
  >((acc, t) => {
    const month = t.date.substring(0, 7);
    if (!acc[month]) acc[month] = { income: 0, expense: 0 };
    acc[month][t.type] += t.amount;
    return acc;
  }, {});

  const monthlyArray = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      label: new Date(month + '-01').toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      }),
      income: Math.round(data.income),
      expense: Math.round(data.expense),
      balance: Math.round(data.income - data.expense),
    }));

  return { totalIncome, totalExpense, totalBalance, categoryBreakdown, monthlyArray };
};

export const CATEGORIES_LIST = CATEGORIES;
