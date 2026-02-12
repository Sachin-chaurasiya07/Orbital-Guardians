import { motion } from 'framer-motion';
import { ChevronRight, Clock } from 'lucide-react';
import { NearMissEvent } from '@/data/orbitalData';
import { cn } from '@/lib/utils';

interface EnhancedEventCardProps {
  event: NearMissEvent;
  isSelected: boolean;
  onClick: () => void;
}

export function EnhancedEventCard({ event, isSelected, onClick }: EnhancedEventCardProps) {
  const riskConfig = {
    critical: {
      badge: 'bg-destructive text-destructive-foreground',
      border: 'border-destructive/50',
      glow: 'shadow-[0_0_15px_hsl(var(--destructive)/0.3)]',
    },
    warning: {
      badge: 'bg-risk-warning text-risk-warning-foreground',
      border: 'border-risk-warning/50',
      glow: 'shadow-[0_0_15px_hsl(var(--risk-warning)/0.3)]',
    },
    low: {
      badge: 'bg-primary text-primary-foreground',
      border: 'border-primary/30',
      glow: '',
    },
    safe: {
      badge: 'bg-risk-safe text-risk-safe-foreground',
      border: 'border-risk-safe/30',
      glow: '',
    },
  };

  const config = riskConfig[event.riskLevel];
  const tcaDate = new Date(event.tca);
  const hoursUntil = (tcaDate.getTime() - Date.now()) / (1000 * 60 * 60);

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "w-full text-left p-4 rounded-xl border transition-all duration-200",
        "bg-card/50 hover:bg-card backdrop-blur-sm",
        isSelected 
          ? cn("ring-2 ring-primary border-primary", config.glow)
          : cn("border-border/50 hover:border-border", event.riskLevel === 'critical' && config.glow)
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Risk Badge */}
          <div className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
            config.badge
          )}>
            {event.riskLevel}
          </div>

          {/* Object Pairing */}
          <div className="mt-2">
            <p className="text-sm font-medium text-foreground truncate">
              {event.primaryObject.name}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <ChevronRight className="w-3 h-3" />
              <span className="truncate">{event.secondaryObject.name}</span>
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3 mt-3 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="font-mono font-medium text-foreground">
                {event.missDistance < 1 
                  ? `${(event.missDistance * 1000).toFixed(0)}m`
                  : `${event.missDistance.toFixed(1)}km`
                }
              </span>
              <span>miss</span>
            </div>
            <div className="w-px h-3 bg-border" />
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="font-mono">
                {hoursUntil < 24 
                  ? `${hoursUntil.toFixed(1)}h`
                  : `${Math.floor(hoursUntil / 24)}d`
                }
              </span>
            </div>
          </div>
        </div>

        {/* Risk Score */}
        <div className="flex flex-col items-center">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            "bg-secondary/50 border border-border/50"
          )}>
            <span className={cn(
              "text-lg font-bold font-mono",
              event.riskLevel === 'critical' ? "text-destructive" :
              event.riskLevel === 'warning' ? "text-risk-warning" :
              event.riskLevel === 'low' ? "text-primary" : "text-risk-safe"
            )}>
              {event.riskScore}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground mt-1">RISK</span>
        </div>
      </div>
    </motion.button>
  );
}
