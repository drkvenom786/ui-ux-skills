---
name: staggered-menu-interactive-effect
description: Integrates interactive StaggeredMenu multi-layer sliding navigation menu components from React Bits into web applications (React, Next.js, and Vanilla HTML/JS with GSAP) with staggered color underlays, kinetic typography cycling, dynamic index numbering, and spring-eased reveal choreography.
risk: low
source: antigravity-custom-skills
date_added: 2026-11-07
---

# StaggeredMenu Interactive Effect

An elite, full-screen mobile and desktop staggered sliding navigation menu originating from React Bits' `<StaggeredMenu />`. Built on GSAP timeline choreography, it orchestrates multi-layer colored background cascades, kinetic 3-cycle "Menu" / "Close" text rolling, morphing 90° plus/cross icon rotation to 225°, and staggered typography reveals with automatic decimal-leading counter numbering.

---

## 1. Visual Architecture & Core Features

1. **Staggered Multi-Color Prelayers**:
   - Slides 2 to 4 layered color panels (`colors: ['#FF0055', '#9D4EDD', '#0e0a16']`) into view with cascading micro-delays (`i * 0.07s`) using `power4.out` easing.
   - Creates a premium layered wipe effect before the main menu panel slides into place.
2. **Kinetic Typography Reveal Choreography**:
   - Menu items emerge with a subtle 10° initial tilt and slide up from 140% Y translation (`yPercent: 0, rotate: 0`) with 0.1s stagger between links.
   - When closing, the panel slides out cleanly with `power3.in` at 0.32s and resets transform states automatically.
3. **Dynamic Decimal-Leading Counter Numbering**:
   - Optional `displayItemNumbering: true` automatically adds CSS counter numbering (`01`, `02`, `03`...) using `counter(smItem, decimal-leading-zero)` styled with accent color highlighting.
4. **Kinetic Text Cycling Button ("Menu" <-> "Close")**:
   - Clicking the toggle button triggers a high-speed multi-cycle text reel flip animation between "Menu" and "Close" using GSAP `power4.out`.
5. **Rotating Cross / Plus Icon**:
   - A minimalist 2-line geometric cross rotates smoothly to 225° on open (`power4.out`) and returns to 0° on close (`power3.inOut`).
   - **Cross / Plus (`+`) Centering & Visibility Rule**: The plus icon container (`.sm-icon`) must be positioned immediately on the right side of the toggle text (`margin-left: 6px; display: inline-flex !important; align-items: center; justify-content: center;`). Its horizontal (`plusH`) and vertical (`plusV`) bars must be centered with `transformOrigin: '7px 1px'` (width 14px, height 2px inside a 16x16 container) so that GSAP `rotate: 0` and `rotate: 90` maintain a clean mathematical `+` cross without being displaced by CSS `translate(-50%, -50%)` overrides. On open, rotating the container to 225° transforms the `+` directly into a crisp diagonal `✕`.
6. **Social Links Deck**:
   - Staggered social links fade and glide into view (`y: 0, opacity: 1`) with subtle hover dimming on non-hovered siblings.
7. **Theme & Palette Compatibility**:
   - Fully customizable via CSS variables `--sm-accent`, `--sm-panel-bg`, `--sm-item-color`, and `--sm-social-color`.
   - Supports light, dark, and Cyber-Luxe obsidian palettes.

---

## 2. File Assets in this Skill

The skill directory provides ready-to-use production assets for both React/Next.js and Vanilla JS projects:

| File | Purpose |
|---|---|
| [`assets/StaggeredMenu.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/staggered-menu-interactive-effect/assets/StaggeredMenu.jsx) | React / Next.js client component with GSAP context and timeline choreography. |
| [`assets/StaggeredMenu.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/staggered-menu-interactive-effect/assets/StaggeredMenu.css) | Layout styling, staggered prelayers, responsive typography, and hover states. |
| [`assets/staggeredmenu.js`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/staggered-menu-interactive-effect/assets/staggeredmenu.js) | Standalone Vanilla JS engine exposing `StaggeredMenu.init(container, options)`. |

---

## 3. Quick Start (Vanilla JS)

