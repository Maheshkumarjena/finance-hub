import { useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, ArrowUp, ArrowDown, ArrowUpDown, X, FileDown, ChevronLeft, ChevronRight, MoreVertical, Trash2, ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  useFinanceStore,
  useFilteredTransactions,
  CATEGORIES_LIST,
  Transaction,
} from '@/store/useFinanceStore';
import { TransactionDrawer } from '@/components/transactions/TransactionDrawer';
import { TransactionModal } from '@/components/transactions/TransactionModal';

const ITEMS_PER_PAGE = 10;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [txnToDelete, setTxnToDelete] = useState<Transaction | null>(null);
  const [pageInput, setPageInput] = useState<string>(String(currentPage));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  const isAdmin = role === 'admin';

  const toggleSort = useCallback((field: 'date' | 'amount') => {
    if (filters.sortBy === field) {
      setFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      setFilters({ sortBy: field, sortOrder: 'desc' });
    }
  }, [filters, setFilters]);

  const toggleSelectId = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginationData.paginatedTransactions.length && selectedIds.size > 0) {
      setSelectedIds(new Set());
    } else {
      const allIds = new Set(paginationData.paginatedTransactions.map(t => t.id));
      setSelectedIds(allIds);
    }
  };

  const handleBulkDelete = () => {
    selectedIds.forEach(id => {
      const txn = transactions.find(t => t.id === id);
      if (txn) {
        deleteTransaction(id);
      }
    });
    toast.success('Transactions deleted', { description: `${selectedIds.size} transaction(s) removed` });
    setSelectedIds(new Set());
    setBulkDeleteConfirmOpen(false);
  };

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [filters.categories, filters.type, filters.sortBy, filters.sortOrder]);

  // Sync pageInput with currentPage
  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const paginatedTransactions = transactions.slice(startIdx, endIdx);
    return { paginatedTransactions, totalPages, currentPage };
  }, [transactions, currentPage]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count++;
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
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-row items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">{transactions.length} transactions</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9" onClick={exportCSV}>
            <FileDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> <span className="hidden sm:inline">Export</span>
          </Button>
          {isAdmin ? (
            <Button size="sm" className="text-xs sm:text-sm h-8 sm:h-9" onClick={() => { setEditingTxn(null); setModalOpen(true); }}>
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-0" /> Add
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" disabled className="text-xs sm:text-sm h-8 sm:h-9">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-0" /> Add
                </Button>
              </TooltipTrigger>
              <TooltipContent>Switch to Admin to add transactions</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Bulk Delete Bar */}
      {selectedIds.size > 0 && isAdmin && (
        <div className="flex items-center justify-between gap-3 bg-destructive/10 border border-destructive/30 rounded-md p-3">
          <span className="text-sm font-medium text-destructive">{selectedIds.size} selected</span>
          <button
            onClick={() => setBulkDeleteConfirmOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 h-9 rounded-md bg-destructive text-destructive-foreground text-xs sm:text-sm font-medium hover:bg-destructive/90 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm">
              Categories {filters.categories.length > 0 && <span className="ml-0 font-semibold">({filters.categories.length})</span>}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="start">
            {CATEGORIES_LIST.map((c) => (
              <div key={c} className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={filters.categories.includes(c)}
                  onCheckedChange={() => {
                    const newCategories = filters.categories.includes(c)
                      ? filters.categories.filter(cat => cat !== c)
                      : [...filters.categories, c];
                    setFilters({ categories: newCategories });
                  }}
                />
                <label className="text-xs sm:text-sm cursor-pointer flex-1">{c}</label>
              </div>
            ))}
            {filters.categories.length > 0 && (
              <>
                <div className="border-t my-1" />
                <DropdownMenuItem
                  onClick={() => setFilters({ categories: [] })}
                  className="text-xs sm:text-sm"
                >
                  Clear Categories
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-1 flex-wrap">
          {(['', 'income', 'expense'] as const).map((t) => (
            <Button
              key={t || 'all'}
              variant={filters.type === t ? 'default' : 'outline'}
              size="sm"
              className="h-8 sm:h-9 text-xs sm:text-sm"
              onClick={() => setFilters({ type: t })}
            >
              {t === '' ? 'All' : t === 'income' ? 'Income' : 'Expenses'}
            </Button>
          ))}
        </div>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" className="h-8 sm:h-9 text-xs text-muted-foreground" onClick={() => setFilters({ categories: [], type: '' })}>
            <X className="h-3 w-3 mr-1" /> Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="py-12 sm:py-16 text-center">
              <p className="text-muted-foreground text-sm mb-2">No transactions found</p>
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={() => { setEditingTxn(null); setModalOpen(true); }} className="text-xs sm:text-sm">
                  Add your first transaction
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm table-auto">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {isAdmin && (
                      <th className="w-10 p-2 sm:p-3">
                        <div className="flex items-center justify-center">
                          <Checkbox
                            checked={selectedIds.size > 0 && selectedIds.size === paginationData.paginatedTransactions.length}
                            indeterminate={selectedIds.size > 0 && selectedIds.size < paginationData.paginatedTransactions.length}
                            onCheckedChange={toggleSelectAll}
                          />
                        </div>
                      </th>
                    )}
                    <th className="text-left p-2 sm:p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => toggleSort('date')}>
                      <span className="flex items-center gap-1">Date {filters.sortBy === 'date' ? (filters.sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}</span>
                    </th>
                    <th className="hidden sm:table-cell text-left p-2 sm:p-3 font-medium text-muted-foreground">Description</th>
                    <th className="text-left p-2 sm:p-3 font-medium text-muted-foreground">Category</th>
                    <th className="text-right p-2 sm:p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => toggleSort('amount')}>
                      <span className="flex items-center justify-end gap-1">Amt {filters.sortBy === 'amount' ? (filters.sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}</span>
                    </th>
                    {isAdmin && <th className="p-2 sm:p-3" />}
                  </tr>
                </thead>
                <tbody>
                  {paginationData.paginatedTransactions.map((t) => (
                    <tr
                      key={t.id}
                      className={`border-b last:border-0 transition-colors group ${
                        selectedIds.has(t.id) ? 'bg-primary/10' : 'hover:bg-muted/30 cursor-pointer'
                      }`}
                      onClick={() => {
                        if (!selectedIds.has(t.id)) {
                          setSelectedTxn(t);
                          setDrawerOpen(true);
                        }
                      }}
                    >
                      {isAdmin && (
                        <td className="p-2 sm:p-3 w-10" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={selectedIds.has(t.id)}
                              onCheckedChange={() => toggleSelectId(t.id)}
                            />
                          </div>
                        </td>
                      )}
                      <td className="p-2 sm:p-3 text-muted-foreground">{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="hidden sm:table-cell p-2 sm:p-3 font-medium">{t.description}</td>
                      <td className="p-2 sm:p-3">
                        <Badge variant="secondary" className="font-normal text-xs">{t.category}</Badge>
                      </td>
                      <td className={`p-2 sm:p-3 text-right font-semibold text-xs sm:text-sm ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                      {isAdmin && !selectedIds.has(t.id) && (
                        <td className="flex justify-end py-2 sm:py-3 pl-1 pr-2 sm:pr-3" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="text-xs">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTxn(t);
                                  setModalOpen(true);
                                }}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTxnToDelete(t);
                                  setDeleteConfirmOpen(true);
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Pagination */}
      {transactions.length > 0 && (
        <div className="flex items-center justify-between gap-2 px-2 sm:px-0">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, transactions.length)} of {transactions.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 sm:h-9 px-2 sm:px-3"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Page</span>
              <Input
                type="number"
                min="1"
                max={paginationData.totalPages}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={(e) => {
                  const num = parseInt(e.target.value);
                  if (!isNaN(num) && num >= 1 && num <= paginationData.totalPages) {
                    setCurrentPage(num);
                    setPageInput(String(num));
                  } else {
                    setPageInput(String(currentPage));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const num = parseInt(pageInput);
                    if (!isNaN(num) && num >= 1 && num <= paginationData.totalPages) {
                      setCurrentPage(num);
                    } else {
                      setPageInput(String(currentPage));
                    }
                  }
                }}
                className="w-12 h-8 sm:h-9 text-center text-xs sm:text-sm [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden [-moz-appearance:textfield]"
              />
              <span className="text-xs sm:text-sm text-muted-foreground">of {paginationData.totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 sm:h-9 px-2 sm:px-3"
              onClick={() => setCurrentPage(p => Math.min(paginationData.totalPages, p + 1))}
              disabled={currentPage === paginationData.totalPages}
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      )}

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

      <AlertDialog open={bulkDeleteConfirmOpen} onOpenChange={setBulkDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Selected Transactions</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {selectedIds.size} transaction(s)? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this transaction? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (txnToDelete) {
                  deleteTransaction(txnToDelete.id);
                  toast.success('Transaction deleted', { description: `Category: ${txnToDelete.category}` });
                  setDeleteConfirmOpen(false);
                  setTxnToDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
