---
name: pill-nav-interactive-effect
description: Integrates interactive PillNav floating navbar components from React Bits into web applications (React, Next.js, and Vanilla HTML/JS) with split/joined layouts, circular ink-fill rollout hover effects, spring-physics gliding active pills, sliding dot indicators, and auto-collapsing shape-morphing mobile menus.
risk: low
source: antigravity-custom-skills
date_added: 2026-11-05
---

# PillNav Interactive Effect

A floating pill navbar originating from React Bits' `<PillNav />`. It delivers a tactile, mobile-responsive navigation experience with split or joined capsule layouts, rotating logo buttons, spring-physics active pill glides, circular ink-fill text rollovers, sliding dot indicators, and shape-morphing mobile hamburger drawer panels.

---

## 1. Visual Architecture & Core Features

1. **Split vs. Joined Capsule Layouts**:
   - `split`: Positions the round logo in its own satellite bubble beside the main pill bar.
   - `joined`: Encapsulates the logo and all navigation items inside a single seamless capsule.
2. **Dual Hover Effect Styles**:
   - `fill`: Radial circular ink fill rises from the bottom of each item (`--pn-fill`), while the label executes a vertical kinetic rollover (`.pill-nav__face` flips upward to `.pill-nav__face-alt`).
   - `glide`: A continuous pill slider glides smoothly between items using damped harmonic spring physics (`k0`, `k1`, `stretch`, `bounce`).
   - `none`: Static hover states for minimal designs.
3. **Indicator Modes**:
   - `dot`: A micro sliding dot tracks the active page along the bottom edge, stretching horizontally based on glide velocity.
   - `pill`: Full active pill highlight enclosing the active item.
   - `none`: Relies solely on text contrast.
4. **Interactive Spinning Logo**:
   - Hovering the circular logo mark triggers a smooth 360° spin animation with cubic Bézier easing (`cubic-bezier(0.65, 0, 0.25, 1)`).
5. **Responsive Auto-Collapse & Morphing Mobile Drawer**:
   - Real-time `ResizeObserver` checks container width against a hidden measurement track (`.pill-nav__measure`).
   - When available width is exceeded, the bar collapses into an animated 2-line hamburger button.
   - Opening the menu morphs the button into a 24px rounded frosted card using dynamic `clip-path: inset(...)` transitions.
6. **Surface Materials**:
   - `glass`: Frosted backdrop blur (`blur(20px) saturate(1.6)`) with subtle specular highlights and soft drop shadows.
   - `solid`: Opaque color surface fill.
   - `none`: Transparent backdrop.

---

## 2. File Assets in this Skill

The skill directory provides ready-to-use production assets for both React/Next.js and Vanilla JS projects:

| File | Purpose |
|---|---|
| [`assets/PillNav.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/pill-nav-interactive-effect/assets/PillNav.jsx) | React / Next.js client component with spring physics and auto-collapse. |
| [`assets/PillNav.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/pill-nav-interactive-effect/assets/PillNav.css) | Layout styling, glassmorphic surfaces, kinetic text rolling, and hamburger morphing. |
| [`assets/pillnav.js`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/pill-nav-interactive-effect/assets/pillnav.js) | Standalone Vanilla JS engine exposing `PillNav.init(container, options)`. |

---

## 3. React / Next.js Integration

### Basic Setup
Copy [`assets/PillNav.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/pill-nav-interactive-effect/assets/PillNav.jsx) and [`assets/PillNav.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/pill-nav-interactive-effect/assets/PillNav.css) into your components directory.

```jsx
'use client';

import PillNav from './PillNav';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Journal', href: '/journal' },
  { label: 'Photos', href: '/photos' },
  { label: 'About', href: '/about' }
];

export default function Header() {
  return (
    <header style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <PillNav
        logo="/logo.svg"
        logoAlt="Company Logo"
        items={navItems}
        activeHref="/"
        layout="split"
        itemStyle="pill"
        hoverEffect="fill"
        indicator="dot"
        theme="dark"
        size="md"
        surface="glass"
      />
    </header>
  );
}
```

---

