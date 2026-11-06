---
name: gooey-nav-interactive-effect
description: Integrates interactive WebGL2 GooeyNav liquid metaball navigation bars from React Bits into web applications (React, Next.js, and Vanilla HTML/JS) with signed distance field (SDF) blending, cubic Bézier droplet trajectories, spring-damped wobble physics, and dual-layer text color inversion clip paths.
risk: low
source: antigravity-custom-skills
date_added: 2026-11-05
---

# GooeyNav Interactive Effect

A state-of-the-art liquid metaball navigation bar originating from React Bits' `<GooeyNav />`. It renders an interactive active pill that dynamically dissolves into organic fluid droplets upon item selection, sends them flying along randomized cubic Bézier trajectories, merges them seamlessly with signed distance fields (SDFs), and wobbles into the destination item with harmonic spring physics.

---

## 1. Visual Architecture & Core Features

1. **WebGL2 Signed Distance Field (SDF) Fluid Rendering**:
   - Evaluates exact analytic distance fields for rounded rectangle pills (`sdPill`) and stretched droplet capsules (`sdCapsule`).
   - Melts traveling droplets and stationary pills together using polynomial smooth minimum blending (`blend(a, b, k)`), with adjustable viscosity (`gooeyness`).
   - Screen-space partial derivative normals (`dFdx`, `dFdy`) produce glossy top-edge specular rims and soft lifted drop shadows.
2. **Dual-Layer Text Color Inversion via SVG `clip-path`**:
   - Two layered item lists are rendered:
     1. Base list: Muted inactive navigation text (`--gn-muted`).
     2. Top overlay list (`gooey-nav__list--active`): High-contrast active ink color (`--gn-active-ink`).
   - A CPU field tracer dynamically generates a continuous SVG `clipPath` (`path('...')`) outlining the exact liquid contour of the active pill and flying droplets, creating pixel-perfect real-time text color inversion as droplets pass over words.
3. **Cubic Bézier Flight Dynamics**:
   - The selected pill disintegrates into $N$ distinct droplets (`particleCount`).
   - Each droplet launches outward with burst scatter (`spread`), swoops along an unpredictable 4-point cubic Bézier path, and gets absorbed into the destination pill.
4. **Harmonic Spring Wobble (`wobble`)**:
   - The destination pill oscillates via a sub-stepped damped harmonic spring solver (`omega = 26`, `zeta = 1 - 0.72 * wobble`) upon absorbing the incoming fluid mass, creating a tactile jiggle before resting.
5. **Soft Cursor Hover State**:
   - Smoothly interpolated frosted pill follows pointer hover (`hoverEffect`) behind items without triggering full selection.
6. **Graceful Fallback**:
   - Automatically degrades to CSS-transformed pill transitions if WebGL2 is unavailable or disabled.

---

## 2. File Assets in this Skill

The skill directory provides ready-to-use production assets for both React/Next.js and Vanilla JS projects:

| File | Purpose |
|---|---|
| [`assets/GooeyNav.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/gooey-nav-interactive-effect/assets/GooeyNav.jsx) | React / Next.js client component with WebGL2 shader pipeline and SVG clip path tracer. |
| [`assets/GooeyNav.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/gooey-nav-interactive-effect/assets/GooeyNav.css) | Layout, typography, glassmorphic frosted borders, and button/link styling. |
| [`assets/gooeynav.js`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/gooey-nav-interactive-effect/assets/gooeynav.js) | Standalone Vanilla JS engine exposing `GooeyNav.init(container, options)`. |

---

## 3. React / Next.js Integration

### Basic Setup
Copy [`assets/GooeyNav.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/gooey-nav-interactive-effect/assets/GooeyNav.jsx) and [`assets/GooeyNav.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/gooey-nav-interactive-effect/assets/GooeyNav.css) into your components directory.

