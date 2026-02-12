import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, ChevronRight, Lightbulb, TrendingUp, TrendingDown } from 'lucide-react';
import { NearMissEvent } from '@/data/orbitalData';
import { RiskGauge } from './RiskGauge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ExplainabilityDrawerProps {
  event: NearMissEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExplainabilityDrawer({ event, isOpen, onClose }: ExplainabilityDrawerProps) {
  if (!event) return null;

  const riskColors = {
    critical: 'text-destructive',
    warning: 'text-risk-warning',
    low: 'text-primary',
    safe: 'text-risk-safe',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-50"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Risk Analysis</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Explainability Report
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-5 space-y-6">
                  {/* Event Summary */}
                  <div className="flex items-start gap-4">
                    <RiskGauge value={event.riskScore} size="lg" />
                    <div className="flex-1">
                      <p className={cn("text-sm font-semibold uppercase tracking-wider", riskColors[event.riskLevel])}>
                        {event.riskLevel} Risk
                      </p>
                      <p className="text-foreground font-medium mt-1">
                        {event.primaryObject.name}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <ChevronRight className="w-3 h-3" />
                        {event.secondaryObject.name}
                      </p>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase">Miss Distance</p>
                      <p className="text-lg font-bold font-mono text-foreground mt-1">
                        {event.missDistance < 1 
                          ? `${(event.missDistance * 1000).toFixed(0)}m`
                          : `${event.missDistance.toFixed(2)}km`
                        }
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase">Rel. Velocity</p>
                      <p className="text-lg font-bold font-mono text-foreground mt-1">
                        {event.relativeVelocity.toFixed(2)} km/s
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase">Collision Prob.</p>
                      <p className="text-lg font-bold font-mono text-foreground mt-1">
                        {(event.probability * 100).toFixed(4)}%
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase">TCA</p>
                      <p className="text-sm font-medium text-foreground mt-1">
                        {new Date(event.tca).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Why is this risky? */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-risk-warning" />
                      <h3 className="text-sm font-semibold text-foreground">
                        Why is this {event.riskLevel === 'critical' || event.riskLevel === 'warning' ? 'risky' : 'assessed this way'}?
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {event.explanation.summary}
                    </p>
                  </div>

                  {/* Contributing Factors */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Info className="w-4 h-4 text-primary" />
                      Contributing Factors
                    </h3>
                    <ul className="space-y-2">
                      {event.explanation.factors.map((factor, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          {factor}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Feature Importance */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      ML Feature Contributions
                    </h3>
                    <div className="space-y-2">
                      {event.featureImportance.slice(0, 5).map((feature, i) => (
                        <motion.div
                          key={feature.feature}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-3 rounded-lg bg-secondary/20 border border-border/30"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-foreground">
                              {feature.feature}
                            </span>
                            <div className={cn(
                              "flex items-center gap-1 text-xs font-mono",
                              feature.contribution > 0 ? "text-destructive" : "text-risk-safe"
                            )}>
                              {feature.contribution > 0 ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {feature.contribution > 0 ? '+' : ''}{(feature.contribution * 100).toFixed(0)}%
                            </div>
                          </div>
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.abs(feature.contribution) * 100}%` }}
                              transition={{ duration: 0.5, delay: i * 0.05 }}
                              className={cn(
                                "h-full rounded-full",
                                feature.contribution > 0 ? "bg-destructive" : "bg-risk-safe"
                              )}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1.5">
                            {feature.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className={cn(
                    "p-4 rounded-lg border",
                    event.riskLevel === 'critical' 
                      ? "bg-destructive/10 border-destructive/30"
                      : event.riskLevel === 'warning'
                      ? "bg-risk-warning/10 border-risk-warning/30"
                      : "bg-risk-safe/10 border-risk-safe/30"
                  )}>
                    <div className="flex items-start gap-3">
                      {event.riskLevel === 'critical' || event.riskLevel === 'warning' ? (
                        <AlertCircle className={cn(
                          "w-5 h-5 flex-shrink-0",
                          event.riskLevel === 'critical' ? "text-destructive" : "text-risk-warning"
                        )} />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-risk-safe flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Recommended Action
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.explanation.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
