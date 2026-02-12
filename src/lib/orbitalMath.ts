/**
 * orbitalMath.ts
 *
 * Deterministic orbital geometry utilities used for
 * conjunction analysis and risk interpretation.
 *
 * Assumptions:
 * - Positions are expressed in an Earth-Centered Inertial (ECI) frame
 * - Motion is locally linear over short time windows
 * - Functions are analytical, not propagators
 *
 * This module intentionally avoids black-box models
 * in favor of transparent, explainable calculations.
 */

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

/* --------------------------------------------------
 * Vector utilities
 * -------------------------------------------------- */

/**
 * Compute the Euclidean distance between two 3D position vectors.
 */
export const computeDistance = (a: Vector3, b: Vector3): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

/**
 * Compute the relative velocity magnitude between two objects.
 */
export const computeRelativeVelocity = (
  v1: Vector3,
  v2: Vector3
): number => {
  const dvx = v1.x - v2.x;
  const dvy = v1.y - v2.y;
  const dvz = v1.z - v2.z;

  return Math.sqrt(dvx * dvx + dvy * dvy + dvz * dvz);
};

/**
 * Compute the angle (in degrees) between two vectors.
 * Useful for understanding orbital plane alignment.
 */
export const computeAngleBetween = (
  a: Vector3,
  b: Vector3
): number => {
  const dot =
    a.x * b.x + a.y * b.y + a.z * b.z;

  const magA = Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2);
  const magB = Math.sqrt(b.x ** 2 + b.y ** 2 + b.z ** 2);

  if (magA === 0 || magB === 0) return 0;

  const cosTheta = dot / (magA * magB);

  // Numerical safety
  const clamped = Math.min(1, Math.max(-1, cosTheta));

  return (Math.acos(clamped) * 180) / Math.PI;
};

/* --------------------------------------------------
 * Risk-related helpers
 * -------------------------------------------------- */

/**
 * Categorize conjunction risk based on miss distance.
 *
 * Thresholds are intentionally conservative and
 * designed for analytical demonstration.
 */
export const categorizeRiskLevel = (
  missDistanceKm: number
): "critical" | "warning" | "low" | "safe" => {
  if (missDistanceKm < 0.1) return "critical"; // <100 m
  if (missDistanceKm < 1.0) return "warning";  // 100 m – 1 km
  if (missDistanceKm < 5.0) return "low";      // 1 – 5 km
  return "safe";
};

/**
 * Compute a simple composite risk score (0–100)
 * using distance and relative velocity.
 *
 * This is NOT probabilistic — it is a weighted heuristic
 * meant to support explainability.
 */
export const computeRiskScore = (
  missDistanceKm: number,
  relativeVelocityKmS: number
): number => {
  // Distance contribution (dominant)
  const distanceScore = Math.max(
    0,
    100 - missDistanceKm * 20
  );

  // Velocity contribution (secondary)
  const velocityScore = Math.min(
    100,
    relativeVelocityKmS * 6
  );

  // Weighted combination
  const score =
    0.65 * distanceScore +
    0.35 * velocityScore;

  return Math.round(Math.min(100, Math.max(0, score)));
};
