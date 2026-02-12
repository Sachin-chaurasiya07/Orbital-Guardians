import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, CheckCircle, Info, ChevronRight } from 'lucide-react';
import { NearMissEvent, RiskLevel } from '@/data/orbitalData';
import { cn } from '@/lib/utils';

interface RiskEventCardProps {
  event: NearMissEvent;
  isSelected: boolean;
  onClick: () => void;
}

const riskConfig: Record<RiskLevel, {
  icon: typeof AlertTriangle;
  className: string;
  glowClass: string;
  label: string;
}> = {
  critical: {
    icon: AlertTriangle,
    className: 'risk-badge-critical',
    glowClass: 'glow-border-critical',
    label: 'CRITICAL',
  },
  warning: {
    icon: AlertCircle,
    className: 'risk-badge-warning',
    glowClass: 'glow-border-warning',
    label: 'WARNING',
  },
  low: {
    icon: Info,
    className: 'bg-primary/20 text-primary border border-primary/50',
    glowClass: 'glow-border',
    label: 'LOW',
  },
  safe: {
    icon: CheckCircle,
    className: 'risk-badge-safe',
    glowClass: 'glow-border-safe',
    label: 'SAFE',
  },
};

export function RiskEventCard({ event, isSelected, onClick }: RiskEventCardProps) {
  const config = riskConfig[event.riskLevel];
  const Icon = config.icon;
  
  const tcaDate = new Date(event.tca);
  const now = new Date();
  const hoursUntilTCA = (tcaDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "p-4 rounded-lg bg-card border border-border cursor-pointer transition-all duration-200",
        isSelected && config.glowClass,
        event.riskLevel === 'critical' && "pulse-critical"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={cn(
            "w-5 h-5",
            event.riskLevel === 'critical' && "text-destructive",
            event.riskLevel === 'warning' && "text-risk-warning",
            event.riskLevel === 'low' && "text-primary",
            event.riskLevel === 'safe' && "text-risk-safe"
          )} />
          <span className={cn("text-xs font-bold px-2 py-0.5 rounded", config.className)}>
            {config.label}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-mono text-foreground">
            {event.riskScore}
          </div>
          <div className="text-xs text-muted-foreground">RISK SCORE</div>
        </div>
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-primary font-medium">{event.primaryObject.name}</span>
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
          <span className="text-destructive font-medium">{event.secondaryObject.name}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-muted/50 rounded p-2">
          <div className="text-muted-foreground mb-1">Miss Distance</div>
          <div className="font-mono font-bold text-foreground">
            {event.missDistance < 1 
              ? `${(event.missDistance * 1000).toFixed(0)}m`
              : `${event.missDistance.toFixed(2)}km`
            }
          </div>
        </div>
        <div className="bg-muted/50 rounded p-2">
          <div className="text-muted-foreground mb-1">Rel. Velocity</div>
          <div className="font-mono font-bold text-foreground">
            {event.relativeVelocity.toFixed(1)} km/s
          </div>
        </div>
        <div className="bg-muted/50 rounded p-2">
          <div className="text-muted-foreground mb-1">Time to TCA</div>
          <div className="font-mono font-bold text-foreground">
            {hoursUntilTCA > 24 
              ? `${Math.floor(hoursUntilTCA / 24)}d ${Math.floor(hoursUntilTCA % 24)}h`
              : `${hoursUntilTCA.toFixed(1)}h`
            }
          </div>
        </div>
      </div>
      
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-border"
        >
          <div className="text-xs text-muted-foreground mb-1">Collision Probability</div>
          <div className="font-mono text-sm text-foreground">
            {(event.probability * 100).toExponential(2)}%
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