## 4. Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | Array<{ label: string; href?: string; icon?: ReactNode; ariaLabel?: string }> | - | Navigation links. Items without `href` render as semantic buttons. |
| `logo` | string \| ReactNode | - | Image URL or SVG element displayed in the circular button. Spins on hover. |
| `logoAlt` | string | `'Logo'` | Accessible label for the logo link. |
| `logoHref` | string | `'#'` | URL destination for the logo button. |
| `activeHref` | string | - | Controlled active URL. When omitted, tracks clicked items internally. |
| `defaultActiveIndex` | number | `0` | Default active item index when `activeHref` is not provided. |
| `onItemClick` | (item, index, event) => void | - | Callback fired whenever a navigation item is clicked. |
| `linkComponent` | ElementType | `'a'` | Custom link element or router link component (e.g., Next.js `Link`). |
| `theme` | `'dark'` \| `'light'` | `'dark'` | Color scheme for surfaces, labels, and active highlight. |
| `layout` | `'split'` \| `'joined'` | `'split'` | `'split'` isolates the logo into a bubble; `'joined'` houses everything in one capsule. |
| `itemStyle` | `'pill'` \| `'plain'` | `'pill'` | `'pill'` renders raised background tiles on each item; `'plain'` renders labels directly on the bar. |
| `hoverEffect` | `'fill'` \| `'glide'` \| `'none'` | `'fill'` | `'fill'` expands a circular ink ripple with rolling text; `'glide'` slides a spring pill. |
| `indicator` | `'dot'` \| `'pill'` \| `'none'` | `'dot'` | Marks active item: a sliding dot or full active pill. |
| `surface` | `'glass'` \| `'solid'` \| `'none'` | `'glass'` | Frosted glassmorphism, opaque surface fill, or transparent background. |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'md'` | Height, padding, and font size scale. |
| `highlightColor` | string | - | Custom color override for the active fill, glide pill, and dot. |
| `highlightTextColor` | string | - | Overrides label color when active on the highlight. |
| `barColor` | string | - | Custom background color for the navbar and logo container. |
| `textColor` | string | - | Custom label text color. |
| `bounce` | number | `0.3` | Spring overshoot restitution for gliding pill and dot (0 to 1). |
| `stretch` | number | `0.5` | Lead/lag elongation of the gliding pill during rapid movement (0 to 1). |
| `collapse` | `'auto'` \| `'always'` \| `'never'` | `'auto'` | Automatically collapses links into a hamburger button when width is constrained. |
| `onMenuToggle` | (open: boolean) => void | - | Callback fired when the mobile drawer panel opens or closes. |
| `intro` | boolean | `true` | Executes an unrolling reveal animation on mount. |
| `ariaLabel` | string | `'Main'` | Accessible name for the `<nav>` landmark. |
| `className` | string | `''` | Extra class names for the container. |
| `style` | object | `{}` | Inline CSS styling overrides. |

---

## 5. Vanilla HTML / JavaScript Integration

### Step 1: Include CSS and Script
```html
<link rel="stylesheet" href="./PillNav.css" />
<script src="./pillnav.js"></script>
```

### Step 2: Container Markup & Initialization
```html
<nav id="nav-container"></nav>

<script>
  const nav = PillNav.init('#nav-container', {
    logo: './logo.svg',
    items: [
      { label: 'Home', href: '#home' },
      { label: 'Work', href: '#work' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'About', href: '#about' }
    ],
    defaultActiveIndex: 0,
    layout: 'split',
    itemStyle: 'pill',
    hoverEffect: 'fill',
    indicator: 'dot',
    theme: 'dark',
    size: 'md',
    surface: 'glass',
    onItemClick: (item, index) => {
      console.log('Selected:', item.label);
    }
  });

  // Programmatic API:
  // nav.select(2); // Activates item index 2
  // nav.toggleMenu(true); // Opens mobile drawer panel
  // nav.update({ theme: 'light', highlightColor: '#ff5a36' }); // Live options update
  // nav.destroy(); // Cleans up observers and DOM
</script>
```

---

## 6. Performance & Accessibility Best Practices

1. **Accessibility (a11y)**:
   - Full keyboard tab navigation, `aria-current="page"` markers, and visible focus rings (`:focus-visible`).
   - Mobile menu button includes `aria-expanded` and `aria-controls` bindings with `Escape` key dismissal.
2. **Reduced Motion (`prefers-reduced-motion`)**:
   - Disables initial intro unrolling, logo hover spins, and spring gliding; transitions snap instantaneously for users with vestibular sensitivities.
3. **No Heavy Dependencies**:
   - Built entirely on standard modern CSS and the native Web Animations API (`element.animate()`). Zero external bundle weight.

4. **Smooth Scroll & Scroll-Spy Synchronization**:
   - When integrating `PillNav` with single-page smooth scrolling and an `IntersectionObserver` scroll-spy, ALWAYS use a programmatic navigation lock (`isNavigatingProgrammatically = true`).
   - While smooth scrolling is animating, strictly ignore intermediate observer callbacks. This prevents sections passed during the scroll from pulling the active color fill back to previous options before reaching the target.
   - In pillnav.js, do NOT reset state.hover = -1 on ocusout events (focus shifts on click, which previously caused the hover target to prematurely fall back to the old selectedIndex before the new index was committed).
   - On pointerdown, immediately lock state.hover = index and 	his.selectedIndex = index so the spring target never flips backward to the previous option upon click.
   - Use a timestamp-based lock (
avLockUntil = Date.now() + 1000) in pp.js to ensure scroll-spy callbacks cannot override the chosen item during smooth scrolling.

