import { Satellite, Shield, Database, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn("border-b border-border bg-card/50 backdrop-blur-sm", className)}>
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Satellite className="w-8 h-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-risk-safe rounded-full border-2 border-card animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                ORBITAL RISK ANALYSIS
              </h1>
              <p className="text-xs text-muted-foreground">
                Near-Miss Detection & Explainability System
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Status indicators */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-risk-safe animate-pulse" />
              <span className="text-muted-foreground">System Online</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Database className="w-4 h-4" />
              <span>TLE Updated: 12:00 UTC</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Cpu className="w-4 h-4" />
              <span>ML Model v2.1</span>
            </div>
          </div>
          
          {/* Security badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-xs">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-secondary-foreground">Research Prototype</span>
          </div>
        </div>
      </div>
    </header>
  );
}
