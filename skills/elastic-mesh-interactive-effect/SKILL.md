---
name: elastic-mesh-interactive-effect
description: Integrates interactive WebGL2 ElasticMesh 3D inflated squishy text and logo effects from React Bits into web applications (React, Next.js, and Vanilla HTML/JS) with signed distance fields (SDF), Poisson inflation solvers, 480 Hz continuum spring lattice simulation, poke/grab deformation, and PBR materials (balloon, chrome, jelly, clay).
risk: low
source: antigravity-custom-skills
date_added: 2026-11-05
---

# ElasticMesh Interactive Effect

An interactive WebGL2 3D inflated squishy typography and logo mesh originating from React Bits' `<ElasticMesh />`. It transforms any string of text or transparent SVG/PNG logo into a tactile 3D elastic body that can be grabbed, pulled, poked, and dented in real time. It features 2D signed distance field generation, multigrid Poisson inflation, 480 Hz continuum spring lattice simulation, interactive 3D studio tilting, dynamic drop shadows, and 4 physical PBR material finishes (`balloon`, `chrome`, `jelly`, `clay`).

---

## 1. Visual Architecture & Core Features

1. **SDF Generation & Multigrid Poisson Inflation**:
   - Rasterizes typography or vector artwork onto an off-screen 2D canvas.
   - Computes exact Euclidean Signed Distance Fields (SDF) using Meijster’s linear-time 2-pass parabolic transform.
   - Solves the Poisson equation \(\nabla^2 u = -4^{\text{level}}\) across hierarchical downsampled grids to calculate smooth volumetric balloon inflation heights.
   - Generates bicubic B-spline filtered slope normal maps for specular light wash.

2. **480 Hz Continuum Spring Lattice Simulation**:
   - Meshes the active surface into a dense 2D lattice of up to 5,200 nodes.
   - Sub-stepped at 480 Hz (\(\text{STEP} = 1/480\,\text{s}\)) with coupled harmonic restoration forces:
     - **Anchor Springs**: Pull displaced nodes back toward rest coordinates.
     - **Coupling Springs**: 8-way neighbor shear and strain propagation across adjacent nodes.
     - **Dent / Depth Springs**: Normal Z-axis depression with damped restitution.
     - **Grip Drag Constraints**: Hyperbolic tangent elasticity damping during user drags.

3. **Interactive Cursor Interaction**:
   - **Hover Denting**: Depresses the mesh surface when the cursor moves across it.
   - **Click Pokes**: Quick clicks (< 260ms, < 8px movement) send high-energy shockwave ripples outward.
   - **Drag & Grab**: Holding down on the surface anchors nodes to the cursor, stretching the mesh elastically before releasing into harmonic wobble.
   - **3D Studio Tilting**: Cursor coordinates tilt the camera yaw/pitch matrix dynamically for 3D perspective depth.

4. **4 Distinct PBR Materials**:
   - `balloon`: Glossy synthetic finish with wrapped ambient key lights, Fresnel edge reflections, and specular studio panels.
   - `chrome`: High-reflectance mirror metal with sharp environmental studio reflections and chromatic luminance.
   - `jelly`: Translucent volume with internal subsurface core glow and bright specular wrap.
   - `clay`: Matte ceramic finish with soft diffuse wrap, subtle specular highlights, and natural occlusion.

5. **Letter-by-Letter Inflated Intro**:
   - Analyzes connected spatial components (letters/islands).
   - Sequentially inflates each glyph from left to right using an arrival spring wave on mount.

---

## 2. Physics & Mathematical Formulations

### 1. Euclidean Distance Transform (Meijster Algorithm)
For an indicator grid \(f(x, y)\), the 1D parabolic envelope transform solves:
\[
d(x, y) = \min_{q} \left( (y - q)^2 + f(x, q) \right)
\]
In two passes (vertical followed by horizontal), exact Euclidean distance \(\sqrt{d}\) is evaluated in \(O(W \cdot H)\) linear time.

### 2. Multigrid Poisson Inflation Equation
Inflation thickness is modeled as a pressurized membrane anchored to the contour boundaries:
\[
\nabla^2 u = \frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 u}{\partial y^2} = -\rho
\]
Discretized with Jacobi relaxation with over-relaxation factor 1.85:
\[
u_{i, j}^{k+1} = u_{i, j}^k + 1.85 \cdot \left[ \frac{u_{i+1, j} + u_{i-1, j} + u_{i, j+1} + u_{i, j-1} + \rho}{4} - u_{i, j}^k \right]
\]

### 3. Continuum Lattice Dynamics (at 480 Hz)
For node \(k\) with rest position \((\bar{x}_k, \bar{y}_k)\) and displacement \(u_k = x_k - \bar{x}_k\):
\[
F_{\text{anchor}} = -k_{\text{anchor}} \cdot u_k - c_{\text{anchor}} \cdot v_k
\]
\[
F_{\text{couple}} = \sum_{n \in \mathcal{N}_k} w_n \cdot k_{\text{couple}} \cdot (u_n - u_k)
\]
Dent acceleration along normal:
\[
F_{\text{dent}} = -k_{\text{dent}} \cdot z_k - c_{\text{dent}} \cdot v_{z, k} + 2.6 \cdot P_{\text{depth}} \cdot P_{\text{hover}} \cdot \exp\left(-\frac{\Delta r^2}{2 R_{\text{press}}^2}\right)
\]

---

