import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Initialize dark mode from localStorage or system preference
const initializeDarkMode = () => {
  const stored = typeof window !== 'undefined' 
    ? localStorage.getItem('finance-dashboard')
    : null;
  
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.state?.darkMode ?? false;
    } catch {
      return false;
    }
  }
  
  // Check system preference
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  return false;
};

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  tags: string[];
  type: 'income' | 'expense';
  description: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  createdAt: string;
  updatedAt: string;
}

interface Filters {
  searchTerm: string;
  categories: string[];
  tags: string[];
  type: '' | 'income' | 'expense';
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
  dateFrom: string;
  dateTo: string;
}

interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  tags: string[];
  role: 'viewer' | 'admin';
  filters: Filters;
  darkMode: boolean;
  setRole: (role: 'viewer' | 'admin') => void;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  addBudget: (b: Omit<Budget, 'id' | 'spent' | 'createdAt' | 'updatedAt'>) => void;
  updateBudget: (id: string, b: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  toggleDarkMode: () => void;
}

const CATEGORIES = ['Salary', 'Freelance', 'Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Investment', 'Other'];

function generateMockData(): Transaction[] {
  const now = new Date();
  const transactions: Transaction[] = [];
  const incomeCategories = ['Salary', 'Freelance', 'Investment'];
  const expenseCategories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health'];
  const tags = ['important', 'recurring', 'business', 'personal', 'urgent', 'review'];

  for (let i = 0; i < 50; i++) {
    const isIncome = Math.random() > 0.6;
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    const cats = isIncome ? incomeCategories : expenseCategories;
    
    // Random 0-2 tags per transaction
    const tagCount = Math.floor(Math.random() * 3);
    const txnTags: string[] = [];
    for (let t = 0; t < tagCount; t++) {
      const tag = tags[Math.floor(Math.random() * tags.length)];
      if (!txnTags.includes(tag)) txnTags.push(tag);
    }

    transactions.push({
      id: `txn-${i + 1}`,
      date: date.toISOString().split('T')[0],
      amount: isIncome
        ? Math.round((Math.random() * 5000 + 1000) * 100) / 100
        : Math.round((Math.random() * 500 + 10) * 100) / 100,
      category: cats[Math.floor(Math.random() * cats.length)],
      tags: txnTags,
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
  categories: [],
  tags: [],
  type: '',
  sortBy: 'date',
  sortOrder: 'desc',
  dateFrom: '',
  dateTo: '',
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: generateMockData(),
      tags: ['important', 'recurring', 'business', 'personal', 'urgent', 'review'],
      budgets: [
        { id: 'b1', category: 'Food', limit: 500, spent: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'b2', category: 'Transport', limit: 200, spent: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'b3', category: 'Entertainment', limit: 300, spent: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'b4', category: 'Shopping', limit: 400, spent: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ],
      role: 'admin',
      filters: { ...defaultFilters },
      darkMode: initializeDarkMode(),
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
      addBudget: (b) =>
        set((s) => ({
          budgets: [
            {
              ...b,
              id: `b-${Date.now()}`,
              spent: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...s.budgets,
          ],
        })),
      updateBudget: (id, updates) =>
        set((s) => ({
          budgets: s.budgets.map((b) =>
            b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
          ),
        })),
      deleteBudget: (id) =>
        set((s) => ({
          budgets: s.budgets.filter((b) => b.id !== id),
        })),
      addTag: (tag) =>
        set((s) => {
          if (s.tags.includes(tag)) return s;
          return { tags: [...s.tags, tag] };
        }),
      removeTag: (tag) =>
        set((s) => ({
          tags: s.tags.filter((t) => t !== tag),
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
        budgets: state.budgets,
        tags: state.tags,
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
  if (filters.categories.length > 0) {
    result = result.filter((t) => filters.categories.includes(t.category));
  }
  if (filters.type) {
    result = result.filter((t) => t.type === filters.type);
  }
  if (filters.dateFrom) {
    result = result.filter((t) => t.date >= filters.dateFrom);
  }
  if (filters.dateTo) {
    result = result.filter((t) => t.date <= filters.dateTo);
  }
  if (filters.tags.length > 0) {
    result = result.filter((t) =>
      filters.tags.some((tag) => t.tags.includes(tag))
    );
  }

  result.sort((a, b) => {
    const mul = filters.sortOrder === 'asc' ? 1 : -1;
    if (filters.sortBy === 'date') return mul * a.date.localeCompare(b.date);
    return mul * (a.amount - b.amount);
  });

  return result;
};

export const useBudgetWithSpending = () => {
  const { transactions, budgets } = useFinanceStore();
  
  return budgets.map((budget) => {
    const spent = transactions
      .filter((t) => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    const status = percentage > 100 ? 'exceeded' : percentage > 80 ? 'warning' : 'on-track';
    
    return {
      ...budget,
      spent,
      remaining: Math.max(0, budget.limit - spent),
      percentage: Math.min(percentage, 100),
      status,
    };
  });
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
