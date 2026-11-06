---
name: card-swap-interactive-effect
description: Integrates interactive CardSwap 3D perspective stacked card swap & fling components from React Bits into web applications (React, Next.js, and Vanilla HTML/JS) with spring-damper physics, draggable fling trajectories, cursor parallax, hover spread fanning, and auto-swap timers.
risk: low
source: antigravity-custom-skills
date_added: 2026-11-06
---

# CardSwap Interactive 3D Stack Effect 🃏🔀

An interactive 3D perspective stacked card carousel originating from React Bits' `<CardSwap />`. It organizes collections of cards (products, testimonials, portfolio items, or media showcases) into a stacked deck in 3D space with continuous spring-damper mechanics, responsive boundary fitting, cursor parallax tracking, and fluid fling gestures that send the front card to the back of the deck with realistic momentum.

---

## 1. Visual Architecture & Core Features

1. **True 3D Stack Perspective**:
   - Calculates spatial depth offsets along $X$, $Y$, and $Z$:
     $$x = i \cdot \Delta x \cdot (1 + \text{hoverSpread}), \quad y = -i \cdot \Delta y \cdot (1 + \text{hoverSpread}), \quad z = -i \cdot \Delta z$$
   - Cards recede into depth with perspective scaling and progressive ambient shade dimming.
2. **Spring-Damper Physical Simulation**:
   - Evaluates continuous second-order harmonic oscillator dynamics for all 5 axes ($x, y, z, r, p$):
     $$\ddot{x} + 2\zeta\omega\dot{x} + \omega^2(x - x_{\text{target}}) = 0$$
   - Supports tunable `speed` and `bounce` parameters with sub-step numerical integration ($1/240\text{ s}$).
3. **Pointer Drag & Fling Physics**:
   - Users can drag or fling the front card in any direction.
   - Evaluates a 90ms sample history window to compute release velocity: if distance exceeds 30% of card bounds or release velocity exceeds $700\text{ px/s}$, the card flings outward with realistic rotational inertia before cycling to the back of the stack.
4. **Cursor Parallax & Hover Spread**:
   - Proportional pointer tracking gently shifts the perspective origin, granting organic 3D depth parallax.
   - Hovering fans the stack outward with smooth interpolation.
5. **Autoplay & Pause on Hover**:
   - Smooth periodic cycling with configurable intervals (`delay`) and instant pause when hovering over active cards or during active gestures.
6. **Zero Dependencies & Universal Compatibility**:
   - Ships with full React/Next.js component (`CardSwap.jsx`) and standalone Vanilla JS engine (`cardswap.js`).

---

## 2. File Assets in this Skill

| File | Purpose |
|---|---|
| [`assets/CardSwap.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/card-swap-interactive-effect/assets/CardSwap.jsx) | React / Next.js client component. |
| [`assets/CardSwap.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/card-swap-interactive-effect/assets/CardSwap.css) | Core 3D perspective layout, shadows, card rims, and theme styling. |
| [`assets/cardswap.js`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/card-swap-interactive-effect/assets/cardswap.js) | Standalone zero-dependency Vanilla JS library (`CardSwap.init(container, options)`). |

---

