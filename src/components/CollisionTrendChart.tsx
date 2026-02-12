import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { nearMissEvents } from '@/data/orbitalData';

interface TrendDataPoint {
  hour: string;
  timestamp: number;
  maxProbability: number;
  avgRiskScore: number;
  eventCount: number;
}

function generateTrendData(): TrendDataPoint[] {
  const now = Date.now();
  const points: TrendDataPoint[] = [];

  for (let i = 24; i >= 0; i--) {
    const ts = now - i * 3600_000;
    const date = new Date(ts);
    const label = `${date.getHours().toString().padStart(2, '0')}:00`;

    // Simulate realistic probability curve seeded by actual event data
    const baseProb = nearMissEvents.reduce((max, e) => {
      const tcaTs = new Date(e.tca).getTime();
      const dist = Math.abs(ts - tcaTs) / 3600_000;
      const contribution = e.probability * Math.exp(-dist * dist / 18);
      return Math.max(max, contribution);
    }, 0);

    const noise = (Math.sin(i * 2.7 + 1.3) * 0.5 + 0.5) * 0.00001;
    const maxProbability = Math.min(baseProb + noise, 1);

    const avgRiskScore = nearMissEvents.reduce((sum, e) => {
      const tcaTs = new Date(e.tca).getTime();
      const dist = Math.abs(ts - tcaTs) / 3600_000;
      return sum + e.riskScore * Math.exp(-dist * dist / 24);
    }, 0) / Math.max(nearMissEvents.length, 1);

    const eventCount = nearMissEvents.filter(e => {
      const tcaTs = new Date(e.tca).getTime();
      return Math.abs(ts - tcaTs) < 3600_000;
    }).length;

    points.push({ hour: label, timestamp: ts, maxProbability, avgRiskScore, eventCount });
  }

  return points;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as TrendDataPoint;
  return (
    <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 text-xs font-mono shadow-lg">
      <p className="text-foreground font-semibold mb-1">{label} UTC</p>
      <p className="text-destructive">
        P(collision): {d.maxProbability.toExponential(2)}
      </p>
      <p className="text-muted-foreground">
        Avg risk: {d.avgRiskScore.toFixed(1)}
      </p>
      {d.eventCount > 0 && (
        <p className="text-risk-warning">{d.eventCount} active event{d.eventCount > 1 ? 's' : ''}</p>
      )}
    </div>
  );
};

export function CollisionTrendChart() {
  const data = useMemo(() => generateTrendData(), []);
  const maxProb = Math.max(...data.map(d => d.maxProbability));

  return (
    <div className="bg-card/50 rounded-xl border border-border/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-semibold text-foreground">Collision Probability Trend</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">Peak P(collision) · 24h window</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/50">
          <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
          <span className="text-[10px] font-mono text-muted-foreground">
            MAX {maxProb.toExponential(1)}
          </span>
        </div>
      </div>
      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="probGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              interval={5}
            />
            <YAxis
              tickFormatter={(v: number) => v.toExponential(0)}
              tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={1e-4}
              stroke="hsl(var(--risk-warning))"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />
            <Area
              type="monotone"
              dataKey="maxProbability"
              stroke="hsl(var(--destructive))"
              strokeWidth={1.5}
              fill="url(#probGradient)"
              dot={false}
              activeDot={{ r: 3, fill: 'hsl(var(--destructive))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
