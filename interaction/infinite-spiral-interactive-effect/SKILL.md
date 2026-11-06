---
name: infinite-spiral-interactive-effect
description: Integrates interactive InfiniteSpiral 3D cylindrical spiral gallery components from React Bits into web applications (React, Next.js, and Vanilla HTML/JS) with continuous helix layouts, perspective depth scaling, smoothstep edge fading, distance blur, and multi-mode gesture navigation (auto, drag, scroll, all).
risk: low
source: antigravity-custom-skills
date_added: 2026-11-05
---

# InfiniteSpiral Interactive Effect

An interactive 3D cylindrical helix gallery component originating from React Bits' `<InfiniteSpiral />`. It organizes images, links, or portfolio cards into a continuous looping 3D spiral with true CSS 3D perspective transforms, dynamic distance blur, edge fade attenuation, and smooth multi-mode navigation (continuous auto-rotation, touch/pointer dragging, and page scroll synchronization).

---

## 1. Visual Architecture & Core Features

1. **Continuous 3D Cylindrical Helix**:
   - Arranges elements along a 3D helix:
     \[
     x = R \cdot \sin(\theta), \quad z = R \cdot \cos(\theta), \quad y = \text{offset} \cdot \Delta y
     \]
   - Calculates relative circular modulo index offsets to wrap cards infinitely without visible seam resets.

2. **Perspective Depth Scaling & Dynamic Z-Index**:
   - Calculates realistic perspective magnification based on foreground/background depth \(z\):
     \[
     S_{\text{depth}} = \operatorname{clamp}\left(\frac{P}{P - z}, 0.72, 1.45\right)
     \]
   - Dynamically reorders CSS `z-index` so cards facing the viewer layer cleanly above background cards.

3. **Smoothstep Focus & Edge Fade / Blur**:
   - Cards near the center plane receive a focus boost (`centerScale`).
   - Cards approaching the top or bottom edges smoothly attenuate opacity using Hermite interpolation (`smoothstep`) and increase Gaussian depth-of-field blur (`edgeBlur`).

4. **Multi-Mode Motion (`animationMode`)**:
   - `auto`: Continuous automatic rotation with exponential speed smoothing and `pauseOnHover` dampening.
   - `drag`: Direct pointer dragging with pointer capture and drag-click suppression (`clickCapture`).
   - `scroll`: Page scroll delta translates directly to spiral rotation.
   - `all`: Combines auto-rotation, pointer dragging, and scroll acceleration simultaneously.

5. **Responsive Auto-Fit**:
   - A `ResizeObserver` monitors stage dimensions and proportionally scales radius, vertical spacing, and card dimensions on mobile devices.

---

## 2. Mathematical Formulations

### 1. Circular Offset & Helix Angle
For item index \(i\) with progress \(p\) and total items \(N\):
\[
\delta_{\text{raw}} = i - p
\]
\[
\delta = \left(\left(\delta_{\text{raw}} + \frac{N}{2}\right) \bmod N\right) - \frac{N}{2}
\]
Helix angular coordinate:
\[
\theta = \delta \cdot \left(\frac{360^\circ}{K_{\text{turn}}}\right) + \theta_{\text{rotation}}
\]

### 2. 3D Cartesian Coordinates & Perspective Scaling
Given responsive radius \(R\) and stage perspective \(P\):
\[
x = R \cdot \sin(\theta), \quad z = R \cdot \cos(\theta)
\]
\[
y = \delta \cdot \Delta y \cdot \text{fit}
\]
\[
S_{\text{depth}} = \operatorname{clamp}\left(\frac{P}{P - z}, 0.72, 1.45\right)
\]
\[
S_{\text{visual}} = (1 + (S_{\text{center}} - 1) \cdot \text{focus}) \cdot \text{fit} \cdot S_{\text{depth}}
\]

### 3. Edge Attenuation & Blur
Hermite cubic smoothstep:
\[
H(t) = t^2 \cdot (3 - 2t) \quad \text{where } t = \operatorname{clamp}\left(\frac{\text{edge} - a}{b - a}, 0, 1\right)
\]
\[
\text{opacity} = 1 - H(\text{fadeStart}, 1, \text{edge})
\]
\[
\text{blur} = B_{\text{max}} \cdot H(0.35, 1, \text{edge})
\]

---

## 3. Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `(string \| SpiralItem)[]` | `[]` | Images shown in the spiral. Objects accept `src`, `alt`, `href`, `target`, `label`, and `id`. |
| `speed` | `number` | `0.55` | Automatic travel speed in cards/sec and sensitivity multiplier of scroll motion. |
| `direction` | `'up' \| 'down'` | `'up'` | Vertical rotation direction. |
| `animationMode` | `'auto' \| 'drag' \| 'scroll' \| 'all'` | `'auto'` | Interaction mode: automatic spin, pointer drag, page scroll, or hybrid all. |
| `radius` | `number` | `170` | Depth radius of the helix cylinder in pixels. |
| `cardWidth` | `number` | `100` | Width of each card in pixels. |
| `cardHeight` | `number` | `100` | Height of each card in pixels. |
| `verticalSpacing` | `number` | `60` | Vertical pitch distance between neighboring cards in pixels. |
| `perspective` | `number` | `1000` | CSS perspective applied to the 3D stage in pixels. |
| `cardsPerTurn` | `number` | `7` | Number of cards required to complete one 360° cylindrical revolution. |
| `rotation` | `number` | `0` | Global angular offset in degrees. |
| `cardTilt` | `number` | `0` | Additional clockwise tilt angle applied to cards in degrees. |
| `cardRadius` | `number` | `10` | Corner border radius of cards in pixels. |
| `centerScale` | `number` | `1.2` | Scale multiplier for cards facing closest to the viewer plane. |
| `edgeFade` | `number` | `0.3` | Fraction of outer travel range used for opacity fading. |
| `edgeBlur` | `number` | `6` | Maximum depth-of-field blur applied near boundaries in pixels. |
| `pauseOnHover` | `boolean` | `true` | Smoothly decelerates automatic rotation to a stop when hovered. |
| `imageFit` | `'cover' \| 'contain'` | `'cover'` | CSS object-fit applied to card images. |
| `grayscale` | `number` | `0` | Grayscale filter intensity from `0` (color) to `1` (black and white). |
| `className` | `string` | `''` | Extra CSS classes for the root container. |

