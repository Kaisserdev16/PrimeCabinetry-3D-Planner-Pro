import * as THREE from 'three';

/**
 * Procedural texture generator to create realistic wood, tile, and marble textures
 * without downloading heavy external assets.
 */
export const textureGenerator = {
  // Wood texture with planks and grain
  createWood: (isDark: boolean = false): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    const baseColor = isDark ? '#3e2723' : '#d7ccc8';
    const grainColor = isDark ? '#271510' : '#b0bec5';
    const lineColor = isDark ? '#1a0c08' : '#8d6e63';

    // Base background
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    // Draw wood planks
    const plankHeight = 64;
    for (let y = 0; y < 512; y += plankHeight) {
      // Plank line
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();

      // Draw staggered vertical joint lines
      const offset = (y / plankHeight) % 2 === 0 ? 0 : 128;
      for (let x = offset; x < 512; x += 256) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + plankHeight);
        ctx.stroke();
      }

      // Add grain details to each plank
      ctx.fillStyle = grainColor;
      ctx.globalAlpha = 0.15;
      
      const plankYStart = y;
      // Draw wavy grain lines
      for (let i = 0; i < 6; i++) {
        const grainY = plankYStart + Math.random() * plankHeight;
        ctx.beginPath();
        ctx.moveTo(0, grainY);
        
        for (let x = 20; x <= 512; x += 20) {
          const nextY = grainY + Math.sin(x * 0.05) * 4 + (Math.random() - 0.5) * 2;
          ctx.lineTo(x, nextY);
        }

        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.strokeStyle = grainColor;
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
    }

    // Add noise
    ctx.fillStyle = grainColor;
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const w = 1 + Math.random() * 2;
      const h = 1 + Math.random() * 2;
      ctx.fillRect(x, y, w, h);
    }
    ctx.globalAlpha = 1.0;

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  },

  // Tile texture with grout lines
  createTile: (color: string, groutColor: string = '#d1d5db'): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Base tile color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 256, 256);

    // Grout lines (borders)
    ctx.strokeStyle = groutColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, 256, 256);
    
    // Draw cross inside for 2x2 grid in a single tile texture
    ctx.beginPath();
    ctx.moveTo(128, 0);
    ctx.lineTo(128, 256);
    ctx.moveTo(0, 128);
    ctx.lineTo(256, 128);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    return texture;
  },

  // Marble countertop texture
  createMarble: (baseColor: string = '#f8fafc', veinColor: string = '#cbd5e1'): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base background
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    // Generate random veins
    ctx.strokeStyle = veinColor;
    ctx.globalAlpha = 0.3;
    
    for (let k = 0; k < 12; k++) {
      let x = Math.random() * 512;
      let y = Math.random() * 512;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      const segments = 15 + Math.floor(Math.random() * 20);
      for (let i = 0; i < segments; i++) {
        x += (Math.random() - 0.4) * 45;
        y += (Math.random() - 0.3) * 45;
        ctx.lineTo(x, y);
      }
      
      ctx.lineWidth = 0.5 + Math.random() * 3;
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1.0;

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    return texture;
  }
};
