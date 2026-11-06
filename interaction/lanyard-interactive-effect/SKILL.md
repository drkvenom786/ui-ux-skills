---
name: lanyard-interactive-effect
description: Integrates interactive 3D Lanyard card physics components from React Bits into web applications (React, Next.js, and Vanilla HTML/JS with Three.js) with Verlet cloth strap mechanics, rigid-body card dynamics, holographic iridescent foil shaders, and click-to-flip.
risk: low
source: antigravity-custom-skills
date_added: 2026-11-05
---

# Lanyard Interactive 3D Card Effect

> [!IMPORTANT]
> ### STRICT ARCHITECTURAL & INTERACTION MANDATES FOR LANYARD
> 1. **STRICT FREEDOM MANDATE (NEVER NEST IN A CARD OR BOX)**:
>    - **NEVER** place a Lanyard card inside a boxed container, glass card, preview border, or framed card (`background: transparent !important; border: none !important; box-shadow: none !important;`).
>    - The card must float completely free, borderless, and unconfined across the section canvas.
> 2. **ATTACHED PHYSICAL RIBBON REQUIRED**:
>    - The card must **always hang and sway from its physical Three.js Verlet cloth strap ribbon** attached to the top clamp.
>    - The ribbon must have a rich, high-contrast fabric weave texture with double-edge stitching and cylindrical lighting gradients. Never let the ribbon disappear, become detached, or render as an empty wireframe.
> 3. **MAXIMUM Z+ VALUE & ALWAYS FORWARD**:
>    - The card mount and canvas must **ALWAYS have the highest z-index across the section** (`z-index: 9999 !important; overflow: visible !important; pointer-events: none;` with canvas `pointer-events: auto;`).
>    - In 3D space, the card must be placed forward in positive Z-space (+Z towards the camera) so that both the ribbon and card swing **in front of all backgrounds, panels, and text**, and **NEVER hide behind anything**.
> 4. **UNCLIPPED CANVAS BOUNDS & BLEED CLEARANCE**:
>    - A WebGL `<canvas>` cannot rasterize outside its DOM pixel box regardless of CSS `overflow: visible`. Constraining the canvas to a narrow grid column slices off the card when swinging.
>    - The mount container MUST be given generous negative margin bleed (e.g. `left: -140px; width: calc(100% + 180px); top: -60px; height: calc(100% + 120px);`) so the card swings freely with zero edge clipping.
> 5. **TAP-TO-FLIP RELIABILITY**:
>    - Pointer drag threshold must be at least 16–20px so user clicks or taps are not swallowed as drag movements.
>    - Clicking/tapping the card must reliably trigger a snappy 180° spin flip with strong angular impulse (`FLIP_SPIN: 14`).
> 6. **THREE.JS r128+ UNIFORM COMPATIBILITY**:
>    - Never set `sheen: 1` as a scalar on `MeshPhysicalMaterial` — Three.js r128 expects `THREE.Color` and will crash WebGL with `uniform3fv` error on frame 0. Use `THREE.MeshStandardMaterial` for `bandMaterial`.
>    - Never call `strapTexture.dispose()` inside `repaintStrap()`; simply update canvas and set `strapTexture.needsUpdate = true`.

