---
name: liquid-ether-interactive-effect
description: Integrates interactive WebGL2 LiquidEther fluid dynamics effects with Navier-Stokes advection, pressure projection, multi-color gradient palettes, click bursts, auto-demo swirls, and glassmorphic backgrounds into web applications (React, Next.js, and Vanilla HTML/JS).
risk: low
source: antigravity-custom-skills
date_added: 2026-11-04
---

# LiquidEther Interactive WebGL2 Fluid Effect

A GPU-accelerated Navier-Stokes fluid simulation component (originating from React Bits) that renders high-performance ethereal liquid swirls with mouse/touch drag currents, click bursts, automatic ambient idle stirring, customizable multi-stop color palettes, and glassmorphic synergy.

---

## Overview & Architecture

LiquidEther solves the incompressible Navier-Stokes equations directly in WebGL2 fragment shaders using floating-point texture framebuffers (`EXT_color_buffer_float` / `gl.HALF_FLOAT`):

1. **Splat**: Injects directional velocity impulses from pointer movement, touch drags, click bursts, or ambient swirling.
2. **Smooth**: Applies multi-pass velocity diffusion based on the `viscosity` parameter.
3. **Divergence**: Computes the velocity field divergence across the grid.
4. **Pressure Solve**: Solves Poisson's equation over 32 Jacobi relaxation iterations to enforce mass conservation.
5. **Project**: Subtracts the pressure gradient from velocity to maintain an incompressible, divergence-free flow.
6. **Advect**: Advects the velocity field forward in time with MacCormack-style second-order correction and boundary walls.
7. **Display**: Evaluates velocity magnitude using bicubic B-spline filtering and maps speeds to a perceptual linear palette texture with filmic grain.

---

## 1. Quick Integration (Vanilla HTML / JS)

### Step 1: Add Canvas Background Container
Place the canvas container inside any target section (e.g., `#projects`, `#hero`):

```html
<section id="projects" class="relative py-24 px-6 bg-black/60 overflow-visible">
    <!-- LiquidEther Canvas Background -->
    <div id="projects-liquidether" class="liquid-ether" style="position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; pointer-events: none; z-index: 0; overflow: hidden;">
        <canvas class="liquid-ether__canvas" style="position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; display: block;" aria-hidden="true"></canvas>
    </div>

    <!-- Foreground Content (Cards, Text) -->
    <div class="relative z-10 max-w-7xl mx-auto">
        <h2 class="text-5xl font-bold text-white mb-4">Featured Projects</h2>
        <!-- Foreground elements sit on top -->
    </div>
</section>
```

### Step 2: Include `liquidether.js` and Initialize

```html
<link rel="stylesheet" href="LiquidEther.css">
<script src="liquidether.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('projects-liquidether');
        if (container && window.LiquidEther) {
            window.LiquidEther.init(container, {
                colors: ["#ffffff", "#000000", "#ffffff"], // Chrome/monochrome smoke or ['#5227FF', '#22C55E', '#A855F7']
                mouseForce: 20,
                cursorSize: 35,
                persistence: 0.48,
                autoDemo: true,
                autoSpeed: 0.5,
                autoIntensity: 0.8,
                resolution: 0.35,
                backgroundColor: 'transparent'
            });
        }
    });
</script>
```

---

## 2. React / Next.js Integration

```jsx
import LiquidEther from './LiquidEther';
import './LiquidEther.css';

export default function ProjectsBackground() {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <LiquidEther
        colors={["#ffffff", "#000000", "#ffffff"]}
        mouseForce={20}
        cursorSize={35}
        persistence={0.48}
        autoDemo={true}
        autoSpeed={0.5}
        autoIntensity={0.8}
        resolution={0.35}
        backgroundColor="transparent"
      />
    </div>
  );
}
```

---

## 3. Configuration Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `colors` | `string[]` | `['#5227FF', '#FF9FFC', '#B497CF']` | Palette gradient stops from calm flow to fastest current. |
| `intensity` | `number` | `1` | Brightness and luminescence of the liquid streams. |
| `mouseForce` | `number` | `20` | Velocity impulse imparted by cursor or touch movement. |
| `cursorSize` | `number` | `100` | Radius of the liquid area affected by pointer interaction (px). |
| `persistence` | `number` | `0.75` | Motion decay rate (0 = vanishes instantly, 1 = sustains indefinitely). |
| `viscosity` | `number` | `0` | Fluid thickness (higher values produce slow, viscous syrup swirls). |
| `resolution` | `number` | `0.5` | Simulation grid density multiplier (0.1 = soft & fast, 1 = ultra crisp). |
| `autoDemo` | `boolean` | `true` | Continues ambient swirling automatically when cursor is idle. |
| `autoSpeed` | `number` | `0.5` | Rate of ambient wandering currents. |
| `autoIntensity` | `number` | `2.2` | Strength of ambient currents compared to user cursor force. |
| `autoResumeDelay`| `number` | `1000` | Milliseconds of inactivity before ambient stirring resumes. |
| `clickBurst` | `boolean` | `true` | Click / tap shoots a vortex puff in the travel direction. |
| `bounceEdges` | `boolean` | `false` | Whether fluid reflects off bounding walls instead of flowing out. |
| `intro` | `boolean` | `true` | Plays a central spiral bloom sweep on mount. |
| `lightMode` | `boolean` | `false` | Renders the fluid as soft calligraphic ink for light backgrounds. |
| `backgroundColor`| `string` | `'transparent'` | Background fill color. Leave transparent to show underlying page layers. |
| `maxDevicePixelRatio` | `number` | `2` | Caps rendering resolution on high-DPI retina screens. |

---

## 4. Performance & Mobile Optimizations

1. **Non-blocking Pointer Tracking**: The canvas has `pointer-events: none` so underlying UI controls, folder tabs, and buttons retain 100% clickability and drag responsiveness. Pointer motion is tracked globally via window coordinates mapped against container bounding boxes.
2. **Hardware Throttling & Visibility Caching**: `IntersectionObserver` and `document.visibilityState` automatically pause simulation frames when the section scrolls out of view or the browser tab is minimized.
3. **Accessibility**: Automatically disables the intro sweep and click bursts when `prefers-reduced-motion` is detected.

---

## 5. Asset Files

- [LiquidEther.jsx](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/liquid-ether-interactive-effect/assets/LiquidEther.jsx): Full React Bits component source.
- [LiquidEther.css](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/liquid-ether-interactive-effect/assets/LiquidEther.css): Minimal layout and canvas sizing styles.
- [liquidether.js](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/liquid-ether-interactive-effect/assets/liquidether.js): Standalone vanilla WebGL2 JavaScript engine.
