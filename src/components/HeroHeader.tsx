import { Shield, Radio, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RiskLevel } from '@/data/orbitalData';

interface HeroHeaderProps {
  systemStatus: 'nominal' | 'elevated' | 'critical';
  className?: string;
}

export function HeroHeader({ systemStatus, className }: HeroHeaderProps) {
  const statusConfig = {
    nominal: {
      label: 'Nominal',
      color: 'bg-risk-safe',
      textColor: 'text-risk-safe',
      glow: 'shadow-[0_0_20px_hsl(var(--risk-safe)/0.4)]',
    },
    elevated: {
      label: 'Elevated',
      color: 'bg-risk-warning',
      textColor: 'text-risk-warning',
      glow: 'shadow-[0_0_20px_hsl(var(--risk-warning)/0.4)]',
    },
    critical: {
      label: 'Critical',
      color: 'bg-destructive',
      textColor: 'text-destructive',
      glow: 'shadow-[0_0_20px_hsl(var(--destructive)/0.4)]',
    },
  };

  const status = statusConfig[systemStatus];

  return (
    <header className={cn(
      "relative border-b border-border/50 bg-gradient-to-r from-card via-card/95 to-card overflow-hidden",
      className
    )}>
      {/* Subtle gradient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="relative px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-5">
          {/* Logo / Brand Mark */}
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-risk-safe border-2 border-card animate-pulse" />
          </div>
          
          {/* Brand Text */}
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              ORBITAL GUARDIAN
              <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                v2.1
              </span>
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Space Debris Risk Intelligence & Explainability
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Telemetry indicators */}
          <div className="hidden lg:flex items-center gap-5 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Radio className="w-4 h-4 text-primary animate-pulse" />
              <span>TLE Feed Active</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-4 h-4" />
              <span>ML Model Ready</span>
            </div>
          </div>
          
          {/* System Status Badge */}
          <div className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-300",
            "bg-card/80 backdrop-blur-sm",
            status.glow
          )}>
            <div className="flex items-center gap-2">
              <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse", status.color)} />
              <span className={cn("text-sm font-semibold uppercase tracking-wider", status.textColor)}>
                {status.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function getSystemStatus(criticalCount: number, warningCount: number): 'nominal' | 'elevated' | 'critical' {
  if (criticalCount > 0) return 'critical';
  if (warningCount > 0) return 'elevated';
  return 'nominal';
}
