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
  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  const isDesktop = window.innerWidth >= 1024;

  const tooltipFont = isMobile ? 11 : isTablet ? 12 : 13;
  const legendTextSize = isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-base';
  const height = isMobile ? 180 : 220;
  const innerRadius = isMobile ? 45 : 55;
  const outerRadius = isMobile ? 70 : 85;

  if (chartData.length === 0) {
    return <div className="h-40 sm:h-64 flex items-center justify-center text-muted-foreground text-xs sm:text-sm">No expenses yet</div>;
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey="value"
            onClick={(entry) => setFilters({ categories: [entry.name], type: 'expense' })}
            className="cursor-pointer"
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const entry = payload[0];
              const name = entry.name as string;
              const value = entry.value as number;
              const color = entry.payload?.fill || 'currentColor';
              const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
              return (
                <div
                  style={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: `${tooltipFont}px`,
                    padding: '6px 10px',
                  }}
                >
                  <div style={{ color, fontWeight: 600 }}>{name}</div>
                  
                  <div style={{ color }}>${value} ({pct}%)</div>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 mt-2">
        {chartData.map((item, i) => (
          <button
            key={item.name}
            onClick={() => setFilters({ categories: [item.name], type: 'expense' })}
            className={`flex items-center gap-1.5 ${legendTextSize} text-muted-foreground hover:text-foreground transition-colors`}
          >
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
