import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { AlertCircle } from 'lucide-react';

interface BalanceChartProps {
  data: { label: string; income: number; expense: number; balance: number }[];
}

export function BalanceChart({ data }: BalanceChartProps) {
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  const isDesktop = window.innerWidth >= 1024;
    
  const axisFont = isMobile ? 9 : isTablet ? 11 : 12;
  const tooltipFont = isMobile ? 11 : isTablet ? 12 : 13;

  if (data.length === 0) {
    return <div className="h-40 sm:h-64 flex items-center justify-center text-muted-foreground text-xs sm:text-sm">No data available</div>;
  }

  try {
    return (
      <ResponsiveContainer width="100%" height={isMobile ? 200 : 280}>
        <AreaChart data={data} margin={isMobile ? { top: 5, right: 0, left: -25, bottom: 0 } : { top: 5, right: 0, left: 0, bottom: 0 }}>
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
          <XAxis dataKey="label" tick={{ fontSize: axisFont }} className="text-muted-foreground" />
          <YAxis tick={{ fontSize: axisFont }} className="text-muted-foreground" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: `${tooltipFont}px`,
            }}
          />
          <Area type="monotone" dataKey="income" stroke="hsl(152, 60%, 42%)" fill="url(#incomeGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="expense" stroke="hsl(0, 72%, 55%)" fill="url(#expenseGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    );
  } catch (error) {
    console.error('Error rendering balance chart:', error);
    return (
      <div className="h-40 sm:h-64 flex flex-col items-center justify-center text-destructive gap-2">
        <AlertCircle className="h-5 w-5" />
        <p className="text-xs sm:text-sm">Failed to load chart</p>
      </div>
    );
  }
}
