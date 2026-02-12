import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { List, Info } from "lucide-react";

import { HeroHeader, getSystemStatus } from "@/components/HeroHeader";
import { OrbitalVisualization } from "@/components/OrbitalVisualization";
import { EnhancedEventCard } from "@/components/EnhancedEventCard";
import { ExplainabilityDrawer } from "@/components/ExplainabilityDrawer";
import { KPICards } from "@/components/KPICards";
import { ContextTimeline } from "@/components/ContextTimeline";
import { FilterPanel } from "@/components/FilterPanel";
import { ObjectCatalog } from "@/components/ObjectCatalog";
import { SimulationControls } from "@/components/SimulationControls";
import { CollisionTrendChart } from "@/components/CollisionTrendChart";

import { useOrbitalSimulation } from "@/hooks/useOrbitalSimulation";
import {
  nearMissEvents,
  getRiskStatistics,
  NearMissEvent,
  RiskLevel,
  SpaceObject,
} from "@/data/orbitalData";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Main dashboard page.
 * Orchestrates simulation state, analytical views, and user interaction.
 */
const Index = () => {
  const [selectedEvent, setSelectedEvent] = useState<NearMissEvent | null>(null);
  const [selectedObject, setSelectedObject] = useState<SpaceObject | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [riskLevelFilter, setRiskLevelFilter] = useState<RiskLevel[]>([
    "critical",
    "warning",
    "low",
    "safe",
  ]);
  const [minRiskScore, setMinRiskScore] = useState(0);
  const [objectTypesFilter] = useState<("satellite" | "debris")[]>([
    "satellite",
    "debris",
  ]);

  /**
   * Time-stepped orbital simulation hook.
   * Provides evolving satellite and debris states for visualization.
   */
  const simulation = useOrbitalSimulation(2000);

  /**
   * Pre-computed global risk statistics used for system-level indicators.
   */
  const stats = useMemo(() => getRiskStatistics(), []);
  const systemStatus = useMemo(
    () => getSystemStatus(stats.criticalCount, stats.warningCount),
    [stats]
  );

  /**
   * Event filtering based on risk level and score threshold.
   * Sorted by descending risk score to surface critical cases first.
   */
  const filteredEvents = useMemo(() => {
    return nearMissEvents
      .filter((event) => {
        if (!riskLevelFilter.includes(event.riskLevel)) return false;
        if (event.riskScore < minRiskScore) return false;
        return true;
      })
      .sort((a, b) => b.riskScore - a.riskScore);
  }, [riskLevelFilter, minRiskScore]);

  const handleEventSelect = (event: NearMissEvent) => {
    setSelectedEvent(event);
    setSelectedObject(null);
    setDrawerOpen(true);
  };

  const handleObjectSelect = (object: SpaceObject) => {
    setSelectedObject(object);
    const relatedEvent = nearMissEvents.find(
      (e) =>
        e.primaryObject.id === object.id ||
        e.secondaryObject.id === object.id
    );
    if (relatedEvent) {
      setSelectedEvent(relatedEvent);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeroHeader systemStatus={systemStatus} />

      <main className="flex-1 p-4 lg:p-6 space-y-5 overflow-hidden">
        {/* Simulation control panel */}
        <SimulationControls
          isRunning={simulation.isRunning}
          speed={simulation.speed}
          simulationTime={simulation.simulationTime}
          totalObjects={simulation.totalTrackedObjects}
          elapsedMinutes={simulation.elapsedSimulationMinutes}
          onToggle={simulation.toggleSimulation}
          onSpeedChange={simulation.setSpeed}
          onReset={simulation.resetSimulation}
        />

        {/* High-level KPIs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <KPICards stats={stats} />
        </motion.div>

        {/* Risk trend visualization */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <CollisionTrendChart />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-340px)]">
          {/* Left: Event list */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">
                Conjunction Events
                <span className="ml-2 px-2 py-0.5 rounded-full bg-secondary text-xs">
                  {filteredEvents.length}
                </span>
              </h2>
              <FilterPanel
                riskLevels={riskLevelFilter}
                onRiskLevelsChange={setRiskLevelFilter}
                minRiskScore={minRiskScore}
                onMinRiskScoreChange={setMinRiskScore}
                objectTypes={objectTypesFilter}
                onObjectTypesChange={() => {}}
                isOpen={filterOpen}
                onToggle={() => setFilterOpen(!filterOpen)}
              />
            </div>

            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-3">
                {filteredEvents.map((event) => (
                  <EnhancedEventCard
                    key={event.id}
                    event={event}
                    isSelected={selectedEvent?.id === event.id}
                    onClick={() => handleEventSelect(event)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Center: Orbital visualization */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="flex-1 min-h-[400px] rounded-xl overflow-hidden border">
              <OrbitalVisualization
                satellites={simulation.satellites}
                debris={simulation.debris}
                selectedEvent={selectedEvent}
                onObjectSelect={handleObjectSelect}
              />
            </div>

            
          </div>

          {/* Right: Catalog & system description */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="catalog" className="h-full flex flex-col">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="catalog" className="gap-1.5">
                  <List className="w-3.5 h-3.5" />
                  Catalog
                </TabsTrigger>
                <TabsTrigger value="about" className="gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  About
                </TabsTrigger>
              </TabsList>

              <TabsContent value="catalog" className="flex-1 mt-4">
                <ObjectCatalog
                  satellites={simulation.satellites}
                  debris={simulation.debris}
                  selectedObjectId={
                    selectedObject?.id ||
                    selectedEvent?.primaryObject.id ||
                    null
                  }
                  onObjectSelect={handleObjectSelect}
                />
              </TabsContent>

              <TabsContent value="about" className="flex-1 mt-4">
                <div className="h-full bg-card/50 rounded-xl border p-5 overflow-y-auto">
                  <h3 className="text-sm font-semibold mb-4">
                    System Overview
                  </h3>

                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p>
                      Orbital Guardians is a simulation-driven system for
                      analyzing close-approach events between satellites and
                      orbital debris. The focus is on interpretability and
                      geometric reasoning rather than black-box prediction.
                    </p>

                    <div>
                      <h4 className="font-medium mb-1">Analysis Flow</h4>
                      <ul className="list-disc list-inside text-xs space-y-1">
                        <li>Time-stepped orbital state simulation</li>
                        <li>Relative distance and proximity assessment</li>
                        <li>Rule-based risk categorization</li>
                        <li>Visual interpretation of conjunction events</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-1">Risk Interpretation</h4>
                      <ul className="list-disc list-inside text-xs space-y-1">
                        <li>
                          <span className="text-destructive">Critical:</span>{" "}
                          &lt;100 m miss distance
                        </li>
                        <li>
                          <span className="text-risk-warning">Warning:</span>{" "}
                          100 m – 1 km
                        </li>
                        <li>
                          <span className="text-primary">Low:</span> 1 km – 5 km
                        </li>
                        <li>
                          <span className="text-risk-safe">Safe:</span> &gt;5 km
                        </li>
                      </ul>
                    </div>

                    <p className="text-xs italic border-t pt-3">
                      Research-oriented prototype for visualization and
                      analytical exploration. Not intended for operational use.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <ExplainabilityDrawer
        event={selectedEvent}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default Index;
