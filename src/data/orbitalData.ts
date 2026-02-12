/**
 * Simulated orbital dataset for conjunction analysis and visualization.
 *
 * This module defines a static, scenario-driven catalog of space objects
 * and near-miss events used to explore:
 *  - relative motion in orbit
 *  - close-approach geometry
 *  - qualitative risk categorization
 *
 * IMPORTANT:
 * - Data is simulated and deterministic
 * - No real-time TLE propagation is performed
 * - Risk values are rule-based and explainable
 * - Intended for analytical and educational use
 */

export type ObjectType = "satellite" | "debris";
export type RiskLevel = "critical" | "warning" | "low" | "safe";

/* ------------------------------------------------------------------
 * Core Data Models
 * ------------------------------------------------------------------ */

export interface SpaceObject {
  id: string;
  name: string;
  noradId: string;
  type: ObjectType;

  orbitParams: {
    semiMajorAxis: number; // km
    eccentricity: number;
    inclination: number; // degrees
    raan: number; // degrees
    argOfPerigee: number; // degrees
    meanAnomaly: number; // degrees
    period: number; // minutes
  };

  currentPosition: {
    x: number; // km (ECI)
    y: number;
    z: number;
  };

  velocity: {
    vx: number; // km/s
    vy: number;
    vz: number;
  };

  lastUpdated: string;
  description?: string;
}

export interface NearMissEvent {
  id: string;
  primaryObject: SpaceObject;
  secondaryObject: SpaceObject;

  tca: string; // Time of Closest Approach (ISO)
  missDistance: number; // km
  relativeVelocity: number; // km/s

  /**
   * Composite risk score derived from deterministic rules
   * (distance, velocity, asset criticality, geometry).
   */
  riskScore: number; // 0–100
  riskLevel: RiskLevel;

  /**
   * Indicative probability used only for visualization.
   * Not intended to represent operational PoC.
   */
  probability: number;

  explanation: RiskExplanation;
  contributingFactors: RiskFactor[];
}

export interface RiskExplanation {
  summary: string;
  factors: string[];
  recommendation: string;
}

export interface RiskFactor {
  name: string;
  value: number;
  weight: number; // relative influence on risk
  description: string;
}

/* ------------------------------------------------------------------
 * Simulated Space Object Catalog
 * ------------------------------------------------------------------ */

export const satellites: SpaceObject[] = [
  {
    id: "sat-001",
    name: "SENTINEL-2A",
    noradId: "40697",
    type: "satellite",
    orbitParams: {
      semiMajorAxis: 7167,
      eccentricity: 0.0001,
      inclination: 98.57,
      raan: 267.89,
      argOfPerigee: 90.0,
      meanAnomaly: 45.2,
      period: 100.6,
    },
    currentPosition: { x: 4532.1, y: -3421.5, z: 4123.8 },
    velocity: { vx: 4.12, vy: 5.23, vz: -3.45 },
    lastUpdated: "2024-01-15T12:00:00Z",
    description: "Earth observation satellite (simulation profile)",
  },
  {
    id: "sat-002",
    name: "AQUA",
    noradId: "27424",
    type: "satellite",
    orbitParams: {
      semiMajorAxis: 7083,
      eccentricity: 0.0002,
      inclination: 98.21,
      raan: 189.45,
      argOfPerigee: 95.3,
      meanAnomaly: 123.7,
      period: 98.8,
    },
    currentPosition: { x: -2145.3, y: 5632.1, z: 3892.4 },
    velocity: { vx: -5.89, vy: -2.34, vz: 4.12 },
    lastUpdated: "2024-01-15T12:00:00Z",
    description: "LEO research satellite (simulation profile)",
  },
  {
    id: "sat-003",
    name: "ISS",
    noradId: "25544",
    type: "satellite",
    orbitParams: {
      semiMajorAxis: 6793,
      eccentricity: 0.0005,
      inclination: 51.64,
      raan: 45.23,
      argOfPerigee: 12.5,
      meanAnomaly: 234.8,
      period: 92.9,
    },
    currentPosition: { x: 1234.5, y: -4567.8, z: 4890.2 },
    velocity: { vx: 6.12, vy: 3.45, vz: -2.89 },
    lastUpdated: "2024-01-15T12:00:00Z",
    description: "Crewed spacecraft (simulation profile)",
  },
  {
    id: "sat-004",
    name: "GOES-16",
    noradId: "41866",
    type: "satellite",
    orbitParams: {
      semiMajorAxis: 42164,
      eccentricity: 0.0001,
      inclination: 0.05,
      raan: 275.1,
      argOfPerigee: 0,
      meanAnomaly: 180.5,
      period: 1436.1,
    },
    currentPosition: { x: -35786.2, y: 21543.1, z: 12.4 },
    velocity: { vx: 1.56, vy: 2.61, vz: 0.01 },
    lastUpdated: "2024-01-15T12:00:00Z",
    description: "Geostationary weather satellite (simulation profile)",
  },
];

