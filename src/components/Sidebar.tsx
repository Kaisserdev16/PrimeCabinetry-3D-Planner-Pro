import React, { useState } from 'react';
import { 
  Home, 
  DoorOpen, 
  Layers, 
  Cpu, 
  Paintbrush, 
  ClipboardList, 
  ChevronRight, 
  Search, 
  Info,
  Maximize2
} from 'lucide-react';
import { useStore } from '../store/useStore';

type TabType = 'room' | 'door_style' | 'cabinets' | 'appliances' | 'finishing' | 'review';

interface CatalogItem {
  name: string;
  sku: string;
  type: 'base' | 'wall' | 'tall' | 'appliance' | 'finishing';
  category: string;
  width: number;
  height: number;
  depth: number;
  price: number;
}

export const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('cabinets');
  const [cabinetSubcat, setCabinetSubcat] = useState<'all' | 'base' | 'wall' | 'tall'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Store values
  const {
    roomWidth,
    roomLength,
    wallHeight,
    floorTexture,
    wallColor,
    cabinetColor,
    countertopColor,
    placedItems,
    selectedItemId,
    setRoomDimensions,
    setWallHeight,
    setFloorTexture,
    setWallColor,
    setCabinetColor,
    setCountertopColor,
    addItem,
    removeItem,
  } = useStore();

  // Mock catalog of items
  const catalog: CatalogItem[] = [
    // Base Cabinets
    { sku: 'B183424', name: '18" Single Door Base Cabinet', type: 'base', category: 'Base Cabinets', width: 18, height: 34.5, depth: 24, price: 380 },
    { sku: 'B333424', name: '33" Double Door Base Cabinet', type: 'base', category: 'Base Cabinets', width: 33, height: 34.5, depth: 24, price: 420 },
    { sku: 'B363424', name: '36" Sink Base Cabinet', type: 'base', category: 'Base Cabinets', width: 36, height: 34.5, depth: 24, price: 450 },
    { sku: 'BD183424', name: '18" 4-Drawer Base Cabinet', type: 'base', category: 'Base Cabinets', width: 18, height: 34.5, depth: 24, price: 490 },
    
    // Wall Cabinets
    { sku: 'W183012', name: '18" Single Door Wall Cabinet', type: 'wall', category: 'Wall Cabinets', width: 18, height: 30, depth: 12, price: 260 },
    { sku: 'W303012', name: '30" Double Door Wall Cabinet', type: 'wall', category: 'Wall Cabinets', width: 30, height: 30, depth: 12, price: 320 },
    { sku: 'W361512', name: '36" Over-Range Wall Cabinet', type: 'wall', category: 'Wall Cabinets', width: 36, height: 15, depth: 12, price: 290 },
    { sku: 'W363012', name: '36" Double Door Wall Cabinet', type: 'wall', category: 'Wall Cabinets', width: 36, height: 30, depth: 12, price: 350 },
    
    // Tall Pantry Cabinets
    { sku: 'T188424', name: '18" Pantry Tall Cabinet', type: 'tall', category: 'Oven/Pantry Cabinets', width: 18, height: 84, depth: 24, price: 610 },
    { sku: 'T338424', name: '33" Double Oven Cabinet', type: 'tall', category: 'Oven/Pantry Cabinets', width: 33, height: 84, depth: 24, price: 730 },
    { sku: 'T339024', name: '33" Double Oven Cabinet (90H)', type: 'tall', category: 'Oven/Pantry Cabinets', width: 33, height: 90, depth: 24, price: 785 },
    
    // Appliances
    { sku: 'REF3670', name: 'Stainless Steel Refrigerator', type: 'appliance', category: 'Refrigerators', width: 36, height: 72, depth: 30, price: 1850 },
    { sku: 'HOD3018', name: '30" Range Hood Canopy', type: 'appliance', category: 'Ventilation', width: 30, height: 24, depth: 20, price: 590 },
    { sku: 'RNG3036', name: '30" Gas Cooktop Range', type: 'appliance', category: 'Cooking', width: 30, height: 36, depth: 26, price: 1250 },
    { sku: 'DSH2434', name: '24" Built-In Dishwasher', type: 'appliance', category: 'Dishwashers', width: 24, height: 34.5, depth: 24, price: 890 },
    
    // Lighting
    { sku: 'PND0985', name: 'Pendant Glass Orb Light', type: 'finishing', category: 'Lighting', width: 10, height: 85, depth: 10, price: 160 }
  ];

  // Door style catalog
  const doorStyles = [
    { id: 'shaker_white', name: 'Shaker White', color: '#ffffff', image: 'bg-white border border-zinc-300' },
    { id: 'shaker_slate', name: 'Shaker Slate Grey', color: '#4b5563', image: 'bg-gray-600' },
    { id: 'raised_classic', name: 'Raised Antique White', color: '#fef3c7', image: 'bg-amber-50 border border-zinc-200' },
    { id: 'flat_slab_oak', name: 'Flat Slab Natural Oak', color: '#d97706', image: 'bg-amber-600' },
    { id: 'matte_black', name: 'Matte Charcoal Black', color: '#18181b', image: 'bg-zinc-800' }
  ];

  // Countertop colors
  const countertops = [
    { id: 'marble_white', name: 'Carrara Marble White', color: '#f8fafc' },
    { id: 'granite_black', name: 'Absolute Granite Black', color: '#09090b' },
    { id: 'concrete_grey', name: 'Honed Concrete Grey', color: '#71717a' },
    { id: 'wood_butcher', name: 'Butcher Block Maple', color: '#d97706' }
  ];

  // Floor style textures
  const floorStyles = [
    { id: 'wood_light', name: 'Natural Light Oak Wood' },
    { id: 'wood_dark', name: 'Dark Roasted Walnut Wood' },
    { id: 'tile_grey', name: 'Slate Grey Square Tiles' },
    { id: 'tile_white', name: 'Polished Ceramic White Tiles' }
  ];

  // Wall colors
  const wallColors = [
    { id: '#f4f4f5', name: 'Cool Alabaster White' },
    { id: '#eae6df', name: 'Warm Cream Beige' },
    { id: '#dce2e2', name: 'Light Slate Grey-Blue' },
    { id: '#e2e8f0', name: 'Bright Ice White' },
    { id: '#d0dbc5', name: 'Soft Sage Muted Green' }
  ];

  // Filter catalog based on active search & category
  const filteredCatalog = catalog.filter(item => {
    // Tab filtering
    if (activeTab === 'cabinets') {
      if (item.type !== 'base' && item.type !== 'wall' && item.type !== 'tall') return false;
      if (cabinetSubcat !== 'all' && item.type !== cabinetSubcat) return false;
    } else if (activeTab === 'appliances') {
      if (item.type !== 'appliance') return false;
    } else if (activeTab === 'finishing') {
      if (item.type !== 'finishing') return false;
    } else {
      return false; // other tabs do not render catalog items
    }

    // Search query filtering
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
    }

    return true;
  });

  // Handles adding item to center of screen with snapping defaults
  const handleAddItem = (item: CatalogItem) => {
    // Determine default elevations based on type
    let defaultY = 0; // sits on floor
    if (item.type === 'wall') {
      defaultY = 54; // wall cabinet hangs 54 inches off the floor
    } else {
      defaultY = item.height / 2; // procedural center
    }

    // Default position: slightly offset from absolute center to avoid overlap
    const offsetCount = placedItems.length * 6;
    const position: [number, number, number] = [
      (offsetCount % 36) - 18,
      defaultY,
      (offsetCount % 18) - 9
    ];

    addItem({
      sku: item.sku,
      name: item.name,
      type: item.type,
      category: item.category,
      dimensions: {
        width: item.width,
        height: item.height,
        depth: item.depth
      },
      position,
      rotation: [0, 0, 0], // flat facing front
      price: item.price,
      color: cabinetColor,
    });
  };

  return (
    <div className="w-[420px] flex h-full border-r border-zinc-200 bg-white select-none z-10">
      {/* Left Navigation tabs */}
      <div className="w-[80px] bg-zinc-50 border-r border-zinc-200 flex flex-col items-center py-6 gap-6">
        {[
          { id: 'room', label: 'Room Styling', icon: <Home size={20} /> },
          { id: 'door_style', label: 'Door Style', icon: <DoorOpen size={20} /> },
          { id: 'cabinets', label: 'Cabinets', icon: <Layers size={20} /> },
          { id: 'appliances', label: 'Appliances', icon: <Cpu size={20} /> },
          { id: 'finishing', label: 'Finishing', icon: <Paintbrush size={20} /> },
          { id: 'review', label: 'Review & Quote', icon: <ClipboardList size={20} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`w-[68px] py-3 rounded-lg flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-purple-900 text-white shadow-md' 
                : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] font-bold text-center leading-none tracking-wide">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Expanded Catalog / Controls Panel */}
      <div className="flex-1 flex flex-col h-full bg-white">
        
        {/* PANEL HEADER */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-zinc-800 uppercase tracking-wide">
            {activeTab === 'room' && 'Room Details'}
            {activeTab === 'door_style' && 'Door Style'}
            {activeTab === 'cabinets' && 'Cabinets Catalog'}
            {activeTab === 'appliances' && 'Appliances'}
            {activeTab === 'finishing' && 'Finishing Selection'}
            {activeTab === 'review' && 'Review & Quote'}
          </h2>
          <span className="text-zinc-400 text-xs hover:text-zinc-600 cursor-pointer">
            ✕
          </span>
        </div>

        {/* PANEL SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4">
          
          {/* TAB 1: ROOM STYLING */}
          {activeTab === 'room' && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Room Dimensions (inches)</h3>
                
                {/* Room Width Slider */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-medium text-zinc-600 mb-1">
                    <span>Width (Left-Right)</span>
                    <span className="font-bold text-purple-700">{roomWidth}" ({Math.floor(roomWidth/12)} ft {roomWidth%12} in)</span>
                  </div>
                  <input 
                    type="range" 
                    min="96" 
                    max="300" 
                    value={roomWidth}
                    onChange={(e) => setRoomDimensions(parseInt(e.target.value), roomLength)}
                    className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-purple-700"
                  />
                </div>

                {/* Room Length Slider */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-medium text-zinc-600 mb-1">
                    <span>Depth (Front-Back)</span>
                    <span className="font-bold text-purple-700">{roomLength}" ({Math.floor(roomLength/12)} ft {roomLength%12} in)</span>
                  </div>
                  <input 
                    type="range" 
                    min="96" 
                    max="300" 
                    value={roomLength}
                    onChange={(e) => setRoomDimensions(roomWidth, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-purple-700"
                  />
                </div>

                {/* Wall Height Slider */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-medium text-zinc-600 mb-1">
                    <span>Wall Height</span>
                    <span className="font-bold text-purple-700">{wallHeight}" ({Math.floor(wallHeight/12)} ft)</span>
                  </div>
                  <input 
                    type="range" 
                    min="72" 
                    max="120" 
                    value={wallHeight}
                    onChange={(e) => setWallHeight(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-purple-700"
                  />
                </div>
              </div>

              <hr className="border-zinc-100" />

              {/* Room Styling Presets */}
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Layout Styles</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => { setRoomDimensions(192, 144); }}
                    className="flex flex-col items-center p-3 border border-zinc-200 rounded-lg hover:border-purple-600 cursor-pointer bg-zinc-50"
                  >
                    <div className="h-16 w-full bg-zinc-200 rounded mb-2 border border-dashed border-zinc-400 flex items-center justify-center text-[10px] text-zinc-500 font-bold">Rectangular</div>
                    <span className="text-xs font-semibold text-zinc-700">Rectangular Room</span>
                  </button>
                  
                  <button 
                    onClick={() => { setRoomDimensions(240, 180); }}
                    className="flex flex-col items-center p-3 border border-zinc-200 rounded-lg hover:border-purple-600 cursor-pointer bg-zinc-50"
                  >
                    <div className="h-16 w-full bg-zinc-200 rounded mb-2 border-r-4 border-b-4 border-zinc-500 flex items-center justify-center text-[10px] text-zinc-500 font-bold">L-Shape Wall</div>
                    <span className="text-xs font-semibold text-zinc-700">Two Wall Corner</span>
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-amber-700">
                  Changing dimensions will automatically shift existing items to keep them within the bounds of the new wall dimensions.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DOOR STYLE */}
          {activeTab === 'door_style' && (
            <div className="flex flex-col gap-5">
              <p className="text-xs text-zinc-500 mb-2">
                Select your premium shaker door finish. This applies a rich paint or wood finish to all cabinet drawer fronts and doors.
              </p>
              
              <div className="flex flex-col gap-3">
                {doorStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setCabinetColor(style.color)}
                    className={`flex items-center gap-4 p-3.5 border rounded-xl w-full text-left transition-all cursor-pointer ${
                      cabinetColor === style.color 
                        ? 'border-purple-700 bg-purple-50/50 shadow-sm ring-1 ring-purple-700' 
                        : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                    }`}
                  >
                    <div className={`h-12 w-12 rounded-lg ${style.image} shadow-inner flex-shrink-0`} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-800">{style.name}</span>
                      <span className="text-[10px] text-zinc-400 font-medium">Cabinet Paint / Texture finish</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3 & 4: CATALOG ITEM LISTS (CABINETS & APPLIANCES & FINISHING) */}
          {(activeTab === 'cabinets' || activeTab === 'appliances' || activeTab === 'finishing') && (
            <div className="flex flex-col h-full gap-4">
              
              {/* Category-specific filter options for Cabinets */}
              {activeTab === 'cabinets' && (
                <div className="flex flex-wrap gap-1.5 pb-2">
                  {[
                    { id: 'all', label: 'All Cabinets' },
                    { id: 'base', label: 'Base Cabinets' },
                    { id: 'wall', label: 'Wall Cabinets' },
                    { id: 'tall', label: 'Oven/Pantry' }
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setCabinetSubcat(sub.id as any)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                        cabinetSubcat === sub.id 
                          ? 'bg-purple-900 border-purple-900 text-white' 
                          : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Search input */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder={activeTab === 'cabinets' ? "Search cabinets (e.g., 33x84x24)..." : "Search item catalog..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-700"
                />
              </div>

              {/* Catalog list grid */}
              <div className="flex flex-col gap-3 pb-6">
                {filteredCatalog.length === 0 ? (
                  <div className="text-center py-8 text-zinc-400 text-xs">
                    No items found matching the search criteria.
                  </div>
                ) : (
                  filteredCatalog.map((item) => (
                    <div 
                      key={item.sku}
                      className="border border-zinc-200 rounded-xl p-3 flex gap-3 hover:border-purple-600 hover:shadow-sm transition-all"
                    >
                      {/* Thumbnail Placeholder Shape */}
                      <div className="w-16 h-16 bg-zinc-100 border border-zinc-200 rounded-lg flex-shrink-0 flex flex-col items-center justify-center text-zinc-400 text-[10px]">
                        <div className={`w-8 h-8 rounded border border-dashed border-zinc-300 ${
                          item.type === 'base' ? 'bg-amber-100' :
                          item.type === 'wall' ? 'bg-sky-100' :
                          item.type === 'tall' ? 'bg-emerald-100' : 'bg-rose-100'
                        } flex items-center justify-center text-xs font-bold text-zinc-600`}>
                          {item.type[0].toUpperCase()}
                        </div>
                        <span className="mt-1 text-[8px] font-semibold text-zinc-500 uppercase">{item.sku}</span>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-xs font-bold text-zinc-800 leading-tight mb-1">{item.name}</div>
                          
                          {/* Dimensions badges */}
                          <div className="flex gap-2.5 text-[9px] text-zinc-500 font-bold uppercase">
                            <span className="bg-zinc-100 px-1.5 py-0.5 rounded">W {item.width}"</span>
                            <span className="bg-zinc-100 px-1.5 py-0.5 rounded">H {item.height}"</span>
                            <span className="bg-zinc-100 px-1.5 py-0.5 rounded">D {item.depth}"</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-50">
                          <span className="text-xs font-extrabold text-zinc-700">${item.price}</span>
                          <button
                            onClick={() => handleAddItem(item)}
                            className="bg-purple-900 hover:bg-purple-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                          >
                            Add To Design
                            <ChevronRight size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: FINISHING CUSTOMIZATIONS */}
          {activeTab === 'finishing' && (
            <div className="flex flex-col gap-5 pb-6">
              
              {/* Floor Styles */}
              <div>
                <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider mb-2.5">Floor Texture</h3>
                <div className="grid grid-cols-2 gap-2">
                  {floorStyles.map((floor) => (
                    <button
                      key={floor.id}
                      onClick={() => setFloorTexture(floor.id as any)}
                      className={`p-2 border rounded-lg text-left transition-all text-xs font-semibold cursor-pointer ${
                        floorTexture === floor.id 
                          ? 'border-purple-600 bg-purple-50 text-purple-900' 
                          : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      {floor.name}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-zinc-100" />

              {/* Countertop Selection */}
              <div>
                <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider mb-2.5">Countertop Material</h3>
                <div className="grid grid-cols-2 gap-2">
                  {countertops.map((ct) => (
                    <button
                      key={ct.id}
                      onClick={() => setCountertopColor(ct.color)}
                      className={`p-2.5 border rounded-lg flex items-center gap-2 text-left transition-all text-xs font-semibold cursor-pointer ${
                        countertopColor === ct.color 
                          ? 'border-purple-600 bg-purple-50 text-purple-900' 
                          : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <div 
                        className="w-5 h-5 rounded-full border border-zinc-300 shadow-inner flex-shrink-0"
                        style={{ backgroundColor: ct.color }}
                      />
                      <span className="truncate">{ct.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-zinc-100" />

              {/* Wall Paint Colors */}
              <div>
                <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider mb-2.5">Wall Color</h3>
                <div className="flex flex-wrap gap-2.5">
                  {wallColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setWallColor(color.id)}
                      title={color.name}
                      className={`w-9 h-9 rounded-full border shadow-sm relative transition-all cursor-pointer hover:scale-105 ${
                        wallColor === color.id 
                          ? 'ring-2 ring-purple-700 border-white scale-105' 
                          : 'border-zinc-300'
                      }`}
                      style={{ backgroundColor: color.id }}
                    >
                      {wallColor === color.id && (
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-purple-800 font-extrabold">✓</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-zinc-100" />
              
              {/* Add pendant lights */}
              <div>
                <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider mb-2.5">Lighting Fixtures</h3>
                <button
                  onClick={() => handleAddItem(catalog.find(c => c.sku === 'PND0985')!)}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  <Maximize2 size={12} />
                  Add Hanging Pendant Light ($160)
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: REVIEW & QUOTE */}
          {activeTab === 'review' && (
            <div className="flex flex-col gap-4 pb-6">
              <p className="text-xs text-zinc-500">
                Here is the itemized summary of cabinets and appliances currently placed in your 3D floor plan layout.
              </p>

              {placedItems.length === 0 ? (
                <div className="text-center py-12 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl text-zinc-400 text-xs">
                  Your design room is currently empty. Add cabinets or appliances to see details.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-zinc-100 text-[10px] text-zinc-500 font-extrabold uppercase border-b border-zinc-200">
                          <th className="p-3">Item (SKU)</th>
                          <th className="p-3 text-right">Price</th>
                          <th className="p-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 text-xs text-zinc-700">
                        {placedItems.map((item) => (
                          <tr key={item.id} className={selectedItemId === item.id ? 'bg-purple-50/50' : ''}>
                            <td className="p-3 font-medium">
                              <div className="font-bold text-zinc-800 truncate max-w-[180px]">{item.name}</div>
                              <div className="text-[9px] text-zinc-400 font-bold uppercase">{item.sku} | W{item.dimensions.width}" H{item.dimensions.height}"</div>
                            </td>
                            <td className="p-3 text-right font-bold text-zinc-800">${item.price}</td>
                            <td className="p-3 text-center">
                              <button 
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center p-3 border-t-2 border-zinc-200 mt-2">
                    <span className="text-xs font-bold text-zinc-600">Total Items:</span>
                    <span className="text-xs font-extrabold text-zinc-800">{placedItems.length}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-purple-50 border border-purple-200 rounded-xl">
                    <span className="text-sm font-bold text-purple-950">Estimated Total:</span>
                    <span className="text-base font-extrabold text-purple-950">
                      ${placedItems.reduce((s, i) => s + (i.price || 0), 0).toLocaleString()}
                    </span>
                  </div>

                  <button 
                    onClick={() => alert("Submitting request for designer assistance!")}
                    className="w-full bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer mt-4"
                  >
                    Submit Design for Professional Quote
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
