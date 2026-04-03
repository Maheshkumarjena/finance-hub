import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, ArrowUp, ArrowDown, ArrowUpDown, X, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  useFinanceStore,
  useFilteredTransactions,
  CATEGORIES_LIST,
  Transaction,
} from '@/store/useFinanceStore';
import { TransactionDrawer } from '@/components/transactions/TransactionDrawer';
import { TransactionModal } from '@/components/transactions/TransactionModal';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function TransactionsPage() {
  const { role, filters, setFilters, deleteTransaction } = useFinanceStore();
  const transactions = useFilteredTransactions();
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState<Transaction | null>(null);

  const isAdmin = role === 'admin';

  const toggleSort = useCallback((field: 'date' | 'amount') => {
    if (filters.sortBy === field) {
      setFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      setFilters({ sortBy: field, sortOrder: 'desc' });
    }
  }, [filters, setFilters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.type) count++;
    return count;
  }, [filters]);

  const exportCSV = useCallback(() => {
    const headers = 'Date,Amount,Category,Type,Description\n';
    const rows = transactions
      .map((t) => `${t.date},${t.amount},${t.category},${t.type},${t.description}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [transactions]);

  return (
    <div className="space-y-3 sm:space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground text-sm">{transactions.length} transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <FileDown className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          {isAdmin ? (
            <Button size="sm" onClick={() => { setEditingTxn(null); setModalOpen(true); }}>
              <Plus className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Add Transaction</span>
              <span className="sm:hidden">Add</span>
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" disabled>
                  <Plus className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Add Transaction</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Switch to Admin to add transactions</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2">
        <Select value={filters.category || 'all'} onValueChange={(v) => setFilters({ category: v === 'all' ? '' : v })}>
          <SelectTrigger className="w-[130px] sm:w-[150px] h-9">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES_LIST.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-1">
          {(['', 'income', 'expense'] as const).map((t) => (
            <Button
              key={t || 'all'}
              variant={filters.type === t ? 'default' : 'outline'}
              size="sm"
              className="h-9"
              onClick={() => setFilters({ type: t })}
            >
              {t === '' ? 'All' : t === 'income' ? 'Income' : 'Expenses'}
            </Button>
          ))}
        </div>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" className="h-9 text-muted-foreground" onClick={() => setFilters({ category: '', type: '' })}>
            <X className="h-3 w-3 mr-1" /> Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground mb-2">No transactions found</p>
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={() => { setEditingTxn(null); setModalOpen(true); }}>
                  Add your first transaction
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-2 sm:p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => toggleSort('date')}>
                      <span className="flex items-center gap-1">Date {filters.sortBy === 'date' ? (filters.sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}</span>
                    </th>
                    <th className="text-left p-2 sm:p-3 font-medium text-muted-foreground hidden sm:table-cell">Description</th>
                    <th className="text-left p-2 sm:p-3 font-medium text-muted-foreground">Category</th>
                    <th className="text-right p-2 sm:p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => toggleSort('amount')}>
                      <span className="flex items-center justify-end gap-1">
                        <span className="hidden sm:inline">Amount</span>
                        <span className="sm:hidden">Amt</span>
                        {filters.sortBy === 'amount' ? (filters.sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                      </span>
                    </th>
                    {isAdmin && <th className="p-2 sm:p-3 w-20" />}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors group"
                      onClick={() => { setSelectedTxn(t); setDrawerOpen(true); }}
                    >
                      <td className="p-2 sm:p-3 text-muted-foreground">{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="p-2 sm:p-3 font-medium hidden sm:table-cell">{t.description}</td>
                      <td className="p-2 sm:p-3">
                        <Badge variant="secondary" className="font-normal">
                          <span className="hidden sm:inline">{t.category}</span>
                          <span className="sm:hidden">{t.category.slice(0, 3)}</span>
                        </Badge>
                      </td>
                      <td className={`p-2 sm:p-3 text-right font-semibold ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                      {isAdmin && (
                        <td className="p-2 sm:p-3">
                          <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={(e) => { e.stopPropagation(); setEditingTxn(t); setModalOpen(true); }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-destructive"
                              onClick={(e) => { e.stopPropagation(); deleteTransaction(t.id); toast.success('Transaction deleted', { description: `Category: ${t.category}` }); }}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionDrawer
        transaction={selectedTxn}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <TransactionModal
        transaction={editingTxn}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