export const debris: SpaceObject[] = [
  {
    id: "deb-001",
    name: "COSMOS 2251 Fragment",
    noradId: "34454",
    type: "debris",
    orbitParams: {
      semiMajorAxis: 7150,
      eccentricity: 0.012,
      inclination: 74.0,
      raan: 265.3,
      argOfPerigee: 92.1,
      meanAnomaly: 48.9,
      period: 100.2,
    },
    currentPosition: { x: 4612.3, y: -3234.7, z: 4089.5 },
    velocity: { vx: 4.23, vy: 5.12, vz: -3.56 },
    lastUpdated: "2024-01-15T12:00:00Z",
    description: "Fragmentation debris (simulation profile)",
  },
  {
    id: "deb-002",
    name: "FENGYUN-1C Fragment",
    noradId: "31141",
    type: "debris",
    orbitParams: {
      semiMajorAxis: 7220,
      eccentricity: 0.008,
      inclination: 99.1,
      raan: 178.9,
      argOfPerigee: 45.6,
      meanAnomaly: 289.3,
      period: 101.5,
    },
    currentPosition: { x: -1987.4, y: 5823.2, z: 3745.6 },
    velocity: { vx: -5.67, vy: -2.45, vz: 4.34 },
    lastUpdated: "2024-01-15T12:00:00Z",
    description: "High-inclination debris fragment",
  },
];

/* ------------------------------------------------------------------
 * Near-Miss Conjunction Scenarios
 * ------------------------------------------------------------------ */

export const nearMissEvents: NearMissEvent[] = [
  {
    id: "nm-001",
    primaryObject: satellites[0],
    secondaryObject: debris[0],
    tca: "2024-01-16T04:32:15Z",
    missDistance: 0.089,
    relativeVelocity: 14.2,
    riskScore: 92,
    riskLevel: "critical",
    probability: 0.0023,
    explanation: {
      summary:
        "Extremely close approach with high relative velocity.",
      factors: [
        "Miss distance well below critical threshold",
        "High closing velocity increases impact severity",
        "Similar orbital planes extend conjunction duration",
      ],
      recommendation:
        "Evaluate avoidance maneuver and prioritize tracking updates.",
    },
    contributingFactors: [
      {
        name: "Miss Distance",
        value: 0.089,
        weight: 0.45,
        description: "Primary driver of conjunction severity",
      },
      {
        name: "Relative Velocity",
        value: 14.2,
        weight: 0.30,
        description: "High-energy encounter",
      },
      {
        name: "Orbital Geometry",
        value: 1.0,
        weight: 0.15,
        description: "Near-coplanar orbits",
      },
      {
        name: "Tracking Uncertainty",
        value: 0.6,
        weight: 0.10,
        description: "Fragmented debris object",
      },
    ],
  },
  {
    id: "nm-002",
    primaryObject: satellites[2],
    secondaryObject: debris[0],
    tca: "2024-01-15T22:45:30Z",
    missDistance: 0.234,
    relativeVelocity: 11.8,
    riskScore: 78,
    riskLevel: "critical",
    probability: 0.0009,
    explanation: {
      summary:
        "Close approach involving a crewed spacecraft.",
      factors: [
        "Crew safety elevates consequence severity",
        "Miss distance within conservative safety margins",
        "Adequate time for decision-making",
      ],
      recommendation:
        "Initiate conjunction assessment and prepare mitigation options.",
    },
    contributingFactors: [
      {
        name: "Asset Criticality",
        value: 1.0,
        weight: 0.40,
        description: "Crewed platform",
      },
      {
        name: "Miss Distance",
        value: 0.234,
        weight: 0.30,
        description: "Below conservative threshold",
      },
      {
        name: "Relative Velocity",
        value: 11.8,
        weight: 0.20,
        description: "High closing speed",
      },
      {
        name: "Lead Time",
        value: 10.75,
        weight: -0.10,
        description: "Sufficient planning window",
      },
    ],
  },
];

/* ------------------------------------------------------------------
 * Utility Selectors
 * ------------------------------------------------------------------ */

export const getAllSpaceObjects = (): SpaceObject[] => [
  ...satellites,
  ...debris,
];

export const getEventsByRiskLevel = (
  level: RiskLevel
): NearMissEvent[] =>
  nearMissEvents.filter((e) => e.riskLevel === level);

/* ------------------------------------------------------------------
 * Summary Statistics
 * ------------------------------------------------------------------ */

export interface RiskStatistics {
  totalEvents: number;
  criticalCount: number;
  warningCount: number;
  lowCount: number;
  safeCount: number;
  averageRiskScore: number;
  highestRisk: NearMissEvent | null;
  nextTCA: NearMissEvent | null;
}

export const getRiskStatistics = (): RiskStatistics => {
  const avg =
    nearMissEvents.reduce((s, e) => s + e.riskScore, 0) /
    nearMissEvents.length;

  const byRisk = [...nearMissEvents].sort(
    (a, b) => b.riskScore - a.riskScore
  );
  const byTime = [...nearMissEvents].sort(
    (a, b) =>
      new Date(a.tca).getTime() - new Date(b.tca).getTime()
  );

  return {
    totalEvents: nearMissEvents.length,
    criticalCount: nearMissEvents.filter(
      (e) => e.riskLevel === "critical"
    ).length,
    warningCount: nearMissEvents.filter(
      (e) => e.riskLevel === "warning"
    ).length,
    lowCount: nearMissEvents.filter(
      (e) => e.riskLevel === "low"
    ).length,
    safeCount: nearMissEvents.filter(
      (e) => e.riskLevel === "safe"
    ).length,
    averageRiskScore: Math.round(avg),
    highestRisk: byRisk[0] ?? null,
    nextTCA: byTime[0] ?? null,
  };
};
