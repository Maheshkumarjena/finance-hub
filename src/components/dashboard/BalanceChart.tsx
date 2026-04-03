import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface BalanceChartProps {
  data: { label: string; income: number; expense: number; balance: number }[];
}

export function BalanceChart({ data }: BalanceChartProps) {
  const isMobile = useIsMobile();

  if (data.length === 0) {
    return <div className="h-40 sm:h-64 flex items-center justify-center text-muted-foreground text-xs sm:text-sm">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 200 : 280}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="label" tick={{ fontSize: isMobile ? 10 : 12 }} className="text-muted-foreground" />
        <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} className="text-muted-foreground" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '13px',
          }}
        />
        <Area type="monotone" dataKey="income" stroke="hsl(152, 60%, 42%)" fill="url(#incomeGrad)" strokeWidth={2} />
        <Area type="monotone" dataKey="expense" stroke="hsl(0, 72%, 55%)" fill="url(#expenseGrad)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
