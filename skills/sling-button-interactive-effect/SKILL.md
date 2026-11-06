---
name: sling-button-interactive-effect
description: Integrates interactive SlingButton elastic pull-to-send slingshot buttons from React Bits into web applications (React, Next.js, and Vanilla HTML/JS) with SVG tangent catenary bands, nonlinear rubberband drag, armed power arcs, recoil snap-through physics, and directional particle bursts.
risk: low
source: antigravity-custom-skills
date_added: 2026-11-05
---

# SlingButton Interactive Effect

An elastic pull-to-send slingshot button originating from React Bits' `<SlingButton />`. It delivers a tactile physical interaction where pulling the pad stretches an elastic tension band away from its resting seat, loads an animated power indicator arc, and snaps through the seat upon release to launch a directional cone of particles while triggering the send action.

---

## 1. Visual Architecture & Core Features

1. **Slingshot Pull-to-Send Dynamics**:
   - The button pad rests inside a circular well/seat.
   - Dragging the pad draws it backward against an asymptotic rubberband drag curve (`rubberband`), maintaining physical tension.
   - Restricts movement freely (`axis="any"`), horizontally (`axis="horizontal"`), or vertically (`axis="vertical"`).

2. **Procedural SVG Tangent Catenary Band**:
   - Analytically calculates the outer tangent lines connecting the circular well (`wellR`) to the offset pad (`padR`) based on distance and angle:
     \[
     \theta = \operatorname{atan2}(y, x) \pm \operatorname{acos}\left(\frac{r_{\text{well}} - r_{\text{pad}}}{d}\right)
     \]
   - Generates dual SVG tension paths (`M...L...`) that dynamically stretch and thin as pull distance increases.

3. **Dual-Stage Arming & Power Arc**:
   - **Pre-arm range**: Tension builds smoothly with a subtle elastic band.
   - **Armed threshold (`armAt`)**: The band thickens, shifts to hot accent color, the button pad scales up slightly (`scale(1.04)`), and an SVG circular progress arc animates to indicate stored power.

4. **Recoil Snap-Through & Velocity Addition**:
   - Measures gesture release velocity (\(v_{\text{finger}}\)).
   - Releases the pad with an added launch velocity (\(v_{\text{launch}} = 2600\,\text{px/s}\)), causing the pad to snap completely through its resting seat before bouncing back into equilibrium with a damped harmonic recoil spring.

5. **Directional Particle Spread Cone**:
   - Upon a loaded release, spawns a burst of particles (`particles: 14`) that fan out in the direction of the launch across a configurable spread angle (`spread: 60°`).
   - Each particle receives randomized trajectory angles, flight reach, scaling, and duration via the Web Animations API.

6. **Full Fallbacks & Keyboard Accessibility**:
   - Tapping without dragging immediately sends when `tapSends` is enabled.
   - Fully keyboard accessible (`Enter` or `Space` sends, `Escape` cancels drag).
   - Dedicated screen reader hint element (`.sling-button__sr`).

---

## 2. Physics & Mathematical Formulations

### 1. Asymptotic Rubberband Drag Curve
When pulling beyond standard distances, raw delta is softened to prevent infinite elongation:
\[
d = \frac{R_{\text{max}} \cdot r_{\text{raw}}}{R_{\text{max}} + r_{\text{raw}}}
\]
Perpendicular axis constraint in single-axis mode:
\[
y_{\text{damped}} = \frac{y \cdot \dim \cdot c}{\dim + c \cdot |y|} \quad (c = 0.55)
\]

### 2. Geometric Circle Tangents
Given well radius \(r_1\), pad radius \(r_2\), and pad displacement \((x, y)\) with distance \(d = \sqrt{x^2 + y^2}\):
\[
\alpha = \operatorname{atan2}(y, x)
\]
\[
\beta = \operatorname{acos}\left(\operatorname{clamp}\left(\frac{r_1 - r_2}{d}, -1, 1\right)\right)
\]
Tangent contact angles on the two circles:
\[
\theta_{A} = \alpha + \beta, \quad \theta_{B} = \alpha - \beta
\]
Tangent line endpoints:
\[
P_{1} = (r_1 \cos \theta, r_1 \sin \theta), \quad P_{2} = (x + r_2 \cos \theta, y + r_2 \sin \theta)
\]

### 3. Recoil Spring-Damper System
On release, the pad returns to origin \((0, 0)\) with initial velocity \(\vec{v}_0 = \vec{v}_{\text{drag}} - \vec{u} \cdot v_{\text{launch}}\):
\[
\omega_0 = \frac{2\pi}{T_{\text{spring}}} \quad (T = 0.4\,\text{s}), \quad \zeta = 1 - \text{recoil}
\]
\[
k = \omega_0^2, \quad c = 2\zeta\omega_0
\]
Sub-stepped Euler integration:
\[
v_{t+1} = \frac{v_t + h \cdot k \cdot (0 - x_t)}{1 + h \cdot c + h^2 \cdot k}, \quad x_{t+1} = x_t + v_{t+1} \cdot h
\]

---

