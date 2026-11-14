import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { textureGenerator } from '../utils/textureGenerator';

export const Floor3D: React.FC = () => {
  const { roomWidth, roomLength, floorTexture, showGrid } = useStore();

  // Create or retrieve floor texture based on store selection
  const texture = useMemo(() => {
    let tex: THREE.CanvasTexture;
    if (floorTexture === 'wood_light') {
      tex = textureGenerator.createWood(false);
    } else if (floorTexture === 'wood_dark') {
      tex = textureGenerator.createWood(true);
    } else if (floorTexture === 'tile_grey') {
      tex = textureGenerator.createTile('#3f3f46', '#27272a');
    } else if (floorTexture === 'tile_white') {
      tex = textureGenerator.createTile('#f4f4f5', '#e4e4e7');
    } else {
      tex = textureGenerator.createWood(false);
    }

    // Configure repeat pattern based on dimensions (roughly one repeat per 48 inches)
    tex.repeat.set(roomWidth / 48, roomLength / 48);
    tex.needsUpdate = true;
    return tex;
  }, [floorTexture, roomWidth, roomLength]);

  return (
    <group>
      {/* Floor mesh */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial 
          map={texture} 
          roughness={floorTexture.startsWith('wood') ? 0.4 : 0.2} 
          metalness={0.05} 
        />
      </mesh>

      {/* Grid overlay for 2D planning alignment */}
      {showGrid && (
        <gridHelper 
          args={[Math.max(roomWidth, roomLength) * 1.5, Math.floor(Math.max(roomWidth, roomLength) / 12), '#8b5cf6', '#cbd5e1']}
          position={[0, 0.1, 0]}
        />
      )}
    </group>
  );
};
