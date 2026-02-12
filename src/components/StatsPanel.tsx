import { motion } from 'framer-motion';
import { Satellite, Trash2, Clock, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { RiskStatistics } from '@/data/orbitalData';
import { cn } from '@/lib/utils';

interface StatsPanelProps {
  stats: RiskStatistics;
}

interface StatCardProps {
  icon: typeof Satellite;
  label: string;
  value: string | number;
  subtext?: string;
  variant?: 'default' | 'critical' | 'warning' | 'safe' | 'primary';
}

function StatCard({ icon: Icon, label, value, subtext, variant = 'default' }: StatCardProps) {
  const variants = {
    default: 'bg-card border-border',
    critical: 'bg-destructive/10 border-destructive/30',
    warning: 'bg-risk-warning/10 border-risk-warning/30',
    safe: 'bg-risk-safe/10 border-risk-safe/30',
    primary: 'bg-primary/10 border-primary/30',
  };

  const iconColors = {
    default: 'text-muted-foreground',
    critical: 'text-destructive',
    warning: 'text-risk-warning',
    safe: 'text-risk-safe',
    primary: 'text-primary',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("p-4 rounded-lg border", variants[variant])}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {label}
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">
            {value}
          </div>
          {subtext && (
            <div className="text-xs text-muted-foreground mt-1">{subtext}</div>
          )}
        </div>
        <Icon className={cn("w-5 h-5", iconColors[variant])} />
      </div>
    </motion.div>
  );
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const nextTCADate = stats.nextTCA ? new Date(stats.nextTCA.tca) : null;
  const hoursUntilNext = nextTCADate 
    ? (nextTCADate.getTime() - Date.now()) / (1000 * 60 * 60)
    : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      <StatCard
        icon={Target}
        label="Total Events"
        value={stats.totalEvents}
        subtext="Active conjunctions"
        variant="default"
      />
      <StatCard
        icon={AlertTriangle}
        label="Critical"
        value={stats.criticalCount}
        subtext="Immediate attention"
        variant="critical"
      />
      <StatCard
        icon={TrendingUp}
        label="Warning"
        value={stats.warningCount}
        subtext="Monitor closely"
        variant="warning"
      />
      <StatCard
        icon={Satellite}
        label="Low Risk"
        value={stats.lowCount}
        subtext="Standard watch"
        variant="primary"
      />
      <StatCard
        icon={Trash2}
        label="Safe"
        value={stats.safeCount}
        subtext="No concerns"
        variant="safe"
      />
      <StatCard
        icon={Clock}
        label="Next TCA"
        value={hoursUntilNext > 24 
          ? `${Math.floor(hoursUntilNext / 24)}d`
          : `${hoursUntilNext.toFixed(1)}h`
        }
        subtext={stats.nextTCA?.primaryObject.name || 'N/A'}
        variant={stats.nextTCA?.riskLevel === 'critical' ? 'critical' : 'default'}
      />
    </div>
  );
}
