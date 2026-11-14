import React from 'react';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import type { CabinetItem } from '../store/useStore';

interface Appliance3DProps {
  item: CabinetItem;
  onDragStart: (id: string, event: any) => void;
}

export const Appliance3D: React.FC<Appliance3DProps> = ({ item, onDragStart }) => {
  const { selectedItemId, setSelectedItemId } = useStore();
  const isSelected = selectedItemId === item.id;
  const { width, height, depth } = item.dimensions;

  // Materials
  const stainlessMaterial = new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    roughness: 0.15,
    metalness: 0.95,
  });

  const blackMetalMaterial = new THREE.MeshStandardMaterial({
    color: '#18181b',
    roughness: 0.4,
    metalness: 0.8,
  });

  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: '#f1f5f9',
    roughness: 0.05,
    metalness: 1.0,
  });

  const glassMaterial = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.8,
  });

  // Refrigerator rendering
  const renderRefrigerator = () => {
    return (
      <group>
        {/* Main Fridge Cabinet */}
        <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, height, depth]} />
          <primitive object={blackMetalMaterial} attach="material" />
        </mesh>

        {/* Stainless Steel Doors */}
        {/* Left Door */}
        <group position={[-width / 4 + 0.1, height * 0.55, depth / 2 + 0.4]}>
          <mesh castShadow>
            <boxGeometry args={[width / 2 - 0.3, height * 0.7 - 0.2, 0.8]} />
            <primitive object={stainlessMaterial} attach="material" />
          </mesh>
          {/* Handle */}
          <mesh position={[width / 4 - 2, 0, 0.6]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 20, 8]} />
            <primitive object={chromeMaterial} attach="material" />
          </mesh>
        </group>

        {/* Right Door */}
        <group position={[width / 4 - 0.1, height * 0.55, depth / 2 + 0.4]}>
          <mesh castShadow>
            <boxGeometry args={[width / 2 - 0.3, height * 0.7 - 0.2, 0.8]} />
            <primitive object={stainlessMaterial} attach="material" />
          </mesh>
          {/* Handle */}
          <mesh position={[-width / 4 + 2, 0, 0.6]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 20, 8]} />
            <primitive object={chromeMaterial} attach="material" />
          </mesh>
        </group>

        {/* Bottom Freezer Drawer */}
        <group position={[0, height * 0.16, depth / 2 + 0.4]}>
          <mesh castShadow>
            <boxGeometry args={[width - 0.4, height * 0.28, 0.8]} />
            <primitive object={stainlessMaterial} attach="material" />
          </mesh>
          {/* Horizontal Handle */}
          <mesh position={[0, 2, 0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, width - 12, 8]} />
            <primitive object={chromeMaterial} attach="material" />
          </mesh>
        </group>
      </group>
    );
  };

  // Range Hood Canopy rendering
  const renderRangeHood = () => {
    const chimneyWidth = width * 0.4;
    const chimneyHeight = 96 - item.position[1] - height / 2; // dynamic to ceiling
    const canopyHeight = height;

    return (
      <group>
        {/* Trapezoidal Canopy Base */}
        <mesh position={[0, canopyHeight / 4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <cylinderGeometry 
            args={[chimneyWidth / 2 + 1, width / 2, canopyHeight / 2, 4, 1, false, Math.PI / 4]} 
          />
          <primitive object={stainlessMaterial} attach="material" />
        </mesh>
        
        {/* Chimney Duct flue up to ceiling */}
        <mesh position={[0, canopyHeight / 2 + chimneyHeight / 2, -2]} castShadow>
          <boxGeometry args={[chimneyWidth, chimneyHeight, depth * 0.7]} />
          <primitive object={stainlessMaterial} attach="material" />
        </mesh>

        {/* Muted filter screen mesh under canopy */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[width - 2, depth - 2]} />
          <primitive object={blackMetalMaterial} attach="material" />
        </mesh>
      </group>
    );
  };

  // Gas Cooktop Range Oven rendering
  const renderGasRange = () => {
    return (
      <group>
        {/* Cooktop Body */}
        <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, height, depth]} />
          <primitive object={blackMetalMaterial} attach="material" />
        </mesh>

        {/* Burners (steel disks) */}
        {[-8, 8].map((x) => 
          [-6, 6].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, height + 0.3, z]}>
              <cylinderGeometry args={[2.5, 2.5, 0.3, 16]} />
              <primitive object={chromeMaterial} attach="material" />
            </mesh>
          ))
        )}

        {/* Oven Door Front */}
        <group position={[0, height * 0.45, depth / 2 + 0.25]}>
          <mesh castShadow>
            <boxGeometry args={[width - 1, height * 0.65, 0.5]} />
            <primitive object={stainlessMaterial} attach="material" />
          </mesh>
          
          {/* Glass window pane */}
          <mesh position={[0, 1, 0.3]}>
            <boxGeometry args={[width - 8, height * 0.35, 0.1]} />
            <primitive object={glassMaterial} attach="material" />
          </mesh>

          {/* Oven Handle */}
          <mesh position={[0, height * 0.24, 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, width - 8, 8]} />
            <primitive object={chromeMaterial} attach="material" />
          </mesh>
        </group>

        {/* Control Knobs panel */}
        <group position={[0, height - 2.5, depth / 2 + 0.3]}>
          {/* Knobs */}
          {[-10, -5, 0, 5, 10].map((kX, idx) => (
            <mesh key={idx} position={[kX, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.6, 0.6, 0.5, 12]} />
              <primitive object={chromeMaterial} attach="material" />
            </mesh>
          ))}
        </group>
      </group>
    );
  };

  // Dishwasher rendering
  const renderDishwasher = () => {
    return (
      <group>
        {/* Main Body */}
        <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, height, depth]} />
          <primitive object={blackMetalMaterial} attach="material" />
        </mesh>

        {/* Stainless Steel door */}
        <mesh position={[0, height / 2 - 2, depth / 2 + 0.25]} castShadow>
          <boxGeometry args={[width - 0.4, height - 4.5, 0.5]} />
          <primitive object={stainlessMaterial} attach="material" />
        </mesh>

        {/* Black control bar at the top */}
        <mesh position={[0, height - 1.5, depth / 2 + 0.25]}>
          <boxGeometry args={[width - 0.4, 2, 0.52]} />
          <primitive object={blackMetalMaterial} attach="material" />
        </mesh>
        
        {/* Chrome strip handle */}
        <mesh position={[0, height - 4, depth / 2 + 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, width - 8, 8]} />
          <primitive object={chromeMaterial} attach="material" />
        </mesh>
      </group>
    );
  };

  return (
    <group
      position={item.position}
      rotation={item.rotation}
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
      {(() => {
        const sku = item.sku || '';
        return (
          <>
            {sku.startsWith('REF') && renderRefrigerator()}
            {sku.startsWith('HOD') && renderRangeHood()}
            {sku.startsWith('RNG') && renderGasRange()}
            {sku.startsWith('DSH') && renderDishwasher()}
          </>
        );
      })()}

      {/* Selection bounding box */}
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
