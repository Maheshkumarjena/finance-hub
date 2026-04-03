import { useMemo } from 'react';
import { TrendingUp, TrendingDown, ShoppingBag, BarChart3, Hash, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDerivedStats, useFinanceStore } from '@/store/useFinanceStore';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function InsightsPage() {
  const { totalIncome, totalExpense, categoryBreakdown, monthlyArray } = useDerivedStats();
  const transactions = useFinanceStore((s) => s.transactions);

  const insights = useMemo(() => {
    const topCategory = Object.entries(categoryBreakdown).sort(([, a], [, b]) => b - a)[0];

    const lastTwo = monthlyArray.slice(-2);
    let monthlyChange = 0;
    if (lastTwo.length === 2 && lastTwo[0].expense > 0) {
      monthlyChange = ((lastTwo[1].expense - lastTwo[0].expense) / lastTwo[0].expense) * 100;
    }

    const categoryPercentages = Object.entries(categoryBreakdown)
      .map(([name, value]) => ({
        name,
        value,
        percentage: totalExpense > 0 ? (value / totalExpense) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);

    const avgTransaction = transactions.length > 0
      ? transactions.reduce((s, t) => s + t.amount, 0) / transactions.length
      : 0;

    return { topCategory, monthlyChange, categoryPercentages, avgTransaction };
  }, [categoryBreakdown, monthlyArray, totalExpense, transactions]);

  const statCards = [
    {
      label: 'Top Spending Category',
      value: insights.topCategory ? insights.topCategory[0] : 'N/A',
      sub: insights.topCategory ? formatCurrency(insights.topCategory[1]) : '',
      icon: ShoppingBag,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Monthly Change',
      value: `${insights.monthlyChange > 0 ? '+' : ''}${insights.monthlyChange.toFixed(1)}%`,
      sub: 'vs previous month',
      icon: insights.monthlyChange > 0 ? TrendingUp : TrendingDown,
      color: insights.monthlyChange > 0 ? 'text-expense' : 'text-income',
      bgColor: insights.monthlyChange > 0 ? 'bg-expense/10' : 'bg-income/10',
    },
    {
      label: 'Total Transactions',
      value: transactions.length.toString(),
      sub: `Avg: ${formatCurrency(insights.avgTransaction)}`,
      icon: Hash,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Savings Rate',
      value: totalIncome > 0 ? `${(((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)}%` : '0%',
      sub: `${formatCurrency(totalIncome - totalExpense)} saved`,
      icon: BarChart3,
      color: 'text-income',
      bgColor: 'bg-income/10',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground text-xs sm:text-sm">Key financial metrics and analysis</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <div className={`h-9 sm:h-10 w-9 sm:w-10 rounded-lg flex items-center justify-center ${card.bgColor}`}>
                  <card.icon className={`h-4 sm:h-5 w-4 sm:w-5 ${card.color}`} />
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground">{card.label}</span>
              </div>
              <div className="text-lg sm:text-xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <h3 className="font-semibold mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {insights.categoryPercentages.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{cat.name}</span>
                  <span className="text-sm text-muted-foreground">{formatCurrency(cat.value)} ({cat.percentage.toFixed(1)}%)</span>
                </div>
                <Progress value={cat.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <h3 className="font-semibold mb-4">Monthly Summary</h3>
          <div className="space-y-3">
            {monthlyArray.map((m, i) => {
              const prev = monthlyArray[i - 1];
              const change = prev && prev.expense > 0 ? ((m.expense - prev.expense) / prev.expense) * 100 : 0;
              return (
                <div key={m.month} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="font-medium text-sm">{m.label}</span>
                  <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                    <span className="text-income">+{formatCurrency(m.income)}</span>
                    <span className="text-expense">-{formatCurrency(m.expense)}</span>
                    {i > 0 && (
                      <span className={`flex items-center gap-0.5 ${change > 0 ? 'text-expense' : 'text-income'}`}>
                        {change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(change).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
