---
name: dodge-field-interactive-effect
description: Integrates interactive DodgeField evasive "catch-me" button and element dodging effects from React Bits into web applications (React, Next.js, and Vanilla HTML/JS) with cursor vector repulsion, nonlinear power falloffs, field boundary clamping/bouncing, patience thresholds, taunt cycling, and catch celebration states.
risk: low
source: antigravity-custom-skills
date_added: 2026-11-05
---

# DodgeField Interactive Effect

An interactive evasive "catch-me" component originating from React Bits' `<DodgeField />`. It transforms buttons, avatars, discount pills, or custom elements into lively game-like targets that dart away when the pointer approaches. It features vector repulsion bearing calculations, customizable power falloffs, boundary clamping/bouncing, patience thresholds (relenting after a given number of attempts), taunt text progressions, and celebratory caught states.

---

## 1. Visual Architecture & Core Features

1. **Vector Repulsion Bearing**:
   - Calculates the exact directional vector from the cursor to the target's center.
   - Restricts movement along both axes (`both`), horizontal only (`x`), or vertical only (`y`).
   - Features a 6px dead zone (`DEAD_ZONE`) to prevent erratic jitter when the cursor is directly over the center.

2. **Nonlinear Falloff Reaction Curve**:
   - As the pointer breaches the detection radius (`radius`), evasion force accelerates based on an exponential falloff (`falloff`).
   - Low exponents (`falloff: 1`) produce gentle, early drifts; high exponents (`falloff: 4`) trigger snappy, last-second flinches.

3. **Perimeter Wall Constraints (`clamp` vs `bounce`)**:
   - Dynamically calculates available container room (`room.x`, `room.y`) using `ResizeObserver`.
   - `clamp`: Stops dead at the boundary edge without clipping.
   - `bounce`: Folds overflow back inside the field, simulating an elastic rebound off the perimeter wall.

4. **Patience Threshold & Relenting State**:
   - Increments an armed dodge counter whenever the pointer penetrates 55% of the radius (`COUNT_LINE = 0.55`).
   - Once `dodges >= patience`, the element gives in, sits completely still (`gave = true`, `data-relented="true"`), and triggers `onRelent()`.

5. **Celebratory Catch State**:
   - Clicking the fleeing or relented child triggers `onCatch()` and sets `data-caught="true"`.
   - Inverts contrast colors (`--df-ink` and `--df-contrast`) for 760ms before resetting dodges and re-arming evasion.

6. **Taunt Text Progression**:
   - Built-in pill seamlessly cycles through taunts (`taunts: ["Catch me", "Nope", "Too slow", "Almost", "Okay, okay"]`) using CSS grid stacking and blurred fade transitions.
   - The final taunt is displayed once the element relents or is caught.

7. **Touch & Coarse Pointer Adaptation**:
   - Uses `matchMedia('(hover: hover) and (pointer: fine)')` to detect touch devices.
   - On touchscreens (where hovering does not exist), dodging is disabled and an optional fallback message (`notice`) is displayed.

---

## 2. Physics & Mathematical Formulations

### Vector Bearing Calculation
Normalized delta coordinates between pointer \(P\) and field center \(C\):
\[
dx = \frac{P_x - C_x}{\text{zoom}}, \quad dy = \frac{P_y - C_y}{\text{zoom}}
\]
\[
d = \sqrt{dx^2 + dy^2}
\]
When \(d > 6\text{px}\):
\[
\vec{b} = 
\begin{cases}
(\operatorname{sgn}(dx) \lor 1, 0) & \text{if axis} = \text{'x'} \\
(0, \operatorname{sgn}(dy) \lor 1) & \text{if axis} = \text{'y'} \\
\left(\frac{dx}{d}, \frac{dy}{d}\right) & \text{if axis} = \text{'both'}
\end{cases}
\]

### Nonlinear Reaction Curve
Within reaction radius \(R\) (`radius`), the fleeing factor \(\phi\) is computed:
\[
\phi = 
\begin{cases}
\left(1 - \frac{d}{R}\right)^{\text{falloff}} & \text{if } d \le R \text{ and not still} \\
0 & \text{otherwise}
\end{cases}
\]
Raw unconstrained target displacement:
\[
T_x = -\vec{b}_x \cdot \phi \cdot \text{reach}, \quad T_y = -\vec{b}_y \cdot \phi \cdot \text{reach}
\]

