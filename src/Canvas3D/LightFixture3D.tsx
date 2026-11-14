import React from 'react';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import type { CabinetItem } from '../store/useStore';

interface LightFixture3DProps {
  item: CabinetItem;
  onDragStart: (id: string, event: any) => void;
}

export const LightFixture3D: React.FC<LightFixture3DProps> = ({ item, onDragStart }) => {
  const { selectedItemId, setSelectedItemId, wallHeight } = useStore();
  const isSelected = selectedItemId === item.id;

  const bulbY = item.position[1];
  const ceilingY = wallHeight;
  const cableLength = Math.max(5, ceilingY - bulbY);

  const glassMaterial = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    emissive: '#fafaf9',
    emissiveIntensity: 1.2,
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.9,
  });

  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: '#e4e4e7',
    roughness: 0.1,
    metalness: 0.9,
  });

  return (
    <group
      position={[item.position[0], 0, item.position[2]]}
      onPointerDown={(e) => {
        e.stopPropagation();
        setSelectedItemId(item.id);
        onDragStart(item.id, e);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'grab';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Ceiling canopy plate mount */}
      <mesh position={[0, ceilingY - 0.5, 0]} castShadow>
        <cylinderGeometry args={[4, 4, 1, 16]} />
        <primitive object={chromeMaterial} attach="material" />
      </mesh>

      {/* Hanging Cable */}
      <mesh position={[0, ceilingY - cableLength / 2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, cableLength, 8]} />
        <meshStandardMaterial color="#18181b" roughness={0.7} />
      </mesh>

      {/* Light Fixture Chrome Cup */}
      <mesh position={[0, bulbY + 3.5, 0]} castShadow>
        <cylinderGeometry args={[1, 2, 1.5, 16]} />
        <primitive object={chromeMaterial} attach="material" />
      </mesh>

      {/* Glowing Glass Orb Bulb */}
      <group position={[0, bulbY, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[4, 32, 32]} />
          <primitive object={glassMaterial} attach="material" />
        </mesh>

        {/* Real PointLight to cast actual light on elements below */}
        <pointLight 
          color="#fef08a" 
          intensity={0.6} 
          distance={150} 
          decay={1.5}
          castShadow
          shadow-bias={-0.002}
        />
      </group>

      {/* Selection bounding box */}
      {isSelected && (
        <mesh position={[0, bulbY + (cableLength / 2), 0]}>
          <boxGeometry args={[10, cableLength + 8, 10]} />
          <meshBasicMaterial 
            color="#8b5cf6" 
            wireframe 
            transparent 
            opacity={0.6} 
          />
        </mesh>
      )}
    </group>
  );
};
