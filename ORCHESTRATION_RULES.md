# Master UI/UX & Interaction Orchestration Rules ⚡🎨

A definitive, production-grade specification for orchestrating interactive typography, physics-based UI components, WebGL backgrounds, micro-interactions, and mobile navigation across modern web applications.

---

## 1. Zero Audio Policy
- Websites must remain **completely silent by default**.
- Never initialize Web Audio API, background soundscapes, chimes, synthesizers, or sound effects unless explicitly requested by the user.
- If an interactive component provides an internal audio mechanism (e.g. `WarpText` water drop tap audio), it **must be explicitly disabled** (`audio: false`, `soundEnabled: false`, `WarpText.Audio.enabled = false`).

---

## 2. Interactive Skills STRICT Priority Mandate
Always give first priority to the installed interactive skills (`<skill-name>-interactive-effect`) instead of improvising generic transitions or using generic motion libraries:

### A. Typography & Background Pairing Rules
| Background Engine | Hero / Big Heading Component | Subtitle / Secondary Typography | Rest Behavior |
|:---|:---|:---|:---|
| **`dotfield-interactive-effect`** (`dotfield.js`) | **`particle-text-interactive-effect`** (`particletext.js`) | **`warp-text-interactive-effect`** (`warptext.js`) | Particles gather at rest; subtitle undulates gently on hover/click |
| **`liquid-ether-interactive-effect`** (`liquidether.js`) | **`warp-text-interactive-effect`** (`warptext.js`) | Elegant serif or clean mono typography | Liquid wave undulation with chromatic dispersion |
| **`antigravity-interactive-effect`** (`antigravity.js`) | **`particle-text-interactive-effect`** (`particletext.js`) | `warp-text-interactive-effect` (`warptext.js`) | Subtle orbital drift; particle repulsion on mouse proximity |

#### Multi-Line Descriptions (2+ Lines of Text)
- When any section features **2 or more lines of description** or lead paragraph text, ALWAYS apply `warp-text-interactive-effect` (`warptext.js`) in multiline/paragraph mode.
- **Calm at Rest Rule**: Never leave the text in a state of continuous agitation or destructive tearing. Text must remain crisp, clear, and perfectly readable at rest, and react with organic fluid waves **only upon cursor hover and pointer click**.

---

### B. Image Presentation Rules
| Visual Scenario | Required Component | Implementation Details |
|:---|:---|:---|
| **Many Photos / Multi-Image Galleries** | **`infinite-spiral-interactive-effect`** (`infinite-spiral.js`) | 3D cylindrical helix gallery with depth scaling, smoothstep edge fading, distance blur, and gesture scroll-linked navigation. |
| **Single Image in Any Section** | **`warp-text-interactive-effect`** (`warpImage`) | Image liquid refraction wave mode (`warpImage`). Pristine and crystal clear at rest (zero caustics, zero tinting), expanding concentric liquid ripple on click/tap. |

---

### C. Card Architecture & Count Rules
| Card Count / Position | Required Component | Interaction Characteristics |
|:---|:---|:---|
| **Few Cards (3–4 Cards in a Section)** | **`folder-interactive-effect`** (`folder.js`) | 3D perspective physics, frosted glass materials, document tab dragging, click-to-zoom expansion, and spring settling. |
| **Single Card in Any Section** | **`lanyard-interactive-effect`** (`lanyard.js`) | Three.js Verlet cloth strap physics, rigid-body card dynamics, holographic iridescent foil shader, and interactive drag/tilt/flip. |
| **Cards in the Last Section of Website** | **`laser-flow-interactive-effect`** (`laserflow.js`) | Scroll-triggered volumetric laser beam washes with realistic surface impact. **Laser colors MUST strictly match the website's theme palette.** |

---

### D. Mouse & Cursor Dynamics (Low & Natural Glow)
- ALWAYS use **`splash-cursor-interactive-effect`** (`splashcursor.js`) or **`glow-cursor-interactive-effect`** (`glowcursor.js`). Never substitute with generic circular followers.
- **Low & Natural Glow Mandate**:
  - Never set blinding, harsh, or oversaturated click bursts.
  - Keep click splash bursts, bloom pyramids, and specular light highlights soft, organic, gentle, and natural:
    - `intensity`: `0.45` – `0.65`
    - `glow`: `0.15` – `0.25`
    - `force`: `0.5` – `0.65`
    - `press`: `0.35`

---

### E. Specular Lighting, Dock, & Navigation
- **Specular Lighting & Edge Hover**: ALWAYS use `specular-border-interactive-effect` (`specular.js`, `SpecularButton.css`) for raytraced perimeter borders on primary action buttons and cards.
- **Application Dock & Launcher**: ALWAYS use `dock-interactive-effect` (`dock.js`, `Dock.css`) with cosine-squared magnification and parabolic click hops.
- **Navigation Bars**: ALWAYS use `pill-nav-interactive-effect` (`pillnav.js`, `PillNav.css`) with ink-fill rollout and spring gliding pills.

---

### F. Tone & Copywriting Ban (Never Highlight Interactions)
> [!IMPORTANT]
> **STRICT BAN**: NEVER use patronizing instructions or explanatory sentences like:
> - ❌ *"Click and drag to rotate"*
> - ❌ *"Hover over this card to interact"*
> - ❌ *"Click here to view animation"*
> - ❌ *"Drag the items around"*
> 
> UI interactions must be self-evident, discoverable, and intuitive through spatial affordance, cursor cues, and natural micro-interactions. Never explain the interaction through copy.

---

### G. Zero Browser Alert Policy
> [!CAUTION]
> **STRICT BAN**: Never call `alert()`, `confirm()`, or `prompt()`.
> Always use theme-harmonized, beautifully styled floating toast notifications with smooth auto-dismiss animations (`library-toast` / custom toast components).

---

### H. Clean Thematic Integrity (No Random 3D Clutter)
- Never inject unrequested or arbitrary 3D assets/models (e.g., generic Three.js ducks, floating wireframe spheres, unrelated robotic models).
- Every visual asset, shader, and interactive element must strictly serve the website's specific domain and thematic purpose.

---

### I. Responsive Design & Mobile Navigation Mandate
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

### J. High-Performance 60fps Execution Protocol
1. **Targeted Attachment**: Only attach heavy WebGL effects (`Specular`, `WarpText`) to explicit interactive cards and buttons (`.specular-button`, `.specular-card`), not indiscriminately to all generic DOM tags.
2. **Layout Measurement Caching**: Cache `getBoundingClientRect()` measurements and invalidate only on `resize` and `scroll` events to prevent forced synchronous layout reflows.
3. **Rest-State Culling**: Never execute WebGL redraw passes on static resting elements. Only render elements actively in cursor proximity or undergoing dynamic motion.
4. **Context Deduplication**: Never instantiate duplicate component instances or spawn multiple overlapping `requestAnimationFrame` loops.
