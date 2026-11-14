import React from 'react';
import { Canvas } from '@react-three/fiber';
import { CanvasView } from './CanvasView';

export const PlannerCanvas: React.FC = () => {
  return (
    <div className="flex-1 h-full w-full bg-slate-50 relative outline-none select-none">
      <Canvas
        shadows
        // Camera setup - 1 unit in ThreeJS will be 1 inch.
        // A typical view starts a bit back and up.
        camera={{
          position: [0, 150, 200],
          fov: 50,
          near: 0.1,
          far: 2000,
        }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <CanvasView />
      </Canvas>
    </div>
  );
};
export default PlannerCanvas;
