---
name: folder-interactive-effect
description: Integrates interactive 3D Folder components (React Bits) with perspective physics, flap/book modes, frosted glass materials, document dragging, click-to-zoom, and mobile-responsive animations into web applications (React, Next.js, and Vanilla HTML/JS).
risk: low
source: antigravity-custom-skills
date_added: 2026-11-04
---

# Folder Interactive 3D Effect

A GPU-accelerated, physics-based interactive 3D folder component (originating from React Bits) that showcases projects, portfolios, documents, or photos inside an authentic skeuomorphic 3D folder with interactive flap opening, glassmorphism, spring physics, card peek/zoom, and drag-and-drop mechanics.

---

## Key Features

1. **Realistic 3D Perspective & Spring Physics**:
   - Uses CSS 3D transforms (`matrix3d`, `perspective`, `transform-style: preserve-3d`) driven by second-order spring dynamics (`omega`, `zeta`).
   - Flap opens smoothly on click or hover with natural overshoot bounce.
2. **Interactive Document Cards**:
   - **Click to Zoom**: Clicking any project document zooms it into high-resolution focus view.
   - **Peek on Hover**: Hovering over the folder teases documents upward in a natural arc.
   - **Physics Drag & Drop**: Documents can be dragged anywhere on the desk surface or returned into the folder pocket.
3. **Material Variants**:
   - `glass`: Translucent front with SVG/CSS backdrop blur refraction, glint highlights, and interior depth.
   - `solid`: Opaque vibrant gradient shading derived from the folder accent color.
   - `matte`: Flat modern finish.
4. **Full Mobile & Touch Responsiveness**:
   - Adaptive dynamic scaling from small mobile phones (`< 400px`) up to ultra-wide displays.
   - Mobile-aware layout spread that prevents cards from overflowing viewport edges.
   - Safe touch gestures (`touch-action: pan-y`) preserving native vertical scrolling while allowing taps and drags.

---

## 1. Quick Integration (Vanilla HTML / JS)

### Step 1: Link CSS and Script

```html
<link rel="stylesheet" href="Folder.css">
<script src="folder.js"></script>
```

### Step 2: Add Container in HTML

```html
<section id="projects" class="py-24 px-6 overflow-visible">
    <div class="text-center mb-12">
        <h2 class="text-5xl font-bold text-white">Projects</h2>
        <p class="text-gray-400">A showcase of apps and projects I've built</p>
    </div>

    <!-- 3D Folder Mount Point -->
    <div class="flex justify-center items-center min-h-[460px]">
        <div id="projects-folder" class="relative z-20"></div>
    </div>
</section>
```

### Step 3: Initialize with Custom Projects

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('projects-folder');
  if (container && window.Folder) {
    window.Folder.init(container, {
      label: "Projects",
      color: "#A855F7",
      variant: "glass",
      paperColor: "#121212",
      size: 1.7, // Automatically scales down on tablets & mobile devices
      layout: "spread",
      defaultOpen: true,
      draggable: true,
      zoomOnClick: true,
      peek: true,
      intro: true,
      items: [
        {
          title: "AirBeats – Music Player",
          description: "High-performance, ad-free Android music player app with background playback and audio optimization.",
          url: "https://airbeats.org",
          btnText: "View AirBeats",
          accentColor: "#22C55E",
          iconHtml: '<img src="icon.png" alt="AirBeats" class="w-full h-full object-cover rounded-lg">'
        },
        {
          title: "AirFlix – Cinema Streaming",
          description: "4K Ultra HD streaming platform with auto-adaptive playback and region discovery.",
          url: "https://airflix.netlify.app",
          btnText: "View AirFlix",
          accentColor: "#EF4444",
          iconHtml: '<i class="fas fa-film text-2xl text-red-500"></i>'
        },
        {
          title: "ChatsApp – Realtime Messenger",
          description: "Modern real-time chat application featuring instant messaging and responsive design.",
          url: "https://chatsapp.pages.dev",
          btnText: "View ChatsApp",
          accentColor: "#A855F7",
          iconHtml: '<i class="fas fa-comments text-2xl text-purple-400"></i>'
        }
      ]
    });
  }
});
```

---

## 2. React / Next.js Integration

```jsx
import Folder from './Folder';
import './Folder.css';

const projects = [
  {
    title: 'AirBeats',
    description: 'Ad-free Android music player',
    url: 'https://airbeats.org'
  },
  {
    title: 'AirFlix',
    description: 'Ultra HD streaming platform',
    url: 'https://airflix.netlify.app'
  }
];

export default function ProjectsSection() {
  return (
    <div style={{ width: '100%', minHeight: '520px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Folder
        label="Projects"
        variant="glass"
        color="#A855F7"
        paperColor="#121212"
        size={1.6}
        layout="spread"
        defaultOpen={true}
        items={projects}
        onItemClick={(item, index) => console.log('Clicked item', item, index)}
      />
    </div>
  );
}
```

---

## 3. Configuration Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `'Projects'` | Text displayed on the folder tab. |
| `color` | `string` | `'#3d8bff'` | Accent color used to derive highlights, tabs, and folder gradients. |
| `variant` | `'glass' \| 'solid' \| 'matte'` | `'glass'` | Visual surface style. `glass` features blur refraction. |
| `paperColor` | `string` | `'#ffffff'` | Background color of document pages. |
| `layout` | `'spread' \| 'stack' \| 'row'` | `'spread'` | How document cards are fanned out when the folder is open. |
| `size` | `number` | `1` | Base scale multiplier. Handled adaptively across screen breakpoints. |
| `defaultOpen` | `boolean` | `false` | Whether the folder starts in the open position. |
| `draggable` | `boolean` | `true` | Allows dragging documents out onto the workspace and dropping back in. |
| `zoomOnClick` | `boolean` | `true` | Clicking any card brings it into close-up zoom. |
| `peek` | `boolean` | `true` | Teases documents upward when mouse hovers over closed folder. |
| `openOn` | `'click' \| 'hover'` | `'click'` | Trigger event that opens the folder. |
| `bounce` | `number` | `0.4` | Spring overshoot elasticity (0 to 1). |
| `speed` | `number` | `1` | Animation speed multiplier. |
| `tilt` | `number` | `0.5` | Degree of 3D tilt tracking user pointer movements. |
| `frost` | `number` | `0.3` | Glass variant blur depth. |

---

## 4. Mobile Responsiveness Implementation Notes

- **Dynamic Viewport Fit**: On mobile screens (`window.innerWidth < 640`), `placeFlap` calculates `maxSpreadWidth = Math.min(window.innerWidth - 32, g.w * 2.2)`. This ensures fanned cards remain fully visible without horizontal page scroll.
- **Touch Drag Guard**: `pointerdown` checks if an anchor tag (`<a>`) was clicked to guarantee link clicks work reliably on touch devices. The drag threshold is set to `14px` on touch to prevent conflicts with page scrolling.
- **Adaptive Resize**: The vanilla script includes a debounced `window.resize` handler that updates scale, recalculates SVG clip paths, and updates CSS custom properties automatically.

---

## 5. Asset Files

- [Folder.jsx](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/folder-interactive-effect/assets/Folder.jsx): Full React Bits component source.
- [Folder.css](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/folder-interactive-effect/assets/Folder.css): 3D perspective, glassmorphism, card typography, and responsive rules.
- [folder.js](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/folder-interactive-effect/assets/folder.js): Standalone vanilla JavaScript engine.
