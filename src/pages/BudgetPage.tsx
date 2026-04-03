import { useState } from 'react';
import { Plus, Trash2, AlertCircle, CheckCircle, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useFinanceStore, useBudgetWithSpending } from '@/store/useFinanceStore';
import { BudgetModal } from '@/components/BudgetModal';
import { EmptyState } from '@/components/EmptyState';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function BudgetPage() {
  const { addBudget, deleteBudget, updateBudget, role } = useFinanceStore();
  const budgetsWithSpending = useBudgetWithSpending();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const isAdmin = role === 'admin';

  const onSaveBudget = (category: string, limit: number) => {
    if (editingId) {
      updateBudget(editingId, { category, limit });
      setEditingId(null);
    } else {
      addBudget({ category, limit, spent: 0 });
    }
  };

  const budgetStats = budgetsWithSpending.reduce(
    (acc, b) => ({
      total: acc.total + b.limit,
      spent: acc.spent + b.spent,
      exceeded: acc.exceeded + (b.status === 'exceeded' ? 1 : 0),
      warning: acc.warning + (b.status === 'warning' ? 1 : 0),
    }),
    { total: 0, spent: 0, exceeded: 0, warning: 0 }
  );

  const statCards = [
    {
      label: 'Total Budget',
      value: formatCurrency(budgetStats.total),
      icon: '🎯',
      color: 'text-primary',
    },
    {
      label: 'Total Spent',
      value: formatCurrency(budgetStats.spent),
      icon: '💸',
      color: 'text-muted-foreground',
    },
    {
      label: 'Warnings',
      value: budgetStats.warning.toString(),
      icon: '⚠️',
      color: 'text-yellow-500',
    },
    {
      label: 'Exceeded',
      value: budgetStats.exceeded.toString(),
      icon: '❌',
      color: 'text-destructive',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Budget Tracking</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">Set and manage spending budgets</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Budget
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-3 sm:p-4">
              <p className="text-2xl mb-1">{card.icon}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className="text-lg sm:text-xl font-bold mt-1">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget Cards */}
      <div className="grid gap-3 sm:gap-4">
        {budgetsWithSpending.length === 0 ? (
          <Card>
            <CardContent className="p-0">
              <EmptyState
                icon={Target}
                title="No budgets yet"
                description="Set up budgets to track spending limits by category and stay on track with your financial goals"
                action={isAdmin ? {
                  label: "Create Budget",
                  onClick: () => setModalOpen(true)
                } : undefined}
              />
            </CardContent>
          </Card>
        ) : (
          budgetsWithSpending.map((budget) => (
            <Card key={budget.id}>
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold mb-1">{budget.category}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        budget.status === 'exceeded'
                          ? 'destructive'
                          : budget.status === 'warning'
                          ? 'secondary'
                          : 'default'
                      }
                      className="text-xs"
                    >
                      {budget.status === 'exceeded' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {budget.status === 'warning' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {budget.status === 'on-track' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {budget.status === 'on-track' ? 'On Track' : budget.status === 'warning' ? 'Warning' : 'Exceeded'}
                    </Badge>
                    {isAdmin && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the {budget.category} budget? This action cannot be undone.
                          </AlertDialogDescription>
                          <div className="flex gap-3 justify-end">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive"
                              onClick={() => deleteBudget(budget.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <Progress
                    value={budget.percentage}
                    className={`h-2.5 ${
                      budget.status === 'exceeded'
                        ? 'bg-destructive/20'
                        : budget.status === 'warning'
                        ? 'bg-yellow-500/20'
                        : 'bg-primary/20'
                    }`}
                  />
                </div>

                {/* Status Text */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">
                    {budget.percentage.toFixed(0)}% spent
                  </span>
                  <span className={budget.remaining >= 0 ? 'text-income' : 'text-expense'}>
                    {budget.remaining >= 0
                      ? `${formatCurrency(budget.remaining)} remaining`
                      : `${formatCurrency(Math.abs(budget.remaining))} over`}
                  </span>
                </div>

                {/* Warning Message */}
                {budget.status === 'exceeded' && (
                  <div className="mt-3 p-2 bg-destructive/10 rounded text-xs text-destructive">
                    You've exceeded your {budget.category} budget by {formatCurrency(Math.abs(budget.remaining))}!
                  </div>
                )}
                {budget.status === 'warning' && (
                  <div className="mt-3 p-2 bg-yellow-500/10 rounded text-xs text-yellow-700 dark:text-yellow-600">
                    You're approaching your {budget.category} budget limit. {formatCurrency(budget.remaining)} remaining.
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <BudgetModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={onSaveBudget}
        title={editingId ? 'Edit Budget' : 'Add Budget'}
      />
    </div>
  );
}
