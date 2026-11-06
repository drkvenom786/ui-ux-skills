---
name: warp-text-interactive-effect
description: Integrates interactive WebGL2 WarpText and fluid glass refraction effects from React Bits into web applications (React, Next.js, and Vanilla HTML/JS) with ambient wave undulation, interactive cursor lens lensing (bulge, pinch, swirl), chromatic dispersion, click shockwave ripples, and dual support for both typography and fluid image warping.
risk: low
source: antigravity-custom-skills
date_added: 2026-11-04
---

# WebGL2 Fluid Warp Engine (Headings, Descriptions & Image Tap Waves)

A GPU-accelerated interactive WebGL2 fluid refraction system. Renders headings, multi-line paragraph descriptions, and images through an interactive optical water simulation with zero external runtime dependencies.

> [!IMPORTANT]
> **Zero Audio & Production Integrity Mandates:**
> 1. **Zero Audio Policy**: By default, web audio MUST be disabled (`audio: false`, `soundEnabled: false`). Never play sound effects unless explicitly instructed by the user.
> 2. **Ghost Text Elimination**: When mounting on an existing DOM text element (e.g., `<p>`, `<h2>`), the original DOM text must have `container.style.color = 'transparent'` to preserve accurate layout bounding dimensions while preventing duplicate/ghost text underlays behind the WebGL canvas.
> 3. **Calm at Rest for Descriptions & Subheadings**: Descriptions and subheadings must NOT be constantly destructive or violently agitated; use `clickWaveOnly: true` or subtle displacement so text remains crisp, calm, and readable at rest.
> 4. **Font Size Preservation**: ALWAYS inspect and strictly preserve the element's computed CSS font size (`window.getComputedStyle(el).fontSize`). Never let WebGL text render smaller than the design system scale.

> [!NOTE]
> **Scope & Modular Architecture:**
> Full-website underwater distortion, full-page SVG turbulence filters, and full-screen underwater canvas overlays are **deliberately excluded** from this skill.
> This skill focuses strictly on three modular, self-contained interactive components:
> 1. **Heading Wave Effect**: Bold title fluid text with ambient ocean swell, cursor wake & droplet lensing, chromatic dispersion, and click ripples.
> 2. **Description Wave Effect**: Multiline paragraphs with gentle liquid undulation, automatic word-wrapping, and computed CSS fidelity.
> 3. **Image Tap Wave Effect**: Photos calm & crystal-clear at rest (zero caustics, zero tinting, zero ambient drift), with a single concentric circular liquid ripple on click/tap, prismatic refraction, and natural water drop audio (`water-drop.wav`).

---

## 1. Effect Breakdown

### Effect 1: Heading Wave Effect (Titles & Section Headers)
- **Visuals:** Living ocean wave undulation using fractional Brownian motion (`fbm`), interactive cursor wake & lens distortion (`bulge`, `pinch`, or `swirl`), and 7-band spectral chromatic dispersion.
- **Typography:** Supports CSS font size inheritance, multi-stop linear gradients, drop-shadow glow, and `singleLine: true` auto-scaling to avoid awkward wraps.
- **Click Behavior:** Generates an expanding water ripple on click with luminous crest highlights and natural water drop sound.

### Effect 2: Description Wave Effect (Paragraphs & Body Text)
- **Visuals:** Subtle, gentle liquid undulation (`warpStrength: 0.10` to `0.14`) that preserves readability without distorting body text excessively.
- **Word Wrapping:** Automatic line-wrapping (`multiline: true`) based on container width, respecting CSS `font-family`, `font-size`, `line-height`, and `letter-spacing`.
- **Interaction:** Soft cursor reaction and click ripples across multiline text blocks.

### Effect 3: Image Tap Wave Effect (Photos & Cards)
- **Rest State (Pristine):** Unlike text, photos stay **calm and crystal clear** at rest (`clickWaveOnly: true`). Zero caustics, zero tinting, zero idle drift, and zero hover wobble.
- **Tap/Click Wave:** When clicked or tapped, a clean circular liquid wave radiates from the exact cursor coordinate `(x, y)` across the image with prismatic glass refraction.
- **Double-Trigger Guard:** Includes a built-in 150ms debounce guard preventing synthetic double-click events or dual wave origins when nesting inside clickable cards.
- **Natural Tap Sound:** Plays `water-drop.wav` with zero audio latency via a preloaded 4-voice audio pool.

---

## 2. File Assets in this Skill

The skill directory contains ready-to-use production assets:

