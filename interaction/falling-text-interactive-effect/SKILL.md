---
name: falling-text-interactive-effect
description: Integrates interactive FallingText 2D physics kinetic typography effects from React Bits into web applications (React, Next.js, and Vanilla HTML/JS with Matter.js) with rigid-body collisions, staggered drops, pointer drag constraints, kinetic cursor swipe kicks, and spring restoration.
risk: low
source: antigravity-custom-skills
date_added: 2026-11-05
---

# FallingText Interactive Effect

A 2D physics kinetic typography engine originating from React Bits' `<FallingText />`. It converts sentences or letters into physical rigid bodies powered by **Matter.js**, letting typography tumble, bounce, collide, and scatter under realistic gravity. Users can grab, toss, or swipe fallen pieces with their cursor, and words spring smoothly back into place after settling.

---

## 1. Visual Architecture & Core Features

1. **DOM-to-Rigid-Body Mapping**:
   - Deconstructs DOM text into individual word or letter bounding rectangles using `getBoundingClientRect()`.
   - Spawns matching rectangular Matter.js rigid bodies with optional chamfered corners for tactile, block-like physics.
2. **Dynamic Collision Boundaries & Domino Cascades**:
   - Viewport boundary walls (floor, left, right, ceiling) dynamically resize via `ResizeObserver`.
   - Collision detection (`collisionStart`) knocks loose stationary pieces whenever a falling letter lands on them, creating organic domino chain reactions.
3. **Staggered Drop Orders**:
   - `random`: Unpredictable chaotic tumbling.
   - `sequence`: Left-to-right reading order collapse.
   - `center`: Structural collapse beginning at the center and rippling outwards.
   - `together`: Sudden synchronous drop of all pieces at once.
4. **Interactive Pointer Physics**:
   - **Interactive Drag & Toss**: Click and fling individual pieces with spring-damped pointer constraints (`Matter.Constraint`).
   - **Kinetic Cursor Swipes (`cursorPush`)**: High-velocity cursor swipes transfer kinetic momentum into resting piles, scattering letters like billiard balls.
5. **Spring Restoration**:
   - Settled pieces automatically fly back into their original DOM layout after `restoreDelay` seconds using the Web Animations API (`element.animate()`) with a custom spring curve (`linear(...)`).
6. **Appearance Modes & Themes**:
   - `variant="text"`: Clean falling text letters.
   - `variant="tiles"`: Skeuomorphic frosted tiles with inner specular highlights and drop shadows.
   - `theme="dark"` / `theme="light"`: Built-in color palettes with automated WCAG contrast calculation for accent text.
   - `wireframes`: Debug mode showing physical collision outlines.

---

## 2. File Assets in this Skill

The skill directory provides ready-to-use production assets for both React/Next.js and Vanilla JS projects:

| File | Purpose |
|---|---|
| [`assets/FallingText.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/falling-text-interactive-effect/assets/FallingText.jsx) | Full React / Next.js client component powered by Matter.js. |
| [`assets/FallingText.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/falling-text-interactive-effect/assets/FallingText.css) | Layout, tile gradients, drop shadows, and grab/grabbing cursors. |
| [`assets/fallingtext.js`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/falling-text-interactive-effect/assets/fallingtext.js) | Standalone Vanilla JS engine exposing `FallingText.init(container, options)`. |

---

## 3. React / Next.js Integration

### Step 1: Install Dependency
```bash
npm install matter-js
# or
yarn add matter-js
# or
pnpm add matter-js
```

### Step 2: Component Usage
Copy [`assets/FallingText.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/falling-text-interactive-effect/assets/FallingText.jsx) and [`assets/FallingText.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/falling-text-interactive-effect/assets/FallingText.css) into your components folder.

```jsx
'use client';

import FallingText from './FallingText';

export default function HeroHeadline() {
  return (
    <div style={{ height: '400px', width: '100%', position: 'relative' }}>
      <FallingText
        text="Some sentences are built to last. This one falls apart on contact."
        highlightWords={['falls', 'apart']}
        trigger="hover"
        fontSize="2rem"
        gravity={1}
        restoreDelay={2}
      />
    </div>
  );
}
```

