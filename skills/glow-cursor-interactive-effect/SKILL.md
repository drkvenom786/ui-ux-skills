---
name: glow-cursor-interactive-effect
description: Integrates interactive WebGL2 GlowCursor fluid light trails and click burst effects from React Bits into web applications (React, Next.js, and Vanilla HTML/JS) with real-time Navier-Stokes fluid advection, MacCormack correction, 5-level bloom pyramids, and dark/light ink themes.
risk: low
source: antigravity-custom-skills
date_added: 2026-11-05
---

# GlowCursor Interactive Effect

A GPU-accelerated interactive fluid light and cursor glow engine (originating from React Bits' `GlowCursor`). The simulation runs an incompressible Navier-Stokes fluid dynamics solver coupled with a 5-level hierarchical bloom pyramid in WebGL2, leaving luminous, drifting vapor trails that react to pointer speed, inertia, and click bursts.

---

## 1. Simulation Architecture & Core Features

GlowCursor executes multiple GPU compute and render passes per frame:
1. **Navier-Stokes Fluid Advection**: Solves fluid velocity using a 20-step Jacobi Poisson pressure projection and divergence solver.
2. **MacCormack Advection Scheme**: High-order advection with forward/backward error correction to eliminate numerical dissipation, preserving sharp dye filaments.
3. **5-Level Hierarchical Bloom Pyramid**: Progressive downsampling and upsampling with additive blending to produce wide, creamy HDR optical halos.
4. **Spring-Damped Emitter**: The fluid emitter chases the pointer using a second-order spring/omega follower, producing natural liquid lag and momentum sweeps.
5. **Directional Click Bursts**: Spawns 6 radial jets on user tap/click with randomized reach, injecting both high-velocity momentum and dense dye.
6. **Dark & Light Theme Adaptations**:
   - `dark` theme: Additive luminous screen-blended light with white-hot cores.
   - `light` theme: Inverse density ink-absorption model resembling sumi-e ink dispersing in water.

---

## 2. File Assets in this Skill

The skill directory contains production-ready assets for both React/Next.js and Vanilla JS projects:

| File | Purpose |
|---|---|
| [`assets/GlowCursor.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/glow-cursor-interactive-effect/assets/GlowCursor.jsx) | React / Next.js client component. |
| [`assets/GlowCursor.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/glow-cursor-interactive-effect/assets/GlowCursor.css) | Structural CSS layout for container and canvas layering. |
| [`assets/glowcursor.js`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/glow-cursor-interactive-effect/assets/glowcursor.js) | Standalone Vanilla JS WebGL2 implementation with `GlowCursor.init()`. |

---

## 3. React / Next.js Integration

### Basic Setup
Copy [`assets/GlowCursor.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/glow-cursor-interactive-effect/assets/GlowCursor.jsx) and [`assets/GlowCursor.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/glow-cursor-interactive-effect/assets/GlowCursor.css) into your components directory.

```jsx
'use client';

import GlowCursor from './GlowCursor';

export default function HeroBanner() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '550px' }}>
      <GlowCursor
        color="#5f8bff"
        secondaryColor="#a855f7"
        intensity={1.3}
        trailWidth={3}
        linger={1.4}
        glow={1.2}
        hotspot={0.8}
        clickBurst={true}
        theme="dark"
      >
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-8">
          <h1 className="text-5xl font-black text-white">Luminous Fluid Experience</h1>
          <p className="mt-4 text-slate-300">Move your cursor or click anywhere to splash light.</p>
        </div>
      </GlowCursor>
    </div>
  );
}
```

---

## 4. Vanilla HTML / JavaScript Integration

### Step 1: Include CSS and Script
```html
<link rel="stylesheet" href="./GlowCursor.css">
<script src="./glowcursor.js"></script>
```

### Step 2: Define Container Markup
```html
<div id="glow-hero" class="glow-cursor" style="position: relative; width: 100%; height: 500px; overflow: hidden; background: #0b0f19;">
  <div class="glow-cursor__content" style="position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; height: 100%;">
    <h1 style="color: white; font-family: sans-serif; font-size: 3rem;">Move Your Mouse</h1>
  </div>
</div>
```

### Step 3: Initialize via JavaScript
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('glow-hero');
  
  const glow = GlowCursor.init(container, {
    color: '#5f8bff',
    secondaryColor: '#ec4899',
    intensity: 1.4,
    trailWidth: 3.5,
    linger: 1.5,
    glow: 1.25,
    hotspot: 0.85,
    followSpeed: 0.65,
    clickBurst: true,
    theme: 'dark'
  });

  // Programmatic control API:
  // glow.burst(x, y);                   // Trigger custom burst at container coords
  // glow.setOptions({ color: '#22c55e' }); // Dynamically update color or settings
  // glow.clear();                       // Wipe existing fluid dye immediately
  // glow.destroy();                     // Clean up listeners and WebGL resources
});
```

---

## 5. Props & Options Reference

| Prop / Option | Type | Default | Description |
|---|---|---|---|
| `color` | string | `'#5f8bff'` | Primary color of the light where it is freshly drawn (hex, rgb, hsl). |
| `secondaryColor` | string | auto | Color the light cools into as it drifts. Defaults to an HSV +8° hue-shifted deeper shade. |
| `intensity` | number | `1.3` | Brightness of the emitted fluid light. |
| `trailWidth` | number | `3` | Thickness of the drawn fluid path in pixels (clamped between 0.5 and 40). |
| `linger` | number | `1.4` | Duration in seconds the light stays visible before completely fading out. |
| `glow` | number | `1.2` | Intensity of the soft 5-level bloom halo around the light trails. |
| `hotspot` | number | `0.8` | Intensity of the concentrated white-hot incandescent core near the cursor. |
| `followSpeed` | number | `0.6` | Spring tension of the light emitter following the pointer [0..1]. |
| `grain` | number | `0` | Procedural film grain overlay applied to the emitted light. |
| `clickBurst` | boolean | `true` | Releases 6 radial explosive fluid light jets on mouse/touch click. |
| `quality` | `'low' \| 'medium' \| 'high'` | `'high'` | Simulation grid resolution. Set to `'low'` or `'medium'` for low-power mobile devices. |
| `theme` | `'dark' \| 'light'` | `'dark'` | `'dark'` renders additive luminous glow; `'light'` renders high-contrast fluid ink absorption. |
| `blendMode` | string | auto | CSS `mix-blend-mode` for canvas layer. Defaults to `'screen'` in dark and `'normal'` in light. |
| `maxDevicePixelRatio` | number | `2` | Maximum device pixel ratio cap for Retina/HiDPI screens to preserve GPU fill rate. |
| `enabled` | boolean | `true` | When `false`, pauses new light emissions while allowing existing light to smoothly decay. |
| `children` | ReactNode | - | React children placed inside `.glow-cursor__content` above the canvas layer. |
| `className` | string | `''` | Custom CSS class name for outer wrapper. |
| `style` | object | - | Inline styles applied to outer wrapper. |

---

## 6. Technical Requirements & Edge Cases

1. **WebGL2 Extension:** Requires WebGL2 with the `EXT_color_buffer_float` extension for 16-bit half-float render targets (`RGBA16F`, `RG16F`, `R16F`). If unsupported, initialization fails gracefully without throwing errors.
2. **Idle Auto-Sleep:** When pointer motion stops and existing fluid fades beyond `linger * 1200 + 900` ms, the render loop automatically pauses to achieve 0% idle CPU/GPU consumption. Moving the cursor instantly wakes the simulation.
3. **Accessibility (`prefers-reduced-motion`):** When reduced motion is detected:
   - Complex fluid vortex advection is bypassed.
   - Pointer lag is removed (emitter moves 1:1 with cursor).
   - Dye decays softly in-place without disorienting swirling velocity.
