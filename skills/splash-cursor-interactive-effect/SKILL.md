---
name: splash-cursor-interactive-effect
description: Integrates interactive WebGL2 SplashCursor fluid ink dynamics effects from React Bits into web applications (React, Next.js, and Vanilla HTML/JS) with Navier-Stokes advection, vorticity confinement, multi-pass bloom glow pyramids, normal-mapped surface shading, rainbow spectrum cycling, and click splash bursts.
risk: low
source: antigravity-custom-skills
date_added: 2026-11-05
---

# SplashCursor Interactive Effect

A GPU-accelerated WebGL2 fluid ink cursor simulation originating from React Bits' `<SplashCursor />`. It renders high-definition Navier-Stokes fluid advection trails behind mouse and touch gestures, featuring curling vorticity eddies, Jacobi Poisson pressure projection, dynamic normal-mapped surface ripple shading, multi-pass optical bloom pyramids, and procedural 7-droplet crown splash bursts upon clicking.

---

## 1. Visual Architecture & Core Features

1. **Eulerian Navier-Stokes Fluid Solver**:
   - **Semi-Lagrangian Advection**: Advects velocity and dye quantities backwards in time through double-buffered half-float textures (`RGBA16F` / `RG16F`).
   - **Vorticity Confinement (`swirl`)**: Computes velocity curl and injects tangential momentum forces, producing organic swirling eddies and turbulent fluid micro-currents.
   - **Poisson Pressure Projection**: Calculates divergence and iteratively solves pressure Poisson equations using 10–20 Jacobi iterations to enforce incompressibility.
2. **Dual Theme Modes (`theme="dark"` / `theme="light"`)**:
   - `dark`: Emissive, glowing neon fluid ink for dark backgrounds with filmic grain.
   - `light`: Subtractive watercolor ink absorption (`transmit = exp(-2.4 * c)`), giving the tactile feel of liquid fountain pen ink seeping into light paper.
3. **Surface Ripple Shading (`shading`)**:
   - Computes finite-difference normal gradients from local ink density variations ($dx, dy$) to simulate realistic refractive surface tension, making the ink appear 3D, raised, and glossy.
4. **Multi-Pass Bloom Glow Pyramid (`glow`)**:
   - Downsamples bright ink highlights through a 4-level progressive blur pyramid and recombines them via additive blending, creating soft ethereal halos around intense fluid currents.
5. **Interactive Click & Tap Splashes (`clickSplash`)**:
   - Clicking or tapping unleashes both an explosive radial velocity burst and a procedural 7-droplet ink crown (`crown`), scattering droplets naturally along logarithmic spiral angles.
6. **Viewport Overlay vs. Contained Mode**:
   - Default: Fixed full-screen non-blocking overlay (`pointer-events: none`).
   - `contained={true}`: Constrains the canvas and interaction bounds to a specific container element (e.g., hero banner, card, or interactive modal).
7. **Zero External Dependencies**: Pure native WebGL2 with floating-point texture extensions. No three.js or external math libraries required.

---

## 2. File Assets in this Skill

The skill directory provides ready-to-use production assets for both React/Next.js and Vanilla JS projects:

| File | Purpose |
|---|---|
| [`assets/SplashCursor.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/splash-cursor-interactive-effect/assets/SplashCursor.jsx) | Full React / Next.js client component with WebGL2 shader pipeline. |
| [`assets/SplashCursor.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/splash-cursor-interactive-effect/assets/SplashCursor.css) | Layout styles for full-screen fixed and contained absolute modes. |
| [`assets/splashcursor.js`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/splash-cursor-interactive-effect/assets/splashcursor.js) | Standalone Vanilla JS engine exposing `SplashCursor.init(target, options)`. |

---

## 3. React / Next.js Integration

### Basic Setup
Copy [`assets/SplashCursor.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/splash-cursor-interactive-effect/assets/SplashCursor.jsx) and [`assets/SplashCursor.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/splash-cursor-interactive-effect/assets/SplashCursor.css) into your components directory.

```jsx
'use client';

import SplashCursor from './SplashCursor';

export default function App() {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#0a0a0c' }}>
      <SplashCursor
        rainbow={true}
        colorSpeed={1.2}
        size={1}
        force={1.2}
        swirl={3.5}
        trail={1.1}
        shading={1}
        glow={0.4}
        clickSplash={true}
      />
      {/* Page content here */}
    </div>
  );
}
```

