import React from 'react';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import type { CabinetItem } from '../store/useStore';

interface Cabinet3DProps {
  item: CabinetItem;
  onDragStart: (id: string, event: any) => void;
}

export const Cabinet3D: React.FC<Cabinet3DProps> = ({ item, onDragStart }) => {
  const { selectedItemId, setSelectedItemId, countertopColor } = useStore();
  const isSelected = selectedItemId === item.id;

  const { width, height, depth } = item.dimensions;
  const cabColor = item.color || '#ffffff';

  // Materials
  const woodMaterial = new THREE.MeshStandardMaterial({
    color: cabColor,
    roughness: 0.6,
    metalness: 0.05,
  });

  const handleMaterial = new THREE.MeshStandardMaterial({
    color: '#a1a1aa',
    roughness: 0.1,
    metalness: 0.9,
  });

  const countertopMaterial = new THREE.MeshStandardMaterial({
    color: countertopColor,
    roughness: 0.2,
    metalness: 0.1,
  });

  const toeKickMaterial = new THREE.MeshStandardMaterial({
    color: '#27272a',
    roughness: 0.8,
  });

  // Base Cabinet rendering
  const renderBaseCabinet = () => {
    const toeKickHeight = 4;
    const bodyHeight = height - toeKickHeight - 1.5; // exclude toe-kick and countertop
    const isDoubleDoor = width >= 24;

    return (
      <group>
        {/* Recessed Toe Kick base */}
        <mesh position={[0, toeKickHeight / 2, bodyHeight / 2 - 22 / 2 - 1]} castShadow receiveShadow>
          <boxGeometry args={[width - 0.2, toeKickHeight, depth - 3]} />
          <primitive object={toeKickMaterial} attach="material" />
        </mesh>

        {/* Cabinet Body */}
        <mesh position={[0, bodyHeight / 2 + toeKickHeight, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, bodyHeight, depth]} />
          <primitive object={woodMaterial} attach="material" />
        </mesh>

        {/* Shaker Doors */}
        {isDoubleDoor ? (
          // Left Door
          <group position={[-width / 4, bodyHeight / 2 + toeKickHeight, depth / 2 + 0.35]}>
            <mesh castShadow>
              <boxGeometry args={[width / 2 - 0.4, bodyHeight - 1, 0.7]} />
              <primitive object={woodMaterial} attach="material" />
            </mesh>
            {/* Left Handle */}
            <mesh position={[width / 4 - 2, 6, 0.6]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 4, 8]} />
              <primitive object={handleMaterial} attach="material" />
            </mesh>
          </group>
        ) : (
          // Single Door
          <group position={[0, bodyHeight / 2 + toeKickHeight, depth / 2 + 0.35]}>
            <mesh castShadow>
              <boxGeometry args={[width - 0.4, bodyHeight - 1, 0.7]} />
              <primitive object={woodMaterial} attach="material" />
            </mesh>
            {/* Handle */}
            <mesh position={[width / 2 - 2, 6, 0.6]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 4, 8]} />
              <primitive object={handleMaterial} attach="material" />
            </mesh>
          </group>
        )}

        {/* Countertop Marble Slab */}
        <mesh position={[0, height - 1.5 / 2, 0.5]} castShadow receiveShadow>
          <boxGeometry args={[width + 0.4, 1.5, depth + 1]} />
          <primitive object={countertopMaterial} attach="material" />
        </mesh>
      </group>
    );
  };

  // Wall Cabinet rendering
  const renderWallCabinet = () => {
    const isDoubleDoor = width >= 24;

    return (
      <group>
        {/* Cabinet Body */}
        <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, height, depth]} />
          <primitive object={woodMaterial} attach="material" />
        </mesh>

        {/* Shaker Doors */}
        {isDoubleDoor ? (
          <group>
            {/* Left Door */}
            <group position={[-width / 4, height / 2, depth / 2 + 0.35]}>
              <mesh castShadow>
                <boxGeometry args={[width / 2 - 0.4, height - 0.8, 0.7]} />
                <primitive object={woodMaterial} attach="material" />
              </mesh>
              {/* Handle */}
              <mesh position={[width / 4 - 2, -height / 4, 0.6]} castShadow>
                <cylinderGeometry args={[0.12, 0.12, 3, 8]} />
                <primitive object={handleMaterial} attach="material" />
              </mesh>
            </group>
            {/* Right Door */}
            <group position={[width / 4, height / 2, depth / 2 + 0.35]}>
              <mesh castShadow>
                <boxGeometry args={[width / 2 - 0.4, height - 0.8, 0.7]} />
                <primitive object={woodMaterial} attach="material" />
              </mesh>
              {/* Handle */}
              <mesh position={[-width / 4 + 2, -height / 4, 0.6]} castShadow>
                <cylinderGeometry args={[0.12, 0.12, 3, 8]} />
                <primitive object={handleMaterial} attach="material" />
              </mesh>
            </group>
          </group>
        ) : (
          // Single Door
          <group position={[0, height / 2, depth / 2 + 0.35]}>
            <mesh castShadow>
              <boxGeometry args={[width - 0.4, height - 0.8, 0.7]} />
              <primitive object={woodMaterial} attach="material" />
            </mesh>
            {/* Handle */}
            <mesh position={[width / 2 - 2, -height / 4, 0.6]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 3, 8]} />
              <primitive object={handleMaterial} attach="material" />
            </mesh>
          </group>
        )}
      </group>
    );
  };

  // Tall Cabinet (Oven/Pantry Stack) rendering
  const renderTallCabinet = () => {
    const toeKickHeight = 4;
    const bodyHeight = height - toeKickHeight;

    // Check if it's an oven cabinet (sku starting with T338 or similar)
    const isOvenCabinet = item.sku?.includes('Oven') || item.name.toLowerCase().includes('oven');

    return (
      <group>
        {/* Recessed Toe Kick base */}
        <mesh position={[0, toeKickHeight / 2, bodyHeight / 2 - 22 / 2 - 1]} castShadow receiveShadow>
          <boxGeometry args={[width - 0.2, toeKickHeight, depth - 3]} />
          <primitive object={toeKickMaterial} attach="material" />
        </mesh>

        {/* Main Tall Body */}
        <mesh position={[0, bodyHeight / 2 + toeKickHeight, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, bodyHeight, depth]} />
          <primitive object={woodMaterial} attach="material" />
        </mesh>

        {isOvenCabinet ? (
          // Oven configuration: top doors, orange-ish wood center cutout, bottom drawers
          <group>
            {/* Top Double Doors */}
            <mesh position={[0, bodyHeight - 12 + toeKickHeight, depth / 2 + 0.35]} castShadow>
              <boxGeometry args={[width - 0.4, 20, 0.7]} />
              <primitive object={woodMaterial} attach="material" />
            </mesh>
            <mesh position={[width / 4 - 1.5, bodyHeight - 12 + toeKickHeight, depth / 2 + 0.85]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 3, 8]} />
              <primitive object={handleMaterial} attach="material" />
            </mesh>

            {/* Oven cut-out space (represented by a wood panel insert) */}
            <mesh position={[0, bodyHeight - 32 + toeKickHeight, depth / 2 + 0.1]} castShadow>
              <boxGeometry args={[width - 2, 24, 0.6]} />
              <meshStandardMaterial color="#d97706" roughness={0.4} metalness={0.1} /> {/* Wood panel accent */}
            </mesh>
            {/* Simulated oven border shadow */}
            <mesh position={[0, bodyHeight - 32 + toeKickHeight, depth / 2 + 0.4]}>
              <boxGeometry args={[width - 4, 20, 0.2]} />
              <meshStandardMaterial color="#1f2937" roughness={0.9} />
            </mesh>

            {/* Bottom drawers */}
            <mesh position={[0, bodyHeight - 54 + toeKickHeight, depth / 2 + 0.35]} castShadow>
              <boxGeometry args={[width - 0.4, 15, 0.7]} />
              <primitive object={woodMaterial} attach="material" />
            </mesh>
            <mesh position={[0, bodyHeight - 54 + toeKickHeight, depth / 2 + 0.85]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 6, 8]} />
              <primitive object={handleMaterial} attach="material" />
            </mesh>

            {/* Bottom-most drawer */}
            <mesh position={[0, bodyHeight - 72 + toeKickHeight, depth / 2 + 0.35]} castShadow>
              <boxGeometry args={[width - 0.4, 15, 0.7]} />
              <primitive object={woodMaterial} attach="material" />
            </mesh>
            <mesh position={[0, bodyHeight - 72 + toeKickHeight, depth / 2 + 0.85]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 6, 8]} />
              <primitive object={handleMaterial} attach="material" />
            </mesh>
          </group>
        ) : (
          // Pantry configuration: tall vertical shaker door panels
          <group>
            {/* Top Doors */}
            <mesh position={[0, bodyHeight - 20 + toeKickHeight, depth / 2 + 0.35]} castShadow>
              <boxGeometry args={[width - 0.4, 36, 0.7]} />
              <primitive object={woodMaterial} attach="material" />
            </mesh>
            {/* Bottom Doors */}
            <mesh position={[0, bodyHeight - 62 + toeKickHeight, depth / 2 + 0.35]} castShadow>
              <boxGeometry args={[width - 0.4, 44, 0.7]} />
              <primitive object={woodMaterial} attach="material" />
            </mesh>
            {/* Steel pantry handles */}
            <mesh position={[width / 2 - 2, bodyHeight - 30 + toeKickHeight, depth / 2 + 0.85]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 8, 8]} />
              <primitive object={handleMaterial} attach="material" />
            </mesh>
            <mesh position={[width / 2 - 2, bodyHeight - 52 + toeKickHeight, depth / 2 + 0.85]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 8, 8]} />
              <primitive object={handleMaterial} attach="material" />
            </mesh>
          </group>
        )}
      </group>
    );
  };

  return (
    <group
      position={item.position}
      rotation={item.rotation}
      // R3F events for selecting & dragging
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
      {/* Dynamic item geometry */}
      {item.type === 'base' && renderBaseCabinet()}
      {item.type === 'wall' && renderWallCabinet()}
      {item.type === 'tall' && renderTallCabinet()}

      {/* Selection bounding outline box */}
      {isSelected && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[width + 1, height + 1, depth + 1]} />
          <meshBasicMaterial 
            color="#8b5cf6" 
            wireframe 
            transparent 
            opacity={0.7} 
          />
        </mesh>
      )}
    </group>
  );
};
