---
name: particle-text-interactive-effect
description: Integrates interactive ParticleText kinetic typography effects from React Bits into web applications (React, Next.js, and Vanilla HTML/JS) with particle sampling, 4 intro choreographies (gather, rain, spiral, scan), cursor repulsion, spring-damped click bursts, and motion-reactive heat glow.
risk: low
source: antigravity-custom-skills
date_added: 2026-11-05
---

# ParticleText Interactive Effect

A GPU-friendly Canvas 2D kinetic typography engine (originating from React Bits' `ParticleText`). It rasterizes text into discrete glyph targets, spawns hundreds or thousands of interactive particles, choreographs their assembly via 4 distinct intro styles (`gather`, `rain`, `spiral`, `scan`), and responds to cursor repulsion, spring-damped click explosions, and motion-reactive thermal glow.

---

## 1. Visual Architecture & Core Features

1. **Glyph Sampling & Adaptive Density**: An offscreen canvas samples glyph pixel values (>40 alpha). Particle count dynamically scales with viewport resolution (capped between 900 and 5,200 particles).
2. **Four Intro Choreographies**:
   - `gather`: Scattered particles pulled together from surrounding 2D space.
   - `rain`: Particles tumble vertically from above with randomized depth and velocity.
   - `spiral`: Swirls particles inwards along an elliptical vortex.
   - `scan`: A sweeping vertical laser line that materializes glyphs behind its luminous crest.
3. **Interactive Physics**:
   - **Pointer Repulsion**: Smooth, quadratic force pushing particles away from cursor within `repelRadius`.
   - **Click Bursts (`clickBurst`)**: Radial blast wave blowing particles outward with a damped harmonic oscillator (`BURST_SPRING = 18`, `BURST_DAMPING = 7.5`) that smoothly snaps back into place.
   - **Idle Drift**: Subtly breathes with Perlin-like sinusoidal resting motion when the cursor is idle.
4. **Motion-Heat Shading**:
   - Particles heat up to `highlightColor` when accelerated by pointer repulsion or click bursts, cooling down to `color` as they settle.
   - 12 tonal interpolation levels and 8 fade tiers for silky transitions.
   - Optional offscreen bloom pass for soft optical glow.
5. **Multiple Particle Shapes**:
   - `circle`: Classic circular dots.
   - `square`: Crisp digital pixels.
   - `line`: Directional kinetic strokes that stretch along their velocity vector and align into neat hatching at rest.

---

## 2. File Assets in this Skill

The skill directory provides ready-to-use production assets for both React/Next.js and Vanilla JS projects:

| File | Purpose |
|---|---|
| [`assets/ParticleText.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/particle-text-interactive-effect/assets/ParticleText.jsx) | React / Next.js client component. |
| [`assets/ParticleText.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/particle-text-interactive-effect/assets/ParticleText.css) | Layout styles for container, canvas, and accessible screen reader text. |
| [`assets/particletext.js`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/particle-text-interactive-effect/assets/particletext.js) | Standalone Vanilla JS Canvas 2D engine with `ParticleText.init()`. |

---

## 3. React / Next.js Integration

### Basic Setup
Copy [`assets/ParticleText.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/particle-text-interactive-effect/assets/ParticleText.jsx) and [`assets/ParticleText.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/particle-text-interactive-effect/assets/ParticleText.css) into your components directory.

```jsx
'use client';

import ParticleText from './ParticleText';

export default function TitleBanner() {
  return (
    <div style={{ width: '100%', height: 360 }}>
      <ParticleText
        text="VENOM"
        particleSize={2}
        density={4}
        color="currentColor"
        highlightColor="#ff5a36"
        highlightMode="motion"
        shape="circle"
        intro="gather"
        scatter={180}
        gatherDuration={2300}
        stagger={420}
        clickBurst={true}
        burstStrength={1}
        pointerRepel={40}
        repelRadius={160}
        idleDrift={0.7}
        trigger="hover"
        fontSize="clamp(3rem, 12vw, 8rem)"
        fontWeight={800}
        fontFamily="inherit"
        glow={true}
      />
    </div>
  );
}
```

---

## 4. Vanilla HTML / JavaScript Integration

### Step 1: Include CSS and Script
```html
<link rel="stylesheet" href="./ParticleText.css">
<script src="./particletext.js"></script>
```

### Step 2: Define Container Markup
```html
<div id="particle-banner" style="position: relative; width: 100%; height: 360px;"></div>
```

### Step 3: Initialize via JavaScript
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('particle-banner');

  const pt = ParticleText.init(container, {
    text: 'VENOM',
    particleSize: 2,
    density: 4,
    color: '#ffffff',
    highlightColor: '#a855f7',
    highlightMode: 'motion',
    shape: 'circle',
    intro: 'gather',
    gatherDuration: 2000,
    stagger: 380,
    scatter: 180,
    clickBurst: true,
    burstStrength: 1.2,
    pointerRepel: 45,
    repelRadius: 150,
    idleDrift: 0.6,
    trigger: 'hover',
    glow: true
  });

  // Programmatic API:
  // pt.burst(clientX, clientY);        // Trigger click burst at coordinates
  // pt.restartIntro();                 // Re-trigger the particle intro choreography
  // pt.setOptions({ text: 'NEXT' });   // Dynamically update text or configuration
  // pt.destroy();                      // Clean up event listeners and canvas
});
```

---

## 5. Props & Options Reference

| Prop / Option | Type | Default | Description |
|---|---|---|---|
| `text` | string | `'React Bits'` | Text string sampled into particle targets. |
| `color` | string | `'currentColor'` | Particle color at rest. Uses surrounding CSS computed text color by default. |
| `highlightColor` | string | `'#ff5a36'` | Color particles assume while moving or repelled. Also colors the bloom glow and scanline. |
| `intro` | `'gather' \| 'rain' \| 'spiral' \| 'scan'` | `'gather'` | Intro choreography: gather pulls points together; rain falls from above; spiral swirls inward; scan sweeps a laser line. |
| `gatherDuration` | number | `1600` | Duration in milliseconds for the text formation animation. |
| `stagger` | number | `420` | Maximum per-particle randomized launch delay in milliseconds. |
| `scatter` | number | `180` | Starting distance in pixels from target positions in gather and spiral intros. |
| `trigger` | `'mount' \| 'hover' \| 'click'` | `'mount'` | When the intro re-triggers: once on mount, on hover enter, or on mouse click. |
| `clickBurst` | boolean | `true` | Clicking detonates particles outward before springing back into place (disabled when `trigger="click"`). |
| `burstStrength` | number | `1` | Blast radius and force of click explosions. |
| `pointerRepel` | number | `40` | Repulsion strength pushing particles away from cursor. |
| `repelRadius` | number | `120` | Radius of cursor influence in pixels. |
| `idleDrift` | number | `0.7` | Amplitude of subtle resting drift after assembly. |
| `shape` | `'circle' \| 'square' \| 'line'` | `'circle'` | Particle geometry: circle (dots), square (pixels), or line (velocity-stretched directional strokes). |
| `highlightMode` | `'motion' \| 'gradient'` | `'motion'` | `'motion'` heats particles while moving; `'gradient'` blends colors horizontally across text. |
| `particleSize` | number | `2` | Rendered particle size in CSS pixels. |
| `density` | number | `4` | Sampling step for glyph rasterization. Lower values create more particles. |
| `glow` | boolean | `true` | Adds a soft bloom in `highlightColor` around accelerated particles. |
| `fontSize` | string \| number | `'clamp(3rem, 12vw, 8rem)'` | CSS font size or numeric pixel size. Automatically scales down if text overflows container. |
| `fontWeight` | string \| number | `800` | Font weight used for glyph rasterization. |
| `fontFamily` | string | `'inherit'` | Font family used for glyph rasterization. Automatically waits for web font loading. |
| `className` | string | `''` | Optional wrapper CSS class name. |
| `style` | object | - | Optional wrapper inline style object. |

---

## 6. Performance, Accessibility & Safeguards

1. **Accessibility (`.particle-text__sr`)**: The plain text is rendered in an accessible, visually-hidden span so screen readers, search engine crawlers, and text selection read the content normally.
2. **Font Loading Guard**: Automatically awaits `document.fonts.ready` before sampling to prevent misaligned particle placement with custom web fonts.
3. **Auto-Sleep Loop**: When particles settle and pointer motion stops, `requestAnimationFrame` automatically pauses. Moving the cursor or triggering a burst wakes the loop immediately.
4. **`prefers-reduced-motion`**: Detects reduced-motion preferences, disabling intros, scatter, repulsion, and click bursts while keeping particles rendered at their target positions.
