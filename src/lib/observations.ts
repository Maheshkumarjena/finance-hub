/**
 * Generate human-readable financial observations
 */

export interface InsightData {
  totalIncome: number;
  totalExpense: number;
  categoryBreakdown: Record<string, number>;
  monthlyArray: Array<{
    month: string;
    label: string;
    income: number;
    expense: number;
    balance: number;
  }>;
  transactionCount: number;
}

export interface Observation {
  title: string;
  description: string;
  type: 'positive' | 'neutral' | 'warning';
  icon?: string;
}

export function generateObservations(data: InsightData): Observation[] {
  const observations: Observation[] = [];

  // Calculate key metrics
  const topCategory = Object.entries(data.categoryBreakdown).sort(([, a], [, b]) => b - a)[0];
  const savingsRate = data.totalIncome > 0 ? ((data.totalIncome - data.totalExpense) / data.totalIncome) * 100 : 0;
  const lastTwo = data.monthlyArray.slice(-2);
  const monthlyExpenseChange = lastTwo.length === 2 && lastTwo[0].expense > 0
    ? ((lastTwo[1].expense - lastTwo[0].expense) / lastTwo[0].expense) * 100
    : 0;

  const avgTransaction = data.transactionCount > 0
    ? (data.totalIncome + data.totalExpense) / data.transactionCount
    : 0;

  // Observation 1: Top spending category
  if (topCategory) {
    const topCategoryPercentage = data.totalExpense > 0
      ? (topCategory[1] / data.totalExpense) * 100
      : 0;
    observations.push({
      title: `${topCategory[0]} is your top expense`,
      description: `You spent $${topCategory[1].toFixed(2)} on ${topCategory[0]}, which is ${topCategoryPercentage.toFixed(1)}% of your total expenses.`,
      type: 'neutral',
    });
  }

  // Observation 2: Monthly spending trend
  if (monthlyExpenseChange !== 0) {
    if (monthlyExpenseChange > 20) {
      observations.push({
        title: 'Spending increased significantly',
        description: `Your spending jumped ${monthlyExpenseChange.toFixed(1)}% this month compared to last month. Keep an eye on your budget!`,
        type: 'warning',
      });
    } else if (monthlyExpenseChange > 5) {
      observations.push({
        title: 'Spending is increasing',
        description: `Your spending is up ${monthlyExpenseChange.toFixed(1)}% month-over-month. Consider reviewing your expenses.`,
        type: 'neutral',
      });
    } else if (monthlyExpenseChange < -20) {
      observations.push({
        title: 'Great job! Spending decreased significantly',
        description: `You've reduced your spending by ${Math.abs(monthlyExpenseChange).toFixed(1)}% compared to last month. Keep it up!`,
        type: 'positive',
      });
    } else if (monthlyExpenseChange < -5) {
      observations.push({
        title: 'Your spending is decreasing',
        description: `Nice work! Your expenses are down ${Math.abs(monthlyExpenseChange).toFixed(1)}% compared to last month.`,
        type: 'positive',
      });
    }
  }

  // Observation 3: Savings rate
  if (savingsRate >= 0) {
    if (savingsRate >= 50) {
      observations.push({
        title: 'Excellent savings rate!',
        description: `You're saving ${savingsRate.toFixed(1)}% of your income. You're doing great with financial discipline!`,
        type: 'positive',
      });
    } else if (savingsRate >= 30) {
      observations.push({
        title: 'Good savings rate',
        description: `You're saving ${savingsRate.toFixed(1)}% of your income. That's a healthy savings habit!`,
        type: 'positive',
      });
    } else if (savingsRate >= 10) {
      observations.push({
        title: `You're saving ${savingsRate.toFixed(1)}% of your income`,
        description: `This is decent, but consider increasing your savings rate if possible.`,
        type: 'neutral',
      });
    }
  } else {
    observations.push({
      title: 'Spending exceeds income',
      description: `Your expenses are ${Math.abs(savingsRate).toFixed(1)}% higher than your income. Consider reducing expenses or increasing income.`,
      type: 'warning',
    });
  }

  // Observation 4: Top categories combined
  const topThreeCategories = Object.entries(data.categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  if (topThreeCategories.length >= 2) {
    const combinedPercentage = data.totalExpense > 0
      ? (topThreeCategories.reduce((sum, [, value]) => sum + value, 0) / data.totalExpense) * 100
      : 0;
    const categoryNames = topThreeCategories.map(([name]) => name).join(', ');
    observations.push({
      title: `Your main expense categories`,
      description: `${categoryNames} account for ${combinedPercentage.toFixed(1)}% of your spending.`,
      type: 'neutral',
    });
  }

  // Observation 5: Transaction frequency
  if (data.transactionCount > 0) {
    if (data.transactionCount > 100) {
      observations.push({
        title: 'You track your finances actively',
        description: `With ${data.transactionCount} transactions recorded, you have detailed spending insights!`,
        type: 'positive',
      });
    } else if (data.transactionCount > 50) {
      observations.push({
        title: 'Good transaction tracking',
        description: `You've recorded ${data.transactionCount} transactions, giving you solid visibility into your finances.`,
        type: 'positive',
      });
    }
  }

  // Observation 6: Income vs Expense balance
  if (data.totalIncome > 0 && data.totalExpense > 0) {
    const ratio = data.totalIncome / data.totalExpense;
    if (ratio > 2) {
      observations.push({
        title: 'Strong income-to-expense ratio',
        description: `You earn $${ratio.toFixed(2)} for every dollar you spend. This is excellent financial health!`,
        type: 'positive',
      });
    } else if (ratio > 1.5) {
      observations.push({
        title: 'Healthy income-to-expense ratio',
        description: `You earn $${ratio.toFixed(2)} for every dollar you spend. This is a good balance.`,
        type: 'positive',
      });
    } else if (ratio > 1) {
      observations.push({
        title: `Income covers your expenses`,
        description: `You earn $${ratio.toFixed(2)} for every dollar you spend, leaving room to save.`,
        type: 'neutral',
      });
    }
  }

  return observations;
}