```jsx
'use client';

import GooeyNav from './GooeyNav';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' }
];

export default function HeaderNavbar() {
  return (
    <header style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
      <GooeyNav
        items={navItems}
        initialActiveIndex={0}
        theme="dark"
        size="md"
        frame={true}
        particleCount={15}
        spread={56}
        animationTime={600}
        timeVariance={300}
        gooeyness={0.5}
        wobble={0.5}
        hoverEffect={true}
        onChange={(index, item) => console.log('Selected:', index, item.label)}
      />
    </header>
  );
}
```

---

## 4. Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | Array<{ label: string; href?: string; icon?: ReactNode }> | - | The navigation items. Items without an `href` render as buttons. |
| `initialActiveIndex` | number | `0` | Which item starts selected on mount. |
| `activeIndex` | number | - | Controlled active item index. Pair with `onChange`. |
| `onChange` | (index: number, item) => void | - | Callback fired whenever an item is clicked / selected. |
| `theme` | `'dark'` \| `'light'` | `'dark'` | Color palette for the glassmorphic frame, text, and active pill. |
| `color` | string | - | Custom color for the active liquid pill. Falls back to theme high-contrast default. |
| `activeTextColor` | string | - | Text color inside the liquid pill. Automatically computed via WCAG contrast when omitted. |
| `colors` | string[] | `[]` | Array of hex/rgba colors assigned to flying droplets as they burst. |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'md'` | Height and padding scale of the navigation menu items. |
| `frame` | boolean | `true` | Shows the glassmorphic frosted background panel with specular border rims. |
| `animationTime` | number | `600` | Travel duration of droplets moving between items (in milliseconds). |
| `particleCount` | number | `15` | Number of fluid droplets the pill disintegrates into. |
| `spread` | number | `56` | Maximum scatter displacement of droplets on their trajectory (in pixels). |
| `timeVariance` | number | `300` | Random timing jitter applied to individual droplet departures (in milliseconds). |
| `gooeyness` | number | `0.5` | Surface tension blending strength between pills and droplets (0 to 1). |
| `wobble` | number | `0.5` | Spring oscillation and bounce intensity of the newly formed destination pill (0 to 1). |
| `hoverEffect` | boolean | `true` | Renders a soft glowing pill behind hovered items. |
| `className` | string | `''` | Extra CSS class names for the root container. |
| `style` | object | `{}` | Inline CSS styles applied to the root nav element. |

---

## 5. Vanilla HTML / JavaScript Integration

### Step 1: Include CSS and Script
```html
<link rel="stylesheet" href="./GooeyNav.css" />
<script src="./gooeynav.js"></script>
```

### Step 2: Container Markup & Initialization
```html
<nav id="main-navigation"></nav>

<script>
  const nav = GooeyNav.init('#main-navigation', {
    items: [
      { label: 'Overview', href: '#overview' },
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Docs', href: '#docs' }
    ],
    initialActiveIndex: 0,
    theme: 'dark',
    size: 'md',
    frame: true,
    particleCount: 16,
    spread: 60,
    gooeyness: 0.55,
    wobble: 0.6,
    onChange: (index, item) => {
      console.log('Navigated to:', item.label);
    }
  });

  // Programmatic API:
  // nav.select(2); // Triggers droplet animation to item 2
  // nav.update({ theme: 'light', color: '#ff5a36' }); // Updates options live
  // nav.destroy(); // Cleans up WebGL context and event listeners
</script>
```

---

## 6. Performance & Accessibility Best Practices

1. **Zero-Power Resting State**:
   - Once all droplets are absorbed and the spring oscillation reaches rest threshold, `requestAnimationFrame` stops completely.
2. **Semantic HTML & Screen Reader Support**:
   - Uses semantic `<nav>`, `<ul>`, `<li>`, and `<a>`/`<button>` tags with full keyboard focus navigation and `aria-current="page"`.
   - The active inverted text layer is marked `aria-hidden="true"` so screen readers only encounter the list once.
3. **Reduced Motion**:
   - When `(prefers-reduced-motion: reduce)` is enabled, droplet explosion and wobble physics are instantly skipped, snapping the pill cleanly to the selected item.
