import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RiskGaugeProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function RiskGauge({ 
  value, 
  size = 'md', 
  label,
  showValue = true,
  className 
}: RiskGaugeProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));
  
  const sizeConfig = {
    sm: { outer: 60, stroke: 6, fontSize: 'text-lg', labelSize: 'text-[10px]' },
    md: { outer: 90, stroke: 8, fontSize: 'text-2xl', labelSize: 'text-xs' },
    lg: { outer: 120, stroke: 10, fontSize: 'text-3xl', labelSize: 'text-sm' },
  };

  const config = sizeConfig[size];
  const radius = (config.outer - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  // Color based on risk level
  const getColor = () => {
    if (normalizedValue >= 75) return 'hsl(var(--destructive))';
    if (normalizedValue >= 50) return 'hsl(var(--risk-warning))';
    if (normalizedValue >= 25) return 'hsl(var(--primary))';
    return 'hsl(var(--risk-safe))';
  };

  const color = getColor();

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        width={config.outer}
        height={config.outer}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.outer / 2}
          cy={config.outer / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth={config.stroke}
        />
        {/* Progress circle */}
        <motion.circle
          cx={config.outer / 2}
          cy={config.outer / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <span className={cn("font-bold font-mono", config.fontSize)} style={{ color }}>
            {normalizedValue}
          </span>
        )}
        {label && (
          <span className={cn("text-muted-foreground uppercase tracking-wider", config.labelSize)}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