## 3. Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | `undefined` | Pad icon or content. Defaults to an upward arrow glyph. |
| `onSend` | `() => void` | `undefined` | Callback invoked on an armed release, tap (when `tapSends` is true), or `Enter`/`Space`. |
| `padColor` | `string` | `'#f5f5f5'` | Background fill color of the circular pad. |
| `iconColor` | `string` | `'#18181b'` | Foreground glyph/icon color inside the pad. |
| `accentColor` | `string` | `'#f5f5f5'` | Fill color of the power arc, loaded band, and flying particles. |
| `wellColor` | `string` | `'#27272a'` | Fill color of the circular seat where the pad rests. |
| `bandColor` | `string` | `'#52525b'` | Color of the elastic tension band before it is armed. |
| `size` | `number` | `56` | Pad diameter in pixels. The well, stroke, and particles scale proportionally. |
| `strokeWidth` | `number` | `3` | Arc and band thickness in pixels (thins dynamically under tension). |
| `armAt` | `number` | `48` | Pull distance threshold in pixels required to arm the slingshot. |
| `maxPull` | `number` | `160` | Maximum pull distance in pixels before asymptotic rubberbanding caps movement. |
| `launchSpeed` | `number` | `2600` | Slingshot snap-through speed in pixels/second upon release. |
| `recoil` | `number` | `0.2` | Spring bounce ratio during return (`0` = no overshoot, `0.3` = bouncy wobble). |
| `flight` | `number` | `120` | Maximum flight travel distance of the lead particle in pixels. |
| `particles` | `number` | `14` | Number of particle sparks launched during a shot (`0` to disable). |
| `spread` | `number` | `60` | Angular width of the particle burst cone in degrees. |
| `axis` | `'any' \| 'horizontal' \| 'vertical'` | `'any'` | Permitted pull directions. |
| `tapSends` | `boolean` | `true` | Allows a direct click/tap without dragging to trigger `onSend`. |
| `disabled` | `boolean` | `false` | Dims the pad, sets `aria-disabled`, and ignores drag input. |
| `ariaLabel` | `string` | `'Send'` | Accessible name announced to assistive technologies. |
| `className` | `string` | `''` | Extra CSS class names applied to the root element. |

---

## 4. Component File Tree

```
C:\Users\V E N O M\.gemini\config\skills\sling-button-interactive-effect/
├── SKILL.md                 # Full documentation, tangent geometry, and integration guide
└── assets/
    ├── SlingButton.jsx      # React / Next.js component powered by motion/react & Hugeicons
    ├── SlingButton.css      # Well, band, pad, particle dot, and accessible styling
    └── sling-button.js      # Standalone Vanilla JS engine (zero dependencies, built-in SVG glyph)
```

---

## 5. Integration Guide: React & Next.js

### Installation

```bash
npm install motion @hugeicons/react @hugeicons/core-free-icons
```

### Basic Chat / Message Send Button

```jsx
'use client';

import SlingButton from './SlingButton';
import './SlingButton.css';

export default function ChatInput() {
  const handleSend = () => {
    console.log('Message sent via slingshot!');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '24px', background: '#121118' }}>
      <input
        type="text"
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: '12px 16px',
          borderRadius: '999px',
          border: '1px solid #3f3f46',
          background: '#18181b',
          color: '#f4f4f5',
          outline: 'none'
        }}
      />
      <SlingButton
        onSend={handleSend}
        size={54}
        padColor="#6366f1"
        iconColor="#ffffff"
        accentColor="#a5b4fc"
        wellColor="#27272a"
        bandColor="#4f46e5"
        armAt={46}
        launchSpeed={2800}
        flight={130}
        particles={16}
      />
    </div>
  );
}
```

---

## 6. Integration Guide: Vanilla JavaScript

Include `SlingButton.css` in your `<head>` and load `sling-button.js`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="./SlingButton.css">
  <style>
    body {
      margin: 0;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #09090b;
    }
  </style>
</head>
<body>
  <div id="button-container"></div>

  <script src="./sling-button.js"></script>
  <script>
    const container = document.getElementById('button-container');

    const button = SlingButton.init(container, {
      size: 56,
      padColor: '#3b82f6',
      iconColor: '#ffffff',
      accentColor: '#93c5fd',
      wellColor: '#1e293b',
      bandColor: '#1d4ed8',
      armAt: 48,
      launchSpeed: 2600,
      particles: 14,
      spread: 60,
      onSend: () => {
        console.log('Action launched!');
      }
    });

    // Programmatic controls:
    // button.send();            // Trigger particle launch and send
    // button.setDisabled(true); // Disable button
    // button.destroy();         // Cleanup DOM and animation frames
  </script>
</body>
</html>
```

---

## 7. Accessibility & Performance

1. **`prefers-reduced-motion` Handling**:
   - Detects `(prefers-reduced-motion: reduce)`.
   - Disables continuous spring recoil and directional particle flights, substituting an instant opacity highlight flash.

2. **Screen Reader Support**:
   - Employs `aria-label="Send"` and links an accessible instruction span via `aria-describedby` ("Press Enter to send, or drag away and release").
   - Dispatches `onSend` directly on `Enter` or `Space` key presses.
