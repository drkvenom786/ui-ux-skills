---
name: dock-interactive-effect
description: Integrates interactive macOS-style Dock components from React Bits into web applications (React, Next.js, and Vanilla HTML/JS) with damped harmonic spring magnification, parabolic hop/launch bounce physics, responsive auto-fitting, proximity auto-hide, badges, active indicators, and portal SVG-tailed context menus.
risk: low
source: antigravity-custom-skills
date_added: 2026-11-05
---

# Dock Interactive Effect

An interactive macOS-inspired application dock originating from React Bits' `<Dock />`. It delivers smooth damped-spring magnification physics, parabolic launch hop/bounce animations, responsive auto-fitting, proximity auto-hide, badge notifications, active application dots, and glassmorphic SVG-tailed context menus with submenu support and comprehensive keyboard navigation.

---

## 1. Visual Architecture & Core Features

1. **Cosine-Bell Harmonic Magnification**:
   - Icons dynamically swell when the cursor approaches using a cosine-squared falloff curve.
   - Smoothly interpolated via Euler sub-stepped harmonic spring physics (`mass`, `stiffness`, `damping`), eliminating jerky transitions.
   - Symmetrical expansion preserves center alignments and supports horizontal (top/bottom) and vertical (left/right) orientations.

2. **Parabolic Hop / Launch Physics**:
   - Clicking an icon triggers an authentic macOS-style launch hop (`HOP = 0.4`, `HOP_TIME = 0.38s`).
   - Height and gravity are dynamically scaled to the current icon size, applying restitution damping (`-0.36`) upon landing before settling.

3. **Responsive Auto-Fit Scaling**:
   - An integrated `ResizeObserver` monitors host container constraints.
   - When available room is insufficient, total length is evaluated and an exact scale factor `fit = min(1, max(0.4, room / length))` is computed, downscaling icons, gaps, and panel thickness proportionally.

4. **Proximity Auto-Hide**:
   - When `autoHide` is enabled, the dock slides off-screen (`data-hidden`) until the pointer enters the edge activation threshold (`EDGE + thickness * 0.6`).
   - Automatically remains visible during user interactions, focus states, or active context menus, with delayed hide timing (`600ms`).

5. **SVG-Tailed Context Menus**:
   - Right-click, long-press (450ms), or keyboard context menu keys (`ContextMenu`, `Shift+F10`, directional arrows) summon a floating menu.
   - Procedurally generated SVG vector path (`menuPath`) renders a seamless directional tail pointing directly at the parent tile.
   - Built-in support for nested submenus, checkmarks (`role="menuitemcheckbox"`), keyboard navigation, keyboard shortcuts, and click-outside dismissal.

6. **Notification Badges & Indicators**:
   - Displays numeric or custom textual notification badges with custom badge colors (`badgeColor`).
   - Active application indicators display glowing dot pills under running items (`showIndicators`).

---

## 2. Physics & Mathematical Formulations

### Magnification Cosine-Bell Curve
Within the interaction distance \(D\) (`distance`), normalized reach \(r\) is calculated:
\[
r = \frac{|x_{\text{pointer}} - x_{\text{icon}}|}{D}
\]
When \(r < 1\), target size expands from \(S_{\text{base}}\) to \(S_{\text{peak}}\):
\[
S_{\text{target}} = S_{\text{base}} + (S_{\text{peak}} - S_{\text{base}}) \cdot \cos^2\left(\frac{r \cdot \pi}{2}\right)
\]

### Sub-Stepped Harmonic Spring-Damper Integration
To ensure numerical stability at 60–120 FPS, dt is sub-stepped at 240 Hz (\(h = \frac{dt}{\text{steps}}\)):
\[
k = \frac{\text{stiffness}}{\text{mass}}, \quad c = \frac{\text{damping}}{\text{mass}}
\]
\[
v_{t+1} = \frac{v_t + h \cdot k \cdot (S_{\text{target}} - S_t)}{1 + h \cdot c + h^2 \cdot k}
\]
\[
S_{t+1} = S_t + v_{t+1} \cdot h
\]

### Parabolic Launch Hop Physics
Upon click, parabolic gravity and vertical launch velocity are initialized:
\[
H_{\text{hop}} = S \cdot 0.4
\]
\[
g = \frac{8 \cdot H_{\text{hop}}}{T_{\text{hop}}^2}, \quad v_{\text{launch}} = \frac{g \cdot T_{\text{hop}}}{2}
\]
On impact (\(y \le 0\)), restitution velocity dampens by \(-0.36\):
\[
v_{\text{rebound}} = -0.36 \cdot v
\]

---

