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
> - **LiquidEther Background Mandate**: Always support and integrate **`liquid-ether-interactive-effect`** (`liquidether.js` / `<LiquidEther />`) for fluid dynamics interactive backgrounds with Navier-Stokes advection, pressure projection, multi-color gradient palettes, click bursts, and auto-demo swirls. When LiquidEther is used, the main/hero title MUST use **`warp-text-interactive-effect`** (`warptext.js`).
> - **Antigravity Conditionality Rule (Only Add If Explicitly Asked — NEVER by Default in Light Mode)**:
>   - **DO NOT add `antigravity-interactive-effect` by default on light backgrounds or in light mode.**
>   - **ONLY add `antigravity-interactive-effect` if EXPLICITLY REQUESTED by the user.**
>   - When explicitly asked, it MUST strictly adhere to:
>     - **Very low opacity** (`opacity: 0.22 - 0.35`).
>     - **Small, delicate particles** (`particleSize: 0.8 - 1.1`).
>     - **Multi-color harmonized palette** (e.g., Gold, Azure, Emerald, Rose — never monochrome).

---

### B. Typography & Subheading Rules
| Typography Level | Background Match | Required Component | Behavior at Rest | Interactive Trigger |
|:---|:---|:---|:---|:---|
| **Big Hero Heading** | `dotfield-interactive-effect` | **`particle-text-interactive-effect`** | Particles gathered in sharp formation | Cursor repulsion & spring burst |
| **Big Hero Heading** | `liquid-ether-interactive-effect` | **`warp-text-interactive-effect`** | Fluid wave undulation | Refraction wake & click dispersion |
| **Big Hero Heading** | `antigravity-interactive-effect` | **`particle-text-interactive-effect`** | Multi-color particle alignment | Proximity scatter & orbital return |
| **Subheadings & Secondary Titles** | Any | **`warp-text-interactive-effect`** | **CALM AT REST (Never destructive)** | **Click/tap wave only** (`clickWaveOnly: true`) |
| **Multi-Line Descriptions (2+ lines)** | Any | **`warp-text-interactive-effect`** | **CALM AT REST (Never destructive)** | Subtle water ripple on hover/click (Always preserve original computed font size) |

#### WarpText Font Size Preservation Mandate
- When applying `warp-text-interactive-effect` (`warptext.js` / `<WarpText />`), **ALWAYS check and preserve the element's original computed font size** (`window.getComputedStyle(el).fontSize`).
- Never allow the canvas or WebGL rasterizer to artificially downscale or shrink typography below its original CSS scale. Typography must remain crisp and at full designed proportions.

---

### C. Image & Multi-Image Gallery Rules

#### 1. Multi-Photo Galleries: `infinite-spiral-interactive-effect`
> [!IMPORTANT]
> **INFINITE SPIRAL PLACEMENT & DURATION RULES**:
> 1. **IMAGES / PHOTOS / FOLIOS ONLY**: `InfiniteSpiral` is strictly for **image folios and photography**. Never wrap text cards or generic UI widgets into it.
> 2. **NO INNER CARD NESTING**: NEVER place `InfiniteSpiral` inside an inner card, framed box, or bordered container. It must breathe freely on the section canvas.
> 3. **NO CENTER PLACEMENT**: NEVER place `InfiniteSpiral` centered alone. It must always be placed asymmetrically in a split layout with narrative text flanking it.
> 4. **MINIMUM TWO-SECTION SPAN & CONTINUOUS BRIDGING**:
>    - NEVER constrain `InfiniteSpiral` to a single isolated section. It MUST span across a **minimum of two consecutive sections** so that as the user scrolls from one section to the next, the 3D cylindrical helix seamlessly links and transitions between both sections.
>    - **Continuous Right-Flank S-Curve Corridor**: Arrange the unboxed 3D spiral on the right flank as a sweeping vertical S-curve corridor that spans continuously down across both sections. Never block or crowd it with center cards, loupe boxes, or header banners.
>    - **Sticky Scroll Persistence**: Root layouts must use `overflow-x: clip !important` (rather than `overflow-x: hidden !important`) on `html, body` so that CSS `position: sticky` inside the two-section container flows smoothly relative to the viewport window without breaking sticky boundaries.
> 5. **FULL INTERACTION MODES (`animationMode: 'all'`)**: NEVER restrict `InfiniteSpiral` to scroll-only. It must always use `animationMode: 'all'` so visitors can auto-spin, pointer-drag, touch-fling, AND scroll through the helix simultaneously.