## 3. Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `'Squish'` | Text to inflate. Supports multi-line input via `\n`. |
| `src` | `string` | `''` | URL of an SVG or PNG to inflate instead of text. Transparent pixels define the contour. |
| `fontFamily` | `string` | `'system-ui, sans-serif'` | Font family for text rendering. Heavy, rounded faces produce the best inflation. |
| `fontWeight` | `number` | `900` | Font weight of the rendered text. |
| `color` | `string` | `'#3b5bff'` | Base tint for the material (supports hex, rgb, or CSS color names). |
| `imageColors` | `boolean` | `true` | Preserves original image pixel colors when `src` is provided. |
| `material` | `'balloon' \| 'chrome' \| 'jelly' \| 'clay'` | `'balloon'` | Surface shader finish. |
| `inflate` | `number` | `1` | Puffy thickness scale (`0.1` to `3`). `1` yields natural tubular inflation. |
| `stiffness` | `number` | `0.5` | Material firmness from `0` (soft and stretchy) to `1` (firm and snappy). |
| `wobble` | `number` | `0.6` | Oscillation damping duration after pokes/pulls (`0` to `1`). |
| `grabRadius` | `number` | `70` | Interaction influence radius under cursor in pixels. |
| `stretch` | `number` | `0.5` | Maximum pull deformation distance from `0` to `1`. |
| `press` | `number` | `0.5` | Depth of cursor denting and poke shockwaves (`0` to `1`). |
| `shadow` | `number` | `0.5` | Strength of the soft volumetric drop shadow (`0` to `1`). |
| `intro` | `boolean` | `true` | Sequentially inflates letters on initial mount. |
| `theme` | `'dark' \| 'light'` | `'dark'` | Studio lighting environment preset for dark or light backgrounds. |
| `dpr` | `number` | `auto` | Max device pixel ratio, capped at `2`. |
| `className` | `string` | `''` | Custom CSS class names applied to the container. |
| `style` | `CSSProperties` | `{}` | Inline CSS styles applied to the container. |

---

## 4. Component File Tree

```
C:\Users\V E N O M\.gemini\config\skills\elastic-mesh-interactive-effect/
├── SKILL.md                 # Full documentation, physics derivations, and integration guide
└── assets/
    ├── ElasticMesh.jsx      # React / Next.js client component with WebGL2 shader pipelines
    ├── ElasticMesh.css      # Container styling and canvas positioning
    └── elastic-mesh.js      # Standalone Vanilla JS engine (zero dependencies, WebGL2 native)
```

---

## 5. Integration Guide: React & Next.js

### Basic Text Usage

```jsx
'use client';

import ElasticMesh from './ElasticMesh';
import './ElasticMesh.css';

export default function HeroTitle() {
  return (
    <div style={{ width: '100%', height: '500px', position: 'relative', background: '#09090e' }}>
      <ElasticMesh
        text="VENOM"
        fontFamily="'Arial Black', sans-serif"
        fontWeight={900}
        color="#6366f1"
        material="balloon"
        inflate={1.1}
        stiffness={0.4}
        wobble={0.7}
        theme="dark"
      />
    </div>
  );
}
```

### SVG / Logo Inflation with Chrome Material

```jsx
'use client';

import ElasticMesh from './ElasticMesh';
import './ElasticMesh.css';

export default function ChromeLogo() {
  return (
    <div style={{ width: '100%', height: '500px', position: 'relative', background: '#000000' }}>
      <ElasticMesh
        src="/brand-mark.svg"
        material="chrome"
        imageColors={false}
        color="#e0e7ff"
        inflate={0.9}
        stiffness={0.6}
        wobble={0.5}
        press={0.7}
      />
    </div>
  );
}
```

---

## 6. Integration Guide: Vanilla JavaScript

Include `ElasticMesh.css` in your `<head>` and load `elastic-mesh.js`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="./ElasticMesh.css">
  <style>
    body {
      margin: 0;
      height: 100vh;
      background: #0d0c15;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    #mesh-container {
      width: 100%;
      height: 600px;
      position: relative;
    }
  </style>
</head>
<body>
  <div id="mesh-container"></div>

  <script src="./elastic-mesh.js"></script>
  <script>
    const container = document.getElementById('mesh-container');

    const mesh = ElasticMesh.init(container, {
      text: 'BOUNCE',
      material: 'jelly',
      color: '#f43f5e',
      inflate: 1.2,
      stiffness: 0.45,
      wobble: 0.75,
      press: 0.6,
      stretch: 0.65,
      theme: 'dark'
    });

    // Programmatic controls:
    // mesh.poke(window.innerWidth / 2, window.innerHeight / 2); // Poke at coordinates
    // mesh.update({ color: '#10b981', material: 'balloon' });   // Dynamically update options
    // mesh.destroy();                                           // Dispose buffers & canvas
  </script>
</body>
</html>
```

---

## 7. Performance & Accessibility

1. **Automatic Viewport Throttling**:
   - An `IntersectionObserver` automatically halts the 480 Hz physics loop and WebGL2 render pipeline when the container is scrolled out of view.
2. **Device Pixel Ratio (DPR) Clamping**:
   - Capped at `2.0` to preserve GPU fillrate and prevent excessive framebuffer allocation on high-DPI displays.
3. **Motion Sensitivity (`prefers-reduced-motion`)**:
   - Detects `(prefers-reduced-motion: reduce)`.
   - Skips the sequential intro wave and damps oscillations rapidly (\(\zeta = 0.8\)) to prevent triggering vestibular discomfort.
