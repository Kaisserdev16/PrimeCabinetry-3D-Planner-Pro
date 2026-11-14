import { create } from 'zustand';

export interface CabinetItem {
  id: string;
  name: string;
  type: 'base' | 'wall' | 'tall' | 'appliance' | 'finishing';
  category: string;
  dimensions: {
    width: number;  // in inches
    height: number; // in inches
    depth: number;  // in inches
  };
  position: [number, number, number]; // [x, y, z] in inches
  rotation: [number, number, number]; // [rx, ry, rz] in radians (mostly ry)
  color?: string;
  material?: string;
  sku?: string;
  price?: number;
}

export type ViewMode = '2d' | '3d';

export interface PlannerState {
  // Room configuration
  roomWidth: number;   // inches (X dimension)
  roomLength: number;  // inches (Z dimension)
  wallHeight: number;  // inches (Y dimension)
  
  // Customization
  floorTexture: 'wood_light' | 'wood_dark' | 'tile_grey' | 'tile_white';
  wallColor: string;
  cabinetColor: string;
  countertopColor: string;
  
  // Editor State
  placedItems: CabinetItem[];
  selectedItemId: string | null;
  viewMode: ViewMode;
  showGrid: boolean;
  
  // History for Undo/Redo
  history: CabinetItem[][];
  historyIndex: number;
  
  // Actions
  setRoomDimensions: (width: number, length: number) => void;
  setWallHeight: (height: number) => void;
  setFloorTexture: (texture: 'wood_light' | 'wood_dark' | 'tile_grey' | 'tile_white') => void;
  setWallColor: (color: string) => void;
  setCabinetColor: (color: string) => void;
  setCountertopColor: (color: string) => void;
  
  addItem: (item: Omit<CabinetItem, 'id'>) => void;
  updateItemPosition: (id: string, position: [number, number, number]) => void;
  updateItemRotation: (id: string, rotation: [number, number, number]) => void;
  removeItem: (id: string) => void;
  setSelectedItemId: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setShowGrid: (show: boolean) => void;
  
  undo: () => void;
  redo: () => void;
  resetRoom: () => void;
  pushHistoryState: () => void;
}

// Helper to push to history state
const saveToHistory = (placedItems: CabinetItem[], history: CabinetItem[][], index: number) => {
  const newHistory = history.slice(0, index + 1);
  newHistory.push(JSON.parse(JSON.stringify(placedItems)));
  return {
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
};

export const useStore = create<PlannerState>((set) => ({
  // Default values
  roomWidth: 192,  // 16 feet
  roomLength: 144, // 12 feet
  wallHeight: 96,  // 8 feet
  floorTexture: 'wood_light',
  wallColor: '#f4f4f5',
  cabinetColor: '#ffffff',
  countertopColor: '#e4e4e7',
  placedItems: [],
  selectedItemId: null,
  viewMode: '3d',
  showGrid: true,
  history: [[]],
  historyIndex: 0,

  setRoomDimensions: (width, length) => set((state) => {
    // Keep items inside the new room dimensions
    const updatedItems = state.placedItems.map(item => {
      const xBound = (width / 2) - (item.dimensions.width / 2);
      const zBound = (length / 2) - (item.dimensions.depth / 2);
      const newX = Math.max(-xBound, Math.min(xBound, item.position[0]));
      const newZ = Math.max(-zBound, Math.min(zBound, item.position[2]));
      return {
        ...item,
        position: [newX, item.position[1], newZ] as [number, number, number]
      };
    });
    
    const historyUpdate = saveToHistory(updatedItems, state.history, state.historyIndex);
    return {
      roomWidth: width,
      roomLength: length,
      placedItems: updatedItems,
      ...historyUpdate
    };
  }),

  setWallHeight: (height) => set({ wallHeight: height }),
  
  setFloorTexture: (texture) => set({ floorTexture: texture }),
  setWallColor: (color) => set({ wallColor: color }),
  setCabinetColor: (color) => set({ cabinetColor: color }),
  setCountertopColor: (color) => set({ countertopColor: color }),

  addItem: (itemData) => set((state) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newItem: CabinetItem = {
      ...itemData,
      id,
    };
    const updatedItems = [...state.placedItems, newItem];
    const historyUpdate = saveToHistory(updatedItems, state.history, state.historyIndex);
    return {
      placedItems: updatedItems,
      selectedItemId: id,
      ...historyUpdate
    };
  }),

  updateItemPosition: (id, position) => set((state) => {
    const updatedItems = state.placedItems.map((item) =>
      item.id === id ? { ...item, position } : item
    );
    return { placedItems: updatedItems };
  }),

  updateItemRotation: (id, rotation) => set((state) => {
    const updatedItems = state.placedItems.map((item) =>
      item.id === id ? { ...item, rotation } : item
    );
    const historyUpdate = saveToHistory(updatedItems, state.history, state.historyIndex);
    return {
      placedItems: updatedItems,
      ...historyUpdate
    };
  }),

  removeItem: (id) => set((state) => {
    const updatedItems = state.placedItems.filter((item) => item.id !== id);
    const historyUpdate = saveToHistory(updatedItems, state.history, state.historyIndex);
    return {
      placedItems: updatedItems,
      selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
      ...historyUpdate
    };
  }),

  setSelectedItemId: (id) => set({ selectedItemId: id }),
  
  setViewMode: (mode) => set({ viewMode: mode }),
  
  setShowGrid: (show) => set({ showGrid: show }),

  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const prevIndex = state.historyIndex - 1;
      return {
        placedItems: JSON.parse(JSON.stringify(state.history[prevIndex])),
        historyIndex: prevIndex,
        selectedItemId: null
      };
    }
    return {};
  }),

  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const nextIndex = state.historyIndex + 1;
      return {
        placedItems: JSON.parse(JSON.stringify(state.history[nextIndex])),
        historyIndex: nextIndex,
        selectedItemId: null
      };
    }
    return {};
  }),

  resetRoom: () => set((state) => {
    const updatedItems: CabinetItem[] = [];
    const historyUpdate = saveToHistory(updatedItems, state.history, state.historyIndex);
    return {
      placedItems: updatedItems,
      selectedItemId: null,
      ...historyUpdate
    };
  }),

  pushHistoryState: () => set((state) => {
    const historyUpdate = saveToHistory(state.placedItems, state.history, state.historyIndex);
    return { ...historyUpdate };
  })
}));
