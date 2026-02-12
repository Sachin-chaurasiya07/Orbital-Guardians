import { motion } from 'framer-motion';
import { Brain, ArrowUp, ArrowDown, Minus, Lightbulb, Shield } from 'lucide-react';
import { NearMissEvent } from '@/data/orbitalData';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface ExplainabilityPanelProps {
  event: NearMissEvent | null;
}

export function ExplainabilityPanel({ event }: ExplainabilityPanelProps) {
  if (!event) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select an event to see AI risk analysis</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full overflow-y-auto space-y-4"
    >
      {/* Summary Section */}
      <div className={cn(
        "p-4 rounded-lg border",
        event.riskLevel === 'critical' && "bg-destructive/10 border-destructive/30",
        event.riskLevel === 'warning' && "bg-risk-warning/10 border-risk-warning/30",
        event.riskLevel === 'low' && "bg-primary/10 border-primary/30",
        event.riskLevel === 'safe' && "bg-risk-safe/10 border-risk-safe/30"
      )}>
        <div className="flex items-start gap-3">
          <Brain className={cn(
            "w-5 h-5 mt-0.5 flex-shrink-0",
            event.riskLevel === 'critical' && "text-destructive",
            event.riskLevel === 'warning' && "text-risk-warning",
            event.riskLevel === 'low' && "text-primary",
            event.riskLevel === 'safe' && "text-risk-safe"
          )} />
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">AI Analysis Summary</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {event.explanation.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Feature Importance */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          Feature Importance Analysis
        </h4>
        <div className="space-y-3">
          {event.featureImportance.map((feature, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {feature.contribution > 0.1 ? (
                    <ArrowUp className="w-3 h-3 text-destructive" />
                  ) : feature.contribution < -0.1 ? (
                    <ArrowDown className="w-3 h-3 text-risk-safe" />
                  ) : (
                    <Minus className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span className="font-medium text-foreground">{feature.feature}</span>
                </div>
                <span className="font-mono text-muted-foreground">
                  {typeof feature.value === 'number' && feature.value < 10 
                    ? feature.value.toFixed(3)
                    : feature.value}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={Math.abs(feature.contribution) * 100} 
                  className={cn(
                    "h-1.5 flex-1",
                    feature.contribution > 0 ? "[&>div]:bg-destructive" : "[&>div]:bg-risk-safe"
                  )}
                />
                <span className={cn(
                  "text-xs font-mono w-12 text-right",
                  feature.contribution > 0 ? "text-destructive" : "text-risk-safe"
                )}>
                  {feature.contribution > 0 ? '+' : ''}{(feature.contribution * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground pl-5">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Factors */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-risk-warning" />
          Key Risk Factors
        </h4>
        <ul className="space-y-2">
          {event.explanation.factors.map((factor, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
              {factor}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Recommendation */}
      <div className="bg-secondary/50 p-4 rounded-lg border border-secondary">
        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          Recommended Action
        </h4>
        <p className="text-sm text-foreground leading-relaxed">
          {event.explanation.recommendation}
        </p>
      </div>
    </motion.div>
  );
}
