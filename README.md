# UI/UX Interactive Skills 🎨✨

A curated, production-ready collection of **19 high-performance interactive UI/UX components and visual effects** inspired by [React Bits](https://reactbits.dev).

Every skill in this repository is completely self-contained with:
1. **`SKILL.md`**: Complete documentation, mathematical physics formulations, props API tables, integration patterns, and accessibility guidelines.
2. **React / Next.js Component (`assets/*.jsx`)**: Fully typed, SSR-safe (`'use client'`) components.
3. **Dedicated Stylesheet (`assets/*.css`)**: Modular, scoped CSS with customizable CSS custom properties.
4. **Standalone Vanilla JS Engine (`assets/*.js`)**: Zero-dependency UMD modules (`Class.init(container, options)` or `new Class(...)`) that run anywhere without React, bundlers, or external dependencies.

---

## 🚀 Interactive Skills Catalog

| Skill Name | Category | Technology / Physics | React Component | Vanilla JS Engine | Description |
|:---|:---|:---|:---|:---|:---|
| [**Antigravity**](skills/antigravity-interactive-effect/) | Particles & Fields | WebGL2, Instanced Geometry, Oklab | `Antigravity.jsx` | `antigravity.js` | Magnetic particle ring and field distortion with harmonic waves and orbital drift. |
| [**Ballpit**](skills/ballpit-interactive-effect/) | 3D Physics Simulation | WebGL2 Raymarching, Spatial Hash, PBR | `Ballpit.jsx` | `ballpit.js` | 3D bouncing spheres with collision physics, cursor repulsion, grab, and burst shockwaves. |
| [**Dock**](skills/dock-interactive-effect/) | Navigation & Menus | Sub-stepped Euler Spring, SVG Pathing | `Dock.jsx` | `dock.js` | macOS-style app dock with spring magnification, hop bounce, badges, and SVG-tailed context menus. |
| [**DodgeField**](skills/dodge-field-interactive-effect/) | Micro-Interactions | Repulsion Vectors, Exponential Falloff | `DodgeField.jsx` | `dodge-field.js` | Evasive "catch-me" button with boundary clamping/bouncing, patience limits, and taunts. |
| [**DotField**](skills/dotfield-interactive-effect/) | Particle Grids | WebGL2, Lens Warping, OKLab Blending | `DotField.jsx` | `dotfield.js` | Interactive particle grid with cursor lens magnification, wave undulation, and frosted cards. |
| [**ElasticMesh**](skills/elastic-mesh-interactive-effect/) | 3D Typography | WebGL2, SDF Poisson Solver, 480Hz Spring | `ElasticMesh.jsx` | `elastic-mesh.js` | Inflated squishy 3D text & logos with 4 PBR materials (balloon, chrome, jelly, clay) and poke physics. |
| [**FallingText**](skills/falling-text-interactive-effect/) | Typography & Physics | Matter.js 2D Rigid-Body Dynamics | `FallingText.jsx` | `fallingtext.js` | Kinetic typography that crumbles on contact, tumbles under gravity, and springs back home. |
| [**Folder**](skills/folder-interactive-effect/) | 3D & Containers | CSS 3D Transforms, Perspective Physics | `Folder.jsx` | `folder.js` | Interactive 3D folder component with flap/book modes, document dragging, and click-to-zoom. |
| [**GlitchText**](skills/glitch-text-interactive-effect/) | Typography Effects | Procedural Canvas Tearing, RGB Shadows | `GlitchText.jsx` | `glitchtext.js` | Multi-mode glitch typography (slices, scanlines, rgb split, noise) with animated gradient flow. |
| [**GlowCursor**](skills/glow-cursor-interactive-effect/) | Cursors & Trails | WebGL2 Fluid Navier-Stokes, 5-Level Bloom | `GlowCursor.jsx` | `glowcursor.js` | Fluid advection light trails, MacCormack advection, and click burst shockwaves. |
| [**GooeyNav**](skills/gooey-nav-interactive-effect/) | Navigation | WebGL2 SDF Metaballs, Cubic Bézier | `GooeyNav.jsx` | `gooeynav.js` | Liquid metaball navigation bar with spring wobble physics and dual-layer inverted text clip paths. |
| [**Lanyard**](skills/lanyard-interactive-effect/) | 3D Physics | Three.js, Verlet Cloth, Rigid Body | `Lanyard.jsx` | `lanyard.js` | Interactive 3D lanyard ID card with Verlet cloth strap mechanics and holographic foil shaders. |
| [**LaserFlow**](skills/laser-flow-interactive-effect/) | Volumetric Lighting | WebGL2, Ray-Sphere Impacts, Edge Washes | `LaserFlow.jsx` | `laserflow.js` | Volumetric laser beam with realistic surface impact washes and atmospheric dust particles. |
| [**LiquidEther**](skills/liquid-ether-interactive-effect/) | Fluid Dynamics | WebGL2 Navier-Stokes, Pressure Projection | `LiquidEther.jsx` | `liquidether.js` | Organic multi-color fluid dynamics background with click bursts and glassmorphic layers. |
| [**ParticleText**](skills/particle-text-interactive-effect/) | Typography & Particles | HTML5 2D Canvas, Staggered Intro | `ParticleText.jsx` | `particletext.js` | Motion-reactive particle text with 4 intro choreographies (gather, rain, spiral, scan). |
| [**PillNav**](skills/pill-nav-interactive-effect/) | Navigation | Spring Dynamics, SVG Ink-Fill, ResizeObserver | `PillNav.jsx` | `pillnav.js` | Floating capsule navbar with circular ink rollouts, sliding dot indicator, and morphing mobile drawer. |
| [**SpecularBorder**](skills/specular-border-interactive-effect/) | Buttons & Borders | WebGL2, Edge Ray-Tracing, Glassmorphism | `SpecularButton.jsx` | `specular.js` | Dynamic perimeter specular border ray reflection that tracks cursor proximity in real time. |
| [**SplashCursor**](skills/splash-cursor-interactive-effect/) | Cursors & Fluids | WebGL2 Navier-Stokes, Multi-Pass Bloom | `SplashCursor.jsx` | `splashcursor.js` | High-viscosity ink splashes, vorticity confinement, and rainbow fluid cursor trails. |
| [**WarpText**](skills/warp-text-interactive-effect/) | Typography & Optics | WebGL2 Refraction, Chromatic Dispersion | `WarpText.jsx` | `warptext.js` | Fluid optical glass refraction, ambient wave undulations, and cursor shockwave ripples. |

---

## 📦 Directory Structure

```
ui-ux-skills/
├── README.md
├── .gitignore
└── skills/
    ├── antigravity-interactive-effect/
    │   ├── SKILL.md
    │   └── assets/ (Antigravity.jsx, Antigravity.css, antigravity.js)
    ├── ballpit-interactive-effect/
    │   ├── SKILL.md
    │   └── assets/ (Ballpit.jsx, Ballpit.css, ballpit.js)
    ├── dock-interactive-effect/
    │   ├── SKILL.md
    │   └── assets/ (Dock.jsx, Dock.css, dock.js)
    ├── dodge-field-interactive-effect/
    │   ├── SKILL.md
    │   └── assets/ (DodgeField.jsx, DodgeField.css, dodge-field.js)
    ├── dotfield-interactive-effect/
    │   ├── SKILL.md
    │   └── assets/ (DotField.jsx, DotField.css, dotfield.js)
    ├── elastic-mesh-interactive-effect/
    │   ├── SKILL.md
    │   └── assets/ (ElasticMesh.jsx, ElasticMesh.css, elastic-mesh.js)
    ├── falling-text-interactive-effect/
    │   ├── SKILL.md
    │   └── assets/ (FallingText.jsx, FallingText.css, fallingtext.js)
    ├── folder-interactive-effect/
    │   ├── SKILL.md
    │   └── assets/ (Folder.jsx, Folder.css, folder.js)
    ├── glitch-text-interactive-effect/
    │   ├── SKILL.md
    │   └── assets/ (GlitchText.jsx, GlitchText.css, glitchtext.js)
    ├── glow-cursor-interactive-effect/
    │   ├── SKILL.md
    │   └── assets/ (GlowCursor.jsx, GlowCursor.css, glowcursor.js)
    ├── gooey-nav-interactive-effect/
    │   ├── SKILL.md
    │   └── assets/ (GooeyNav.jsx, GooeyNav.css, gooeynav.js)
    ├── lanyard-interactive-effect/
    │   ├── SKILL.md
    │   └── assets/ (Lanyard.jsx, Lanyard.css, lanyard.js)
    ├── laser-flow-interactive-effect/
    │   ├── SKILL.md
    │   └── assets/ (LaserFlow.jsx, LaserFlow.css, laserflow.js)
    ├── liquid-ether-interactive-effect/
    │   ├── SKILL.md
    │   └── assets/ (LiquidEther.jsx, LiquidEther.css, liquidether.js)
    ├── particle-text-interactive-effect/
    │   ├── SKILL.md
    │   └── assets/ (ParticleText.jsx, ParticleText.css, particletext.js)
    ├── pill-nav-interactive-effect/
    │   ├── SKILL.md
    │   └── assets/ (PillNav.jsx, PillNav.css, pillnav.js)
    ├── specular-border-interactive-effect/
    │   ├── SKILL.md
    │   └── assets/ (SpecularButton.jsx, SpecularButton.css, specular.js)
    ├── splash-cursor-interactive-effect/
    │   ├── SKILL.md
    │   └── assets/ (SplashCursor.jsx, SplashCursor.css, splashcursor.js)
    └── warp-text-interactive-effect/
        ├── SKILL.md
        └── assets/ (WarpText.jsx, WarpText.css, warptext.js, water-drop.wav)
```

---

## 🛠️ Usage Examples

### 1. React & Next.js
Copy the target component and CSS file into your components folder:

```jsx
'use client';

import Dock from './skills/dock-interactive-effect/assets/Dock';
import './skills/dock-interactive-effect/assets/Dock.css';

export default function App() {
  return (
    <Dock
      items={[
        { label: 'Home', icon: '🏠', active: true },
        { label: 'Settings', icon: '⚙️' }
      ]}
      position="bottom"
      theme="dark"
    />
  );
}
```

### 2. Standalone Vanilla JavaScript
Include the stylesheet and script tag in your HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="./skills/ballpit-interactive-effect/assets/Ballpit.css">
  <style>
    body { margin: 0; height: 100vh; overflow: hidden; }
    #container { width: 100%; height: 100%; position: relative; }
  </style>
</head>
<body>
  <div id="container"></div>

  <script src="./skills/ballpit-interactive-effect/assets/ballpit.js"></script>
  <script>
    const pit = Ballpit.init(document.getElementById('container'), {
      count: 200,
      gravity: 0.2,
      drift: 0.4,
      clickEffect: 'burst'
    });
  </script>
</body>
</html>
```

---

## 📄 License
MIT License. Inspired by and compatible with [React Bits](https://reactbits.dev).
