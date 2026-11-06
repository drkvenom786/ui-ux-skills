---
name: ballpit-interactive-effect
description: Integrates interactive WebGL2 Ballpit 3D floating and bouncy sphere physics simulation effects from React Bits into web applications (React, Next.js, and Vanilla HTML/JS) with PBR shading (satin, matte, gloss, frosted, metal), spatial hash collisions, cursor obstacle interaction, click shockwaves, and ambient occlusion.
risk: low
source: antigravity-custom-skills
date_added: 2026-11-05
---

# Ballpit Interactive Effect

An ultra-high-performance WebGL2 3D physics ballpit engine originating from React Bits' `<Ballpit />` (inspired by Kevin Levron). It simulates hundreds or thousands of bouncing, floating, or stacking physical spheres using instanced raymarched sphere imposters, physically based materials (`satin`, `matte`, `gloss`, `frosted`, `metal`), spatial hash grid collision detection, cursor obstacle repulsion, pointer drag-and-throw interaction, and click shockwave bursts.

---

## 1. Visual Architecture & Core Features

1. **Instanced Raymarched Imposters**:
   - Zero 3D polygon meshes: Each sphere is rendered on an instanced camera-facing billboard quad (`gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count)`).
   - The WebGL2 fragment shader calculates analytic ray-sphere intersections, true fragment depth (`gl_FragDepth`), and normal vectors in real time, achieving silky smooth 60–120 FPS even on mobile GPUs with thousands of spheres.
2. **PBR Material Finishing**:
   - `satin`: Soft sheen, moderate roughness (`0.42`), light clearcoat, and subsurface transmission scatter.
   - `matte`: Chalky, high roughness (`0.92`), pure diffuse studio lighting.
   - `gloss`: Polished mirror sheen (`roughness: 0.2`, `coat: 1.0`).
   - `frosted`: Translucent glass-like material with edge Fresnel rim illumination.
   - `metal`: Full metallic reflection (`metalness: 1.0`, Cook-Torrance GGX specular).
3. **Advanced Lighting & Ambient Occlusion**:
   - **Studio HDR Illumination**: Tri-lobe studio environment map simulation (`studio`) with ACES filmic tone mapping.
   - **Cursor Point Light**: Follows the pointer with inverse-square radiance attenuation (`uLight / (dist2 + 1.0)`).
   - **Dynamic Contact AO & Floor Shadows**: Neighboring spheres and the floor plane generate directional ambient occlusion (`occ`), grounding the spheres realistically.
4. **Spatial Hash 3D Physics Engine**:
   - Uniform 3D spatial partitioning grid (`buildGrid`) scales linearly $O(N)$ with sphere count.
   - Sub-stepped velocity constraint solver (`solveVelocities`) resolves multi-body contacts, restitution, and wall collisions.
   - Slop relaxation (`correctPositions`) prevents interpenetration under heavy gravity piles.
5. **Interactive Controls**:
   - **Zero-G Floating vs. Heavy Gravity**: Setting `gravity: 0` lets spheres float weightlessly with gentle sinusoidal harmonic `drift`. Higher gravity values ($0.5$ to $1.2$) pile them up into a realistic ballpit.
   - **Follow Cursor**: A physical cursor collider pushes spheres out of the way as you move your mouse.
   - **Grab & Fling (`grab: true`)**: Ray-sphere intersection picking (`pick`) lets users grab individual spheres, drag them around, and throw them with fling momentum.
   - **Click Burst (`clickEffect: "burst"`)**: Clicking open space triggers a radial explosive shockwave and illuminating light flash.
6. **Zero External Dependencies**: Pure native WebGL2 with vanilla HTML5 `<canvas>`. No Three.js or physics libraries required.

---

## 2. File Assets in this Skill

The skill directory provides ready-to-use production assets for both React/Next.js and Vanilla JS projects:

| File | Purpose |
|---|---|
| [`assets/Ballpit.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/ballpit-interactive-effect/assets/Ballpit.jsx) | React / Next.js client component with WebGL2 shader pipeline. |
| [`assets/Ballpit.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/ballpit-interactive-effect/assets/Ballpit.css) | Layout styling, canvas sizing, and grab/grabbing cursor classes. |
| [`assets/ballpit.js`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/ballpit-interactive-effect/assets/ballpit.js) | Standalone Vanilla JS engine exposing `Ballpit.init(container, options)`. |

---

## 3. React / Next.js Integration

### Basic Setup
Copy [`assets/Ballpit.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/ballpit-interactive-effect/assets/Ballpit.jsx) and [`assets/Ballpit.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/ballpit-interactive-effect/assets/Ballpit.css) into your components folder.

