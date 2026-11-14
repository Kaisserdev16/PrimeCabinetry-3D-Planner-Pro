import React from 'react';
import { useStore } from '../store/useStore';

export const Wall3D: React.FC = () => {
  const { roomWidth, roomLength, wallHeight, wallColor } = useStore();
  const wallThickness = 4; // 4 inches thick wall

  return (
    <group>
      {/* Back Wall */}
      <mesh 
        position={[0, wallHeight / 2, -roomLength / 2 - wallThickness / 2]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[roomWidth + wallThickness * 2, wallHeight, wallThickness]} />
        <meshStandardMaterial 
          color={wallColor} 
          roughness={0.9} 
          metalness={0.05} 
        />
      </mesh>

      {/* Left Wall */}
      <mesh 
        position={[-roomWidth / 2 - wallThickness / 2, wallHeight / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[wallThickness, wallHeight, roomLength]} />
        <meshStandardMaterial 
          color={wallColor} 
          roughness={0.9} 
          metalness={0.05} 
        />
      </mesh>

      {/* Visual Wall baseboards (base molding) */}
      {/* Back Wall Molding */}
      <mesh 
        position={[0, 2, -roomLength / 2 + 0.1]} 
        castShadow
      >
        <boxGeometry args={[roomWidth, 4, 0.5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      
      {/* Left Wall Molding */}
      <mesh 
        position={[-roomWidth / 2 + 0.1, 2, 0]} 
        castShadow
      >
        <boxGeometry args={[0.5, 4, roomLength]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </group>
  );
};