## 3. Props & Options Specification

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `items` | `Array` | `DEFAULT_ITEMS` | Card items `{ title, image, icon, alt, content, html }`. |
| `width` | `number` | `460` | Width of each card, in px. |
| `height` | `number` | `340` | Height of each card, in px. |
| `cardDistance` | `number` | `60` | Horizontal step between stacked cards, in px. |
| `verticalDistance` | `number` | `70` | Vertical step between stacked cards, in px. |
| `depth` | `number` | `90` | Depth spacing between cards, in px. |
| `skewAmount` | `number` | `6` | Slant angle of cards, in degrees. |
| `visibleCards` | `number` | `4` | How many cards show in the stack. Extra cards wait hidden at the back. |
| `delay` | `number` | `4000` | Auto-swap timer interval, in ms. |
| `autoplay` | `boolean` | `true` | Automatically cycles front card to back on timer. |
| `pauseOnHover` | `boolean` | `true` | Pauses timer while cursor hovers over card. |
| `draggable` | `boolean` | `true` | Enables pointer drag & fling gestures. |
| `speed` | `number` | `1` | Speed of swap animation ($0.1$ to $4$). |
| `bounce` | `number` | `0.35` | Overshoot settling factor ($0$ to $1$). |
| `parallax` | `number` | `0.5` | Depth shift on cursor movement ($0$ to $1$). |
| `hoverSpread` | `number` | `0.12` | Stack fan-out factor on hover. |
| `dim` | `number` | `0.5` | Shade attenuation for cards behind front ($0$ to $1$). |
| `cardRadius` | `number` | `18` | Corner border radius in px. |
| `intro` | `boolean` | `true` | Staggered fan intro reveal on mount. |
| `theme` | `'dark' \| 'light'` | `'dark'` | Visual theme styling. |
| `onCardClick` | `Function` | `undefined` | Callback `(index) => void` on card click. |
| `onChange` | `Function` | `undefined` | Callback `(newFrontIndex) => void` on swap. |

---

## 4. React / Next.js Integration

```jsx
'use client';

import CardSwap, { Card } from './CardSwap';
import './CardSwap.css';

const items = [
  { title: 'Golden hour', image: '/photos/sky.jpg' },
  { title: 'Canola field', image: '/photos/field.jpg' },
  { title: 'The pier', image: '/photos/pier.jpg' },
  { title: 'Pink drift', image: '/photos/clouds.jpg' }
];

export default function StackSection() {
  return (
    <div style={{ height: 600, width: '100%' }}>
      <CardSwap items={items} delay={4000} theme="dark" />
    </div>
  );
}
```

---

## 5. Vanilla HTML / JavaScript Integration

```html
<!-- Stylesheet -->
<link rel="stylesheet" href="./CardSwap.css">

<!-- Container -->
<div id="card-swap-mount" style="position: relative; width: 100%; height: 550px;"></div>

<!-- Script -->
<script src="./cardswap.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const swap = CardSwap.init('#card-swap-mount', {
      items: [
        { title: 'Kitab al-Manazir', image: 'optics.jpg' },
        { title: 'Suwar al-Kawakib', image: 'stars.jpg' },
        { title: 'Al-Qanun fi al-Tibb', image: 'medicine.jpg' },
        { title: 'Ihya Ulum al-Din', image: 'philosophy.jpg' },
        { title: 'Al-Muqaddimah', image: 'history.jpg' }
      ],
      width: 440,
      height: 320,
      delay: 4500,
      theme: 'dark'
    });
  });
</script>
```

---

## 6. Interaction Orchestration Mandate

- **Strict Ban on Excessive Cards & Card Clutter**:
  - Never clutter websites with dozens of boxed cards or static card grids. Keep websites open, spacious, and beautiful across clean editorial sections.
  - When a collection of 5+ items is displayed (e.g. catalog books, service offerings, or feature decks), **DO NOT render a repetitive static card grid**. Use `card-swap-interactive-effect` to present the entire collection cleanly without vertical bloat or card clutter.
- **Card Architecture Rule**:
  - **Single Card**: `lanyard-interactive-effect` (Verlet strap 3D badge).
  - **Few Cards (3–4 Cards)**: `folder-interactive-effect` (Frosted glass 3D tabs).
  - **Many Cards / Stacked Deck (5+ Cards or when Folder is not suitable)**: **`card-swap-interactive-effect`** (`CardSwap`).
  - **Last Section Card**: `laser-flow-interactive-effect` with scroll trigger.
- **CardSwap Layout & Placement Rules**:
  - **NEVER nest inside another card**: CardSwap must NEVER be wrapped inside another card, `.specular-card`, or border box.
  - **NEVER place in the center**: CardSwap must NEVER be centered.
  - **ALWAYS place on the RIGHT side** with descriptive narrative text, search controls, or category tabs on the **LEFT side**.
  - **NEVER duplicate with a static card grid underneath**: The swipe card deck IS the collection showcase.
- **Copywriting**: Never write instructional sentences ("Click and drag to swap", "Fling the card"). The tactile stack affordance is self-evident.
