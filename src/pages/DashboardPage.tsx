import { useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDerivedStats, useFinanceStore, useBudgetWithSpending } from '@/store/useFinanceStore';
import { BalanceChart } from '@/components/dashboard/BalanceChart';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { useNavigate } from 'react-router-dom';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function DashboardPage() {
  const { totalBalance, totalIncome, totalExpense, categoryBreakdown, monthlyArray } = useDerivedStats();
  const setFilters = useFinanceStore((s) => s.setFilters);
  const budgetsWithSpending = useBudgetWithSpending();
  const navigate = useNavigate();

  const budgetAlerts = budgetsWithSpending.filter(b => b.status === 'warning' || b.status === 'exceeded');

  const cards = useMemo(() => [
    {
      label: 'Total Balance',
      value: totalBalance,
      change: 12.5,
      icon: DollarSign,
      accent: 'primary' as const,
      onClick: () => setFilters({ type: '' }),
    },
    {
      label: 'Total Income',
      value: totalIncome,
      change: 8.2,
      icon: TrendingUp,
      accent: 'income' as const,
      onClick: () => setFilters({ type: 'income' }),
    },
    {
      label: 'Total Expenses',
      value: totalExpense,
      change: -3.1,
      icon: TrendingDown,
      accent: 'expense' as const,
      onClick: () => setFilters({ type: 'expense' }),
    },
  ], [totalBalance, totalIncome, totalExpense, setFilters]);

  const accentStyles = {
    primary: 'bg-primary/10 text-primary',
    income: 'bg-income/10 text-income',
    expense: 'bg-expense/10 text-expense',
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-xs sm:text-sm">Your financial overview at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {cards.map((card) => (
          <Card
            key={card.label}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={card.onClick}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">{card.label}</span>
                <div className={`h-8 sm:h-9 w-8 sm:w-9 rounded-lg flex items-center justify-center ${accentStyles[card.accent]}`}>
                  <card.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="text-lg sm:text-2xl font-bold">{formatCurrency(card.value)}</div>
              <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm">
                {card.change > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-income" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-expense" />
                )}
                <span className={`text-xs font-medium ${card.change > 0 ? 'text-income' : 'text-expense'}`}>
                  {Math.abs(card.change)}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget Summary */}
      {budgetsWithSpending.length > 0 && (
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Budget Overview</h3>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/budgets')}>
                Manage Budgets
              </Button>
            </div>
            {budgetAlerts.length > 0 ? (
              <div className="space-y-2">
                {budgetAlerts.slice(0, 3).map((budget) => (
                  <div key={budget.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-sm font-medium">{budget.category}</span>
                    <Badge variant={budget.status === 'exceeded' ? 'destructive' : 'secondary'} className="text-xs">
                      {budget.status === 'exceeded' ? 'Over budget' : 'Warning'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">All budgets on track ✓</p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-3 sm:p-5">
              <h3 className="text-sm sm:text-base font-semibold mb-4">Balance Trend</h3>
              <BalanceChart data={monthlyArray} />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <h3 className="text-sm sm:text-base font-semibold mb-4">Expense Breakdown</h3>
            <CategoryChart data={categoryBreakdown} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