A GPU-accelerated interactive 3D physics badge and lanyard engine powered by Three.js (originating from React Bits' `Lanyard`). The card hangs from a flexible fabric strap simulated via Position-Based Dynamics (PBD) and Verlet integration. Visitors can drag, stretch, throw, and click the card to flip it over, revealing custom front and back artwork with realistic specular reflections and holographic foil grating.

---

## 1. Simulation Architecture & Core Features

1. **Dual Physics System**:
   - **Strap Ribbon (PBD/Verlet)**: A 4-node segmented chain solved iteratively with hyperbolic tension, elasticity, and damping. A 72-sample Catmull-Rom curve generates a continuous 3D ribbon with lateral curvature and twist propagation.
   - **Rigid-Body Card**: Evaluates angular drag, broadside air resistance, inertia tensors, and breeze oscillation.
2. **Holographic Iridescent Foil Shader**:
   - Custom GLSL shader injected into `MeshPhysicalMaterial` calculating procedural Voronoi micro-shards, diffraction grating spectral rainbow fringes, and sparkling facet glints based on view angles and lighting keys.
3. **Procedural Surface Textures**:
   - **Paper Grain**: Canvas-generated 128x128 normal map providing tactile micro-texture.
   - **Woven Fabric**: Procedural weave normal map simulating interlaced warp and weft fibers with anisotropic sheen.
4. **Card Finishes & Metal Clamps**:
   - **Finishes**: `glossy` (clearcoat wet look), `matte` (diffuse soft finish), `holographic` (sparkling spectral foil), and `metallic` (brushed sheen).
   - **Metal hardware**: `silver`, `gold`, and `graphite` finishes for eyelet, clamp, and split ring.
5. **Interactive Gestures**:
   - Raycaster pointer picking allows users to grab anywhere on the badge.
   - Releasing tosses the card with realistic momentum.
   - Clicking/tapping the card executes a smooth 180° spin flip to inspect the reverse side.

---

## 2. File Assets in this Skill

The skill directory provides ready-to-use production assets for both React/Next.js and Vanilla JS projects:

| File | Purpose |
|---|---|
| [`assets/Lanyard.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/lanyard-interactive-effect/assets/Lanyard.jsx) | React / Next.js client component (requires `three`). |
| [`assets/Lanyard.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/lanyard-interactive-effect/assets/Lanyard.css) | Layout styles for canvas positioning and viewport containment. |
| [`assets/lanyard.js`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/lanyard-interactive-effect/assets/lanyard.js) | Standalone Vanilla JS library with `Lanyard.init(container, options)` (requires Three.js). |

---

## 3. React / Next.js Integration

### Dependency Installation
```bash
npm install three
```

### Basic Setup
Copy [`assets/Lanyard.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/lanyard-interactive-effect/assets/Lanyard.jsx) and [`assets/Lanyard.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/lanyard-interactive-effect/assets/Lanyard.css) into your components directory.

```jsx
'use client';

import Lanyard from './Lanyard';

export default function BadgeSection() {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <Lanyard
        frontImage="/assets/card-front.png"
        backImage="/assets/card-back.png"
        strapImage="/assets/band.png"
        finish="holographic"
        anchor="center"
        orientation="portrait"
        metal="silver"
        breeze={0.5}
        interactive={true}
      />
    </div>
  );
}
```

---

## 4. Vanilla HTML / JavaScript Integration

### Step 1: Include Three.js, CSS, and Script
```html
<!-- Include Three.js first -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<link rel="stylesheet" href="./Lanyard.css">
<script src="./lanyard.js"></script>
```

### Step 2: Define Container Markup
```html
<div id="lanyard-container" style="position: relative; width: 100%; height: 600px;"></div>
```

### Step 3: Initialize via JavaScript
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('lanyard-container');

  const card = Lanyard.init(container, {
    frontImage: './card-front.png',
    backImage: './card-back.png',
    strapImage: './band.png',
    finish: 'holographic',
    metal: 'gold',
    orientation: 'portrait',
    anchor: 'center',
    breeze: 0.5,
    interactive: true
  });

  // Programmatic API:
  // card.flip();                           // Trigger 180-degree flip
  // card.setOptions({ finish: 'matte' });  // Update finish or imagery dynamically
  // card.destroy();                        // Dispose Three.js scenes, meshes & textures
});
```

---

## 5. Props & Options Reference

| Prop / Option | Type | Default | Description |
|---|---|---|---|
| `frontImage` | string | `undefined` | Image URL printed on the front of the card. Supports PNG, JPG, WebP, SVG. |
| `backImage` | string | `undefined` | Image URL printed on the back. Falls back to `frontImage`, then to a blank card. |
| `imageFit` | `'cover' \| 'contain'` | `'cover'` | `'cover'` fills and crops; `'contain'` fits image inside bordered card color. |
| `cardColor` | string | `'#ffffff'` | Color of the base card material, visible when no image is supplied or around contained artwork. |
| `orientation` | `'portrait' \| 'landscape'` | `'portrait'` | Card proportions: portrait (1.6 : 2.25) or landscape (2.25 : 1.6). |
| `finish` | `'glossy' \| 'matte' \| 'holographic' \| 'metallic'` | `'glossy'` | Surface shader finish. `holographic` adds iridescent diffractive foil; `metallic` adds brushed sheen. |
| `cornerRadius` | number | `0.3` | Roundness of card corners [0..1] (from sharp credit card edges to soft rounded badges). |
| `size` | number | `0.6` | Height of the card relative to the container height [0.15..0.9]. |
| `anchor` | `'left' \| 'center' \| 'right'` | `'center'` | Horizontal mounting point along the top edge of the viewport. |
| `strapLength` | number | `0.5` | How far below the top edge the card hangs [0..1]. |
| `strapImage` | string | `undefined` | Texture URL printed along the band. Repeats seamlessly along strap length. |
| `strapColor` | string | `'#111111'` | Solid color of the fabric ribbon when no strap image is supplied. |
| `strapWidth` | number | `0.65` | Width of the strap relative to default scale [0.4..2]. |
| `metal` | `'graphite' \| 'silver' \| 'gold'` | `'silver'` | Material appearance of the clamp, eyelet, and split ring. |
| `gravity` | number | `1` | Gravitational pull scale. Lower values float dreamily; `0` disables gravity. |
| `damping` | number | `0.5` | Air and joint friction [0..1]. Lower values cause prolonged swaying. |
| `elasticity` | number | `0.5` | Spring snap-back rate of the strap ribbon after release. |
| `breeze` | number | `0.5` | Ever-changing ambient air current intensity keeping the badge in living motion. |
| `interactive` | boolean | `true` | Enables pointer dragging, stretching, throwing, and click-to-flip. |
| `intro` | boolean | `true` | Triggers a dynamic entry swing on initial mount. |
| `className` | string | `''` | Optional wrapper CSS class name. |
| `style` | object | - | Optional wrapper inline style object. |

---

## 6. Performance & Lifecycle Optimization

1. **Auto-Sleep Rest Detection**: When user interaction ceases, breeze settles, and overall kinetic energy falls below `2e-4`, the simulation automatically suspends the `requestAnimationFrame` loop, reaching 0% idle GPU usage.
2. **IntersectionObserver & Visibility Handling**: Pauses rendering when the badge container is scrolled out of view or the browser tab is hidden.
3. **Resource Disposal**: Complete teardown of geometries (`ExtrudeGeometry`, `TorusGeometry`, `BufferGeometry`), materials (`MeshPhysicalMaterial`), procedural normal maps, and WebGL render targets upon unmount.
4. **`prefers-reduced-motion`**: Automatically mutes the intro drop-in and breeze turbulence for accessibility.
