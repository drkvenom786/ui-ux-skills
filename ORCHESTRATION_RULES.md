# Master UI/UX & Interaction Orchestration Rules ⚡🎨

A definitive, production-grade specification for orchestrating interactive typography, physics-based UI components, section-by-section WebGL backgrounds, multi-image helices, card stacks, responsive edge-to-edge layouts, and mobile navigation across modern web applications.

---

## 1. Zero Audio Policy
- Websites must remain **completely silent by default**.
- Never initialize Web Audio API, background soundscapes, chimes, synthesizers, or sound effects unless explicitly requested by the user.
- If an interactive component provides an internal audio mechanism (e.g. `WarpText` water drop tap audio), it **must be explicitly disabled** (`audio: false`, `soundEnabled: false`, `WarpText.Audio.enabled = false`).

---

## 2. Interactive Skills STRICT Priority Mandate
Always give first priority to the installed interactive skills (`<skill-name>-interactive-effect`) instead of improvising generic transitions or using generic motion libraries:

### A. Section-by-Section Background Differentiation Mandate
> [!IMPORTANT]
> **STRICT BAN ON SINGLE GLOBAL BACKGROUNDS**:
> - **NEVER create a single background for the whole website**. Each section MUST have its own independent background container/canvas (`.section-bg-mount` / `.section-bg-canvas`), even if using the same color theme. Every section owns its interactive backdrop independently.
> - **Multi-Color Antigravity Rule**: When using `antigravity-interactive-effect`, **NEVER use a single monochrome color**. Always configure a rich, multi-color harmonized palette (e.g., Sacred Gold `#D4AF37`, Celestial Azure `#3B82F6`, Luminous Emerald `#10B981`, and Imperial Rose `#E11D48`).
> - **Light Background Rule**: Whenever a page or section uses a light background (ivory, pearl, light parchment), ALWAYS use **`antigravity-interactive-effect`** with multi-colored floating particle dust and magnetic repulsion.

---

### B. Typography & Subheading Rules
| Typography Level | Background Match | Required Component | Behavior at Rest | Interactive Trigger |
|:---|:---|:---|:---|:---|
| **Big Hero Heading** | `dotfield-interactive-effect` | **`particle-text-interactive-effect`** | Particles gathered in sharp formation | Cursor repulsion & spring burst |
| **Big Hero Heading** | `liquid-ether-interactive-effect` | **`warp-text-interactive-effect`** | Fluid wave undulation | Refraction wake & click dispersion |
| **Big Hero Heading** | `antigravity-interactive-effect` | **`particle-text-interactive-effect`** | Multi-color particle alignment | Proximity scatter & orbital return |
| **Subheadings & Secondary Titles** | Any | **`warp-text-interactive-effect`** | **CALM AT REST (Never destructive)** | **Click/tap wave only** (`clickWaveOnly: true`) |
| **Multi-Line Descriptions (2+ lines)** | Any | **`warp-text-interactive-effect`** | **CALM AT REST (Never destructive)** | Subtle water ripple on hover/click |

---

### C. Image & Multi-Image Gallery Rules

#### 1. Multi-Photo Galleries: `infinite-spiral-interactive-effect`
> [!IMPORTANT]
> **INFINITE SPIRAL PLACEMENT & DURATION RULES**:
> 1. **NO INNER CARD NESTING**: NEVER place `InfiniteSpiral` inside an inner card or framed card box. It must breathe freely on the section canvas.
> 2. **NO CENTER PLACEMENT**: NEVER place `InfiniteSpiral` centered alone. It must always be placed asymmetrically in a split layout with narrative text flanking it.
> 3. **MINIMUM TWO-SECTION SPAN**: NEVER constrain `InfiniteSpiral` to a single isolated section. It MUST span across a **minimum of two consecutive sections** so that as the user scrolls from one section to the next, the 3D cylindrical helix seamlessly links and transitions between both sections.
> 4. **FULL INTERACTION MODES (`animationMode: 'all'`)**: NEVER restrict `InfiniteSpiral` to scroll-only. It must always use `animationMode: 'all'` so visitors can auto-spin, pointer-drag, touch-fling, AND scroll through the helix simultaneously.

#### 2. Single Image in Any Section: `warp-text-interactive-effect` (`warpImage`)
- Must use image liquid wave mode (`warpImage`).
- **Pristine at rest**: Zero caustics or destructive distortion when idle.
- Expanding concentric liquid water wave ripples trigger cleanly on hover and click/tap.

---

### D. Card Architecture & Count Rules

| Card Scenario | Required Component | Strict Placement & Architecture Rules |
|:---|:---|:---|
| **Single Card in Any Section** | **`lanyard-interactive-effect`** (`lanyard.js`) | Three.js Verlet cloth strap physics, rigid-body card dynamics, holographic iridescent foil shader, and interactive drag/tilt/flip. |
| **Few Cards (3–4 Cards in a Section)** | **`folder-interactive-effect`** (`folder.js`) | 3D perspective physics, frosted glass materials, document tab dragging, click-to-zoom expansion, and spring settling. |
| **Many Cards / Features / Services (5+ Cards)** | **`card-swap-interactive-effect`** (`CardSwap.jsx` / `cardswap.js`) | **STRICT RULES**: <br>1. **NEVER nest inside another card**.<br>2. **NEVER place in the center**.<br>3. **ALWAYS place on the RIGHT side** with descriptive feature/service text on the **LEFT side**.<br>4. Used for services, features, and disciplines. |
| **Cards in the Last Section of Website** | **`laser-flow-interactive-effect`** (`laserflow.js`) | Scroll-triggered volumetric laser beam washes with realistic surface impact. **Laser colors MUST strictly match the website's theme palette.** |

