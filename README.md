# PrimeCabinetry 3D Planner Pro

A React + TypeScript + Vite project for an interactive 3D kitchen and cabinet planning experience. The app lets users configure room dimensions, choose cabinet styles, add appliances and finishing elements, and preview the design in a 3D canvas before saving or pricing the layout.

## Overview

This project is built around a 3D room planner for kitchen cabinetry and related fixtures. It includes:

- Room dimension controls for width, depth, and wall height
- Cabinet, appliance, and finishing catalog browsing
- 3D product placement in a room scene
- Style and finish customization for walls, flooring, cabinets, and countertops
- Pricing totals based on the items in the current design
- Undo/redo and reset controls for iterative planning

## Tech Stack

- React 19
- TypeScript
- Vite
- @react-three/fiber
- @react-three/drei
- Three.js
- Zustand for state management
- Tailwind CSS
- Oxlint for linting

## Project Structure

```text
3d-render-site/
├── public/
├── src/
│   ├── components/
│   ├── store/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── index.html
├── README.md
└── package-lock.json
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the local development server:

```bash
npm run dev
```

3. Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

To expose the app on a network or local environment, you can also run:

```bash
npm run dev -- --host
```

## Available Scripts

```bash
npm run dev      # starts the Vite dev server
npm run build    # type-checks and builds for production
npm run preview  # preview the production build locally
npm run lint     # runs the project linter
```

## Production Build

To generate the production bundle:

```bash
npm run build
```

The build output will be created in the `dist` directory.

## Notes

- The app uses a mock product catalog and pricing model for demonstration purposes.
- Default room and item data are populated on initial load so the 3D planner is ready to interact with immediately.
- This project is intended as a front-end planning prototype and can be expanded with saved designs, backend APIs, or e-commerce integration.
