import { motion } from 'framer-motion';
import { NearMissEvent } from '@/data/orbitalData';
import { cn } from '@/lib/utils';

interface EventTimelineProps {
  events: NearMissEvent[];
  selectedEvent: NearMissEvent | null;
  onEventSelect: (event: NearMissEvent) => void;
}

export function EventTimeline({ events, selectedEvent, onEventSelect }: EventTimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.tca).getTime() - new Date(b.tca).getTime()
  );

  const now = Date.now();
  const minTime = Math.min(...sortedEvents.map(e => new Date(e.tca).getTime()));
  const maxTime = Math.max(...sortedEvents.map(e => new Date(e.tca).getTime()));
  const timeRange = maxTime - minTime;

  const getPosition = (event: NearMissEvent) => {
    const eventTime = new Date(event.tca).getTime();
    return ((eventTime - minTime) / timeRange) * 100;
  };

  const riskColors = {
    critical: 'bg-destructive',
    warning: 'bg-risk-warning',
    low: 'bg-primary',
    safe: 'bg-risk-safe',
  };

  const riskSizes = {
    critical: 'w-4 h-4',
    warning: 'w-3.5 h-3.5',
    low: 'w-3 h-3',
    safe: 'w-2.5 h-2.5',
  };

  return (
    <div className="bg-card p-4 rounded-lg border border-border">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Conjunction Timeline
      </h3>
      
      {/* Timeline bar */}
      <div className="relative h-12 mb-2">
        {/* Background track */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
        
        {/* Now marker */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-primary/50"
          style={{ left: `${Math.max(0, Math.min(100, ((now - minTime) / timeRange) * 100))}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] text-primary font-mono whitespace-nowrap">
            NOW
          </div>
        </div>
        
        {/* Event markers */}
        {sortedEvents.map((event) => {
          const position = getPosition(event);
          const isSelected = selectedEvent?.id === event.id;
          
          return (
            <motion.button
              key={event.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.3 }}
              onClick={() => onEventSelect(event)}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full cursor-pointer transition-all",
                riskColors[event.riskLevel],
                riskSizes[event.riskLevel],
                isSelected && "ring-2 ring-offset-2 ring-offset-card ring-foreground",
                event.riskLevel === 'critical' && "animate-pulse"
              )}
              style={{ left: `${position}%` }}
              title={`${event.primaryObject.name} - ${new Date(event.tca).toLocaleString()}`}
            />
          );
        })}
      </div>
      
      {/* Time labels */}
      <div className="flex justify-between text-xs text-muted-foreground font-mono">
        <span>{new Date(minTime).toLocaleDateString()}</span>
        <span>{new Date(maxTime).toLocaleDateString()}</span>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
        {Object.entries(riskColors).map(([level, color]) => (
          <div key={level} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className={cn("w-2 h-2 rounded-full", color)} />
            <span className="capitalize">{level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
