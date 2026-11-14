import React from 'react';
import { Line, Html } from '@react-three/drei';
import { useStore } from '../store/useStore';

export const Measurements3D: React.FC = () => {
  const { placedItems, selectedItemId, roomWidth, roomLength } = useStore();

  const selectedItem = placedItems.find((item) => item.id === selectedItemId);

  if (!selectedItem) return null;

  const { position, rotation, dimensions } = selectedItem;
  const [x, y, z] = position;
  const ry = rotation[1];

  // Determine actual width/depth projection based on rotation
  // Simple check for 90-degree rotations
  const isRotated = Math.abs(Math.sin(ry)) > 0.707;
  const projWidth = isRotated ? dimensions.depth : dimensions.width;
  const projDepth = isRotated ? dimensions.width : dimensions.depth;

  // Bounding box edges on X and Z axes
  const minX = x - projWidth / 2;
  const minZ = z - projDepth / 2;

  // Distances to Back Wall (z = -roomLength/2) and Left Wall (x = -roomWidth/2)
  const leftWallX = -roomWidth / 2;
  const backWallZ = -roomLength / 2;

  const distToLeft = minX - leftWallX;
  const distToBack = minZ - backWallZ;

  // Elevation where we draw the measurement line (usually center of item height)
  const lineY = y;

  // Midpoints for HTML label positioning
  const midLeftX = (leftWallX + minX) / 2;
  const midBackZ = (backWallZ + minZ) / 2;

  return (
    <group>
      {/* 1. Line to Left Wall */}
      {distToLeft > 1 && (
        <group>
          {/* Cyan line from left wall to cabinet edge */}
          <Line
            points={[
              [leftWallX, lineY, z],
              [minX, lineY, z]
            ]}
            color="#22d3ee" // Cyan 400
            lineWidth={2.5}
          />
          
          {/* Small perpendicular tick at left wall */}
          <Line
            points={[
              [leftWallX, lineY, z - 3],
              [leftWallX, lineY, z + 3]
            ]}
            color="#0891b2" // Cyan 600
            lineWidth={3}
          />

          {/* Small perpendicular tick at cabinet edge */}
          <Line
            points={[
              [minX, lineY, z - 3],
              [minX, lineY, z + 3]
            ]}
            color="#0891b2"
            lineWidth={3}
          />

          {/* HTML measurement text label badge */}
          <Html position={[midLeftX, lineY + 6, z]} center distanceFactor={150}>
            <div className="bg-white text-cyan-950 font-extrabold text-[10px] px-2.5 py-1 rounded-full border border-cyan-300 shadow-md whitespace-nowrap select-none flex items-center gap-0.5">
              <span>{Math.round(distToLeft)}</span>
              <span className="text-[8px] text-cyan-600 font-semibold">in</span>
            </div>
          </Html>
        </group>
      )}

      {/* 2. Line to Back Wall */}
      {distToBack > 1 && (
        <group>
          {/* Cyan line from back wall to cabinet edge */}
          <Line
            points={[
              [x, lineY, backWallZ],
              [x, lineY, minZ]
            ]}
            color="#22d3ee"
            lineWidth={2.5}
          />

          {/* Small perpendicular tick at back wall */}
          <Line
            points={[
              [x - 3, lineY, backWallZ],
              [x + 3, lineY, backWallZ]
            ]}
            color="#0891b2"
            lineWidth={3}
          />

          {/* Small perpendicular tick at cabinet edge */}
          <Line
            points={[
              [x - 3, lineY, minZ],
              [x + 3, lineY, minZ]
            ]}
            color="#0891b2"
            lineWidth={3}
          />

          {/* HTML measurement text label badge */}
          <Html position={[x, lineY + 6, midBackZ]} center distanceFactor={150}>
            <div className="bg-white text-cyan-950 font-extrabold text-[10px] px-2.5 py-1 rounded-full border border-cyan-300 shadow-md whitespace-nowrap select-none flex items-center gap-0.5">
              <span>{Math.round(distToBack)}</span>
              <span className="text-[8px] text-cyan-600 font-semibold">in</span>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
};
export default Measurements3D;
