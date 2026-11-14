import React, { useState, useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { Floor3D } from '../Canvas3D/Floor3D';
import { Wall3D } from '../Canvas3D/Wall3D';
import { Cabinet3D } from '../Canvas3D/Cabinet3D';
import { Appliance3D } from '../Canvas3D/Appliance3D';
import { LightFixture3D } from '../Canvas3D/LightFixture3D';
import { Measurements3D } from '../Canvas3D/Measurements3D';

export const CanvasView: React.FC = () => {
  const { 
    viewMode, 
    placedItems, 
    roomWidth, 
    roomLength,
    updateItemPosition,
    pushHistoryState
  } = useStore();


  const { camera } = useThree();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [controlsEnabled, setControlsEnabled] = useState(true);

  // References
  const orbitRef = useRef<any>(null);
  const dragPlaneRef = useRef<THREE.Mesh>(null);

  // Offset between click point and item position
  const dragOffsetRef = useRef<THREE.Vector3>(new THREE.Vector3());

  // Automatically adjust camera based on 2D / 3D mode
  useEffect(() => {
    if (viewMode === '2d') {
      // Top down orthographic-style camera
      camera.position.set(0, 220, 0.1);
      camera.lookAt(0, 0, 0);
      if (orbitRef.current) {
        orbitRef.current.target.set(0, 0, 0);
      }
    } else {
      // Perspective showroom view
      camera.position.set(0, 150, 200);
      camera.lookAt(0, 30, 0);
      if (orbitRef.current) {
        orbitRef.current.target.set(0, 30, 0);
      }
    }
  }, [viewMode, camera]);

  // Handle Drag Start
  const handleDragStart = (id: string, event: any) => {
    setDraggedId(id);
    setControlsEnabled(false); // disable orbital rotation while dragging

    const item = placedItems.find(i => i.id === id);
    if (item && event.point) {
      // Calculate offset of click relative to item's current position
      const itemPos = new THREE.Vector3(...item.position);
      dragOffsetRef.current.copy(event.point).sub(itemPos);
    }
  };

  // Handle Drag Move (triggered by pointer move on a large invisible floor plane)
  const handleDragMove = (event: any) => {
    if (!draggedId || !event.point) return;

    const item = placedItems.find(i => i.id === draggedId);
    if (!item) return;

    // Calculate new raw coordinates by subtracting drag click offset
    const targetPoint = event.point.clone().sub(dragOffsetRef.current);
    let newX = targetPoint.x;
    let newZ = targetPoint.z;
    const newY = item.position[1]; // keep original height elevation

    // Cabinet dimensions & rotation orientation
    const ry = item.rotation[1];
    const isRotated = Math.abs(Math.sin(ry)) > 0.707;
    const itemW = isRotated ? item.dimensions.depth : item.dimensions.width;
    const itemD = isRotated ? item.dimensions.width : item.dimensions.depth;

    const snapThreshold = 10; // inches threshold to trigger wall snap

    // 1. WALL SNAPPING
    // Back Wall (z = -roomLength/2)
    const backWallZ = -roomLength / 2;
    if (Math.abs((newZ - itemD / 2) - backWallZ) < snapThreshold) {
      newZ = backWallZ + itemD / 2;
    }
    // Front Wall (z = roomLength/2)
    const frontWallZ = roomLength / 2;
    if (Math.abs((newZ + itemD / 2) - frontWallZ) < snapThreshold) {
      newZ = frontWallZ - itemD / 2;
    }
    // Left Wall (x = -roomWidth/2)
    const leftWallX = -roomWidth / 2;
    if (Math.abs((newX - itemW / 2) - leftWallX) < snapThreshold) {
      newX = leftWallX + itemW / 2;
    }
    // Right Wall (x = roomWidth/2)
    const rightWallX = roomWidth / 2;
    if (Math.abs((newX + itemW / 2) - rightWallX) < snapThreshold) {
      newX = rightWallX - itemW / 2;
    }

    // 2. CABINET SIDE-BY-SIDE SNAPPING (LEGO SNAP)
    placedItems.forEach((other) => {
      if (other.id === draggedId) return;

      const otherRy = other.rotation[1];
      const otherRotated = Math.abs(Math.sin(otherRy)) > 0.707;
      const otherW = otherRotated ? other.dimensions.depth : other.dimensions.width;
      const otherD = otherRotated ? other.dimensions.width : other.dimensions.depth;

      // Are they aligned along the same depth/row? (e.g. both against the back wall)
      const sameZRow = Math.abs(newZ - other.position[2]) < 6;
      const sameXCol = Math.abs(newX - other.position[0]) < 6;

      if (sameZRow) {
        // Snapping our right edge to their left edge
        const ourRightTheirLeft = (newX + itemW / 2) - (other.position[0] - otherW / 2);
        if (Math.abs(ourRightTheirLeft) < snapThreshold) {
          newX = other.position[0] - otherW / 2 - itemW / 2;
          newZ = other.position[2]; // perfectly align depth
        }

        // Snapping our left edge to their right edge
        const ourLeftTheirRight = (newX - itemW / 2) - (other.position[0] + otherW / 2);
        if (Math.abs(ourLeftTheirRight) < snapThreshold) {
          newX = other.position[0] + otherW / 2 + itemW / 2;
          newZ = other.position[2]; // perfectly align depth
        }
      }

      if (sameXCol) {
        // Snapping our front edge to their back edge
        const ourFrontTheirBack = (newZ + itemD / 2) - (other.position[2] - otherD / 2);
        if (Math.abs(ourFrontTheirBack) < snapThreshold) {
          newZ = other.position[2] - otherD / 2 - itemD / 2;
          newX = other.position[0]; // perfectly align column
        }

        // Snapping our back edge to their front edge
        const ourBackTheirFront = (newZ - itemD / 2) - (other.position[2] + otherD / 2);
        if (Math.abs(ourBackTheirFront) < snapThreshold) {
          newZ = other.position[2] + otherD / 2 + itemD / 2;
          newX = other.position[0]; // perfectly align column
        }
      }
    });

    // 3. BOUNDARY CLAMPING
    // Keep items fully inside the room dimensions
    const maxBoundX = roomWidth / 2 - itemW / 2;
    const maxBoundZ = roomLength / 2 - itemD / 2;

    newX = Math.max(-maxBoundX, Math.min(maxBoundX, newX));
    newZ = Math.max(-maxBoundZ, Math.min(maxBoundZ, newZ));

    // Update position in Zustand store
    updateItemPosition(draggedId, [newX, newY, newZ]);
  };

  // Handle Drag End
  const handleDragEnd = () => {
    if (draggedId) {
      pushHistoryState(); // commit transaction to undo/redo history
      setDraggedId(null);
    }
    setControlsEnabled(true); // re-enable camera orbit controls
  };

  return (
    <group>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[150, 200, 100]}
        intensity={0.7}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={600}
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
        shadow-bias={-0.0005}
      />
      
      {/* Subtle fill point light for shadow softening */}
      <pointLight position={[-100, 120, -100]} intensity={0.2} />

      {/* Orbit Navigation Controls */}
      <OrbitControls
        ref={orbitRef}
        enabled={controlsEnabled}
        // If in 2D mode, lock polar angle to face top-down and disable vertical rotation
        minPolarAngle={viewMode === '2d' ? 0 : 0.1}
        maxPolarAngle={viewMode === '2d' ? 0 : Math.PI / 2.1}
        enableRotate={viewMode === '3d'}
        // Set limits to prevent panning infinitely away
        maxDistance={500}
        minDistance={30}
      />

      {/* Renders Floor & Grid */}
      <Floor3D />

      {/* Renders L-Shape Corner Walls */}
      <Wall3D />

      {/* Placed Catalog Items */}
      {placedItems.map((item) => {
        if (item.type === 'base' || item.type === 'wall' || item.type === 'tall') {
          return (
            <Cabinet3D 
              key={item.id} 
              item={item} 
              onDragStart={handleDragStart} 
            />
          );
        } else if (item.type === 'appliance') {
          return (
            <Appliance3D 
              key={item.id} 
              item={item} 
              onDragStart={handleDragStart} 
            />
          );
        } else if (item.type === 'finishing') {
          return (
            <LightFixture3D 
              key={item.id} 
              item={item} 
              onDragStart={handleDragStart} 
            />
          );
        }
        return null;
      })}

      {/* Dynamic 3D Measurement overlay arrows/billboards */}
      <Measurements3D />

      {/* Raycast floor plane receiver to capture drag tracking */}
      <mesh
        ref={dragPlaneRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]} // slightly below floor
        visible={false} // invisible, only for mouse events
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerOut={handleDragEnd}
      >
        <planeGeometry args={[roomWidth * 3, roomLength * 3]} />
        <meshBasicMaterial transparent opacity={0.1} />
      </mesh>
    </group>
  );
};
export default CanvasView;
