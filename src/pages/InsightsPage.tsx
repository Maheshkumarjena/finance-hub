import { useMemo } from 'react';
import { TrendingUp, TrendingDown, ShoppingBag, BarChart3, Hash, ArrowUpRight, ArrowDownRight, Lightbulb, AlertCircle, CheckCircle, Activity, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useDerivedStats, useFinanceStore } from '@/store/useFinanceStore';
import { generateObservations } from '@/lib/observations';
import { analyzeTrends } from '@/lib/trendAnalysis';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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

    const observations = generateObservations({
      totalIncome,
      totalExpense,
      categoryBreakdown,
      monthlyArray,
      transactionCount: transactions.length,
    });

    const trends = analyzeTrends(monthlyArray, categoryBreakdown, transactions);

    return { topCategory, monthlyChange, categoryPercentages, avgTransaction, observations, trends };
  }, [categoryBreakdown, monthlyArray, totalExpense, totalIncome, transactions]);

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
    <div className="space-y-4 sm:space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground text-xs sm:text-sm">Key financial metrics and analysis</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card, index) => (
          <Card 
            key={card.label}
            className={`card-hover ${['animate-fade-in-stagger-1', 'animate-fade-in-stagger-2', 'animate-fade-in-stagger-3', 'animate-fade-in-stagger-4'][index]}`}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <div className={`h-9 sm:h-10 w-9 sm:w-10 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110 ${card.bgColor}`}>
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

      {/* Observations Section */}
      {insights.observations.length > 0 && (
        <Card className="animate-scale-in" style={{ animationDelay: '0.05s' }}>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-primary transition-transform duration-300 hover:scale-110 hover:rotate-6" />
              <h3 className="font-semibold">Smart Observations</h3>
            </div>
            <div className="space-y-3">
              {insights.observations.map((obs, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex gap-3 transition-all duration-300 animate-slide-up ${
                    obs.type === 'positive'
                      ? 'bg-income/5 border-income/30'
                      : obs.type === 'warning'
                      ? 'bg-expense/5 border-expense/30'
                      : 'bg-muted/50 border-muted'
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex-shrink-0 mt-0.5 transition-transform duration-300">
                    {obs.type === 'positive' && <CheckCircle className="h-4 w-4 text-income animate-scale-in" />}
                    {obs.type === 'warning' && <AlertCircle className="h-4 w-4 text-expense animate-pulse-subtle" />}
                    {obs.type === 'neutral' && <Lightbulb className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium">{obs.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{obs.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trend Overview Card */}
      <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary transition-transform duration-300 hover:scale-110" />
            <h3 className="font-semibold">Spending Trends</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="transition-all duration-300 hover:scale-105">
              <p className="text-xs text-muted-foreground mb-1">Trend</p>
              <p className="text-sm font-semibold capitalize flex items-center gap-1">
                {insights.trends.spendingTrend === 'increasing' ? (
                  <TrendingUp className="h-4 w-4 text-expense transition-transform duration-300 hover:scale-110" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-income transition-transform duration-300 hover:scale-110" />
                )}
                {insights.trends.spendingTrend}
              </p>
              <p className={`text-xs mt-1 ${insights.trends.trendPercentage > 0 ? 'text-expense' : 'text-income'}`}>
                {insights.trends.trendPercentage > 0 ? '+' : ''}{insights.trends.trendPercentage.toFixed(1)}%
              </p>
            </div>
            <div className="transition-all duration-300 hover:scale-105">
              <p className="text-xs text-muted-foreground mb-1">Volatility</p>
              <Badge
                variant={
                  insights.trends.volatility === 'high' ? 'destructive' : insights.trends.volatility === 'medium' ? 'secondary' : 'default'
                }
                className="text-xs transition-all duration-300"
              >
                {insights.trends.volatility}
              </Badge>
            </div>
            <div className="transition-all duration-300 hover:scale-105">
              <p className="text-xs text-muted-foreground mb-1">Peak Month</p>
              <p className="text-sm font-semibold">{insights.trends.peakMonth?.label || 'N/A'}</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(insights.trends.peakMonth?.expense || 0)}</p>
            </div>
            <div className="transition-all duration-300 hover:scale-105">
              <p className="text-xs text-muted-foreground mb-1">Lowest Month</p>
              <p className="text-sm font-semibold">{insights.trends.lowestMonth?.label || 'N/A'}</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(insights.trends.lowestMonth?.expense || 0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spending Trend Chart */}
      {monthlyArray.length > 1 && (
        <Card className="animate-scale-in" style={{ animationDelay: '0.15s' }}>
          <CardContent className="p-4 sm:p-5">
            <h3 className="font-semibold mb-4">Spending History</h3>
            <div className="w-full h-80 -mx-2 transition-all duration-300 hover:opacity-90">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyArray} margin={{ top: 5, right: 10, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--destructive))', r: 4 }}
                    name="Expenses"
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    name="Income"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Trends */}
      {insights.trends.categoryTrends.length > 0 && (
        <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary transition-transform duration-300 hover:scale-110" />
              <h3 className="font-semibold">Category Trends (Month-over-Month)</h3>
            </div>
            <div className="space-y-3">
              {insights.trends.categoryTrends.slice(0, 5).map((cat, idx) => (
                <div 
                  key={cat.name}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg transition-all duration-300 hover:bg-muted/70 animate-slide-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(cat.previousSpending)} → {formatCurrency(cat.recentSpending)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {cat.trend === 'increasing' ? (
                      <TrendingUp className="h-4 w-4 text-expense transition-transform duration-300 hover:scale-110" />
                    ) : cat.trend === 'decreasing' ? (
                      <TrendingDown className="h-4 w-4 text-income transition-transform duration-300 hover:scale-110" />
                    ) : (
                      <Activity className="h-4 w-4 text-muted-foreground transition-transform duration-300 hover:scale-110" />
                    )}
                    <span className={`text-sm font-semibold ${cat.trendPercentage > 0 ? 'text-expense' : 'text-income'}`}>
                      {cat.trendPercentage > 0 ? '+' : ''}{cat.trendPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quarterly Performance */}
      {insights.trends.quarterlyData.length > 0 && (
        <Card className="animate-scale-in" style={{ animationDelay: '0.25s' }}>
          <CardContent className="p-4 sm:p-5">
            <h3 className="font-semibold mb-4">Quarterly Performance</h3>
            <div className="w-full h-80 -mx-2 transition-all duration-300 hover:opacity-90">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.trends.quarterlyData} margin={{ top: 5, right: 10, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="income" fill="hsl(var(--primary))" name="Income" />
                  <Bar dataKey="expense" fill="hsl(var(--destructive))" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

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
