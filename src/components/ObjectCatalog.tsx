import { motion } from 'framer-motion';
import { SpaceObject } from '@/data/orbitalData';
import { Satellite, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ObjectCatalogProps {
  satellites: SpaceObject[];
  debris: SpaceObject[];
  selectedObjectId: string | null;
  onObjectSelect: (object: SpaceObject) => void;
}

export function ObjectCatalog({ 
  satellites, 
  debris, 
  selectedObjectId, 
  onObjectSelect 
}: ObjectCatalogProps) {
  const renderObject = (obj: SpaceObject, index: number) => (
    <motion.button
      key={obj.id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onObjectSelect(obj)}
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-all",
        selectedObjectId === obj.id
          ? "bg-primary/10 border-primary/50"
          : "bg-card border-border hover:border-muted-foreground/50"
      )}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          {obj.type === 'satellite' ? (
            <Satellite className="w-4 h-4 text-primary" />
          ) : (
            <Trash2 className="w-4 h-4 text-destructive" />
          )}
          <span className="font-medium text-sm text-foreground">{obj.name}</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          #{obj.noradId}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-2">
        <div className="text-muted-foreground">
          Alt: <span className="text-foreground font-mono">
            {(obj.orbitParams.semiMajorAxis - 6371).toFixed(0)} km
          </span>
        </div>
        <div className="text-muted-foreground">
          Inc: <span className="text-foreground font-mono">
            {obj.orbitParams.inclination.toFixed(1)}°
          </span>
        </div>
        <div className="text-muted-foreground">
          Ecc: <span className="text-foreground font-mono">
            {obj.orbitParams.eccentricity.toFixed(4)}
          </span>
        </div>
        <div className="text-muted-foreground">
          Period: <span className="text-foreground font-mono">
            {obj.orbitParams.period.toFixed(1)} min
          </span>
        </div>
      </div>
    </motion.button>
  );

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Object Catalog</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {satellites.length} satellites • {debris.length} debris objects
        </p>
      </div>
      
      <div className="h-[300px] overflow-y-auto p-3 space-y-4">
        {/* Satellites */}
        <div>
          <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
            <Satellite className="w-3 h-3" />
            Active Satellites
          </h4>
          <div className="space-y-2">
            {satellites.map((sat, idx) => renderObject(sat, idx))}
          </div>
        </div>
        
        {/* Debris */}
        <div>
          <h4 className="text-xs font-semibold text-destructive uppercase tracking-wider mb-2 flex items-center gap-2">
            <Trash2 className="w-3 h-3" />
            Tracked Debris
          </h4>
          <div className="space-y-2">
            {debris.map((deb, idx) => renderObject(deb, idx + satellites.length))}
          </div>
        </div>
      </div>
    </div>
  );
}
