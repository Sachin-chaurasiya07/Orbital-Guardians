import { motion } from 'framer-motion';
import { AlertTriangle, Radio, Clock, Target } from 'lucide-react';
import { RiskStatistics, NearMissEvent } from '@/data/orbitalData';
import { RiskGauge } from './RiskGauge';
import { cn } from '@/lib/utils';

interface KPICardsProps {
  stats: RiskStatistics;
}

interface KPICardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'critical' | 'warning' | 'highlight';
  delay?: number;
}

function KPICard({ children, className, variant = 'default', delay = 0 }: KPICardProps) {
  const variants = {
    default: 'bg-card border-border/50 hover:border-border',
    critical: 'bg-destructive/5 border-destructive/30 hover:border-destructive/50',
    warning: 'bg-risk-warning/5 border-risk-warning/30 hover:border-risk-warning/50',
    highlight: 'bg-primary/5 border-primary/30 hover:border-primary/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "relative p-5 rounded-xl border backdrop-blur-sm transition-all duration-300",
        "hover:shadow-lg hover:shadow-primary/5",
        variants[variant],
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function KPICards({ stats }: KPICardsProps) {
  const nextTCADate = stats.nextTCA ? new Date(stats.nextTCA.tca) : null;
  const hoursUntilNext = nextTCADate 
    ? (nextTCADate.getTime() - Date.now()) / (1000 * 60 * 60)
    : 0;

  const formatTimeUntil = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${hours.toFixed(1)}h`;
    return `${Math.floor(hours / 24)}d ${Math.round(hours % 24)}h`;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Overall Risk Score */}
      <KPICard variant="highlight" delay={0}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Overall Risk
            </p>
            <p className="text-sm text-foreground font-medium mt-3">
              {stats.averageRiskScore >= 50 ? 'Elevated' : 'Nominal'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Weighted average
            </p>
          </div>
          <RiskGauge value={stats.averageRiskScore} size="md" />
        </div>
      </KPICard>

      {/* Active Conjunctions */}
      <KPICard variant="default" delay={0.1}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Active Conjunctions
            </p>
            <p className="text-3xl font-bold font-mono text-foreground">
              {stats.totalEvents}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Being monitored
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-secondary/50">
            <Radio className="w-5 h-5 text-primary" />
          </div>
        </div>
      </KPICard>

      {/* Critical Events */}
      <KPICard variant={stats.criticalCount > 0 ? 'critical' : 'default'} delay={0.2}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Critical Events
            </p>
            <p className={cn(
              "text-3xl font-bold font-mono",
              stats.criticalCount > 0 ? "text-destructive" : "text-foreground"
            )}>
              {stats.criticalCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Require attention
            </p>
          </div>
          <div className={cn(
            "p-2.5 rounded-lg",
            stats.criticalCount > 0 ? "bg-destructive/20" : "bg-secondary/50"
          )}>
            <AlertTriangle className={cn(
              "w-5 h-5",
              stats.criticalCount > 0 ? "text-destructive" : "text-muted-foreground"
            )} />
          </div>
        </div>
        {stats.criticalCount > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-destructive/50 via-destructive to-destructive/50 rounded-b-xl" />
        )}
      </KPICard>

      {/* Next TCA */}
      <KPICard 
        variant={stats.nextTCA?.riskLevel === 'critical' ? 'warning' : 'default'} 
        delay={0.3}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Next Closest Approach
            </p>
            <p className="text-3xl font-bold font-mono text-foreground">
              {formatTimeUntil(hoursUntilNext)}
            </p>
            <p className="text-xs text-muted-foreground mt-1 truncate max-w-[140px]">
              {stats.nextTCA?.primaryObject.name || 'N/A'}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-secondary/50">
            <Clock className="w-5 h-5 text-primary" />
          </div>
        </div>
      </KPICard>
    </div>
  );
}
