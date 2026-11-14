import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PlannerCanvas } from './components/PlannerCanvas';
import { Toolbar } from './components/Toolbar';
import { useStore } from './store/useStore';

export const App: React.FC = () => {
  const { addItem } = useStore();

  // Populate some default items on initial load so the canvas isn't blank
  useEffect(() => {
    // 33" Double Oven Cabinet against back wall (left)
    addItem({
      sku: 'T338424',
      name: '33" Double Oven Cabinet',
      type: 'tall',
      category: 'Oven/Pantry Cabinets',
      dimensions: { width: 33, height: 84, depth: 24 },
      position: [-50, 42, -72 + 12], // backed against back wall, left side
      rotation: [0, 0, 0],
      price: 730,
      color: '#ffffff'
    });

    // 30" Double Door Base Cabinet next to oven cabinet
    addItem({
      sku: 'B333424',
      name: '33" Double Door Base Cabinet',
      type: 'base',
      category: 'Base Cabinets',
      dimensions: { width: 33, height: 34.5, depth: 24 },
      position: [-50 + 16.5 + 16.5, 17.25, -72 + 12],
      rotation: [0, 0, 0],
      price: 420,
      color: '#ffffff'
    });

    // 30" Range Hood Canopy mounted high
    addItem({
      sku: 'HOD3018',
      name: '30" Range Hood Canopy',
      type: 'appliance',
      category: 'Ventilation',
      dimensions: { width: 30, height: 24, depth: 20 },
      position: [20, 60, -72 + 10], // hanging on back wall
      rotation: [0, 0, 0],
      price: 590,
      color: '#ffffff'
    });

    // Glass Orb Pendant Light over the center
    addItem({
      sku: 'PND0985',
      name: 'Pendant Glass Orb Light',
      type: 'finishing',
      category: 'Lighting',
      dimensions: { width: 10, height: 85, depth: 10 },
      position: [40, 45, 0], // hanging from ceiling, right side
      rotation: [0, 0, 0],
      price: 160,
      color: '#ffffff'
    });
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-zinc-100 text-zinc-900">
      {/* Top Navigation / Brand Bar */}
      <Header />

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Side: Layout, Style, & Cabinet Catalogs */}
        <Sidebar />

        {/* Center/Right: Interactive 3D Room planner viewport */}
        <div className="flex-1 h-full relative">
          <PlannerCanvas />

          {/* Floating bottom dashboard controller */}
          <Toolbar />
        </div>
      </div>
    </div>
  );
};

export default App;
