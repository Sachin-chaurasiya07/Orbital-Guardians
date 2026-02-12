import { motion } from 'framer-motion';
import { NearMissEvent } from '@/data/orbitalData';
import { cn } from '@/lib/utils';

interface ContextTimelineProps {
  events: NearMissEvent[];
  selectedEvent: NearMissEvent | null;
  onEventSelect: (event: NearMissEvent) => void;
}

export function ContextTimeline({ events, selectedEvent, onEventSelect }: ContextTimelineProps) {
  const now = Date.now();
  
  // Sort events by TCA
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.tca).getTime() - new Date(b.tca).getTime()
  );

  // Calculate time range for visualization
  const times = sortedEvents.map(e => new Date(e.tca).getTime());
  const minTime = Math.min(...times, now);
  const maxTime = Math.max(...times);
  const range = maxTime - minTime;

  const getPosition = (time: number) => {
    return ((time - minTime) / range) * 100;
  };

  const nowPosition = getPosition(now);

  const riskColors = {
    critical: 'bg-destructive',
    warning: 'bg-risk-warning',
    low: 'bg-primary',
    safe: 'bg-risk-safe',
  };

  return (
    <div className="p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Event Timeline</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>Past</span>
          <div className="w-20 h-px bg-gradient-to-r from-muted-foreground/50 to-muted-foreground/20" />
          <span>Future</span>
        </div>
      </div>

      <div className="relative h-16">
        {/* Timeline track */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-secondary rounded-full -translate-y-1/2" />
        
        {/* Now marker */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
          style={{ left: `${nowPosition}%` }}
        >
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-foreground border-2 border-background" />
            <span className="absolute top-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap">
              Now
            </span>
          </div>
        </motion.div>

        {/* Event markers */}
        {sortedEvents.map((event, i) => {
          const position = getPosition(new Date(event.tca).getTime());
          const isSelected = selectedEvent?.id === event.id;
          const isPast = new Date(event.tca).getTime() < now;

          return (
            <motion.button
              key={event.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onEventSelect(event)}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-200",
                "hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-full"
              )}
              style={{ left: `${position}%` }}
            >
              <div className={cn(
                "w-4 h-4 rounded-full border-2 border-background transition-all",
                riskColors[event.riskLevel],
                isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-card scale-125",
                isPast && "opacity-60"
              )} />
              
              {/* Tooltip on hover */}
              <div className={cn(
                "absolute bottom-6 left-1/2 -translate-x-1/2 px-2 py-1 rounded",
                "bg-popover border border-border shadow-lg",
                "opacity-0 group-hover:opacity-100 pointer-events-none",
                "transition-opacity whitespace-nowrap text-xs"
              )}>
                <p className="font-medium text-foreground">{event.primaryObject.name}</p>
                <p className="text-muted-foreground">{new Date(event.tca).toLocaleDateString()}</p>
              </div>
            </motion.button>
          );
        })}

        {/* Selected event label */}
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-center"
          >
            <span className="text-xs font-medium text-primary">
              {selectedEvent.primaryObject.name} — TCA
            </span>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-6 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
          <span className="text-muted-foreground">Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-risk-warning" />
          <span className="text-muted-foreground">Warning</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="text-muted-foreground">Low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-risk-safe" />
          <span className="text-muted-foreground">Safe</span>
        </div>
      </div>
    </div>
  );
}
