import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Satellite, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RiskLevel } from '@/data/orbitalData';

interface FilterPanelProps {
  riskLevels: RiskLevel[];
  onRiskLevelsChange: (levels: RiskLevel[]) => void;
  minRiskScore: number;
  onMinRiskScoreChange: (score: number) => void;
  objectTypes: ('satellite' | 'debris')[];
  onObjectTypesChange: (types: ('satellite' | 'debris')[]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function FilterPanel({
  riskLevels,
  onRiskLevelsChange,
  minRiskScore,
  onMinRiskScoreChange,
  objectTypes,
  onObjectTypesChange,
  isOpen,
  onToggle,
}: FilterPanelProps) {
  const allRiskLevels: RiskLevel[] = ['critical', 'warning', 'low', 'safe'];
  
  const toggleRiskLevel = (level: RiskLevel) => {
    if (riskLevels.includes(level)) {
      onRiskLevelsChange(riskLevels.filter(l => l !== level));
    } else {
      onRiskLevelsChange([...riskLevels, level]);
    }
  };

  const toggleObjectType = (type: 'satellite' | 'debris') => {
    if (objectTypes.includes(type)) {
      onObjectTypesChange(objectTypes.filter(t => t !== type));
    } else {
      onObjectTypesChange([...objectTypes, type]);
    }
  };

  const resetFilters = () => {
    onRiskLevelsChange(['critical', 'warning', 'low', 'safe']);
    onMinRiskScoreChange(0);
    onObjectTypesChange(['satellite', 'debris']);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="gap-2"
      >
        <Filter className="w-4 h-4" />
        Filters
        {(riskLevels.length < 4 || minRiskScore > 0) && (
          <span className="w-2 h-2 rounded-full bg-primary" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-lg shadow-lg z-50 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-foreground">Filter Events</h4>
              <Button variant="ghost" size="sm" onClick={onToggle}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Risk Levels */}
            <div className="mb-4">
              <Label className="text-xs text-muted-foreground mb-2 block">Risk Levels</Label>
              <div className="grid grid-cols-2 gap-2">
                {allRiskLevels.map((level) => (
                  <div key={level} className="flex items-center gap-2">
                    <Checkbox
                      id={`risk-${level}`}
                      checked={riskLevels.includes(level)}
                      onCheckedChange={() => toggleRiskLevel(level)}
                    />
                    <Label
                      htmlFor={`risk-${level}`}
                      className="text-sm capitalize cursor-pointer"
                    >
                      {level}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Min Risk Score */}
            <div className="mb-4">
              <Label className="text-xs text-muted-foreground mb-2 block">
                Minimum Risk Score: {minRiskScore}
              </Label>
              <Slider
                value={[minRiskScore]}
                onValueChange={(v) => onMinRiskScoreChange(v[0])}
                min={0}
                max={100}
                step={5}
                className="my-2"
              />
            </div>

            {/* Object Types */}
            <div className="mb-4">
              <Label className="text-xs text-muted-foreground mb-2 block">Object Types</Label>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="type-satellite"
                    checked={objectTypes.includes('satellite')}
                    onCheckedChange={() => toggleObjectType('satellite')}
                  />
                  <Label htmlFor="type-satellite" className="text-sm flex items-center gap-1.5 cursor-pointer">
                    <Satellite className="w-3 h-3 text-primary" />
                    Satellites
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="type-debris"
                    checked={objectTypes.includes('debris')}
                    onCheckedChange={() => toggleObjectType('debris')}
                  />
                  <Label htmlFor="type-debris" className="text-sm flex items-center gap-1.5 cursor-pointer">
                    <Trash2 className="w-3 h-3 text-destructive" />
                    Debris
                  </Label>
                </div>
              </div>
            </div>

            {/* Reset */}
            <Button variant="outline" size="sm" className="w-full" onClick={resetFilters}>
              Reset Filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