```html
<!-- 1. Include GSAP and StaggeredMenu assets -->
<link rel="stylesheet" href="vendor/StaggeredMenu.css" />
<script src="vendor/gsap.min.js"></script>
<script src="vendor/staggeredmenu.js"></script>

<!-- 2. Mount point in your layout -->
<div id="staggered-menu-mount"></div>

<!-- 3. Initialize in your script -->
<script>
  const menu = StaggeredMenu.init(document.getElementById('staggered-menu-mount'), {
    position: 'right',
    colors: ['#FF0055', '#9D4EDD', '#0e0a16'],
    panelBackground: '#0a0812',
    accentColor: '#00F5D4',
    menuButtonColor: '#ffffff',
    openMenuButtonColor: '#00F5D4',
    items: [
      { label: 'Overview', link: '#hero' },
      { label: 'Features', link: '#features' },
      { label: 'Video Engine', link: '#video-experience' },
      { label: 'I MUSIC', link: '#music-ecosystem' },
      { label: 'Developers', link: '#developers' },
      { label: 'Download', link: '#download' }
    ],
    socialItems: [
      { label: 'GitHub', link: 'https://github.com' },
      { label: 'Discord', link: 'https://discord.gg' },
      { label: 'X', link: 'https://x.com' }
    ],
    displaySocials: true,
    displayItemNumbering: true,
    onItemClick: (item, event, index) => {
      // Custom smooth scrolling logic
      const target = document.querySelector(item.link);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
</script>
```

---

## 4. Quick Start (React / Next.js)

```jsx
import StaggeredMenu from './StaggeredMenu';
import './StaggeredMenu.css';

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'Features', ariaLabel: 'View features', link: '#features' },
  { label: 'About', ariaLabel: 'Learn about us', link: '#about' },
  { label: 'Download', ariaLabel: 'Download the app', link: '#download' }
];

const socialItems = [
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'Telegram', link: 'https://t.me' }
];

export default function MobileNavigation() {
  return (
    <StaggeredMenu
      position="right"
      items={menuItems}
      socialItems={socialItems}
      displaySocials={true}
      displayItemNumbering={true}
      colors={['#FF0055', '#9D4EDD', '#0e0a16']}
      accentColor="#00F5D4"
      menuButtonColor="#ffffff"
      openMenuButtonColor="#00F5D4"
      changeMenuColorOnOpen={true}
      isFixed={true}
      onMenuOpen={() => console.log('Menu opened')}
      onMenuClose={() => console.log('Menu closed')}
    />
  );
}
```

---

## 5. Configuration Options

| Option / Prop | Type | Default | Description |
|---|---|---|---|
| `position` | `"left"` \| `"right"` | `"right"` | Side of the screen where the menu panel slides in from. |
| `colors` | `string[]` | `['#B497CF', '#5227FF']` | Palette of colors for cascading staggered prelayer slides. |
| `panelBackground` | `string` | `'#0a0812'` / `'white'` | Background color of the main aside panel. |
| `accentColor` | `string` | `'#5227FF'` | Accent hover color and index numbering color. |
| `menuButtonColor` | `string` | `'#fff'` | Color of toggle button text and icon when menu is closed. |
| `openMenuButtonColor`| `string` | `'#fff'` | Color of toggle button text and icon when menu is open. |
| `changeMenuColorOnOpen` | `boolean` | `true` | Whether to animate the toggle button color when opened. |
| `items` | `Array<{ label, link, ariaLabel? }>` | `[]` | Navigation items to render. |
| `socialItems` | `Array<{ label, link }>` | `[]` | Social links displayed at the bottom of the drawer. |
| `displaySocials` | `boolean` | `true` | Toggle visibility of the social links block. |
| `displayItemNumbering`| `boolean`| `true` | Enables automatic decimal counter numbering (`01`, `02`...). |
| `isFixed` | `boolean` | `false` (React) / `true` (Vanilla) | Fixes the menu wrapper to the full viewport (`fixed-wrapper`). |
| `closeOnClickAway` | `boolean` | `true` | Closes the menu on clicks outside the panel. |
| `onItemClick` | `(item, event, idx) => void` | `undefined` | Callback fired when an item is selected. |