#### 2. Single Image in Any Section: `warp-text-interactive-effect` (`warpImage`)
- Must use image liquid wave mode (`warpImage`).
- **Pristine at rest**: Zero caustics or destructive distortion when idle.
- Expanding concentric liquid water wave ripples trigger cleanly on hover and click/tap.

---

### D. Card Architecture & Count Rules (Strict Ban on Excessive Cards)

> [!WARNING]
> **STRICT BAN ON CARD CLUTTER & TOO MANY CARDS**:
> - Never create too many cards across a website. Do not box every section, form, instrument, or paragraph inside cards or `.specular-card` containers.
> - Structure websites as open, spacious, breathing, beautiful editorial sections (`sections of website to make it more beautiful`) rather than repetitive card walls or grids.
> - **Smart Selection Gate**: If content genuinely requires cards, **NEVER simply add a static card or generic card grid**. Check and apply the exact matching interaction:

| Card Scenario | Required Component | Strict Placement & Architecture Rules |
|:---|:---|:---|
| **Single Card in Any Section** | **`lanyard-interactive-effect`** (`lanyard.js`) | **STRICT FREEDOM & FORWARD MANDATE**: <br>1. **NEVER nest inside a box or card**. Must float freely and borderlessly on the section canvas (`background: transparent !important; border: none !important; box-shadow: none !important;`).<br>2. **Ribbon Attached**: Card hangs and sways freely from its physical Three.js Verlet cloth strap ribbon.<br>3. **Maximum z+ Value & Always Forward**: Must have the highest z-index across the section (`z-index: 9999 !important; position: relative !important; overflow: visible !important;`) and in 3D space must be placed forward in positive Z-space (+Z towards camera) so the card and ribbon are always in front of all text, backgrounds, and layout elements, and NEVER hide behind anything. |
| **Few Cards (3–4 Cards in a Section)** | **`folder-interactive-effect`** (`folder.js`) | 3D perspective physics, frosted glass materials, document tab dragging, click-to-zoom expansion, and spring settling. |
| **Many Cards / Feature Showcases / Catalog Collections (5+ Cards)** | **`card-swap-interactive-effect`** (`CardSwap.jsx` / `cardswap.js`) | **STRICT RULES**: <br>1. **NEVER nest inside another card**.<br>2. **NEVER place in the center**.<br>3. **ALWAYS place on the RIGHT side** with descriptive text/controls on the **LEFT side**.<br>4. **NEVER duplicate with a static card grid underneath**. The swipe card deck IS the showcase.<br>5. Used for catalog collections (e.g. books, folios), feature showcases, departments, and services. |
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
>     overflow-x: clip !important;
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
  - **Corner Radius Matching Mandate**: Whenever applying border glow or specular border lighting effects, **ALWAYS make sure that the glow line and the border of the element match perfectly at all corners if the element has any `border-radius`**.
  - **Zero Corner Distortion**: The illuminated glow beam must seamlessly hug the curved corner arcs rather than cutting across or rendering as sharp $90^\circ$ rectangles. Always inherit `parseFloat(window.getComputedStyle(el).borderRadius)` and trace with exact matching `roundRect` or SDF rounded corner arcs. If using CSS pseudo-elements, strictly enforce `border-radius: inherit !important;`.
- **Application Dock & Launcher**: ALWAYS use `dock-interactive-effect` (`dock.js`, `Dock.css`) with cosine-squared magnification and parabolic click hops.
- **Navigation Bars**: ALWAYS use `pill-nav-interactive-effect` (`pillnav.js`, `PillNav.css`) for floating desktop and tablet navigation bars with ink-fill rollout and spring gliding pills.
- **Mobile Navigation & Staggered Menus**: ALWAYS use `staggered-menu-interactive-effect` (`staggeredmenu.js`, `StaggeredMenu.css`, `StaggeredMenu.jsx`) for full-screen and slide-over mobile navigation with cascading color prelayers, rotating cross toggle, kinetic text cycling, and dynamic index numbering.

---