---

### E. Zero Margin Space Across All Devices (Edge-to-Edge Fluidity)
> [!IMPORTANT]
> **STRICT BAN ON MARGIN GAPS**:
> - Always ensure there is **NO unwanted margin space, dead edge gaps, or horizontal scroll gutters on any device** (desktop, laptop, tablet, and small Android/iOS mobile screens).
> - Root layout containers must strictly enforce:
>   ```css
>   html, body {
>     margin: 0 !important;
>     padding: 0 !important;
>     width: 100% !important;
>     max-width: 100vw !important;
>     overflow-x: hidden !important;
>     box-sizing: border-box !important;
>   }
>   *, *::before, *::after {
>     box-sizing: border-box !important;
>   }
>   section {
>     width: 100% !important;
>     max-width: 100vw !important;
>     margin-left: 0 !important;
>     margin-right: 0 !important;
>   }
>   ```
> - Full-width interactive backgrounds (`DotField`, `LiquidEther`, `Antigravity`), hero containers, headers, and footer blocks must span the full viewport seamlessly with zero side margins or horizontal scroll clipping.

---

### F. Mouse & Cursor Dynamics (Low & Natural Glow)
- ALWAYS use **`splash-cursor-interactive-effect`** (`splashcursor.js`) or **`glow-cursor-interactive-effect`** (`glowcursor.js`). Never substitute with generic circular followers.
- **Low & Natural Glow Mandate**:
  - Never set blinding, harsh, or oversaturated click bursts.
  - Keep click splash bursts, bloom pyramids, and specular light highlights soft, organic, gentle, and natural:
    - `intensity`: `0.45` – `0.65`
    - `glow`: `0.15` – `0.25`
    - `force`: `0.5` – `0.65`
    - `press`: `0.35`

---

### G. Specular Lighting, Dock, & Navigation
- **Specular Lighting & Edge Hover**: ALWAYS use `specular-border-interactive-effect` (`specular.js`, `SpecularButton.css`) for raytraced perimeter borders on primary action buttons and cards.
- **Application Dock & Launcher**: ALWAYS use `dock-interactive-effect` (`dock.js`, `Dock.css`) with cosine-squared magnification and parabolic click hops.
- **Navigation Bars**: ALWAYS use `pill-nav-interactive-effect` (`pillnav.js`, `PillNav.css`) with ink-fill rollout and spring gliding pills.

---

### H. Tone & Copywriting Ban (Never Highlight Interactions)
> [!IMPORTANT]
> **STRICT BAN**: NEVER use patronizing instructions or explanatory sentences like:
> - ❌ *"Click and drag to rotate"*
> - ❌ *"Hover over this card to interact"*
> - ❌ *"Click here to view animation"*
> - ❌ *"Drag the items around"*
> 
> UI interactions must be self-evident, discoverable, and intuitive through spatial affordance, cursor cues, and natural micro-interactions. Never explain the interaction through copy.

---

### I. Zero Browser Alert Policy
> [!CAUTION]
> **STRICT BAN**: Never call `alert()`, `confirm()`, or `prompt()`.
> Always use theme-harmonized, beautifully styled floating toast notifications with smooth auto-dismiss animations (`library-toast` / custom toast components).

---

### J. Clean Thematic Integrity (No Random 3D Clutter)
- Never inject unrequested or arbitrary 3D assets/models (e.g., generic Three.js ducks, floating wireframe spheres, unrelated robotic models).
- Every visual asset, shader, and interactive element must strictly serve the website's specific domain and thematic purpose.

---

### K. Responsive Design & Mobile Navigation Mandate
- **All Viewports Supported**: Every interface must be meticulously tested and responsive across:
  - Desktop (`≥ 1280px`)
  - Laptop (`1024px – 1279px`)
  - Tablet (`768px – 1023px`)
  - Small Android & iOS mobile devices (`360px – 767px`)
- **Strict Mobile Navbar Mandate**:
  - **NEVER** display the desktop horizontal top navbar on mobile devices.
  - On viewports with `max-width: 768px`, the top navigation must be completely hidden and replaced with:
    1. A floating bottom application dock (`dock-interactive-effect`), OR
    2. A clean, smooth slide-over mobile drawer sheet, OR
    3. A floating mobile pill menu (`pill-nav-interactive-effect`).

---

### L. High-Performance 60fps Execution Protocol
1. **Targeted Attachment**: Only attach heavy WebGL effects (`Specular`, `WarpText`) to explicit interactive cards and buttons (`.specular-button`, `.specular-card`), not indiscriminately to all generic DOM tags.
2. **Layout Measurement Caching**: Cache `getBoundingClientRect()` measurements and invalidate only on `resize` and `scroll` events to prevent forced synchronous layout reflows.
3. **Rest-State Culling**: Never execute WebGL redraw passes on static resting elements. Only render elements actively in cursor proximity or undergoing dynamic motion.
4. **Context Deduplication**: Never instantiate duplicate component instances or spawn multiple overlapping `requestAnimationFrame` loops.
