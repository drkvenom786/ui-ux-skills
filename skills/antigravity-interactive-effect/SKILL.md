---
name: antigravity-interactive-effect
description: Integrates interactive WebGL2 Antigravity magnetic particle ring and gravity-defying field effects from React Bits into web applications (React, Next.js, and Vanilla HTML/JS) with instanced geometry, Oklab color palettes, harmonic wave undulations, spring-damped click bursts, and autonomous orbital drift.
risk: low
source: antigravity-custom-skills
date_added: 2026-11-05
---

# Antigravity Interactive Effect

A high-performance GPU-accelerated particle field simulation in WebGL2 (originating from React Bits' `Antigravity`). It renders up to 20,000 instanced particles in real time, pulling them into a customizable magnetic attractor ring that undulates with harmonic wave ripples, tracks the cursor, and unleashes powerful kinetic shockwaves on click release.

---

## 1. Simulation Architecture & Core Features

1. **Instanced WebGL2 Geometry**: Uses hardware-instanced triangle strips (`gl.drawArraysInstanced`) with dynamic particle buffers to simulate 1,500 to 20,000 particles at 60 FPS.
2. **Magnetic Attractor Ring**:
   - Particles within `magnetRadius` are drawn toward a circular orbit of radius `ringRadius`.
   - `fieldStrength` controls orbital tightness (high values create crisp rings; low values create diffuse halos).
   - Harmonic sinusoidal waves (`waveAmplitude`, `waveCount`, `waveSpeed`) warp the ring into flowing rippling flower-like silhouettes.
3. **Four Particle Geometries (`particleShape`)**:
   - `capsule`: Stretches into dashes pointing toward the cursor/attractor center.
   - `sphere`: Circular glowing points with soft edge falloff.
   - `box`: Crisp rectangular particles.
   - `tetrahedron`: Sharp triangular geometry.
4. **Oklab Perceptual Color Palette**:
   - Blends colors smoothly through perceptual Oklab color space with warmth and lightness compensation for light/dark modes.
   - Color distribution modes:
     - `conic`: Rotates the palette angularly around the attractor center (`colorSpeed`).
     - `radial`: Radiates color bands outward from the ring.
     - `random`: Assigns each particle a randomized swatch from the palette.
5. **Spring Charge & Click Bursts**:
   - Holding down mouse/touch charges an implosion field (`uCharge`), contracting the ring and accelerating its spin.
   - Releasing fires an explosive radial kick that scatters particles outward before second-order springs pull them back into orbit.
6. **Autonomous Drift (`autoAnimate`)**:
   - When idle or when pointer interaction is absent, the attractor point gracefully roams along a Lissajous curve.

---

## 2. File Assets in this Skill

The skill directory provides ready-to-use production assets for both React/Next.js and Vanilla JS projects:

| File | Purpose |
|---|---|
| [`assets/Antigravity.jsx`](file:///C:/Users/V E N O M/.gemini/config/skills/antigravity-interactive-effect/assets/Antigravity.jsx) | React / Next.js client component. |
| [`assets/Antigravity.css`](file:///C:/Users/V E N O M/.gemini/config/skills/antigravity-interactive-effect/assets/Antigravity.css) | Layout styles for canvas positioning and viewport containment. |
| [`assets/antigravity.js`](file:///C:/Users/V E N O M/.gemini/config/skills/antigravity-interactive-effect/assets/antigravity.js) | Standalone Vanilla JS WebGL2 library with `Antigravity.init()`. |

---

## 3. React / Next.js Integration

### Basic Setup
Copy [`assets/Antigravity.jsx`](file:///C:/Users/V E N O M/.gemini/config/skills/antigravity-interactive-effect/assets/Antigravity.jsx) and [`assets/Antigravity.css`](file:///C:/Users/V E N O M/.gemini/config/skills/antigravity-interactive-effect/assets/Antigravity.css) into your components directory.

```jsx
'use client';

import Antigravity from './Antigravity';

export default function HeroSection() {
  return (
    <div style={{ width: '100%', height: '500px', position: 'relative', background: '#0a051d' }}>
      <Antigravity
        colors={['#5227FF', '#FF9FFC', '#B497CF']}
        count={1800}
        magnetRadius={9}
        ringRadius={7}
        particleSize={0.9}
        waveAmplitude={1.2}
        waveCount={3}
        waveSpeed={0.4}
        autoAnimate={true}
        clickBurst={true}
      />
    </div>
  );
}
```

---

## 4. Vanilla HTML / JavaScript Integration

### Step 1: Include CSS and Script
```html
<link rel="stylesheet" href="./Antigravity.css">
<script src="./antigravity.js"></script>
```

### Step 2: Define Container Markup
```html
<div id="antigravity-field" style="position: relative; width: 100%; height: 500px; background: #070314;"></div>
```

### Step 3: Initialize via JavaScript
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('antigravity-field');

  const ag = Antigravity.init(container, {
    colors: ['#5227FF', '#FF9FFC', '#B497CF'],
    count: 1600,
    magnetRadius: 9,
    ringRadius: 7,
    particleSize: 0.9,
    waveAmplitude: 1,
    waveCount: 3,
    waveSpeed: 0.4,
    particleShape: 'capsule',
    colorMode: 'conic',
    autoAnimate: true,
    clickBurst: true
  });

  // Programmatic API:
  // ag.burst(1.5);                                 // Trigger kinetic explosion
  // ag.setOptions({ colors: ['#22c55e', '#38bdf8'] }); // Update palette or settings
  // ag.destroy();                                  // Free WebGL context & listeners
});
```

---

## 5. Props & Options Reference

| Prop / Option | Type | Default | Description |
|---|---|---|---|
| `colors` | string[] | `['#5227FF', '#FF9FFC', '#B497CF']` | Palette array interpolated through perceptual Oklab color space. |
| `color` | string | `undefined` | Single solid color overriding `colors` when specified. |
| `colorMode` | `'conic' \| 'radial' \| 'random'` | `'conic'` | Palette distribution: `conic` turns around cursor; `radial` spreads from ring; `random` distributes swatches across particles. |
| `colorSpeed` | number | `0.05` | Angular rotation speed of the conic palette. Set to `0` to keep stationary. |
| `particleShape` | `'capsule' \| 'sphere' \| 'box' \| 'tetrahedron'` | `'capsule'` | Geometry profile. `capsule` stretches along particle velocity vectors toward the attractor. |
| `count` | number | `1500` | Number of particles in the field (clamped between 1 and 20,000). |
| `particleSize` | number | `0.9` | Base size scale of particles. |
| `particleVariance` | number | `1` | Depth and pulsation size variance [0..1]. |
| `magnetRadius` | number | `9` | World-space radius around cursor where particles are captured into the ring. |
| `ringRadius` | number | `7` | World-space radius of the equilibrium attractor ring. |
| `fieldStrength` | number | `10` | Orbital tightness. Higher values force particles into a sharp ring; lower values spread them into a band. |
| `waveAmplitude` | number | `1` | Height of the undulating ripples around the ring. Set to `0` for an unperturbed circle. |
| `waveCount` | number | `3` | Frequency of ripples around the perimeter (pair with high amplitude for flower silhouettes). |
| `waveSpeed` | number | `0.4` | Velocity of the ripples travelling around the ring. |
| `rotationSpeed` | number | `0` | Orbital angular velocity around the cursor (negative values orbit counter-clockwise). |
| `pulseSpeed` | number | `3` | Oscillation frequency for individual particle size pulsation. |
| `depthFactor` | number | `1` | 3D depth attenuation: foreground particles enlarge; background particles shrink and soften. |
| `ambient` | number | `0.25` | Base opacity of uncaptured particles far from the ring [0..1]. |
| `lerpSpeed` | number | `0.05` | Emitter follow speed towards cursor [0.001..1]. |
| `autoAnimate` | boolean | `true` | Enables autonomous Lissajous roaming when cursor is idle. |
| `interactive` | boolean | `true` | Allows particles to follow cursor or touch gestures. |
| `clickBurst` | boolean | `true` | Holding mouse/touch compresses and charges the ring; releasing triggers an explosive blast. |
| `intro` | boolean | `true` | Animates particles rising gracefully into place on initial load. |
| `lightMode` | boolean | `false` | Tone-maps pale colors darker to ensure high contrast against white/light backgrounds. |
| `opacity` | number | `1` | Master opacity multiplier [0..1]. |
| `maxDevicePixelRatio` | number | `2` | Device pixel ratio cap for HiDPI/Retina screens to safeguard frame rates. |
| `className` | string | `''` | Optional wrapper CSS class name. |
| `style` | object | - | Optional wrapper inline style object. |

---

## 6. Performance, Mobile & Context Resilience

1. **Context Loss & Restoration**: Listens to `webglcontextlost` and `webglcontextrestored`, reallocating vertex array objects, instanced buffers, and palette textures automatically.
2. **Dynamic Pixel Budget**: Automatically caps internal render resolution according to `PIXEL_BUDGET = 2.4e6` to guarantee smooth performance on 4K and Retina screens.
3. **Auto-Sleep Lifecycle**: Integrates with `IntersectionObserver` and `visibilitychange` to pause WebGL draw calls when off-screen or in background tabs, ensuring 0% idle GPU usage.
4. **`prefers-reduced-motion` Support**: Detects user motion preferences, disabling violent blast impulses and scaling down rotation and wave velocities.