### H. Tone & Copywriting Ban (Never Highlight Interactions or Use Technical Labels)
> [!IMPORTANT]
> **STRICT BAN ON INSTRUCTIONAL TEXT**: NEVER use patronizing instructions or explanatory sentences like:
> - ❌ *"Click and drag to rotate"*
> - ❌ *"Hover over this card to interact"*
> - ❌ *"Click here to view animation"*
> - ❌ *"Drag the items around"*
> 
> UI interactions must be self-evident, discoverable, and intuitive through spatial affordance, cursor cues, and natural micro-interactions. Never explain the interaction through copy.
>
> **STRICT BAN ON ROBOTIC HEADLINES, NUMBERED BADGES & SLASH SYNTAX (`//`)**:
> - **NEVER** use developer section tags or numbered meta-badges above titles like:
>   - ❌ *"SECTION 01 // ..."*
>   - ❌ *"SECTION 02 // HISTORIC PRESERVATION"*
>   - ❌ *"SECTION 03 // EPOCHS OF ENLIGHTENMENT"*
>   - ❌ *"SECTION 04 // ARCHITECTURAL HABITATS"*
>   - ❌ *"FOLIO REPOSITORY // ILLUMINATED ARCHIVES"*
>   - ❌ *"DAILY SANCTUARY ILLUMINATION // حكمة اليوم"*
>   - ❌ *"WING A // MAIN LEVEL"*
> - **NEVER** use double-slash syntax (`//`) in titles or subtitles. Use clean, elegant typographic bullets (`•`), em-dashes (`—`), or standalone headlines.
> - Real titles must stand proud, clean, authentic, and atmospheric without patronizing developer metadata tags.
>
> **STRICT BAN ON TECHNICAL BUZZWORDS & META-LABELS**: NEVER use developer labels, animation names, or technical jargon in user-facing UI copy or badges like:
> - ❌ *"CURATED CODEX STACK // 3D FLING & SWAP PERSPECTIVE"*
> - ❌ *"MEDIEVAL FOLIO REPOSITORY // SCROLL-LINKED 3D HELIX"*
> - ❌ *"3D FLING", "SWAP PERSPECTIVE", "3D HELIX", "INTERACTIVE EFFECT"*
> 
> All titles, headers, and descriptions must strictly use authentic, atmospheric domain terminology matching the website's thematic purpose (e.g., *"مَيَادِينُ العِلْم • SCHOLARLY DISCIPLINES"*, *"خَزَانَةُ المَخْطُوطَاتِ النَّادِرَة • ILLUMINATED ARCHIVES"*).

---

### I. Strict Ban on Emojis (Use Proper SVG Icons Only)
> [!IMPORTANT]
> **NEVER USE EMOJIS — ALWAYS USE PROPER SVG ICONS**:
> - **STRICT BAN ON SYSTEM EMOJIS**: NEVER use emojis (e.g. 🏛️, 🌿, 📜, 🕯️, 📍, ✉️, 🔖, ☀️, 🌙, ✕, etc.) anywhere across a website's user interface, buttons, tabs, navigation items, amenity lists, or status indicators.
> - System emojis look amateurish, render inconsistently across operating systems (iOS vs Android vs Windows), and destroy brand luxury.
> - **MANDATORY SVG STANDARD**: ALWAYS use clean, beautifully crafted vector SVG icons (`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">...`) that harmoniously adopt the design system's exact colors, stroke weights, and hover effects.

---

### J. Zero Browser Alert Policy
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

---

### M. Dark & Light Mode High-Contrast Mandate
> [!IMPORTANT]
> **STRICT BAN ON LOW CONTRAST IN LIGHT MODE**:
> - When a website implements dark and light modes, ALWAYS strictly enforce high visual contrast for all elements, text, and interactive controls in light mode.
> - There must **NEVER be light-on-light, washed-out text, or matching text and background colors**.
> - In light mode:
>   - Background is light (ivory, pearl, light parchment, `#faf7ee`).
>   - Body text must be deep high-contrast ink (`#1e1913`, `#12151a`) with WCAG AAA contrast ratio ($\ge 7:1$).
>   - Headings, titles, and author lines must be bold, dark, and prominent.
>   - Subtitles, metadata, and labels must be crisp charcoal/slate (`#4a4031`, `#374151`), never faint beige.
>   - Interactive buttons, tabs, inputs, and controls must have distinct high-contrast borders and clear focus/hover indicators.