```jsx
'use client';

import Ballpit from './Ballpit';

export default function FloatingBallsHero() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: '500px', width: '100%' }}>
      <Ballpit
        count={200}
        colors={['#5227ff', '#ff9ffc', '#ffffff']}
        material="satin"
        gravity={0}
        drift={0.4}
        followCursor={true}
        grab={true}
        clickEffect="burst"
        maxSize={1.35}
      />
    </div>
  );
}
```

---

## 4. Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | number | `200` | Number of spheres in the pit (clamped 1 to 4000). |
| `colors` | Array<string \| number> | `['#ffffff']` | Palette handed out sequentially to spheres. Supports hex strings (`"#5227ff"`) or numbers (`0x5227ff`). |
| `material` | `'satin'` \| `'matte'` \| `'gloss'` \| `'frosted'` \| `'metal'` | `'satin'` | PBR surface finish: soft satin, chalky matte, polished mirror gloss, translucent frosted, or brushed metal. |
| `minSize` | number | `0.5` | Smallest sphere radius (viewport is approx 18 units tall). |
| `maxSize` | number | `1` | Largest sphere radius. |
| `gravity` | number | `0.5` | Gravitational pull towards the floor. `0` allows spheres to float weightlessly. |
| `friction` | number | `0.9975` | Velocity retention per frame (0.5 to 1). 1 preserves kinetic energy indefinitely. |
| `wallBounce` | number | `0.95` | Restitution when colliding with container bounding walls (0 to 1). |
| `bounce` | number | `0.85` | Restitution when spheres collide with each other (0 to 1). |
| `depth` | number | `2` | Pit depth on the Z-axis, allowing balls to pass in front and behind each other. |
| `drift` | number | `0` | Sinusoidal wandering drift that keeps zero-gravity floating spheres moving. |
| `followCursor` | boolean | `true` | A physical sphere follows the cursor, shoving nearby balls aside. |
| `cursorSize` | number | `1` | Radius of the cursor collider sphere. |
| `grab` | boolean | `true` | Enables raycasted pointer grab, drag, and fling physics. |
| `clickEffect` | `'burst'` \| `'none'` | `'burst'` | Clicking empty space unleashes a radial shockwave with light flash. |
| `lightColor` | string | `'#ffffff'` | Color of the cursor point light. |
| `lightIntensity` | number | `1` | Brightness multiplier for the cursor light. |
| `exposure` | number | `1` | Filmic ACES exposure adjustment for the entire scene. |
| `shadows` | number | `0.6` | Intensity of ambient occlusion and contact shadows (0 to 1). |
| `intro` | boolean | `true` | Pours balls from the top on mount, or bursts outward from center in zero-g. |
| `dpr` | number | `auto` | Maximum device pixel ratio (capped at 2 for performance). |
| `className` | string | `''` | Extra CSS class names for the container. |
| `style` | object | `{}` | Inline CSS styling overrides for the container. |

---

## 5. Vanilla HTML / JavaScript Integration

### Step 1: Include CSS and Script
```html
<link rel="stylesheet" href="./Ballpit.css" />
<script src="./ballpit.js"></script>
```

### Step 2: Container Markup & Initialization
```html
<div id="ballpit-container" style="position: relative; width: 100%; height: 550px;"></div>

<script>
  const pit = Ballpit.init('#ballpit-container', {
    count: 180,
    colors: ['#00f0ff', '#7000ff', '#ff007b', '#ffffff'],
    material: 'frosted',
    gravity: 0,
    drift: 0.5,
    minSize: 0.6,
    maxSize: 1.4,
    followCursor: true,
    grab: true,
    clickEffect: 'burst',
    lightColor: '#00f0ff',
    lightIntensity: 1.5,
    exposure: 1.1,
    shadows: 0.7
  });

  // Programmatic API:
  // pit.burst(0, 0); // Trigger shockwave at coordinates
  // pit.update({ material: 'metal', gravity: 0.8 }); // Update options live
  // pit.destroy(); // Teardown WebGL context and listeners
</script>
```

---

## 6. Performance & Accessibility Best Practices

1. **Adaptive Sleep Mode (`quiet`)**:
   - The animation frame loop automatically suspends (`raf = 0`) when motion settles below `0.6` for more than 0.8 seconds without active pointer events.
   - Instantly re-awakens on pointer movement, clicks, or viewport resizing. Saves 100% idle GPU/CPU battery.
2. **Reduced Motion (`prefers-reduced-motion`)**:
   - Disables initial explosive drop/burst animations and idle sinusoidal drifting.
3. **High DPI Capping**:
   - Automatically clamps canvas resolution at `2x` device pixel ratio to prevent fillrate bottlenecks on 4K/Retina displays.
4. **Context Loss Management**:
   - Cleanly releases GPU buffers (`quad`, `instances`, `vao`, `program`) and triggers `WEBGL_lose_context` on unmount.