---

## 4. Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colors` | string[] | `['#4f8cff', '#2dd4bf', '#ffd166']` | Palette the ink cycles through when `rainbow` is false. |
| `rainbow` | boolean | `true` | Cycles smoothly through the 360° HSV color spectrum instead of the fixed palette. |
| `colorSpeed` | number | `1` | How fast colors shift while the pointer moves. `0` maintains one color per continuous stroke. |
| `intensity` | number | `1` | Volume of ink deposited into the simulation per cursor motion. |
| `size` | number | `1` | Radius scale of the cursor stroke and splash droplet crown. |
| `force` | number | `1` | Momentum and velocity impulse imparted to the fluid by cursor motion. |
| `swirl` | number | `3` | Vorticity confinement strength; higher values generate tighter turbulent curling eddies. |
| `trail` | number | `1` | Longevity of the ink before dissipation (higher values linger longer). |
| `momentum` | number | `1` | Fluid inertia; controls how long velocity currents drift after pointer motion halts. |
| `shading` | number | `1` | 3D surface normal lighting applied to ink ridges (0 to 1). |
| `glow` | number | `0` | Multi-pass optical bloom halo intensity around bright fluid crests (0 to 1). |
| `quality` | `'low'` \| `'medium'` \| `'high'` | `'high'` | Grid resolution tier (low: 64/512, med: 96/1024, high: 128/1440). |
| `clickSplash` | boolean | `true` | Generates a 7-droplet crown splash burst on mouse clicks or touch taps. |
| `intro` | boolean | `true` | Executes an introductory fluid gesture curve across the screen on mount. |
| `contained` | boolean | `false` | When true, renders absolutely inside the parent element rather than fixed across the entire viewport. |
| `theme` | `'dark'` \| `'light'` | `'dark'` | `'dark'` uses glowing additive ink; `'light'` uses subtractive watercolor absorption. |
| `zIndex` | number | `50` | CSS z-index stacking layer. |
| `className` | string | `''` | Extra class name applied to the container. |
| `style` | object | `{}` | Inline CSS styles applied to the container. |

---

## 5. Vanilla HTML / JavaScript Integration

### Step 1: Include CSS and Script
```html
<link rel="stylesheet" href="./SplashCursor.css" />
<script src="./splashcursor.js"></script>
```

### Step 2: Global Viewport Initialization
```html
<script>
  // Initializes full-screen interactive fluid trails over the entire page:
  const cursorEffect = SplashCursor.init(document.body, {
    rainbow: true,
    size: 1,
    force: 1,
    swirl: 3,
    trail: 1.2,
    glow: 0.3,
    clickSplash: true,
    theme: 'dark'
  });

  // Programmatic API:
  // cursorEffect.burst(0.5, 0.5); // Spawns a splash burst at normalized coordinates
  // cursorEffect.update({ glow: 0.8, swirl: 4 }); // Update options live
  // cursorEffect.destroy(); // Teardown WebGL buffers and listeners
</script>
```

### Step 3: Contained Element Mode
```html
<div id="interactive-card" style="width: 500px; height: 350px; position: relative; border-radius: 16px; overflow: hidden;">
  <!-- Card content -->
</div>

<script>
  SplashCursor.init('#interactive-card', {
    contained: true,
    rainbow: false,
    colors: ['#ff007b', '#7000ff', '#00f0ff'],
    size: 0.8,
    trail: 0.9,
    clickSplash: true
  });
</script>
```

---

## 6. Performance & Accessibility Best Practices

1. **Automatic Idle Sleep (`quiet`)**:
   - The simulation loop detects when fluid motion settles and ink completely dissipates (`(2.2 * trail + 0.4)` seconds). It automatically suspends `requestAnimationFrame` and clears the canvas to consume 0% GPU/CPU while idle.
   - Instantly re-awakens on pointer movement or touch interaction.
2. **Reduced Motion (`prefers-reduced-motion`)**:
   - Automatically disables the introductory motion gesture on mount.
3. **Resolution Optimization**:
   - Use `quality="medium"` or `quality="low"` on mobile devices or lower-tier hardware to downscale simulation grids without sacrificing fluidity.
4. **Context Recovery**:
   - Fully supports WebGL context lost and restored events (`webglcontextlost` and `webglcontextrestored`) for robust long-running sessions.
