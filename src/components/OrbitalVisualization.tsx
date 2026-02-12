import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Line, Html } from "@react-three/drei";
import * as THREE from "three";

import { SpaceObject, NearMissEvent } from "@/data/orbitalData";
import { computeDistance } from "@/lib/orbitalMath";

interface OrbitalVisualizationProps {
  satellites: SpaceObject[];
  debris: SpaceObject[];
  selectedEvent: NearMissEvent | null;
  onObjectSelect?: (object: SpaceObject) => void;
}

/* ------------------------------------------------------------------
 * Shared orbital position helper
 *
 * Assumptions:
 * - Circular orbit approximation
 * - Static mean anomaly for visualization snapshot
 * - ECI-like reference frame
 * ------------------------------------------------------------------ */
const computeOrbitalPosition = (object: SpaceObject): THREE.Vector3 => {
  const scale = object.orbitParams.semiMajorAxis / 6371;

  const angle = THREE.MathUtils.degToRad(object.orbitParams.meanAnomaly);
  const inc = THREE.MathUtils.degToRad(object.orbitParams.inclination);
  const raan = THREE.MathUtils.degToRad(object.orbitParams.raan);

  const x = scale * Math.cos(angle);
  const z = scale * Math.sin(angle);

  const position = new THREE.Vector3(x, 0, z);
  position.applyAxisAngle(new THREE.Vector3(1, 0, 0), inc);
  position.applyAxisAngle(new THREE.Vector3(0, 1, 0), raan);

  return position;
};

/* ------------------------------------------------------------------
 * Earth
 * ------------------------------------------------------------------ */

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        color="#1a4d7c"
        emissive="#0a2540"
        emissiveIntensity={0.2}
        roughness={0.8}
      />
    </mesh>
  );
}

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.02, 64, 64]} />
      <meshBasicMaterial
        color="#4da6ff"
        transparent
        opacity={0.15}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------
 * Orbital path (visual only)
 * ------------------------------------------------------------------ */

function OrbitPath({
  semiMajorAxis,
  inclination,
  raan,
  color = "#334155",
  opacity = 0.3,
}: {
  semiMajorAxis: number;
  inclination: number;
  raan: number;
  color?: string;
  opacity?: number;
}) {
  const scale = semiMajorAxis / 6371;

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(angle) * scale,
          0,
          Math.sin(angle) * scale
        )
      );
    }
    return pts;
  }, [scale]);

  return (
    <group
      rotation={[
        THREE.MathUtils.degToRad(inclination),
        THREE.MathUtils.degToRad(raan),
        0,
      ]}
    >
      <Line
        points={points}
        color={color}
        lineWidth={1}
        transparent
        opacity={opacity}
      />
    </group>
  );
}

/* ------------------------------------------------------------------
 * Space object marker
 * ------------------------------------------------------------------ */

function SpaceObjectMarker({
  object,
  isSelected,
  isHighlighted,
  onClick,
}: {
  object: SpaceObject;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const position = useMemo(() => computeOrbitalPosition(object), [object]);

  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected || isHighlighted) {
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
        meshRef.current.scale.setScalar(pulse);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const color = object.type === "satellite" ? "#22d3ee" : "#ef4444";
  const size = object.type === "satellite" ? 0.08 : 0.05;

  return (
    <group position={position}>
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={isSelected ? "#fbbf24" : color}
          transparent={!isSelected && !isHighlighted}
          opacity={isSelected || isHighlighted ? 1 : 0.8}
        />
      </mesh>

      {(isSelected || isHighlighted) && (
        <Html distanceFactor={10}>
          <div className="px-2 py-1 bg-card/90 backdrop-blur-sm rounded border text-xs font-mono">
            <span
              className={
                object.type === "satellite"
                  ? "text-primary"
                  : "text-destructive"
              }
            >
              {object.name}
            </span>
          </div>
        </Html>
      )}

      <pointLight
        color={isSelected ? "#fbbf24" : color}
        intensity={isSelected ? 2 : 0.5}
        distance={0.5}
      />
    </group>
  );
}

/* ------------------------------------------------------------------
 * Conjunction line
 * ------------------------------------------------------------------ */

function ConjunctionLine({
  event,
  isActive,
}: {
  event: NearMissEvent;
  isActive: boolean;
}) {
  if (!isActive) return null;

  const pos1 = computeOrbitalPosition(event.primaryObject);
  const pos2 = computeOrbitalPosition(event.secondaryObject);

  // Analytical distance (ownership anchor)
  const distance = computeDistance(pos1, pos2);

  const color =
    event.riskLevel === "critical"
      ? "#ef4444"
      : event.riskLevel === "warning"
      ? "#f59e0b"
      : "#22d3ee";

  return (
    <>
      <Line
        points={[pos1, pos2]}
        color={color}
        lineWidth={2}
        dashed
        dashScale={10}
        dashSize={0.1}
      />
      {/* Distance label */}
      <Html position={pos1.clone().lerp(pos2, 0.5)} distanceFactor={10}>
        <div className="px-2 py-0.5 bg-card/80 rounded text-[10px] font-mono">
          {distance.toFixed(2)} ER
        </div>
      </Html>
    </>
  );
}

/* ------------------------------------------------------------------
 * Scene
 * ------------------------------------------------------------------ */

function Scene({
  satellites,
  debris,
  selectedEvent,
  onObjectSelect,
}: OrbitalVisualizationProps) {
  const highlightedIds = selectedEvent
    ? [selectedEvent.primaryObject.id, selectedEvent.secondaryObject.id]
    : [];

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} fade />

      <Earth />
      <Atmosphere />

      {satellites.map((sat) => (
        <OrbitPath
          key={sat.id}
          semiMajorAxis={sat.orbitParams.semiMajorAxis}
          inclination={sat.orbitParams.inclination}
          raan={sat.orbitParams.raan}
          color="#22d3ee"
          opacity={highlightedIds.includes(sat.id) ? 0.6 : 0.2}
        />
      ))}

      {satellites.map((sat) => (
        <SpaceObjectMarker
          key={sat.id}
          object={sat}
          isSelected={selectedEvent?.primaryObject.id === sat.id}
          isHighlighted={highlightedIds.includes(sat.id)}
          onClick={() => onObjectSelect?.(sat)}
        />
      ))}

      {debris.map((deb) => (
        <SpaceObjectMarker
          key={deb.id}
          object={deb}
          isSelected={false}
          isHighlighted={highlightedIds.includes(deb.id)}
          onClick={() => onObjectSelect?.(deb)}
        />
      ))}

      {selectedEvent && (
        <ConjunctionLine event={selectedEvent} isActive />
      )}

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={2}
        maxDistance={20}
      />
    </>
  );
}

/* ------------------------------------------------------------------
 * Public component
 * ------------------------------------------------------------------ */

export function OrbitalVisualization(props: OrbitalVisualizationProps) {
  return (
    <div className="w-full h-full bg-background rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Scene {...props} />
      </Canvas>
    </div>
  );
}