## 3. Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `DockItemData[]` | `[]` | Apps and tools in the dock. Each item accepts `icon`, `label`, `onClick`, `className`, `active`, `badge`, and `menu`. Dividers use `{ separator: true }`. |
| `position` | `'bottom' \| 'top' \| 'left' \| 'right'` | `'bottom'` | Screen or container edge. Icons expand away from this edge, standing vertically on left/right. |
| `theme` | `'dark' \| 'light'` | `'dark'` | Visual theme for panels, tiles, tooltips, and context menus. |
| `baseItemSize` | `number` | `50` | Unmagnified item size in px. Automatically shrinks when container bounds are exceeded. |
| `magnification` | `number` | `70` | Peak magnified item size under pointer in px. Equal to `baseItemSize` to disable. |
| `distance` | `number` | `200` | Influence radius in px over which neighboring icons scale. |
| `panelHeight` | `number` | `68` | Dock shelf thickness in px. Icons rise above shelf during expansion. |
| `gap` | `number` | `10` | Spacing between adjacent icons in px. |
| `roundness` | `number` | `0.5` | Border radius ratio from `0` (square) to `1` (circular capsules). |
| `spring` | `SpringConfig` | `{ mass: 0.1, stiffness: 150, damping: 12 }` | Harmonic spring parameters governing icon growth and damping. |
| `bounce` | `boolean` | `true` | Enables parabolic launch hop on click. |
| `autoHide` | `boolean` | `false` | Slides dock out of view until the cursor approaches the container perimeter. |
| `tiles` | `boolean` | `true` | Renders rounded glassmorphic tile backdrop behind glyphs. Set to `false` for raw icons. |
| `showLabels` | `boolean` | `true` | Displays floating tooltips above the hovered/focused icon. |
| `showIndicators` | `boolean` | `true` | Renders glowing dot indicators beneath items marked `active: true`. |
| `showBadges` | `boolean` | `true` | Displays badge notifications (`badge: 3` or `badge: true`). |
| `badgeColor` | `string` | `'#ff453a'` | Background fill color for notification badges. |
| `accentColor` | `string` | `'#0a84ff'` | Focus outlines and active menu item background tint. |
| `className` | `string` | `''` | Custom CSS class names applied to the outer dock element. |
| `style` | `CSSProperties` | `{}` | Inline CSS styles applied to the outer dock element. |

---

## 4. Component File Tree

```
C:\Users\V E N O M\.gemini\config\skills\dock-interactive-effect/
├── SKILL.md                 # Full documentation, mathematical physics, and integration guide
└── assets/
    ├── Dock.jsx             # React / Next.js client component with portal SVG-tailed menus
    ├── Dock.css             # Glassmorphic dock shelf, spring tiles, tooltips & context menu styling
    └── dock.js              # Standalone Vanilla JS engine (zero dependencies, class & init API)
```

---

## 5. Integration Guide: React & Next.js

### Basic Next.js (App Router / Pages) Integration

```jsx
'use client';

import Dock from './Dock';
import './Dock.css';

const items = [
  {
    icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
    label: 'Home',
    active: true,
    onClick: () => console.log('Home clicked'),
    menu: [
      { label: 'New Window', onClick: () => console.log('New Window') },
      { separator: true },
      {
        label: 'Options',
        items: [
          { label: 'Open at Login', checked: true },
          { label: 'Show in Finder' }
        ]
      },
      { separator: true },
      { label: 'Quit', onClick: () => console.log('Quit') }
    ]
  },
  {
    icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    label: 'Mail',
    badge: 3,
    onClick: () => console.log('Mail clicked')
  },
  { separator: true },
  {
    icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    label: 'Settings',
    onClick: () => console.log('Settings clicked')
  }
];

export default function App() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#121118', overflow: 'hidden' }}>
      <Dock
        items={items}
        position="bottom"
        theme="dark"
        baseItemSize={52}
        magnification={76}
        distance={220}
        panelHeight={70}
        autoHide={false}
      />
    </div>
  );
}
```

---

## 6. Integration Guide: Vanilla JavaScript

Include `Dock.css` in your `<head>` and load `dock.js`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="./Dock.css">
  <style>
    body {
      margin: 0;
      height: 100vh;
      background: #181622;
      overflow: hidden;
      position: relative;
    }
  </style>
</head>
<body>
  <div id="dock-container" style="position: absolute; inset: 0; pointer-events: none;"></div>

  <script src="./dock.js"></script>
  <script>
    const container = document.getElementById('dock-container');

    const dock = Dock.init(container, {
      position: 'bottom',
      theme: 'dark',
      baseItemSize: 52,
      magnification: 78,
      distance: 220,
      panelHeight: 70,
      autoHide: false,
      items: [
        {
          icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
          label: 'Home',
          active: true,
          onClick: () => console.log('Home opened'),
          menu: [
            { label: 'New Tab', onClick: () => console.log('New tab') },
            { separator: true },
            { label: 'Preferences', shortcut: '⌘,' }
          ]
        },
        {
          icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
          label: 'Messages',
          badge: '5',
          onClick: () => console.log('Messages opened')
        },
        { separator: true },
        {
          icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
          label: 'Downloads',
          onClick: () => console.log('Downloads')
        }
      ]
    });

    // Programmatic control:
    // dock.hop(0);           // Trigger launch bounce on item 0
    // dock.openMenu(0);      // Open context menu for item 0
    // dock.closeMenu();      // Dismiss open context menu
    // dock.destroy();        // Cleanup event listeners and DOM
  </script>
</body>
</html>
```

---

## 7. Accessibility & Performance

1. **ARIA Landmark & Roles**:
   - The dock root element applies `role="toolbar"`, `aria-label="Dock"`, and `aria-orientation="horizontal" | "vertical"`.
   - Items render as standard semantic `<button>` elements with distinct `aria-label`, `aria-haspopup="menu"`, and `aria-expanded`.
   - Context menus implement `role="menu"`, individual items implement `role="menuitem"` or `role="menuitemcheckbox"`.

2. **Keyboard Navigation**:
   - `ArrowLeft` / `ArrowRight` (horizontal) or `ArrowUp` / `ArrowDown` (vertical) navigate focus across dock tiles.
   - `Home` and `End` jump directly to the first and last items.
   - `ContextMenu`, `Shift+F10`, or directional arrows toward the open shelf edge open the context menu.

3. **Motion Sensitivity (`prefers-reduced-motion`)**:
   - Detects `window.matchMedia('(prefers-reduced-motion: reduce)')`.
   - Instantly snaps icons to magnification targets and disables hop oscillations, substituting instant opacity fades for scale animations.
