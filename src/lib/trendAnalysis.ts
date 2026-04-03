/**
 * Generate deeper trend analysis for financial insights
 */

export interface MonthlyData {
  month: string;
  label: string;
  income: number;
  expense: number;
  balance: number;
}

export interface TrendAnalysis {
  spendingTrend: 'increasing' | 'decreasing' | 'stable';
  trendPercentage: number;
  peakMonth: { label: string; expense: number } | null;
  lowestMonth: { label: string; expense: number } | null;
  averageMonthlyExpense: number;
  volatility: 'high' | 'medium' | 'low';
  categoryTrends: CategoryTrend[];
  quarterlyData: QuarterlyData[];
}

export interface CategoryTrend {
  name: string;
  recentSpending: number;
  previousSpending: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  trendPercentage: number;
}

export interface QuarterlyData {
  quarter: string;
  income: number;
  expense: number;
  balance: number;
}

export function analyzeTrends(
  monthlyArray: MonthlyData[],
  categoryBreakdown: Record<string, number>,
  transactions: Array<{ date: string; amount: number; category: string; type: 'income' | 'expense' }>
): TrendAnalysis {
  const expenses = monthlyArray.map((m) => m.expense);
  const incomes = monthlyArray.map((m) => m.income);

  // Spending trend analysis
  const recentExpenses = expenses.slice(-3);
  const olderExpenses = expenses.slice(-6, -3);
  const recentAvg = recentExpenses.reduce((a, b) => a + b, 0) / Math.max(recentExpenses.length, 1);
  const olderAvg = olderExpenses.reduce((a, b) => a + b, 0) / Math.max(olderExpenses.length, 1);
  const spendingTrendPercent = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

  let spendingTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (spendingTrendPercent > 5) spendingTrend = 'increasing';
  else if (spendingTrendPercent < -5) spendingTrend = 'decreasing';

  // Peak and lowest months
  const peakMonthIdx = expenses.length > 0 ? expenses.indexOf(Math.max(...expenses)) : -1;
  const lowestMonthIdx = expenses.length > 0 ? expenses.indexOf(Math.min(...expenses)) : -1;

  const peakMonth =
    peakMonthIdx >= 0
      ? { label: monthlyArray[peakMonthIdx].label, expense: monthlyArray[peakMonthIdx].expense }
      : null;
  const lowestMonth =
    lowestMonthIdx >= 0
      ? { label: monthlyArray[lowestMonthIdx].label, expense: monthlyArray[lowestMonthIdx].expense }
      : null;

  // Average monthly expense
  const averageMonthlyExpense = expenses.length > 0 ? expenses.reduce((a, b) => a + b, 0) / expenses.length : 0;

  // Volatility calculation (standard deviation)
  const variance =
    expenses.length > 0
      ? expenses.reduce((sum, exp) => sum + Math.pow(exp - averageMonthlyExpense, 2), 0) / expenses.length
      : 0;
  const standardDeviation = Math.sqrt(variance);
  const coefficientOfVariation = averageMonthlyExpense > 0 ? (standardDeviation / averageMonthlyExpense) * 100 : 0;
  let volatility: 'high' | 'medium' | 'low' = 'low';
  if (coefficientOfVariation > 25) volatility = 'high';
  else if (coefficientOfVariation > 10) volatility = 'medium';

  // Category trends
  const categoryTrends: CategoryTrend[] = [];
  const now = new Date();
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  for (const [category] of Object.entries(categoryBreakdown)) {
    const recentTxns = transactions.filter(
      (t) =>
        t.category === category &&
        t.type === 'expense' &&
        new Date(t.date) >= oneMonthAgo &&
        new Date(t.date) < currentMonth
    );
    const previousTxns = transactions.filter(
      (t) =>
        t.category === category &&
        t.type === 'expense' &&
        new Date(t.date) >= twoMonthsAgo &&
        new Date(t.date) < oneMonthAgo
    );

    const recentSpending = recentTxns.reduce((sum, t) => sum + t.amount, 0);
    const previousSpending = previousTxns.reduce((sum, t) => sum + t.amount, 0);
    const catTrendPercent = previousSpending > 0 ? ((recentSpending - previousSpending) / previousSpending) * 100 : 0;

    let catTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (catTrendPercent > 5) catTrend = 'increasing';
    else if (catTrendPercent < -5) catTrend = 'decreasing';

    categoryTrends.push({
      name: category,
      recentSpending,
      previousSpending,
      trend: catTrend,
      trendPercentage: catTrendPercent,
    });
  }

  // Quarterly data
  const quarterlyMap: Record<string, { income: number; expense: number }> = {};
  monthlyArray.forEach((month) => {
    const monthNum = parseInt(month.month.split('-')[1]);
    const quarter = `Q${Math.ceil(monthNum / 3)} ${month.month.split('-')[0]}`;
    if (!quarterlyMap[quarter]) quarterlyMap[quarter] = { income: 0, expense: 0 };
    quarterlyMap[quarter].income += month.income;
    quarterlyMap[quarter].expense += month.expense;
  });

  const quarterlyData: QuarterlyData[] = Object.entries(quarterlyMap)
    .sort()
    .map(([q, data]) => ({
      quarter: q,
      income: data.income,
      expense: data.expense,
      balance: data.income - data.expense,
    }));

  return {
    spendingTrend,
    trendPercentage: spendingTrendPercent,
    peakMonth,
    lowestMonth,
    averageMonthlyExpense,
    volatility,
    categoryTrends: categoryTrends.filter((ct) => ct.recentSpending > 0 || ct.previousSpending > 0),
    quarterlyData,
  };
}
