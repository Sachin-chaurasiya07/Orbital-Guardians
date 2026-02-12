import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Gauge, Satellite, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SimulationControlsProps {
  isRunning: boolean;
  speed: number;
  simulationTime: Date;
  totalObjects: number;
  elapsedMinutes: number;
  onToggle: () => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
}

export function SimulationControls({
  isRunning,
  speed,
  simulationTime,
  totalObjects,
  elapsedMinutes,
  onToggle,
  onSpeedChange,
  onReset,
}: SimulationControlsProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatElapsedOrbitalTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg p-3"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Status indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-2 h-2 rounded-full animate-pulse',
                isRunning ? 'bg-risk-safe' : 'bg-muted-foreground'
              )}
            />
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              {isRunning ? 'LIVE' : 'PAUSED'}
            </span>
          </div>
          
          <Badge variant="outline" className="gap-1 font-mono text-xs">
            <Satellite className="w-3 h-3" />
            {totalObjects} objects
          </Badge>
        </div>

        {/* Time display */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Sim Time</div>
            <div className="font-mono text-sm text-foreground">
              {formatTime(simulationTime)}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              {formatDate(simulationTime)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Elapsed</div>
            <div className="font-mono text-sm text-foreground flex items-center gap-1">
              <Clock className="w-3 h-3 text-primary" />
              {formatElapsedOrbitalTime(elapsedMinutes)}
            </div>
          </div>
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Speed:</span>
            <span className="text-sm font-mono text-foreground w-12">{speed}x</span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={(v) => onSpeedChange(v[0])}
            min={1}
            max={500}
            step={10}
            className="w-24"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            className="gap-1.5"
          >
            {isRunning ? (
              <>
                <Pause className="w-3 h-3" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                Resume
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
