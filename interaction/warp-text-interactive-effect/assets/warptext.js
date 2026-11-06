/**
 * WarpText & WarpMedia - Interactive WebGL2 Liquid Wave Refraction Engine
 * 
 * Supports:
 * 1. Heading Effect: Bold fluid typography with oceanic wave undulation, pointer wake, chromatic dispersion & click shockwaves.
 * 2. Description Wave Effect: Multiline paragraphs with gentle liquid undulation, automatic word-wrapping & computed CSS fidelity.
 * 3. Image Tap Wave Effect: Calm & crystal clear at rest (zero caustics, zero tinting), single clean expanding concentric liquid ripple on click/tap with natural water drop audio.
 * 
 * Excludes full-page DOM/SVG underwater filters (by design).
 */

(function (global) {
  'use strict';

  // =========================================================================
  // 1. Natural Water Drop Tap Sound Engine
  // =========================================================================

  const AudioEngine = {
    enabled: true,
    pool: [],
    poolIdx: 0,
    soundUrl: 'water-drop.wav',

    init(customUrl) {
      if (customUrl) this.soundUrl = customUrl;
      if (this.pool.length === 0 && typeof Audio !== 'undefined') {
        for (let i = 0; i < 4; i++) {
          const a = new Audio(this.soundUrl);
          a.volume = 0.40;
          this.pool.push(a);
        }
      }
    },

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    },

    playTap() {
      if (!this.enabled || typeof Audio === 'undefined') return;
      this.init();
      try {
        if (this.pool.length > 0) {
          const snd = this.pool[this.poolIdx];
          this.poolIdx = (this.poolIdx + 1) % this.pool.length;
          snd.currentTime = 0;
          snd.play().catch(() => {});
        }
      } catch (e) {}
    }
  };

  // =========================================================================
  // 2. WebGL2 Fluid Wave Refraction Shaders
  // =========================================================================

  const VERTEX_SHADER = `#version 300 es
  in vec2 aPosition;
  in vec2 aUv;
  out vec2 vUv;
  void main() {
    vUv = aUv;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }`;

  const FRAGMENT_SHADER = `#version 300 es
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uPointerActive;
  uniform float uTime;
  uniform float uWarpStrength;
  uniform float uWarpScale;
  uniform float uSpeed;
  uniform float uPointerInfluence;
  uniform float uPointerStrength;
  uniform float uRefraction;
  uniform float uChromatic;
  uniform float uLensMode;      // 0 = bulge, 1 = pinch, 2 = swirl
  uniform float uIsImage;       // 1.0 for photos, 0.0 for typography
  uniform float uClickWaveOnly; // 1.0 for photos: calm until clicked
  uniform vec4 uClicks[4];      // x, y, age, intensity
  uniform float uIntro;
  uniform float uReveal;

  in vec2 vUv;
  out vec4 fragColor;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.04;
      amplitude *= 0.5;
    }
    return value;
  }

  vec4 sampleTex(vec2 uv) {
    if (uIsImage > 0.5) {
      uv = clamp(uv, vec2(0.001), vec2(0.999));
      return texture(uTexture, uv);
    }
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      return vec4(0.0);
    }
    return texture(uTexture, uv);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    float t = uTime * uSpeed;
    float scale = max(uWarpScale, 0.001);

    // 1. Ambient Fluid Wave Motion (Active on typography; photos stay calm at rest)
    vec2 ambientWarp = vec2(0.0);
    if (uClickWaveOnly < 0.5) {
      vec2 drift = vec2(t * 0.08, -t * 0.06);
      float n1 = fbm(uv * scale * 2.8 + drift);
      float n2 = fbm((uv + 17.43) * scale * 3.2 - drift.yx);
      vec2 oceanSwell = (vec2(n1, n2) - 0.5) * (uWarpStrength * 0.06 + uIntro * 0.15);

      vec2 capillary = vec2(
        sin(uv.y * 22.0 * scale + t * 2.4),
        cos(uv.x * 20.0 * scale - t * 2.1)
      ) * (uWarpStrength * 0.015);

      ambientWarp = oceanSwell + capillary;
    }

    // 2. Interactive Cursor Lensing & Pointer Wake (Active on typography)
    vec2 pointerWarp = vec2(0.0);
    float lensProximity = 0.0;
    if (uClickWaveOnly < 0.5) {
      vec2 ptrDelta = uv - uPointer;
      vec2 aspectDelta = vec2(ptrDelta.x * aspect, ptrDelta.y);
      float dist = length(aspectDelta);
      float radius = max(uPointerInfluence, 0.001);
      float pNorm = clamp(dist / radius, 0.0, 1.0);
      lensProximity = smoothstep(radius, 0.0, dist) * uPointerActive;
      vec2 dir = dist > 0.0001 ? vec2(aspectDelta.x / aspect, aspectDelta.y) / dist : vec2(0.0);

      if (uLensMode > 1.5) {
        float twist = (1.0 - pNorm) * (1.0 - pNorm) * uPointerActive * uPointerStrength * 3.2;
        float s = sin(twist);
        float c = cos(twist);
        vec2 turned = vec2(aspectDelta.x * c - aspectDelta.y * s, aspectDelta.x * s + aspectDelta.y * c);
        pointerWarp = (vec2(turned.x / aspect, turned.y) - ptrDelta) * 0.85;
      } else {
        float side = uLensMode > 0.5 ? -1.0 : 1.0;
        float bulge = pNorm * (1.0 - pNorm) * (1.0 - pNorm) * 6.75 * uPointerActive;
        pointerWarp = -dir * side * bulge * uPointerStrength * 0.055;
      }

      float wakeWave = sin(dist * 32.0 - t * 5.0) * exp(-dist * 4.5);
      pointerWarp += dir * wakeWave * uPointerActive * uPointerStrength * 0.022;
    }

    // 3. Dynamic Click Water Ripple Wave Effect (Active on both photos and typography)
    vec2 shockWarp = vec2(0.0);
    float shockGlow = 0.0;
    for (int i = 0; i < 4; i++) {
      vec4 click = uClicks[i];
      if (click.w <= 0.0) continue;
      vec2 cDelta = uv - click.xy;
      vec2 cAspect = vec2(cDelta.x * aspect, cDelta.y);
      float cDist = length(cAspect);
      float age = click.z;

      float waveSpeed = uIsImage > 0.5 ? 1.05 : 0.85;
      float front = age * waveSpeed;
      float waveThickness = 0.08 + age * 0.09;
      float ringOffset = (cDist - front) / waveThickness;
      float fade = 1.0 - smoothstep(0.0, 1.8, age);
      
      float waveShape = sin(ringOffset * 3.8) * exp(-ringOffset * ringOffset * 0.75) * fade * click.w;
      vec2 cDir = cDist > 0.0001 ? vec2(cAspect.x / aspect, cAspect.y) / cDist : vec2(0.0);

      float wavePower = uIsImage > 0.5 ? 0.35 : 0.12;
      shockWarp -= cDir * waveShape * wavePower;
      shockGlow += max(0.0, waveShape) * 0.55;
    }

    // Combined Refraction Vector
    vec2 totalDisplacement = ambientWarp + pointerWarp + shockWarp;

    // 4. Seven-Band Prismatic Chromatic Dispersion
    vec2 splitDir = totalDisplacement;
    float splitLen = length(splitDir);
    splitDir = splitLen > 0.00001 ? splitDir / splitLen : vec2(0.7071, 0.7071);
    vec2 split = splitDir * uRefraction * 0.18 * (0.4 + lensProximity * 1.8 + uIntro * 2.5);
    float dispersion = uChromatic * 0.6;

    vec3 ink = vec3(0.0);
    vec3 cover = vec3(0.0);
    vec3 totalWeight = vec3(0.0);

    for (int i = 0; i < 7; i++) {
      float k = 1.0 - float(i) / 3.0; // [-1.0 .. 1.0]
      vec2 sampleCoord = uv + totalDisplacement * (1.0 + dispersion * k) + split * k;
      vec4 tap = sampleTex(sampleCoord);
      
      vec3 band = vec3(
        max(k, 0.0),
        1.0 - abs(k),
        max(-k, 0.0)
      );
      if (uIsImage < 0.5) {
        band.b += 0.15; // Soft aquatic tint for typography dispersion
      }
      band = normalize(band);

      ink += tap.rgb * band;
      cover += tap.a * band;
      totalWeight += band;
    }

    ink /= totalWeight;
    cover /= totalWeight;
    float alpha = max(max(cover.r, cover.g), cover.b);

    // 5. Photos: Output pure, unmodified original colors + click ripple refraction
    if (uIsImage > 0.5) {
      vec3 imgColor = ink;
      if (shockGlow > 0.001) {
        imgColor += shockGlow * 0.12 * vec3(0.7, 0.95, 1.0);
      }
      fragColor = vec4(imgColor, 1.0) * uReveal;
      return;
    }

    if (alpha <= 0.001) {
      fragColor = vec4(0.0);
      return;
    }

    // Luminous ripple crest highlight for typography
    vec3 color = ink + (lensProximity * 0.06 + shockGlow * 0.20) * vec3(0.5, 0.95, 1.0);
    fragColor = vec4(color, alpha) * uReveal;
  }`;

  // =========================================================================
  // 3. WebGL Compilation Helpers
  // =========================================================================

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('WarpText Shader error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createProgram(gl, vSrc, fSrc) {
    const vs = compileShader(gl, gl.VERTEX_SHADER, vSrc);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fSrc);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('WarpText Program link error:', gl.getProgramInfoLog(prog));
      gl.deleteProgram(prog);
      return null;
    }
    return prog;
  }

  // =========================================================================
  // 4. Core WebGL2 Fluid Warp Engine (Headings, Descriptions, Photos)
  // =========================================================================

  const LENS_MODES = { bulge: 0, pinch: 1, swirl: 2 };
  const INTRO_MS = 1200;
  const RIPPLE_LIFE = 1.8;
  const MAX_CLICKS = 4;

  function initWarpEffect(container, options = {}) {
    if (typeof container === 'string') container = document.querySelector(container);
    if (!container) return null;

    container.classList.add('warp-fluid-container');
    let canvas = container.querySelector('canvas.warp-fluid-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'warp-fluid-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      container.appendChild(canvas);
    }

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      depth: false,
      stencil: false
    });
    if (!gl) {
      console.warn('WebGL2 not supported for WarpText.');
      return null;
    }

    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (!program) return null;

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uvBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      gl.STATIC_DRAW
    );
    const uvLoc = gl.getAttribLocation(program, 'aUv');
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const uLocs = {};
    [
      'uTexture',
      'uResolution',
      'uPointer',
      'uPointerActive',
      'uTime',
      'uWarpStrength',
      'uWarpScale',
      'uSpeed',
      'uPointerInfluence',
      'uPointerStrength',
      'uRefraction',
      'uChromatic',
      'uLensMode',
      'uIsImage',
      'uClickWaveOnly',
      'uClicks',
      'uIntro',
      'uReveal'
    ].forEach(name => {
      uLocs[name] = gl.getUniformLocation(program, name);
    });

    const reduceMotion = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
    const clicks = Array.from({ length: MAX_CLICKS }, () => [0.5, 0.5, 0, 0]);
    let clickSlot = 0;
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: 0, activeTarget: 0 };
    const startTime = performance.now();
    let lastFrame = 0;
    let introProgress = options.intro !== false && !reduceMotion ? 0 : 1;
    let mediaReady = false;
    let raf = 0;
    let visible = true;
    let alive = true;

    // Offscreen 2D canvas for rasterizing text or images
    const rasterCanvas = document.createElement('canvas');
    const rasterCtx = rasterCanvas.getContext('2d');

    const measureLine = (ctx, line, letterSpacing) => {
      const chars = Array.from(line);
      const textWidth = chars.reduce((w, c) => w + ctx.measureText(c).width, 0);
      return textWidth + Math.max(0, chars.length - 1) * letterSpacing;
    };

    const drawLine = (ctx, line, x, y, letterSpacing) => {
      const chars = Array.from(line);
      let cursor = x - measureLine(ctx, line, letterSpacing) / 2;
      chars.forEach((char, index) => {
        ctx.fillText(char, cursor, y);
        cursor += ctx.measureText(char).width + (index === chars.length - 1 ? 0 : letterSpacing);
      });
    };

    const rasterize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = rect.width;
      const height = rect.height;

      rasterCanvas.width = Math.max(1, Math.floor(width * dpr));
      rasterCanvas.height = Math.max(1, Math.floor(height * dpr));

      if (options.imageElement) {
        // ==========================================
        // IMAGE MODE: Calm & pristine at rest
        // ==========================================
        const img = options.imageElement;
        rasterCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        rasterCtx.clearRect(0, 0, width, height);

        const imgW = img.naturalWidth || img.width || width;
        const imgH = img.naturalHeight || img.height || height;
        const scale = Math.max(width / imgW, height / imgH);
        const nw = imgW * scale;
        const nh = imgH * scale;
        const ox = (width - nw) / 2;
        const oy = (height - nh) / 2;

        try {
          rasterCtx.drawImage(img, ox, oy, nw, nh);
        } catch (e) {}
      } else {
        // ==========================================
        // TYPOGRAPHY MODE: Headings & Descriptions
        // ==========================================
        const computed = window.getComputedStyle(container);
        const text = options.text || container.getAttribute('data-text') || container.textContent || '';
        const fontFamily = options.fontFamily || computed.fontFamily || 'Poppins, sans-serif';
        const fontWeight = options.fontWeight || computed.fontWeight || '700';
        let fontSizePx = options.fontSize
          ? parseFloat(options.fontSize)
          : parseFloat(computed.fontSize) || 48;
        let letterSpacing = computed.letterSpacing === 'normal' ? 0 : parseFloat(computed.letterSpacing) || 0;
        let lineHeight = parseFloat(computed.lineHeight);
        if (!Number.isFinite(lineHeight)) lineHeight = fontSizePx * 1.25;

        rasterCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        rasterCtx.clearRect(0, 0, width, height);
        rasterCtx.textAlign = 'left';
        rasterCtx.textBaseline = 'middle';
        rasterCtx.imageSmoothingEnabled = true;

        let lines = [];
        if (options.multiline) {
          // Word-wrapping for descriptions / paragraphs
          rasterCtx.font = `${fontWeight} ${fontSizePx}px ${fontFamily}`;
          const words = text.split(/\s+/);
          let currentLine = '';
          const maxLineWidth = width * 0.94;
          words.forEach(word => {
            const testLine = currentLine ? currentLine + ' ' + word : word;
            if (measureLine(rasterCtx, testLine, letterSpacing) > maxLineWidth && currentLine) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          });
          if (currentLine) lines.push(currentLine);
        } else {
          lines = String(text).split('\n');
        }

        rasterCtx.font = `${fontWeight} ${fontSizePx}px ${fontFamily}`;

        if (options.gradientColors && Array.isArray(options.gradientColors)) {
          const grad = rasterCtx.createLinearGradient(0, 0, width, 0);
          options.gradientColors.forEach((col, idx) => {
            grad.addColorStop(idx / (options.gradientColors.length - 1), col);
          });
          rasterCtx.fillStyle = grad;
        } else if (options.color) {
          rasterCtx.fillStyle = options.color;
        } else {
          rasterCtx.fillStyle = computed.color || '#FFFFFF';
        }

        if (options.shadowColor) {
          rasterCtx.shadowColor = options.shadowColor;
          rasterCtx.shadowBlur = options.shadowBlur || 20;
        }

        const maxWidth = width * 0.95;
        const maxHeight = height * 0.95;
        const widest = Math.max(...lines.map(line => measureLine(rasterCtx, line, letterSpacing)), 1);
        const blockHeight = Math.max(lineHeight * lines.length, 1);
        const fit = Math.min(1, maxWidth / widest, maxHeight / blockHeight);

        if (fit < 1 && options.singleLine) {
          fontSizePx *= fit;
          letterSpacing *= fit;
          lineHeight *= fit;
          rasterCtx.font = `${fontWeight} ${fontSizePx}px ${fontFamily}`;
        }

        const startY = height / 2 - (lineHeight * (lines.length - 1)) / 2;
        lines.forEach((line, index) =>
          drawLine(rasterCtx, line, width / 2, startY + index * lineHeight, letterSpacing)
        );
      }

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rasterCanvas);
      mediaReady = true;
    };

    const resize = () => {
      if (!alive) return;
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      rasterize();
    };

    let lastClickTime = 0;
    let lastClickPos = [-1, -1];

    const triggerClickAt = (normX, normY) => {
      const now = performance.now();
      const dx = normX - lastClickPos[0];
      const dy = normY - lastClickPos[1];
      // Debounce duplicate synthetic double-triggers within 150ms
      if (now - lastClickTime < 150 && (dx * dx + dy * dy < 0.08)) {
        return;
      }
      lastClickTime = now;
      lastClickPos = [normX, normY];

      const click = clicks[clickSlot];
      clickSlot = (clickSlot + 1) % clicks.length;
      click[0] = normX;
      click[1] = normY;
      click[2] = 0;
      click[3] = reduceMotion ? 0.35 : 1.0;

      // Natural water drop tap audio trigger
      AudioEngine.playTap();
    };

    const onPointerMove = event => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointer.tx = (event.clientX - rect.left) / rect.width;
      pointer.ty = 1 - (event.clientY - rect.top) / rect.height;
      pointer.activeTarget = 1;
    };

    const onPointerLeave = () => {
      pointer.activeTarget = 0;
    };

    const onPointerDown = event => {
      if (options.clickRipple === false) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = 1 - (event.clientY - rect.top) / rect.height;
      triggerClickAt(nx, ny);
    };

    const render = now => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;

      const elapsed = (now - startTime) * 0.001;
      const delta = lastFrame ? Math.min(now - lastFrame, 50) : 16;
      lastFrame = now;

      if (mediaReady && introProgress < 1) {
        introProgress = Math.min(1, introProgress + delta / INTRO_MS);
      }
      const settle = 1 - introProgress;

      const drift = Math.min(Math.max(options.idleDrift ?? 0.5, 0), 1);
      const engaged = pointer.activeTarget > 0;
      const idleX = 0.5 + Math.sin(elapsed * 0.4) * (0.1 + drift * 0.15);
      const idleY = 0.5 + Math.cos(elapsed * 0.32) * (0.08 + drift * 0.15);
      const follow = 1 - Math.exp(-delta / (engaged ? 120 : 450));

      pointer.x += ((engaged ? pointer.tx : idleX) - pointer.x) * follow;
      pointer.y += ((engaged ? pointer.ty : idleY) - pointer.y) * follow;
      pointer.active += ((engaged ? 1 : drift) - pointer.active) * (1 - Math.exp(-delta / 250));

      clicks.forEach(click => {
        if (click[3] <= 0) return;
        click[2] += delta / 1000;
        if (click[2] > RIPPLE_LIFE) click[3] = 0;
      });

      gl.useProgram(program);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uLocs.uTexture, 0);

      gl.uniform2f(uLocs.uResolution, canvas.width, canvas.height);
      gl.uniform2f(uLocs.uPointer, pointer.x, pointer.y);
      gl.uniform1f(uLocs.uPointerActive, reduceMotion ? pointer.active * 0.35 : pointer.active);
      gl.uniform1f(uLocs.uTime, reduceMotion ? 0 : elapsed);
      gl.uniform1f(uLocs.uWarpStrength, options.warpStrength ?? 0.16);
      gl.uniform1f(uLocs.uWarpScale, options.warpScale ?? 1.4);
      gl.uniform1f(uLocs.uSpeed, options.speed ?? 0.85);
      gl.uniform1f(uLocs.uPointerInfluence, options.pointerInfluence ?? 0.5);
      gl.uniform1f(uLocs.uPointerStrength, options.pointerStrength ?? 0.55);
      gl.uniform1f(uLocs.uRefraction, options.refraction ?? 0.028);
      gl.uniform1f(uLocs.uChromatic, options.chromatic ?? 0.07);
      gl.uniform1f(uLocs.uLensMode, LENS_MODES[options.lens] ?? 0);
      gl.uniform1f(uLocs.uIsImage, options.imageElement ? 1.0 : 0.0);
      gl.uniform1f(uLocs.uClickWaveOnly, options.clickWaveOnly ? 1.0 : 0.0);
      gl.uniform1f(uLocs.uIntro, settle * settle * settle);
      gl.uniform1f(uLocs.uReveal, mediaReady ? (introProgress < 0.3 ? introProgress / 0.3 : 1.0) : 0);

      const flatClicks = [];
      clicks.forEach(c => flatClicks.push(...c));
      gl.uniform4fv(uLocs.uClicks, new Float32Array(flatClicks));

      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.bindVertexArray(null);

      raf = requestAnimationFrame(render);
    };

    const wake = () => {
      if (!raf && alive && visible && !document.hidden) {
        raf = requestAnimationFrame(render);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    intersectionObserver.observe(container);

    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('pointerdown', onPointerDown);

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && visible) wake();
    });

    resize();
    wake();

    return {
      destroy: () => {
        alive = false;
        if (raf) cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerleave', onPointerLeave);
        canvas.removeEventListener('pointerdown', onPointerDown);
        gl.deleteTexture(texture);
        gl.deleteBuffer(posBuf);
        gl.deleteBuffer(uvBuf);
        gl.deleteVertexArray(vao);
        gl.deleteProgram(program);
      },
      updateText: newText => {
        options.text = newText;
        rasterize();
      },
      triggerWave: (x = 0.5, y = 0.5) => {
        triggerClickAt(x, y);
      },
      setOptions: newOpts => {
        Object.assign(options, newOpts);
        rasterize();
      }
    };
  }

  // =========================================================================
  // 5. Standalone Image Wrapper (Tap Wave Effect)
  // =========================================================================

  function warpImage(imgElement, options = {}) {
    if (typeof imgElement === 'string') imgElement = document.querySelector(imgElement);
    if (!imgElement) return null;

    const wrapper = document.createElement('div');
    wrapper.className = 'warp-image-container';
    wrapper.style.display = 'block';
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.overflow = 'hidden';
    wrapper.style.cursor = 'pointer';
    wrapper.style.borderRadius = (typeof window !== 'undefined' && window.getComputedStyle ? window.getComputedStyle(imgElement).borderRadius : '') || '16px';

    imgElement.parentNode.insertBefore(wrapper, imgElement);
    wrapper.appendChild(imgElement);

    let warpInstance = null;

    const startWarp = () => {
      warpInstance = initWarpEffect(wrapper, {
        ...options,
        imageElement: imgElement,
        clickWaveOnly: true, // Photos stay calm until clicked/tapped!
        warpStrength: options.warpStrength ?? 0.32,
        warpScale: options.warpScale ?? 1.2,
        speed: options.speed ?? 0.85,
        refraction: options.refraction ?? 0.038,
        chromatic: options.chromatic ?? 0.09,
        clickRipple: true
      });

      if (warpInstance) {
        imgElement.style.opacity = '0';
        imgElement.style.position = 'absolute';
        imgElement.style.pointerEvents = 'none';
      }
    };

    if (imgElement.complete && imgElement.naturalWidth > 0) {
      startWarp();
    } else {
      imgElement.addEventListener('load', startWarp, { once: true });
    }

    return {
      destroy: () => warpInstance?.destroy(),
      triggerWave: (x = 0.5, y = 0.5) => warpInstance?.triggerWave(x, y),
      setOptions: newOpts => warpInstance?.setOptions(newOpts)
    };
  }

  // =========================================================================
  // 6. Public API Export
  // =========================================================================

  const WarpText = {
    init: initWarpEffect,
    warpImage: warpImage,
    Audio: AudioEngine
  };

  global.WarpText = WarpText;
})(typeof window !== 'undefined' ? window : this);