---

## 4. Component File Tree

```
C:\Users\V E N O M\.gemini\config\skills\infinite-spiral-interactive-effect/
├── SKILL.md                 # Full documentation, 3D cylindrical math, and integration guide
└── assets/
    ├── InfiniteSpiral.jsx   # React / Next.js client component with continuous 3D loop
    ├── InfiniteSpiral.css   # 3D stage, perspective container, card styles & blur filters
    └── infinite-spiral.js   # Standalone Vanilla JS engine (zero dependencies)
```

---

## 5. Integration Guide: React & Next.js

```jsx
'use client';

import InfiniteSpiral from './InfiniteSpiral';
import './InfiniteSpiral.css';

const images = [
  { src: '/images/1.jpg', alt: 'Design 1', href: '/project/1' },
  { src: '/images/2.jpg', alt: 'Design 2', href: '/project/2' },
  { src: '/images/3.jpg', alt: 'Design 3', href: '/project/3' },
  { src: '/images/4.jpg', alt: 'Design 4', href: '/project/4' },
  { src: '/images/5.jpg', alt: 'Design 5', href: '/project/5' },
  { src: '/images/6.jpg', alt: 'Design 6', href: '/project/6' },
  { src: '/images/7.jpg', alt: 'Design 7', href: '/project/7' }
];

export default function GalleryPage() {
  return (
    <div style={{ height: '640px', position: 'relative', overflow: 'hidden', background: '#0a0a0f' }}>
      <InfiniteSpiral
        items={images}
        animationMode="all"
        speed={0.6}
        radius={180}
        cardWidth={120}
        cardHeight={120}
        verticalSpacing={64}
        cardsPerTurn={8}
        centerScale={1.25}
        edgeBlur={8}
        pauseOnHover
      />
    </div>
  );
}
```

---

## 6. Integration Guide: Vanilla JavaScript

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="./InfiniteSpiral.css">
  <style>
    body {
      margin: 0;
      height: 100vh;
      background: #09090b;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #spiral-container {
      width: 100%;
      max-width: 800px;
      height: 600px;
      position: relative;
    }
  </style>
</head>
<body>
  <div id="spiral-container"></div>

  <script src="./infinite-spiral.js"></script>
  <script>
    const container = document.getElementById('spiral-container');

    const spiral = InfiniteSpiral.init(container, {
      items: [
        'https://picsum.photos/seed/1/300/300',
        'https://picsum.photos/seed/2/300/300',
        'https://picsum.photos/seed/3/300/300',
        'https://picsum.photos/seed/4/300/300',
        'https://picsum.photos/seed/5/300/300',
        'https://picsum.photos/seed/6/300/300',
        'https://picsum.photos/seed/7/300/300'
      ],
      animationMode: 'all',
      speed: 0.55,
      radius: 170,
      cardWidth: 110,
      cardHeight: 110,
      verticalSpacing: 60,
      cardsPerTurn: 7,
      pauseOnHover: true
    });

    // Programmatic controls:
    // spiral.setProgress(3);                    // Jump progress
    // spiral.update({ speed: 1.0 });            // Dynamically change options
    // spiral.destroy();                         // Cleanup observers & listeners
  </script>
</body>
</html>
```

---

## 7. Accessibility & Performance

1. **`IntersectionObserver` Throttling**:
   - Freezes the animation loop and scroll listener when the gallery is scrolled off-screen.
2. **`prefers-reduced-motion` Compliance**:
   - Detects `(prefers-reduced-motion: reduce)` and disables continuous auto-spin, allowing comfortable manual drag or scroll interaction.
3. **Semantic List Structure**:
   - Container implements `role="list" aria-label="Infinite spiral gallery"`, and each card applies `role="listitem" aria-label="..."`.

---

## 8. Strict Architectural & Placement Mandates

1. **IMAGES ONLY**:
   - `InfiniteSpiral` is strictly for **image galleries, manuscripts, folios, and photographic works**. Never use it for arbitrary text cards or generic UI widgets.
2. **NO INNER CARD WRAPPER / CONTAINER**:
   - NEVER place `InfiniteSpiral` inside an inner card, framed box, or bordered `.specular-card` container. The 3D spiral must float freely and borderlessly on the section canvas.
3. **NO CENTER PLACEMENT**:
   - NEVER place `InfiniteSpiral` centered alone. It must always be placed asymmetrically in a split layout with narrative text flanking it.
4. **MINIMUM TWO-SECTION SPAN**:
   - NEVER constrain `InfiniteSpiral` to a single isolated section. It MUST span across a **minimum of two consecutive sections** so that scrolling between sections creates a continuous, seamless 3D transition.
5. **FULL INTERACTION MODES (`animationMode: 'all'`)**:
   - NEVER restrict `InfiniteSpiral` to scroll-only. It must always use `animationMode: 'all'` so visitors can auto-spin, pointer-drag, touch-fling, AND scroll through the helix simultaneously.
