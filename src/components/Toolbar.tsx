import React from 'react';
import { 
  Undo2, 
  Redo2, 
  Trash2, 
  RotateCcw,
  LayoutGrid
} from 'lucide-react';
import { useStore } from '../store/useStore';

export const Toolbar: React.FC = () => {
  const {
    viewMode,
    showGrid,
    selectedItemId,
    history,
    historyIndex,
    setViewMode,
    setShowGrid,
    removeItem,
    undo,
    redo,
    resetRoom
  } = useStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleDeleteSelected = () => {
    if (selectedItemId) {
      removeItem(selectedItemId);
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border border-zinc-200 shadow-xl rounded-full px-5 py-2.5 flex items-center gap-4 select-none z-10">
      
      {/* 2D / 3D Toggle */}
      <div className="flex bg-zinc-100 p-0.5 rounded-full border border-zinc-200">
        <button
          onClick={() => setViewMode('2d')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            viewMode === '2d' 
              ? 'bg-purple-900 text-white shadow-sm' 
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          2D Plan
        </button>
        <button
          onClick={() => setViewMode('3d')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            viewMode === '3d' 
              ? 'bg-purple-900 text-white shadow-sm' 
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          3D View
        </button>
      </div>

      <div className="h-6 w-px bg-zinc-200" />

      {/* Grid Toggle */}
      <button
        onClick={() => setShowGrid(!showGrid)}
        title="Toggle Layout Grid"
        className={`p-2 rounded-full transition-all cursor-pointer ${
          showGrid 
            ? 'bg-purple-100 text-purple-900 border border-purple-200' 
            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 border border-transparent'
        }`}
      >
        <LayoutGrid size={16} />
      </button>

      <div className="h-6 w-px bg-zinc-200" />

      {/* Undo & Redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          title="Undo Action"
          className={`p-2 rounded-full transition-all border border-transparent ${
            canUndo 
              ? 'text-zinc-700 hover:bg-zinc-100 cursor-pointer active:scale-90' 
              : 'text-zinc-300 cursor-not-allowed'
          }`}
        >
          <Undo2 size={16} />
        </button>

        <button
          onClick={redo}
          disabled={!canRedo}
          title="Redo Action"
          className={`p-2 rounded-full transition-all border border-transparent ${
            canRedo 
              ? 'text-zinc-700 hover:bg-zinc-100 cursor-pointer active:scale-90' 
              : 'text-zinc-300 cursor-not-allowed'
          }`}
        >
          <Redo2 size={16} />
        </button>
      </div>

      <div className="h-6 w-px bg-zinc-200" />

      {/* Reset & Delete Selected */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (confirm("Are you sure you want to clear all cabinets and reset the room layout?")) {
              resetRoom();
            }
          }}
          title="Clear Design"
          className="p-2 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-full transition-all cursor-pointer"
        >
          <RotateCcw size={16} />
        </button>

        <button
          onClick={handleDeleteSelected}
          disabled={!selectedItemId}
          title="Delete Selected Item"
          className={`p-2 rounded-full transition-all border border-transparent ${
            selectedItemId 
              ? 'text-red-500 hover:bg-red-50 cursor-pointer active:scale-90' 
              : 'text-zinc-300 cursor-not-allowed'
          }`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {selectedItemId && (
        <>
          <div className="h-6 w-px bg-zinc-200" />
          <span className="text-[10px] text-purple-700 font-extrabold uppercase bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 animate-pulse">
            Item Selected
          </span>
        </>
      )}
    </div>
  );
};