### Wall Constraint Function (`wallIt`)
Given available travel room \(M\) (`room.x` or `room.y`):
- **Clamp Mode (`wall = 'clamp'`)**:
  \[
  \operatorname{clamp}(T, M) = \min(M, \max(-M, T))
  \]
- **Bounce Mode (`wall = 'bounce'`)**:
  \[
  \operatorname{bounce}(T, M) = 
  \begin{cases}
  \max(-M, 2M - T) & \text{if } T > M \\
  \min(M, -2M - T) & \text{if } T < -M \\
  T & \text{otherwise}
  \end{cases}
  \]

### Sub-Stepped Harmonic Spring Integration (Vanilla Engine)
\[
\omega_0 = \frac{2\pi}{T_{\text{spring}}}, \quad \zeta = 1 - \text{bounce}
\]
\[
k = \omega_0^2, \quad c = 2\zeta\omega_0
\]
At 240 Hz sub-stepping (\(h = \frac{dt}{\text{steps}}\)):
\[
v_{t+1} = \frac{v_t + h \cdot k \cdot (T - x_t)}{1 + h \cdot c + h^2 \cdot k}
\]
\[
x_{t+1} = x_t + v_{t+1} \cdot h
\]

---

## 3. Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode \| ((state) => ReactNode)` | `undefined` | Element that flees. Omit for the built-in taunt pill, or pass a function receiving `{ dodges, gave, caught, fleeing }`. |
| `taunts` | `string[]` | `["Catch me", "Nope", "Too slow", "Almost", "Okay, okay"]` | Sequential labels for the built-in pill: initial resting state, one per dodge, and the final state when relented. |
| `notice` | `string` | `""` | Informational text displayed under the element on touch devices where dodging is disabled. |
| `inkColor` | `string` | `"#f5f5f5"` | Pill tint, text color, caught background, and focus ring color. |
| `contrastColor` | `string` | `"#18181b"` | Inverted text color displayed while the pill is caught. |
| `fieldHeight` | `number` | `240` | Height of the field bounding area in pixels (width defaults to 100% of container). |
| `reach` | `number` | `72` | Maximum flee displacement distance in pixels when cursor is at center. |
| `radius` | `number` | `120` | Proximity trigger distance in pixels at which evasion begins. |
| `falloff` | `number` | `2` | Exponent of the evasion curve. `1` is gentle drift, `4` is a sudden flinch. |
| `fleeDuration` | `number` | `130` | Settle time of the dart displacement in milliseconds. |
| `returnDuration` | `number` | `620` | Settle time of the return glide home in milliseconds. |
| `returnBounce` | `number` | `0.1` | Overshoot ratio on the glide home (`0` = no overshoot, `0.3` = bouncy wobble). |
| `axis` | `'both' \| 'x' \| 'y'` | `'both'` | Permitted evasion axes. |
| `wall` | `'clamp' \| 'bounce'` | `'clamp'` | Boundary behavior: stop dead at edge (`clamp`) or rebound back (`bounce`). |
| `patience` | `number` | `4` | Number of dodges before the element surrenders and stays stationary. |
| `disabled` | `boolean` | `false` | Disables dodging completely; the element remains interactive. |
| `onDodge` | `(count: number) => void` | `undefined` | Callback invoked on each counted dodge. |
| `onRelent` | `() => void` | `undefined` | Callback invoked when the element surrenders after exceeding `patience`. |
| `onCatch` | `() => void` | `undefined` | Callback invoked when the element is clicked. |
| `className` | `string` | `""` | Additional CSS class names applied to the field container. |
| `style` | `CSSProperties` | `undefined` | Custom inline CSS styles for the field container. |

---

## 4. Component File Tree

