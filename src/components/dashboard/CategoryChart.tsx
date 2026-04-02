import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useFinanceStore } from '@/store/useFinanceStore';

const COLORS = [
  'hsl(234, 89%, 60%)',
  'hsl(152, 60%, 42%)',
  'hsl(0, 72%, 55%)',
  'hsl(38, 92%, 55%)',
  'hsl(280, 60%, 55%)',
  'hsl(190, 70%, 45%)',
];

interface CategoryChartProps {
  data: Record<string, number>;
}

export function CategoryChart({ data }: CategoryChartProps) {
  const setFilters = useFinanceStore((s) => s.setFilters);
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value: Math.round(value) }));

  if (chartData.length === 0) {
    return <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">No expenses yet</div>;
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            dataKey="value"
            onClick={(entry) => setFilters({ category: entry.name, type: 'expense' })}
            className="cursor-pointer"
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '13px',
            }}
            formatter={(value: number, name: string) => [`$${value}`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 mt-2">
        {chartData.map((item, i) => (
          <button
            key={item.name}
            onClick={() => setFilters({ category: item.name, type: 'expense' })}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