| File | Purpose |
|---|---|
| [`assets/warptext.js`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/warp-text-interactive-effect/assets/warptext.js) | Standalone Vanilla JS WebGL2 engine for Headings, Descriptions, and Images. |
| [`assets/WarpText.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/warp-text-interactive-effect/assets/WarpText.jsx) | React / Next.js component exporting `WarpHeading`, `WarpDescription`, `WarpImage`, and `AudioEngine`. |
| [`assets/WarpText.css`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/warp-text-interactive-effect/assets/WarpText.css) | Layout styles for containers and WebGL canvas layers. |
| [`assets/water-drop.wav`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/warp-text-interactive-effect/assets/water-drop.wav) | High-fidelity natural water drop sound effect for tap interactions. |

---

## 3. Vanilla HTML / JavaScript Usage

### Setup Assets
Copy `warptext.js`, `WarpText.css`, and `water-drop.wav` to your project assets or public folder:

```html
<link rel="stylesheet" href="./WarpText.css">
<script src="./warptext.js"></script>
```

### 1. Heading Effect Setup
```html
<h2 id="hero-heading" class="warp-fluid-container" style="font-size: 64px; font-weight: 800; min-height: 80px;">
  About Me
</h2>

<script>
WarpText.init(document.getElementById('hero-heading'), {
  text: 'About Me',
  singleLine: true,
  gradientColors: ['#FFFFFF', '#E9D5FF', '#A855F7'],
  shadowColor: 'rgba(168, 85, 247, 0.45)',
  shadowBlur: 20,
  warpStrength: 0.18,
  warpScale: 1.4,
  speed: 0.85,
  lens: 'bulge',
  pointerInfluence: 0.52,
  pointerStrength: 0.50,
  refraction: 0.028,
  chromatic: 0.07,
  idleDrift: 0.65,
  clickRipple: true
});
</script>
```

### 2. Description Wave Effect Setup (Multiline Paragraphs)
```html
<div id="hero-desc" class="warp-fluid-container" style="font-size: 18px; line-height: 1.7; color: #9CA3AF; min-height: 120px;">
  Full-stack engineer crafting high-performance, GPU-accelerated web experiences with modern typography, fluid interactions, and expressive design.
</div>

<script>
WarpText.init(document.getElementById('hero-desc'), {
  multiline: true,
  singleLine: false,
  color: '#9CA3AF',
  warpStrength: 0.11, // Gentle wave swell for readable paragraphs
  warpScale: 1.3,
  speed: 0.75,
  lens: 'bulge',
  pointerInfluence: 0.45,
  pointerStrength: 0.35,
  refraction: 0.018,
  chromatic: 0.03,
  idleDrift: 0.4,
  clickRipple: true
});
</script>
```

### 3. Image Tap Wave Effect Setup (Calm at Rest)
Wrap any `<img>` tag or pass the image element directly:

```html
<div class="photo-card" style="width: 320px; height: 380px; border-radius: 16px; overflow: hidden;">
  <img id="profile-photo" src="./photo.jpg" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">
</div>

<script>
// Warps the image with calm rest state and liquid wave on click/tap
const photoWave = WarpText.warpImage(document.getElementById('profile-photo'), {
  warpStrength: 0.32,
  warpScale: 1.2,
  speed: 0.85,
  refraction: 0.038,
  chromatic: 0.09,
  clickRipple: true
});

// Programmatic trigger (e.g. from an external button or event)
// photoWave.triggerWave(0.5, 0.5); // Center origin (x, y normalized 0..1)
</script>
```

---

## 4. React / Next.js Usage

Import components directly from [`assets/WarpText.jsx`](file:///C:/Users/V%20E%20N%20O%20M/.gemini/config/skills/warp-text-interactive-effect/assets/WarpText.jsx):

```jsx
'use client';

import { WarpHeading, WarpDescription, WarpImage } from './WarpText';

export default function HeroSection() {
  return (
    <section className="flex flex-col gap-6 max-w-4xl mx-auto p-8">
      {/* 1. Heading Effect */}
      <WarpHeading
        text="Interactive Fluid Typography"
        fontSize="56px"
        fontWeight="800"
        gradientColors={['#FFFFFF', '#38BDF8', '#818CF8']}
        warpStrength={0.18}
        warpScale={1.3}
        speed={0.85}
        clickRipple={true}
        audio={true}
      />

      {/* 2. Description Wave Effect */}
      <WarpDescription
        text="A GPU-accelerated fluid glass refraction engine that preserves font fidelity, automatically wraps multiline paragraphs, and responds smoothly to cursor hover and click ripples."
        fontSize="18px"
        color="#94A3B8"
        warpStrength={0.12}
        speed={0.7}
        clickRipple={true}
      />

      {/* 3. Image Tap Wave Effect */}
      <div className="w-[320px] h-[400px] rounded-2xl overflow-hidden shadow-2xl">
        <WarpImage
          src="/images/portfolio.jpg"
          alt="Portfolio Showcase"
          warpStrength={0.32}
          refraction={0.038}
          chromatic={0.09}
          audio={true}
          audioUrl="/water-drop.wav"
          borderRadius="16px"
        />
      </div>
    </section>
  );
}
```

---

## 5. Configuration & Props Reference

| Prop / Option | Type | Default | Scope | Description |
|---|---|---|---|---|
| `text` | string | `''` | Headings & Descriptions | Text to rasterize into WebGL2 texture. |
| `singleLine` | boolean | `true` | Headings | Automatically scales text down to fit a single line without wrapping. |
| `multiline` | boolean | `false` | Descriptions | Enables paragraph word-wrapping across multiple lines based on container width. |
| `src` / `imageElement` | string \| HTMLImageElement | `null` | Images | Image source or element for photo tap wave rendering. |
| `clickWaveOnly` | boolean | `false` (auto `true` for images) | Images | When `true`, element remains completely calm at rest and only animates on tap/click. |
| `gradientColors` | string[] | `null` | Headings | Array of hex/rgba colors creating a horizontal text gradient. |
| `color` | string | `computed` | Headings & Descriptions | Solid text fill color. |
| `shadowColor` | string | `null` | Headings | Canvas shadow/glow color behind glyphs. |
| `shadowBlur` | number | `20` | Headings | Blur radius for the glow shadow. |
| `warpStrength` | number | `0.16` (text), `0.32` (images) | All | Amplitude of fluid displacement. |
| `warpScale` | number | `1.4` (text), `1.2` (images) | All | Granularity/scale of fluid wave cells. |
| `speed` | number | `0.85` | All | Temporal animation speed. |
| `refraction` | number | `0.028` (text), `0.038` (images) | All | Optical refraction offset through liquid surface. |
| `chromatic` | number | `0.07` (text), `0.09` (images) | All | Prismatic 7-band RGB channel dispersion. |
| `lens` | `'bulge' \| 'pinch' \| 'swirl'` | `'bulge'` | Headings & Descriptions | Cursor interaction lens style. |
| `pointerInfluence` | number | `0.50` | Headings & Descriptions | Radius of cursor interaction zone [0..1]. |
| `pointerStrength` | number | `0.55` | Headings & Descriptions | Force of cursor displacement. |
| `idleDrift` | number | `0.50` | Headings & Descriptions | Autonomous lens roaming when mouse is outside container [0..1]. |
| `clickRipple` | boolean | `true` | All | Propagates concentric liquid ripples from pointer tap coordinates. |
| `audio` | boolean | `true` | All | Plays natural `water-drop.wav` audio on click. |
| `audioUrl` | string | `'water-drop.wav'` | All | Relative or absolute path to the audio file. |

---

## 6. Audio Engine Setup & Best Practices

The audio engine (`AudioEngine`) uses a pre-instantiated pool of `Audio` objects to eliminate latency on mobile and desktop:

```javascript
// Global Audio Controls
WarpText.Audio.init('/assets/water-drop.wav'); // Initialize with custom path
WarpText.Audio.playTap();                     // Play natural water drop tap
WarpText.Audio.toggle();                      // Mute / unmute audio globally
```

### Avoiding Double-Click Wave Origins
When attaching the effect to an image inside a parent card or button:
1. Do **NOT** attach a separate `onclick` on the parent container that triggers another wave at `(0.5, 0.5)`. The canvas listener automatically captures exact pointer coordinates.
2. If using explicit buttons like "Tap Wave", call `event.stopPropagation()` so the click doesn't trigger two wave origins.
3. The engine includes an internal 150ms debounce guard preventing synthetic double-clicks from spawning twin wave origins.

---

## 7. Performance & Accessibility

1. **Auto-Sleep:** The engine automatically pauses its `requestAnimationFrame` render loop when off-screen via `IntersectionObserver` or when the tab is hidden via `document.hidden`.
2. **Accessible DOM:** The original text content is preserved in the DOM (hidden from sight with `aria-hidden` canvas layer or `.sr-only`) so screen readers, search engines, and selection operate normally.
3. **`prefers-reduced-motion`:** Automatically detects reduced-motion system preferences and softens wave amplitudes and transition speeds.
