---
name: dotfield-interactive-effect
description: Integrates interactive WebGL2 DotField particle grid effects with lens warping, cursor glow, wave displacement, OKLab color blending, and frosted glass cards into web applications (React, Next.js, and Vanilla HTML/JS).
risk: low
source: antigravity-custom-skills
date_added: 2026-11-04
---

# DotField Interactive WebGL2 Effect

A GPU-accelerated interactive particle grid component (originating from React Bits) that renders high-performance dots with spring-physics cursor lens distortion, OkLab-based perceptual color gradients, harmonic wave displacement, and cursor bloom glow.

## Overview & Architecture

DotField draws a grid, hex, spiral, or scattered field of dots using **WebGL 2.0 instanced rendering** (`gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count)`). Each quad dot has smooth antialiased edges, bloom glow, and dynamic optical magnification.

### Key Capabilities
- **Physics-driven lens**: Smooth spring tracking (`omega = 18`) following mouse and touch pointers.
- **Warp & Twist**: Bulges, pinches, and swirls particles around the cursor in 2D space.
- **Perceptual OKLab Gradients**: Gamut-mapped OKLab color blending preventing muddy grey midtones.
- **Dynamic Wave Displacements**: Harmonic undulating wave surface drift.
- **Glassmorphic Synergy**: Pairs with frosted glass cards (`backdrop-blur-2xl bg-white/[0.04] border border-white/15`).

---

## 1. Quick Integration (Vanilla HTML / JS)

### Step 1: Add Canvas Background Container
Place the canvas container inside any section (e.g., `#services`, `#hero`):

```html
<section id="services" class="relative py-24 px-6 overflow-hidden">
    <!-- DotField Canvas Container -->
    <div id="services-dotfield" class="dot-field" style="position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; pointer-events: none; z-index: 0;">
        <canvas class="dot-field__canvas" style="position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; display: block;" aria-hidden="true"></canvas>
    </div>

    <!-- Foreground Content (Glass Cards) -->
    <div class="relative z-10 max-w-7xl mx-auto">
        <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-white/[0.04] backdrop-blur-2xl p-8 rounded-3xl border border-white/15 hover:border-purple-500/50 hover:bg-white/[0.08] transition-all">
                <h3 class="text-white text-xl font-bold mb-2">Service Title</h3>
                <p class="text-gray-300 text-sm">Description content...</p>
            </div>
        </div>
    </div>
</section>
```

### Step 2: Include `dotfield.js` and Initialize
```html
<script src="dotfield.js"></script>
<script>
    (function() {
        function start() {
            const container = document.getElementById('services-dotfield');
            if (container && window.DotField) {
                window.DotField.init(container, {
                    gradientFrom: "#cabfc9",
                    gradientTo: "#cabfc9",
                    dotRadius: 1.8,
                    dotSpacing: 14,
                    cursorRadius: 240,
                    bulgeStrength: 0.45,
                    glowRadius: 180,
                    twist: 5,
                    glowIntensity: 0.85,
                    waveAmplitude: 2.5,
                    pattern: 'grid',
                    glowColor: '#ffffff',
                    baseOpacity: 0.65,
                    sparkle: true,
                    speed: 1,
                    interactive: true,
                    holdToZoom: true,
                    intro: true
                });
            }
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', start);
        } else {
            start();
        }
    })();
</script>
```

---

## 2. React / Next.js Integration

### Component Usage:
```jsx
import DotField from './DotField';

export default function ServicesSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background DotField */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <DotField
          gradientFrom="#cabfc9"
          gradientTo="#cabfc9"
          dotRadius={1.8}
          dotSpacing={14}
          cursorRadius={240}
          bulgeStrength={0.45}
          glowRadius={180}
          twist={5}
          glowIntensity={0.85}
          waveAmplitude={2.5}
          sparkle={true}
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Glass cards here */}
      </div>
    </section>
  );
}
```

---

## 3. Prop Reference & Tuning

| Prop | Type | Default | Description |
|---|---|---|---|
| `dotRadius` | number | `1.5` | Radius of each particle in pixels (1.5 - 2.5 recommended). |
| `dotSpacing` | number | `14` | Distance between dot centers in pixels. |
| `pattern` | string | `'grid'` | `'grid'` \| `'hex'` \| `'spiral'` \| `'scatter'`. |
| `gradientFrom` | string | `'#5227FF'` | Starting gradient hex/rgb. |
| `gradientTo` | string | `'#FF9FFC'` | Ending gradient hex/rgb. |
| `cursorRadius` | number | `240` | Radius of cursor distortion lens in pixels. |
| `bulgeStrength`| number | `0.35` - `0.6` | Lens magnification: positive expands, negative pinches. |
| `twist` | number | `0` - `5` | Swirl rotation in degrees around pointer. |
| `glowColor` | string | `'#ffffff'` | Color of illuminated dots under cursor. |
| `glowRadius` | number | `160` | Bloom illumination radius. |
| `glowIntensity`| number | `0.8` | Brightness of cursor glow bloom. |
| `baseOpacity` | number | `0.55` - `0.7` | Inactive resting dot opacity. |
| `waveAmplitude`| number | `2` | Harmonic undulating drift amplitude in pixels. |
| `sparkle` | boolean | `true` | Random twinkling star bloom effect. |
| `interactive` | boolean | `true` | Enables cursor/touch tracking. |

---

## 4. Curated Aesthetic Presets

### Electric Violet & Magenta (Cyber Luxury)
```javascript
{
  gradientFrom: "#A855F7",
  gradientTo: "#EC4899",
  glowColor: "#ffffff",
  dotRadius: 1.8,
  dotSpacing: 15,
  bulgeStrength: 0.5,
  twist: 6,
  waveAmplitude: 2.2,
  sparkle: true
}
```

### Silvery Lavender (Clean Minimalist / Dark)
```javascript
{
  gradientFrom: "#cabfc9",
  gradientTo: "#cabfc9",
  glowColor: "#ffffff",
  dotRadius: 1.8,
  dotSpacing: 14,
  bulgeStrength: 0.45,
  twist: 5,
  glowIntensity: 0.85,
  waveAmplitude: 2.5,
  sparkle: true
}
```

### Emerald Matrix (Tech & Terminal)
```javascript
{
  gradientFrom: "#10B981",
  gradientTo: "#065F46",
  glowColor: "#34D399",
  dotRadius: 1.6,
  dotSpacing: 13,
  bulgeStrength: 0.4,
  twist: 3,
  waveAmplitude: 1.8
}
```

---

## 5. Critical Integration Rules & Pitfalls

1. **Avoid Height 0 Collapse**:
   If the container element is inside a section with `height: auto`, `.dot-field` must have `position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important;`. Never rely solely on `height: 100%` without absolute positioning.

2. **Pointer Events Transparency**:
   Keep the canvas container set to `pointer-events: none` and `z-index: 0`. The script captures cursor coordinates globally via `window.addEventListener('pointermove', ...)`, calculating bounds relative to `container.getBoundingClientRect()`. This allows all buttons, links, and text cards to remain fully clickable while still driving the 3D lens.

3. **Performance & Battery**:
   The component includes built-in `IntersectionObserver` and `document.visibilityState` listeners, automatically stopping the `requestAnimationFrame` loop when the element is offscreen or when the tab is hidden.
