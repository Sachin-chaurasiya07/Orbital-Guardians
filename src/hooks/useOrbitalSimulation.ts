import { useState, useEffect, useCallback, useRef } from 'react';
import { SpaceObject, satellites as initialSatellites, debris as initialDebris } from '@/data/orbitalData';

interface SimulationState {
  satellites: SpaceObject[];
  debris: SpaceObject[];
  simulationTime: Date;
  isRunning: boolean;
  speed: number; // Simulation speed multiplier
  lastUpdate: Date;
}

// Simplified mean motion calculation (rad/min) from period
const getMeanMotion = (periodMinutes: number): number => {
  return (2 * Math.PI) / periodMinutes;
};

// Propagate mean anomaly based on elapsed time
const propagateMeanAnomaly = (
  initialMeanAnomaly: number,
  periodMinutes: number,
  elapsedMinutes: number
): number => {
  const meanMotion = getMeanMotion(periodMinutes);
  const deltaMeanAnomaly = (meanMotion * elapsedMinutes * 180) / Math.PI; // Convert to degrees
  return (initialMeanAnomaly + deltaMeanAnomaly) % 360;
};

// Update object position based on new mean anomaly (simplified 2-body)
const updateObjectPosition = (
  object: SpaceObject,
  elapsedMinutes: number
): SpaceObject => {
  const newMeanAnomaly = propagateMeanAnomaly(
    object.orbitParams.meanAnomaly,
    object.orbitParams.period,
    elapsedMinutes
  );

  // Simplified position calculation (circular orbit approximation)
  const sma = object.orbitParams.semiMajorAxis;
  const inc = (object.orbitParams.inclination * Math.PI) / 180;
  const raan = (object.orbitParams.raan * Math.PI) / 180;
  const ma = (newMeanAnomaly * Math.PI) / 180;

  // Position in orbital plane
  const xOrbit = sma * Math.cos(ma);
  const yOrbit = sma * Math.sin(ma);

  // Rotate by inclination around x-axis
  const xInclined = xOrbit;
  const yInclined = yOrbit * Math.cos(inc);
  const zInclined = yOrbit * Math.sin(inc);

  // Rotate by RAAN around z-axis
  const x = xInclined * Math.cos(raan) - yInclined * Math.sin(raan);
  const y = xInclined * Math.sin(raan) + yInclined * Math.cos(raan);
  const z = zInclined;

  return {
    ...object,
    orbitParams: {
      ...object.orbitParams,
      meanAnomaly: newMeanAnomaly,
    },
    currentPosition: { x, y, z },
    lastUpdated: new Date().toISOString(),
  };
};

export function useOrbitalSimulation(updateIntervalMs: number = 2000) {
  const [state, setState] = useState<SimulationState>({
    satellites: initialSatellites,
    debris: initialDebris,
    simulationTime: new Date(),
    isRunning: true,
    speed: 100, // 100x real-time for visible motion
    lastUpdate: new Date(),
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<Date>(new Date());
  const cumulativeMinutesRef = useRef<number>(0);

  const updatePositions = useCallback(() => {
    setState((prev) => {
      if (!prev.isRunning) return prev;

      const now = new Date();
      const realElapsedMs = now.getTime() - prev.lastUpdate.getTime();
      const simulatedElapsedMinutes = (realElapsedMs / 1000 / 60) * prev.speed;
      
      cumulativeMinutesRef.current += simulatedElapsedMinutes;

      const updatedSatellites = prev.satellites.map((sat) =>
        updateObjectPosition(sat, simulatedElapsedMinutes)
      );

      const updatedDebris = prev.debris.map((deb) =>
        updateObjectPosition(deb, simulatedElapsedMinutes)
      );

      // Update simulation time
      const newSimTime = new Date(
        startTimeRef.current.getTime() + cumulativeMinutesRef.current * 60 * 1000
      );

      return {
        ...prev,
        satellites: updatedSatellites,
        debris: updatedDebris,
        simulationTime: newSimTime,
        lastUpdate: now,
      };
    });
  }, []);

  // Start/stop simulation
  const toggleSimulation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRunning: !prev.isRunning,
      lastUpdate: new Date(),
    }));
  }, []);

  // Set simulation speed
  const setSpeed = useCallback((speed: number) => {
    setState((prev) => ({
      ...prev,
      speed: Math.max(1, Math.min(1000, speed)),
      lastUpdate: new Date(),
    }));
  }, []);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    startTimeRef.current = new Date();
    cumulativeMinutesRef.current = 0;
    setState({
      satellites: initialSatellites,
      debris: initialDebris,
      simulationTime: new Date(),
      isRunning: true,
      speed: 100,
      lastUpdate: new Date(),
    });
  }, []);

  // Setup interval
  useEffect(() => {
    intervalRef.current = setInterval(updatePositions, updateIntervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updatePositions, updateIntervalMs]);

  return {
    ...state,
    toggleSimulation,
    setSpeed,
    resetSimulation,
    totalTrackedObjects: state.satellites.length + state.debris.length,
    elapsedSimulationMinutes: cumulativeMinutesRef.current,
  };
}