---

## 4. Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | `''` | The text that falls apart into physics rigid bodies. |
| `highlightWords` | string[] | `[]` | Words starting with any of these prefixes receive accent colors or highlighted tiles. |
| `highlightClass` | string | `'highlighted'` | Extra CSS class added to highlighted words. |
| `trigger` | `'auto'` \| `'hover'` \| `'click'` \| `'scroll'` | `'auto'` | What initiates the fall. `'scroll'` triggers when 30% of the element enters the viewport. |
| `variant` | `'text'` \| `'tiles'` | `'text'` | Plain typography or rounded skeuomorphic tiles that stack like blocks. |
| `split` | `'words'` \| `'letters'` | `'words'` | Determines whether whole words or single letters tumble independently. |
| `order` | `'random'` \| `'sequence'` \| `'center'` \| `'together'` | `'random'` | Determines which pieces begin falling first. |
| `stagger` | number | `0.03` | Delay between consecutive pieces falling (in seconds). |
| `gravity` | number | `1` | Strength of gravity. Negative values cause pieces to float upward. |
| `bounciness` | number | `0.2` | Restitution of the pieces when colliding with walls or each other (0 to 1). |
| `scatter` | number | `0.5` | Sideways push and angular spin applied as each piece drops (0 to 1). |
| `draggable` | boolean | `true` | Allows users to click, drag, and fling fallen pieces. |
| `mouseConstraintStiffness` | number | `0.2` | Stiffness of the pointer drag constraint (0 to 1). |
| `cursorPush` | number | `0.5` | Kinetic impulse transferred by rapid cursor swipes. 0 disables swipe kicks. |
| `restoreDelay` | number | `0` | Seconds after the pile settles before spring restoration reassembles text. 0 keeps pieces fallen. |
| `fontSize` | string | `'1rem'` | Font size for the text container. |
| `accentColor` | string | `'#5b8cff'` | Color for highlighted words or tiles. Automatically chooses dark or light ink for legibility. |
| `theme` | `'dark'` \| `'light'` | `'dark'` | Color theme for tile gradients and shadows. |
| `backgroundColor` | string | `'transparent'` | Background color for the interactive canvas area. |
| `wireframes` | boolean | `false` | Renders outlines around each physical rigid body for debugging. |
| `className` | string | `''` | Additional CSS class names for the root container. |
| `style` | object | `{}` | Inline CSS styling overrides for the container. |

---

## 5. Vanilla HTML / JavaScript Integration

### Step 1: Include Matter.js and Styles
```html
<link rel="stylesheet" href="./FallingText.css" />
<script src="https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js"></script>
<script src="./fallingtext.js"></script>
```

### Step 2: Container Markup & Initialization
```html
<div id="headline-canvas" style="height: 450px; width: 100%; position: relative;"></div>

<script>
  const effect = FallingText.init('#headline-canvas', {
    text: 'Move fast and break things. Physics takes care of the rest.',
    highlightWords: ['break', 'Physics'],
    trigger: 'hover',
    variant: 'tiles',
    split: 'words',
    fontSize: '2.2rem',
    accentColor: '#ff5a36',
    gravity: 1.2,
    bounciness: 0.35,
    cursorPush: 0.8,
    restoreDelay: 3
  });

  // Programmatic controls:
  // effect.fall();
  // effect.restore();
  // effect.destroy();
</script>
```

---

## 6. Performance & Accessibility Best Practices

1. **Reduced Motion (`prefers-reduced-motion`)**: Automatically detected; animation and physics bodies are bypassed so text remains static and accessible for users with vestibular sensitivities.
2. **Text Crawlers & Screen Readers**: The DOM text maintains standard semantic flow before falling and retains screen reader readability.
3. **Adaptive Sleeping**: Matter.js bodies sleep (`enableSleeping: true`) once kinetic energy falls below `0.05`, eliminating idle CPU/GPU battery drain.
4. **Touch & Mobile Support**: Built-in pointer capture ensures dragging works seamlessly on iOS Safari and Android touch devices without unintended scrolling.
