---
name: specular-border-interactive-effect
description: Integrates interactive WebGL2 SpecularButton and dynamic specular border lighting effects along the perimeter of buttons and cards with cursor proximity tracking, edge ray tracing, press bloom, and glassmorphic styling into web applications (React, Next.js, and Vanilla HTML/JS).
risk: low
source: antigravity-custom-skills
date_added: 2026-11-04
---

# Specular Border & Button Interactive Effect

A GPU-accelerated specular rim lighting engine (originating from React Bits' `SpecularButton`) that traces a realistic ray-marched specular highlight along the perimeter of buttons, cards, and containers. The highlight actively steers toward the user's cursor as it approaches, expands on click/press, and smoothly rests at an ambient glint when idle.

---

## Overview & Architecture

The specular border effect evaluates an exact signed distance field (SDF) of a 2D rounded rectangle in WebGL2 fragment shaders:

1. **Perimeter Parameterization (`loopPosition`)**: Normalizes the outer rounded boundary into a continuous scalar loop $s \in [0, 1)$.
2. **Specular Lobes (`lobe`)**: Generates primary and counter-reflection streaks along the rim with configurable beam angular spread (`shineSize`) and gradient falloff (`shineFade`).
3. **Double-Rim Highlights**:
   - `band`: The bright specular ray beam on the rounded edge.
   - `hair`: A subtle, continuous anti-aliased base line preserving the geometric edge silhouette under ambient light.
   - `glow`: Volumetric bloom radiating outside the edge and softly bleeding into the glass interior pool.
4. **Shared Master WebGL2 Engine**: For multi-element sites (15–30+ buttons and cards), a single offscreen WebGL2 pipeline calculates shader passes and blits to hardware-accelerated 2D canvases, completely avoiding the browser's 16-context WebGL limit while sustaining 60–120 FPS.

---

## 1. Quick Integration (Vanilla HTML / JS)

### Step 1: Link CSS and Script

```html
<link rel="stylesheet" href="SpecularButton.css">
<script src="specular.js"></script>
```

### Step 2: Use on Buttons and Cards
Elements marked with `.specular-border`, `button`, `.cta-button`, `.contact-card`, or cards automatically receive specular rim lighting:

```html
<!-- Specular Button -->
<a href="#contact" class="cta-button bg-primary text-white px-8 py-3 rounded-full font-semibold">
    Get Started
</a>

<!-- Specular Card with Custom Accent Color -->
<div class="bg-card p-6 rounded-3xl border border-white/10" data-line-color="#A855F7">
    <h3 class="text-white text-xl font-bold">Featured Card</h3>
    <p class="text-gray-400 text-sm">Interactive specular light traces the border as the cursor moves.</p>
</div>
```

### Step 3: Programmatic API

```javascript
// Attach to any specific element
window.Specular.attach(myElement, {
  lineColor: '#A855F7',
  baseColor: '#3f3f46',
  thickness: 1.3,
  glow: 1.1,
  idleIntensity: 0.28,
  proximity: 250
});

// Or auto-scan all buttons and cards on the page
window.Specular.init();
```

---

## 2. React / Next.js Integration

```jsx
import SpecularButton from './SpecularButton';
import './SpecularButton.css';

export default function HeroSection() {
  return (
    <SpecularButton
      size="lg"
      radius={18}
      tint="#ffffff"
      tintOpacity={0.04}
      textColor="#f5f5f5"
      lineColor="#A855F7"
      baseColor="#525252"
      intensity={1}
      idleIntensity={0.35}
      shineSize={12}
      shineFade={36}
      thickness={1.2}
      glow={1}
      followMouse={true}
      proximity={250}
      onClick={() => console.log('Clicked!')}
    >
      Explore Projects
    </SpecularButton>
  );
}
```

---

## 3. Configuration Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `radius` | `number` | `18` | Corner radius in px. Values equal to or exceeding half height form a pill. |
| `lineColor` | `string` | `'#ffffff'` | Color of the bright specular light traveling along the perimeter. |
| `baseColor` | `string` | `'#525252'` | Color of the subtle continuous edge line. |
| `intensity` | `number` | `1` | Peak brightness multiplier. |
| `idleIntensity` | `number` | `0.35` | Ambient light intensity when cursor is outside proximity (0 to 1). |
| `shineSize` | `number` | `10` | Arc width in degrees where the specular beam is at full intensity. |
| `shineFade` | `number` | `34` | Angular fade-out reach past the shine center. |
| `thickness` | `number` | `1.2` | Stroke width of the lit edge (px). |
| `glow` | `number` | `1` | Soft ambient bloom surrounding the perimeter. |
| `followMouse` | `boolean` | `true` | Continuously steers the light toward the cursor. |
| `proximity` | `number` | `250` | Distance in px at which the specular ray wakes and tracks the cursor. |
| `autoAnimate` | `boolean` | `false` | Circles the light around the edge continuously when idle. |
| `speed` | `number` | `0.35` | Rotation speed for auto-animation. |

---

## 4. Asset Files

- [SpecularButton.jsx](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/specular-border-interactive-effect/assets/SpecularButton.jsx): React component source with per-instance WebGL2 context.
- [SpecularButton.css](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/specular-border-interactive-effect/assets/SpecularButton.css): Button, card, and canvas sizing styles with 24px bloom margin.
- [specular.js](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/specular-border-interactive-effect/assets/specular.js): Shared master WebGL2 engine powering unlimited buttons and cards across an entire page with zero context-limit issues.
