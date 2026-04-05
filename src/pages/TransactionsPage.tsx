import { useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, ArrowUp, ArrowDown, ArrowUpDown, X, FileDown, ChevronLeft, ChevronRight, MoreVertical, Trash2, ChevronDown, Receipt } from 'lucide-react';
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
import { DateRangePicker } from '@/components/DateRangePicker';
import { EmptyState } from '@/components/EmptyState';
import ErrorBoundary from '@/components/ErrorBoundary';
import { PageErrorFallback } from '@/components/PageErrorFallback';

const ITEMS_PER_PAGE = 10;

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function TransactionsPageContent() {
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
    try {
      let deletedCount = 0;
      selectedIds.forEach(id => {
        const txn = transactions.find(t => t.id === id);
        if (txn) {
          deleteTransaction(id);
          deletedCount++;
        }
      });
      if (deletedCount > 0) {
        toast.success('Transactions deleted', { description: `${deletedCount} transaction(s) removed` });
      } else {
        toast.error('No transactions deleted', { description: 'An error occurred during deletion' });
      }
      setSelectedIds(new Set());
      setBulkDeleteConfirmOpen(false);
    } catch (error) {
      console.error('Error deleting transactions:', error);
      toast.error('Failed to delete transactions', { description: 'Please try again' });
    }
  };

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [filters.categories, filters.type, filters.dateFrom, filters.dateTo, filters.tags, filters.sortBy, filters.sortOrder]);

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
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.tags.length > 0) count++;
    return count;
  }, [filters]);

  const exportCSV = useCallback(() => {
    try {
      if (transactions.length === 0) {
        toast.error('No data to export', { description: 'Add transactions before exporting' });
        return;
      }

      const headers = 'Date,Amount,Category,Type,Description\n';
      const rows = transactions
        .map((t) => `${t.date},${t.amount},${t.category},${t.type},${t.description}`)
        .join('\n');
      
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      if (blob.size === 0) {
        toast.error('Export failed', { description: 'Unable to generate CSV file' });
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Export successful', { description: `${transactions.length} transaction(s) exported` });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Export failed', { description: 'Unable to download CSV file' });
    }
  }, [transactions]);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-row items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">{transactions.length} transactions</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9 btn-interactive" onClick={exportCSV}>
              <FileDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> <span className="hidden sm:inline">Export</span>
            </Button>
            {isAdmin ? (
              <Button size="sm" className="text-xs sm:text-sm h-8 sm:h-9 btn-interactive" onClick={() => { setEditingTxn(null); setModalOpen(true); }}>
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
      </div>

      {/* Bulk Delete Bar */}
      {selectedIds.size > 0 && isAdmin && (
        <div
          className="flex items-center justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-3 shadow-sm"
          style={{ animationFillMode: 'both' }}
        >
          <span className="text-sm font-medium text-destructive">{selectedIds.size} selected</span>
          <button
            onClick={() => setBulkDeleteConfirmOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-destructive px-3 py-2 text-xs font-medium text-destructive-foreground transition-all duration-200 hover:bg-destructive/90 active:scale-95 motion-safe:hover:-translate-y-px sm:text-sm"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </button>
        </div>
      )}

      {/* Filters */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm btn-interactive">
                Categories {filters.categories.length > 0 && <span className="ml-0 font-semibold">({filters.categories.length})</span>}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="start">
              {CATEGORIES_LIST.map((c) => (
                <div key={c} className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer transition-colors duration-200" onClick={(e) => e.stopPropagation()}>
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
                className="h-8 sm:h-9 text-xs sm:text-sm btn-interactive transition-all duration-300"
                onClick={() => setFilters({ type: t })}
              >
                {t === '' ? 'All' : t === 'income' ? 'Income' : 'Expenses'}
              </Button>
            ))}
          </div>

          <DateRangePicker
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            onDateFromChange={(date) => setFilters({ dateFrom: date })}
            onDateToChange={(date) => setFilters({ dateTo: date })}
            onClear={() => setFilters({ dateFrom: '', dateTo: '' })}
          />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm btn-interactive">
              Tags {filters.tags.length > 0 && <span className="ml-0 font-semibold">({filters.tags.length})</span>}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="start">
            {useFinanceStore.getState().tags.map((tag) => (
              <div key={tag} className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer transition-colors duration-200" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={filters.tags.includes(tag)}
                  onCheckedChange={() => {
                    const newTags = filters.tags.includes(tag)
                      ? filters.tags.filter(t => t !== tag)
                      : [...filters.tags, tag];
                    setFilters({ tags: newTags });
                  }}
                />
                <label className="text-xs sm:text-sm cursor-pointer flex-1 capitalize">{tag}</label>
              </div>
            ))}
            {filters.tags.length > 0 && (
              <>
                <div className="border-t my-1" />
                <DropdownMenuItem
                  onClick={() => setFilters({ tags: [] })}
                  className="text-xs sm:text-sm"
                >
                  Clear Tags
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" className="h-8 sm:h-9 text-xs text-muted-foreground btn-interactive transition-all duration-300 hover:text-foreground" onClick={() => setFilters({ categories: [], type: '', dateFrom: '', dateTo: '', tags: [] })}>
            <X className="h-3 w-3 mr-1" /> Clear filters
          </Button>
        )}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No transactions yet"
              description={isAdmin ? "Get started by adding your first transaction to track your spending" : "No transactions to display. Switch to Admin mode to add one."}
              action={isAdmin ? {
                label: "Add Transaction",
                onClick: () => { setEditingTxn(null); setModalOpen(true); }
              } : undefined}
            />
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
                    <th className="hidden sm:table-cell text-left p-2 sm:p-3 font-medium text-muted-foreground">Tags</th>
                    <th className="text-right p-2 sm:p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => toggleSort('amount')}>
                      <span className="flex items-center justify-end gap-1">Amt {filters.sortBy === 'amount' ? (filters.sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}</span>
                    </th>
                    {isAdmin && <th className="p-2 sm:p-3" />}
                  </tr>
                </thead>
                <tbody>
                  {paginationData.paginatedTransactions.map((t, idx) => (
                    <tr
                      key={t.id}
                      className={`border-b last:border-0 transition-all duration-300 group ${
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
                      <td className="hidden sm:table-cell p-2 sm:p-3">
                        <div className="flex flex-wrap gap-1">
                          {t.tags && t.tags.length > 0 ? (
                            t.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="font-normal text-xs capitalize">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </div>
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
                                className="h-6 w-6 p-0 opacity-0 transition-all duration-300 group-hover:opacity-100 motion-safe:translate-y-1 motion-safe:group-hover:translate-y-0 btn-interactive"
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
              className="h-8 sm:h-9 px-2 sm:px-3 btn-interactive transition-all duration-300"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 hover:scale-110" />
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
                className="w-12 h-8 sm:h-9 text-center text-xs sm:text-sm transition-all duration-300 focus-ring-animate [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden [-moz-appearance:textfield]"
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
        onEdit={(txn) => {
          setEditingTxn(txn);
          setModalOpen(true);
        }}
      />

      <TransactionModal
        transaction={editingTxn}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <AlertDialog open={bulkDeleteConfirmOpen} onOpenChange={setBulkDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete {selectedIds.size} Transaction(s)?</AlertDialogTitle>
          <div className="bg-muted/50 p-3 rounded-md mb-3 border border-muted text-sm space-y-2">
            <p className="text-muted-foreground">Selected items:</p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {paginationData.paginatedTransactions
                .filter((t) => selectedIds.has(t.id))
                .slice(0, 3)
                .map((t) => (
                  <div key={t.id} className="flex justify-between items-center text-xs">
                    <span className="text-foreground font-medium truncate">{t.description}</span>
                    <span className={`font-semibold whitespace-nowrap ml-2 ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                  </div>
                ))}
            </div>
            {selectedIds.size > 3 && (
              <p className="text-xs text-muted-foreground">...and {selectedIds.size - 3} more</p>
            )}
          </div>
          <AlertDialogDescription>
            This action cannot be undone. All {selectedIds.size} transaction(s) will be permanently removed.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
          {txnToDelete && (
            <div className="bg-muted/50 p-3 rounded-md mb-3 border border-muted text-sm">
              <p className="text-muted-foreground mb-2">You're about to delete:</p>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-medium text-foreground">{txnToDelete.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(txnToDelete.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <p className={`font-semibold whitespace-nowrap ${txnToDelete.type === 'income' ? 'text-income' : 'text-expense'}`}>
                  {txnToDelete.type === 'income' ? '+' : '-'}{formatCurrency(txnToDelete.amount)}
                </p>
              </div>
            </div>
          )}
          <AlertDialogDescription>
            This action cannot be undone. The transaction will be permanently removed from your records.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (txnToDelete) {
                  try {
                    deleteTransaction(txnToDelete.id);
                    toast.success('Transaction deleted', { description: `Category: ${txnToDelete.category}` });
                  } catch (error) {
                    console.error('Error deleting transaction:', error);
                    toast.error('Failed to delete', { description: 'Unable to delete transaction' });
                  } finally {
                    setDeleteConfirmOpen(false);
                    setTxnToDelete(null);
                  }
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Permanently
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <ErrorBoundary fallback={<PageErrorFallback pageName="Transactions" />}>
      <TransactionsPageContent />
    </ErrorBoundary>
  );
}
