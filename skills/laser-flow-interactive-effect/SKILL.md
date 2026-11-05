---
name: laser-flow-interactive-effect
description: Integrates interactive WebGL2 LaserFlow volumetric beam and surface illumination effects from React Bits into web applications (React, Next.js, and Vanilla HTML/JS) with realistic surface impacts, edge light washes, corner spills, atmospheric dust particles, and responsive desktop-only gating.
risk: low
source: antigravity-custom-skills
date_added: 2026-11-04
---

# LaserFlow Interactive Effect

A GPU-accelerated volumetric laser beam and surface lighting engine (originating from React Bits' `LaserFlow`). The shader projects an intense, focused light beam that falls from the top of the viewport or section, impacts the top boundary of an interactive target element (such as a form, card, or container), splashes across its top perimeter, spills down its rounded corners, and scatters glittering dust and lens flares in response to user cursor interaction.

---

## 1. Overview & Architecture

LaserFlow runs in an offscreen or full-bleed WebGL2 fragment shader evaluating real-time distance fields and optical phenomena:
1. **Volumetric Beam Core & Halo**: A narrow laser filament with exponential radial decay and high-order brightness.
2. **Impact Flare & Skirt**: A bright splash at the point of contact that dynamically breathes and sweeps horizontally.
3. **Corner Spill (`spill`)**: Procedural cascading streaks pouring down the left and right rounded shoulders of the target surface.
4. **Perimeter Light Wash**: High-speed luminescence running along the top edge of the surface element.
5. **Harmonious HSV Tinting**: A procedural 16-shade optical spectrum derived automatically from any primary input color.
6. **Glittering Dust & Micro-Sparks**: Procedural twinkling floating particles interacting with cursor motion.

---

## 2. Quick Integration (Vanilla HTML / JS)

### Step 1: Link CSS and Script

```html
<link rel="stylesheet" href="LaserFlow.css">
<script src="laserflow.js"></script>
```

### Step 2: Add Markup

Place the `laser-flow-container` over the section or above the target surface. Keep the target surface relatively positioned with a higher `z-index` so its contents remain interactive:

```html
<section id="contact" class="relative overflow-hidden py-24">
    <!-- LaserFlow full-bleed container (desktop only) -->
    <div id="contact-laserflow" class="hidden lg:block pointer-events-none z-0" style="position: absolute; inset: 0; width: 100%; height: 100%; overflow: hidden;"></div>

    <div class="container mx-auto relative z-10">
        <!-- Target Surface (Form / Card) -->
        <div id="contact-form-card" class="bg-card p-10 rounded-3xl border border-white/10">
            <!-- Form inputs and interactive controls -->
        </div>
    </div>
</section>
```

### Step 3: Initialize via JavaScript

```javascript
document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('contact-laserflow');
  const targetSurface = document.getElementById('contact-form-card');

  if (container && targetSurface && window.LaserFlow) {
    window.LaserFlow.init(container, {
      surfaceRef: targetSurface,
      beamPosition: 0.78,          // Horizontal position across section (e.g. 0.78 for right column)
      surfaceBeamRatio: 0.75,      // Position relative to target surface (0.75 = right side of card)
      color: '#A855F7',            // Light color (derives all tints automatically)
      intensity: 1.4,              // Overall brightness
      flare: 1.2,                  // Impact splash size
      spread: 1.3,                 // Surface travel distance
      spill: 0.8,                  // Corner cascade intensity
      fog: 0.0,                    // 0 = crisp background (no cloudy haze)
      dust: 1.2,                   // Floating dust particles
      speed: 1.2,                  // Animation flow speed
      mouseInteraction: true,      // Cursor brightening & lens flare
      desktopOnly: true            // Gates execution to desktop (width >= 1024px)
    });
  }
});
```

---

## 3. React / Next.js Integration

```jsx
import { useRef } from 'react';
import LaserFlow from './LaserFlow';

export default function ContactSection() {
  const cardRef = useRef(null);

  return (
    <section className="relative overflow-hidden py-24">
      {/* LaserFlow Container (desktop only) */}
      <div className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0">
        <LaserFlow
          surfaceRef={cardRef}
          beamPosition={0.78}
          color="#A855F7"
          intensity={1.4}
          flare={1.2}
          spread={1.3}
          spill={0.8}
          fog={0.0}
          dust={1.2}
          speed={1.2}
          mouseInteraction={true}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div ref={cardRef} className="bg-card p-10 rounded-3xl border border-white/10">
          {/* Card content */}
        </div>
      </div>
    </section>
  );
}
```

---

## 4. Props & Options Reference

| Prop / Option | Type | Default | Description |
|---|---|---|---|
| `surfaceRef` | `HTMLElement \| RefObject` | `null` | Target element the laser strikes and flows along. |
| `beamPosition` | number | `0.6` | Horizontal entry point of the beam across the container [0..1]. |
| `surfaceBeamRatio` | number | `0.75` | Target beam alignment across the target surface width [0..1]. |
| `color` | string | `'#3847ff'` | Base beam color. Generates 16 harmonious HSV tints. |
| `intensity` | number | `1.8` | Overall brightness multiplier. |
| `beamWidth` | number | `1.5` | Thickness of the vertical laser beam filament. |
| `flare` | number | `1.5` | Size and bloom of the surface impact splash. |
| `spread` | number | `1.5` | How far light washes horizontally along the top edge. |
| `spill` | number | `1.0` | How much light pours over the rounded corners. |
| `fog` | number | `0.2` | Atmospheric smoke. Set to `0` for deep clean background. |
| `dust` | number | `1.6` | Twinkling glitter particles floating in the atmosphere. |
| `speed` | number | `1.5` | Animation and advection speed multiplier. |
| `mouseInteraction` | boolean | `true` | Brightens light and renders reactive lens glint on cursor hover. |
| `desktopOnly` | boolean | `false` | Automatically restricts rendering to desktop (`>= 1024px`). |

---

## 5. Assets

Source code files are saved in `assets/`:
- [`LaserFlow.jsx`](assets/LaserFlow.jsx): Full React Bits component.
- [`LaserFlow.css`](assets/LaserFlow.css): Fullscreen canvas styling.
- [`laserflow.js`](assets/laserflow.js): Standalone Vanilla JS WebGL2 implementation with auto-resize and desktop gating.
