---
name: glitch-text-interactive-effect
description: Integrates interactive multi-mode GlitchText effects (slices, rgb, scan, noise) from React Bits into web applications (React, Next.js, and Vanilla HTML/JS) with procedural tearing, horizontal displacement bands, chromatic aberration shadows, and animated flowing gradient support.
risk: low
source: antigravity-custom-skills
date_added: 2026-11-04
---

# GlitchText Interactive Effect

A high-performance text glitch and displacement animation engine (originating from React Bits' `GlitchText`). Features 4 distinct glitch algorithms:
1. **`slices`**: Procedural horizontal bands slicing and displacing sideways with chromatic fringe shadows.
2. **`rgb`**: Split red/green/blue or dual-channel chromatic aberration with jitter offsets.
3. **`scan`**: Vertical scanning beam displacement traversing the text height.
4. **`noise`**: Matrix glyph swap scrambling individual characters while retaining word geometry.

Supports both solid text colors and animated flowing text gradients (`-webkit-background-clip: text` with `animation: colorFlow`).

---

## 1. Quick Integration (Vanilla HTML / JS)

### Step 1: Link CSS and Script

```html
<link rel="stylesheet" href="GlitchText.css">
<script src="glitchtext.js"></script>
```

### Step 2: Add Markup

```html
<h1 class="text-6xl font-bold">
    Hi, I'm <span id="hero-venom-glitch" class="venom-name animate-text font-extrabold" data-text="VENOM">VENOM</span>
</h1>
```

### Step 3: Initialize via JavaScript

```javascript
document.addEventListener('DOMContentLoaded', function () {
  const el = document.getElementById('hero-venom-glitch');
  if (el && window.GlitchText) {
    window.GlitchText.init(el, {
      mode: 'slices',          // 'slices' | 'rgb' | 'scan' | 'noise'
      trigger: 'always',       // 'always' | 'hover' | 'click'
      speed: 0.6,              // Slower or faster cycle pace
      intensity: 0.65,         // Displacement power [0..1]
      offset: 14,              // Displacement distance in px
      burstDuration: 0.6,      // Click burst length in seconds
      enableShadows: true,     // Chromatic glow shadows
      shadowColors: ['#22C55E', '#A855F7'], // Green & Violet brand colors
      flicker: false           // Subtle alpha flicker
    });
  }
});
```

---

## 2. React / Next.js Integration

### Import Component

```jsx
import GlitchText from './GlitchText';

export default function Hero() {
  return (
    <h1 className="text-6xl font-bold text-white">
      Hi, I'm{' '}
      <GlitchText
        mode="slices"
        trigger="always"
        speed={0.6}
        intensity={0.65}
        offset={14}
        enableShadows={true}
        shadowColors={['#22C55E', '#A855F7']}
        className="font-extrabold inline-block"
      >
        VENOM
      </GlitchText>
    </h1>
  );
}
```

---

## 3. Animated Gradient Text Support

When applied to gradient text (`background: linear-gradient(...)` with `-webkit-background-clip: text`), the container removes its own background so it won't draw a solid box behind, while `.glitch__text`, `.glitch__slice--a`, and `.glitch__slice--b` inherit the flowing gradient:

```css
/* Green + Violet Gradient Glitch styling */
.glitch-venom,
.glitch.animate-text,
.glitch--animated {
  background: none !important;
  -webkit-background-clip: unset !important;
  background-clip: unset !important;
  color: unset !important;
}

.glitch-venom .glitch__text,
.glitch-venom .glitch__slice,
.glitch.animate-text .glitch__text,
.glitch.animate-text .glitch__slice,
.glitch--animated .glitch__text,
.glitch--animated .glitch__slice {
  background: linear-gradient(90deg, #22C55E, #A855F7, #22C55E, #A855F7);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: colorFlow 3s linear infinite;
  display: inline-block;
}

.glitch-venom .glitch__slice--a,
.glitch.animate-text .glitch__slice--a,
.glitch--animated .glitch__slice--a {
  filter: drop-shadow(var(--glitch-a-x, 0px) 0 2px rgba(34, 197, 94, 0.95)) drop-shadow(0 0 8px rgba(34, 197, 94, 0.5));
}

.glitch-venom .glitch__slice--b,
.glitch.animate-text .glitch__slice--b,
.glitch--animated .glitch__slice--b {
  filter: drop-shadow(var(--glitch-b-x, 0px) 0 2px rgba(168, 85, 247, 0.95)) drop-shadow(0 0 8px rgba(168, 85, 247, 0.5));
}

@keyframes colorFlow {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}
```

---

## 4. Props & Options Reference

| Prop / Option | Type | Default | Description |
|---|---|---|---|
| `mode` | string | `'slices'` | `'slices'`, `'rgb'`, `'scan'`, or `'noise'`. |
| `trigger` | string | `'always'` | `'always'`, `'hover'`, or `'click'`. |
| `speed` | number | `0.6` | Speed multiplier (higher is slower/calmer). |
| `intensity` | number | `0.5` | Glitch frequency and displacement range [0..1]. |
| `offset` | number | `10` | Horizontal slice shift distance in pixels. |
| `shadowColors` | `[string, string]` | `['#22C55E', '#A855F7']` | Colors of the two displaced chromatic slice glows. |
| `enableShadows` | boolean | `true` | Toggle chromatic aberration shadows. |
| `flicker` | boolean | `false` | Quick subtle dips in opacity during jolts. |
| `burstDuration` | number | `0.6` | Duration of the glitch burst on click in seconds. |

---

## 5. Assets

Component source files are stored in `assets/`:
- [`GlitchText.jsx`](assets/GlitchText.jsx): Full React Bits component implementation.
- [`GlitchText.css`](assets/GlitchText.css): Multi-mode glitch styling, CSS masks, slice clipping, and gradient text support.
- [`glitchtext.js`](assets/glitchtext.js): Standalone Vanilla JS adaptation with IntersectionObserver auto-pause.