```
C:\Users\V E N O M\.gemini\config\skills\dodge-field-interactive-effect/
├── SKILL.md                 # Full documentation, evasion mathematics, and integration guide
└── assets/
    ├── DodgeField.jsx       # React / Next.js component powered by motion/react
    ├── DodgeField.css       # Field layout, pill styling, label transitions & media queries
    └── dodge-field.js       # Standalone Vanilla JS engine (zero dependencies, spring integration)
```

---

## 5. Integration Guide: React & Next.js

### Installation

```bash
npm install motion
```

### Basic Usage with Built-in Pill

```jsx
'use client';

import DodgeField from './DodgeField';
import './DodgeField.css';

export default function EasterEgg() {
  return (
    <div style={{ padding: '40px 0', background: '#09090b', textAlign: 'center' }}>
      <DodgeField
        inkColor="#38bdf8"
        contrastColor="#0f172a"
        fieldHeight={220}
        reach={80}
        radius={130}
        patience={4}
        onDodge={(count) => console.log(`Dodged ${count} times!`)}
        onRelent={() => console.log('I give up!')}
        onCatch={() => alert('You caught the discount code: REACTBITS20')}
      />
    </div>
  );
}
```

### Custom Render Prop Button

```jsx
'use client';

import DodgeField from './DodgeField';
import './DodgeField.css';

export default function CustomTarget() {
  return (
    <DodgeField patience={3} fieldHeight={280} reach={90} wall="bounce">
      {({ dodges, gave, caught }) => (
        <button
          type="button"
          style={{
            padding: '14px 28px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.15)',
            background: caught ? '#22c55e' : gave ? '#f59e0b' : '#6366f1',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 200ms ease'
          }}
        >
          {caught ? '🎉 Caught!' : gave ? '😅 Okay, you win!' : dodges ? `Missed x${dodges}!` : 'Try to click me'}
        </button>
      )}
    </DodgeField>
  );
}
```

---

## 6. Integration Guide: Vanilla JavaScript

Include `DodgeField.css` in your `<head>` and load `dodge-field.js`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="./DodgeField.css">
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #0d0c15;
      color: #fff;
      font-family: sans-serif;
    }
    #game-container {
      width: 100%;
      max-width: 600px;
    }
  </style>
</head>
<body>
  <div id="game-container"></div>

  <script src="./dodge-field.js"></script>
  <script>
    const container = document.getElementById('game-container');

    const dodge = DodgeField.init(container, {
      inkColor: '#f43f5e',
      contrastColor: '#ffffff',
      fieldHeight: 260,
      reach: 84,
      radius: 140,
      falloff: 2.2,
      wall: 'bounce',
      patience: 4,
      taunts: ['Catch me', 'Too slow!', 'Nice try', 'Almost!', 'Alright, take it!'],
      notice: 'Tap the button to claim your reward',
      onDodge: (count) => console.log('Dodge count:', count),
      onRelent: () => console.log('Button has surrendered!'),
      onCatch: () => console.log('Button was caught!')
    });

    // Programmatic controls:
    // dodge.reset();            // Reset dodges and state
    // dodge.setDisabled(true);  // Freeze button in place
    // dodge.destroy();          // Remove event listeners and DOM
  </script>
</body>
</html>
```

---

## 7. UX Guidelines & Anti-Frustration Rules

> [!CAUTION]
> **Never use DodgeField on essential actions**:
> Never wrap decline buttons, modal close triggers, unsubscribe links, cancellation flows, or cookie consent banners inside a DodgeField. This creates hostile dark patterns. Use it solely for easter eggs, playful gamified discount unlocks, or interactive portfolio showcases.

---

## 8. Accessibility & Reduced Motion

1. **`prefers-reduced-motion` Compliance**:
   - Automatically detects `(prefers-reduced-motion: reduce)`.
   - Freezes displacement at `(0, 0)`, disables spring oscillations, and ensures buttons remain instantly clickable without evasion.

2. **Touch Pointer Fallbacks**:
   - Gracefully degrades on touchscreens (`pointer: coarse`). Displays the optional `notice` prop under the button so mobile visitors are informed.

3. **Keyboard Focus Outlines**:
   - Maintains full `:focus-visible` styling with accessible outline offset for keyboard accessibility (`Tab` + `Enter` / `Space`).
