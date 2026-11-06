/**
 * SlingButton.js - Standalone Vanilla JS Elastic Pull-to-Send Slingshot Button
 * Inspired by React Bits <SlingButton />
 * 
 * Features:
 * - Dynamic SVG tangent elastic band catenary calculations
 * - Rubberband nonlinear pull constraints
 * - Dual-stage armed threshold with animated power arc
 * - Velocity tracking and launch speed snap-through recoil spring
 * - Directional particle burst spread cone (Web Animations API)
 * - Zero dependencies (No React, Framer Motion or external icon packages required)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SlingButton = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  const GAP = 4;
  const SLOP = { fine: 4, coarse: 8 };
  const FINGER_MAX = 3000;
  const HAND_MAX = 6000;
  const CANCEL = 0.5;
  const POWER_CAP = 1.5;
  const DOT_MS = 300;
  const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const rubberband = (o, dim, c = 0.55) => (o * dim * c) / (dim + c * Math.abs(o));

  const DEFAULT_ARROW_SVG = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`;

  class SlingButton {
    constructor(container, options = {}) {
      if (!container) throw new Error('SlingButton: container element is required.');
      this.container = container;
      this.options = Object.assign(
        {
          onSend: null,
          padColor: '#f5f5f5',
          iconColor: '#18181b',
          accentColor: '#f5f5f5',
          wellColor: '#27272a',
          bandColor: '#52525b',
          size: 56,
          strokeWidth: 3,
          armAt: 48,
          maxPull: 160,
          launchSpeed: 2600,
          recoil: 0.2,
          flight: 120,
          particles: 14,
          spread: 60,
          axis: 'any',
          tapSends: true,
          disabled: false,
          ariaLabel: 'Send',
          className: '',
          icon: null
        },
        options
      );

      this.px = 0;
      this.py = 0;
      this.held = false;
      this.armed = false;
      this.sent = false;
      this.grip = null;
      this.dir = { ux: 0, uy: -1 };
      this.power = 0;
      this.dotPending = false;
      this.dotTimer = null;
      this.skipClick = false;
      this.paintQueued = false;
      this.alive = true;
      this.springRaf = 0;

      this.initConstants();
      this.initDOM();
      this.initEvents();
      this.paint();
    }

    static init(container, options) {
      return new SlingButton(container, options);
    }

    initConstants() {
      const o = this.options;
      this.R = o.maxPull;
      this.ARM = Math.min(o.armAt, 0.8 * this.R);
      this.wellR = o.size / 2 + GAP + o.strokeWidth;
      this.padR = o.size / 2 - o.strokeWidth / 2;
      this.arcR = this.wellR;
      this.H = this.wellR + o.strokeWidth + 2;
      this.DOT = Math.max(6, Math.round(o.size / 7));
      this.count = Math.max(0, Math.round(o.particles));
    }

    initDOM() {
      const o = this.options;
      const root = document.createElement('span');
      this.root = root;
      root.className = `sling-button${o.className ? ` ${o.className}` : ''}`;
      root.style.setProperty('--sl-size', `${o.size}px`);
      root.style.setProperty('--sl-svg', `${2 * this.H}px`);
      root.style.setProperty('--sl-pad', o.padColor);
      root.style.setProperty('--sl-icon', o.iconColor);
      root.style.setProperty('--sl-accent', o.accentColor);
      root.style.setProperty('--sl-well', o.wellColor);
      root.style.setProperty('--sl-band', o.bandColor);
      root.style.setProperty('--sl-stroke', `${o.strokeWidth}px`);
      root.style.setProperty('--sl-dot', `${this.DOT}px`);

      // SVG Tension & Well Layer
      const H = this.H;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'sling-button__fx');
      svg.setAttribute('viewBox', `${-H} ${-H} ${2 * H} ${2 * H}`);
      svg.setAttribute('aria-hidden', 'true');

      const gTension = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gTension.setAttribute('class', 'sling-button__tension');
      gTension.style.opacity = '0';

      const pathBand = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathBand.setAttribute('class', 'sling-button__band');

      const pathHot = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathHot.setAttribute('class', 'sling-button__band sling-button__band--hot');

      gTension.appendChild(pathBand);
      gTension.appendChild(pathHot);
      svg.appendChild(gTension);

      const circleWell = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circleWell.setAttribute('class', 'sling-button__well');
      circleWell.setAttribute('r', String(this.wellR));
      svg.appendChild(circleWell);

      const circleArc = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circleArc.setAttribute('class', 'sling-button__arc');
      circleArc.setAttribute('r', String(this.arcR));
      circleArc.setAttribute('pathLength', '1');
      circleArc.setAttribute('stroke-dasharray', '0 1');
      circleArc.style.opacity = '0';
      svg.appendChild(circleArc);

      root.appendChild(svg);
      this.fxNode = gTension;
      this.bandNode = pathBand;
      this.hotNode = pathHot;
      this.arcNode = circleArc;

      // Particle Dots
      this.dotNodes = [];
      for (let i = 0; i < this.count; i++) {
        const dot = document.createElement('span');
        dot.className = 'sling-button__dot';
        dot.setAttribute('aria-hidden', 'true');
        root.appendChild(dot);
        this.dotNodes.push(dot);
      }

      // Moving Pad Container
      const move = document.createElement('span');
      move.className = 'sling-button__move';

      const pad = document.createElement('button');
      pad.type = 'button';
      pad.className = 'sling-button__pad';
      pad.setAttribute('aria-label', o.ariaLabel);
      if (o.disabled) pad.setAttribute('aria-disabled', 'true');

      const face = document.createElement('span');
      face.className = 'sling-button__face';

      const icon = document.createElement('span');
      icon.className = 'sling-button__icon';
      if (typeof o.icon === 'string') {
        icon.innerHTML = o.icon;
      } else if (o.icon instanceof Node) {
        icon.appendChild(o.icon.cloneNode(true));
      } else {
        icon.innerHTML = DEFAULT_ARROW_SVG;
      }

      face.appendChild(icon);
      pad.appendChild(face);
      move.appendChild(pad);
      root.appendChild(move);

      // Screen Reader Instructions
      const sr = document.createElement('span');
      sr.className = 'sling-button__sr';
      sr.textContent = 'Press Enter to send, or drag away and release.';
      root.appendChild(sr);

      this.moveNode = move;
      this.padNode = pad;
      this.iconNode = icon;

      this.container.appendChild(root);
    }

    launchDot() {
      this.dotPending = false;
      window.clearTimeout(this.dotTimer);
      const { ux, uy } = this.dir;
      this.relaxIcon();

      const base = Math.atan2(-uy, -ux);
      const cone = (this.options.spread * Math.PI) / 180;
      const push = 0.85 + 0.35 * this.power;
      const flight = this.options.flight;
      const wellR = this.wellR;

      this.dotNodes.forEach((dot, i) => {
        if (!dot) return;
        const lead = i === 0;
        const angle = base + (lead ? 0 : (Math.random() + Math.random() - 1) * (cone / 2));
        const cx = Math.cos(angle);
        const cy = Math.sin(angle);
        const reach = (lead ? flight : flight * (0.3 + Math.random())) * push;
        const drift = lead ? 0 : (Math.random() - 0.5) * flight * 0.4;
        const scale = lead ? 1 : 0.3 + Math.random() * 0.6;
        const shrink = lead ? 0.6 : scale * (0.2 + Math.random() * 0.4);
        const duration = lead ? DOT_MS : DOT_MS * (0.7 + Math.random());
        const delay = lead ? 0 : Math.random() * 70;
        const to = wellR + reach;

        dot.animate(
          [
            { transform: `translate(${cx * wellR}px, ${cy * wellR}px) scale(${scale})` },
            { transform: `translate(${cx * to - cy * drift}px, ${cy * to + cx * drift}px) scale(${shrink})` }
          ],
          { duration, delay, easing: EASE_OUT, fill: 'none' }
        );

        dot.animate(
          [
            { opacity: 1, offset: 0 },
            { opacity: 1, offset: 0.55 },
            { opacity: 0, offset: 1 }
          ],
          { duration, delay, easing: 'linear', fill: 'none' }
        );
      });
    }

    aimIcon(ux, uy, dist) {
      const angle = (Math.atan2(-uy, -ux) * 180) / Math.PI + 90;
      this.iconNode.style.transition = 'none';
      this.iconNode.style.transform = `rotate(${angle * clamp(dist / 12, 0, 1)}deg)`;
    }

    relaxIcon() {
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      this.iconNode.style.transition = reduce ? 'none' : 'transform 360ms cubic-bezier(0.23, 1, 0.32, 1)';
      this.iconNode.style.transform = 'rotate(0deg)';
    }

    paint() {
      this.paintQueued = false;
      const x = this.px;
      const y = this.py;
      const { ux, uy } = this.dir;
      const proj = x * ux + y * uy;
      const p = clamp(proj / this.ARM, 0, 1);
      const dist = Math.hypot(x, y);

      let d = '';
      if (dist > 0.5) {
        const a = Math.atan2(y, x);
        const b = Math.acos(clamp((this.wellR - this.padR) / dist, -1, 1));
        d = [a + b, a - b]
          .map(t => {
            const cx = Math.cos(t);
            const cy = Math.sin(t);
            return `M${(this.wellR * cx).toFixed(2)},${(this.wellR * cy).toFixed(2)}L${(x + this.padR * cx).toFixed(2)},${(y + this.padR * cy).toFixed(2)}`;
          })
          .join('');
      }

      this.bandNode.setAttribute('d', d);
      this.hotNode.setAttribute('d', d);
      this.hotNode.style.opacity = String(p);
      this.fxNode.style.opacity = String(clamp(proj / 6, 0, 1));

      this.arcNode.setAttribute('stroke-dasharray', `${p} ${1 - p}`);
      this.arcNode.setAttribute('stroke-dashoffset', String(p / 2));
      this.arcNode.style.opacity = p > 0.01 ? '1' : '0';

      if (this.grip) this.aimIcon(ux, uy, dist);
      this.arcNode.setAttribute('transform', `rotate(${(Math.atan2(-uy, -ux) * 180) / Math.PI})`);

      this.moveNode.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;

      if (this.dotPending && proj <= this.options.size / 4) {
        this.launchDot();
      }
    }

    schedulePaint() {
      if (this.paintQueued) return;
      this.paintQueued = true;
      requestAnimationFrame(() => this.paint());
    }

    settle(v0) {
      cancelAnimationFrame(this.springRaf);
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

      if (reduce) {
        this.fxNode.style.transition = 'opacity 200ms ease';
        this.fxNode.style.opacity = '0';
        window.setTimeout(() => {
          this.px = 0;
          this.py = 0;
          this.fxNode.style.transition = '';
          this.schedulePaint();
        }, 200);
        return;
      }

      // Spring simulation: duration = 0.4s, bounce = recoil
      const duration = 0.4;
      const bounce = this.options.recoil;
      const omega = (2 * Math.PI) / duration;
      const zeta = Math.max(0.05, 1 - bounce);
      const stiffness = omega * omega;
      const damping = 2 * zeta * omega;

      let vx = v0.x;
      let vy = v0.y;
      let lastTime = performance.now();

      const step = now => {
        if (!this.alive) return;
        const dt = Math.min(1 / 30, Math.max(0.001, (now - lastTime) / 1000));
        lastTime = now;

        // Sub-stepped Euler integration
        const subSteps = Math.max(1, Math.ceil(dt * 240));
        const h = dt / subSteps;

        for (let i = 0; i < subSteps; i++) {
          vx = (vx + h * stiffness * (0 - this.px)) / (1 + h * damping + h * h * stiffness);
          this.px += vx * h;

          vy = (vy + h * stiffness * (0 - this.py)) / (1 + h * damping + h * h * stiffness);
          this.py += vy * h;
        }

        this.schedulePaint();

        if (Math.abs(vx) < 0.05 && Math.abs(vy) < 0.05 && Math.hypot(this.px, this.py) < 0.1) {
          this.px = 0;
          this.py = 0;
          this.schedulePaint();
        } else {
          this.springRaf = requestAnimationFrame(step);
        }
      };

      this.springRaf = requestAnimationFrame(step);
    }

    initEvents() {
      const pad = this.padNode;

      pad.addEventListener('pointerdown', e => {
        if (this.options.disabled || this.grip || e.button !== 0) return;
        cancelAnimationFrame(this.springRaf);

        const rect = this.root.getBoundingClientRect();
        const scale = rect.width / (this.root.offsetWidth || rect.width) || 1;
        const dNow = Math.hypot(this.px, this.py);
        const dClamped = Math.min(dNow, 0.95 * this.R);
        const rawNow = dNow > 0.5 ? (this.R * dClamped) / (this.R - dClamped) : 0;

        this.grip = {
          id: e.pointerId,
          startX: e.clientX,
          startY: e.clientY,
          scale,
          moved: false,
          hist: [],
          rawOrigin: dNow > 0.5 ? { x: (rawNow * this.px) / dNow, y: (rawNow * this.py) / dNow } : { x: 0, y: 0 },
          slop: e.pointerType === 'touch' ? SLOP.coarse : SLOP.fine
        };

        try {
          pad.setPointerCapture(e.pointerId);
        } catch {}

        this.held = true;
        this.root.setAttribute('data-held', '');
        pad.setAttribute('data-held', '');
      });

      pad.addEventListener('pointermove', e => {
        const g = this.grip;
        if (!g || g.id !== e.pointerId) return;

        const dx = (e.clientX - g.startX) / g.scale;
        const dy = (e.clientY - g.startY) / g.scale;
        let rx = g.rawOrigin.x + dx;
        let ry = g.rawOrigin.y + dy;

        if (this.options.axis === 'horizontal') ry = rubberband(ry, this.options.size / 4);
        else if (this.options.axis === 'vertical') rx = rubberband(rx, this.options.size / 4);

        if (!g.moved && Math.hypot(dx, dy) > g.slop) g.moved = true;

        const raw = Math.hypot(rx, ry);
        if (raw < 0.01) return;

        const d = (this.R * raw) / (this.R + raw);
        const ux = rx / raw;
        const uy = ry / raw;
        this.dir = { ux, uy };

        this.px = d * ux;
        this.py = d * uy;

        const t = performance.now();
        g.hist.push({ x: d * ux, y: d * uy, t });
        while (g.hist.length > 4 || t - g.hist[0].t > 80) g.hist.shift();

        const isArmed = d >= this.ARM;
        if (isArmed !== this.armed) {
          this.armed = isArmed;
          if (isArmed) {
            this.root.setAttribute('data-armed', '');
            pad.setAttribute('data-armed', '');
          } else {
            this.root.removeAttribute('data-armed');
            pad.removeAttribute('data-armed');
          }
        }
        this.schedulePaint();
      });

      const onRelease = (e, cancelled) => this.release(e.pointerId, cancelled);

      pad.addEventListener('pointerup', e => onRelease(e, false));
      pad.addEventListener('pointercancel', e => onRelease(e, true));
      pad.addEventListener('lostpointercapture', e => onRelease(e, true));

      pad.addEventListener('keydown', e => {
        if (e.key === 'Escape' && this.grip) {
          this.release(this.grip.id, true);
        }
      });

      pad.addEventListener('click', () => {
        if (this.skipClick) {
          this.skipClick = false;
          return;
        }
        if (!this.options.disabled) this.options.onSend?.();
      });
    }

    release(pointerId, cancelled) {
      const g = this.grip;
      if (!g || g.id !== pointerId) return;
      this.grip = null;
      this.skipClick = true;

      try {
        this.padNode.releasePointerCapture(pointerId);
      } catch {}

      const d = Math.hypot(this.px, this.py);
      const p = d / this.ARM;
      const { ux, uy } = this.dir;

      let vx = 0;
      let vy = 0;

      if (!cancelled && g.hist.length > 1) {
        const a = g.hist[0];
        const b = g.hist[g.hist.length - 1];
        const dt = b.t - a.t;
        if (dt > 0 && performance.now() - b.t < 50) {
          vx = ((b.x - a.x) / dt) * 1000;
          vy = ((b.y - a.y) / dt) * 1000;
        }
      }

      const fm = Math.hypot(vx, vy);
      if (fm > FINGER_MAX) {
        vx *= FINGER_MAX / fm;
        vy *= FINGER_MAX / fm;
      }

      if (!g.moved) {
        this.relaxIcon();
        if (this.options.tapSends && !cancelled && !this.options.disabled) {
          this.options.onSend?.();
        }
      } else {
        const fire = this.armed && !cancelled;
        const launch = fire
          ? this.options.launchSpeed * Math.min(p, POWER_CAP)
          : CANCEL * this.options.launchSpeed * Math.min(p, 1);

        let v0x = vx - ux * launch;
        let v0y = vy - uy * launch;
        const m = Math.hypot(v0x, v0y);

        if (m > HAND_MAX) {
          v0x *= HAND_MAX / m;
          v0y *= HAND_MAX / m;
        }

        if (!fire) this.relaxIcon();
        if (fire) {
          if (!this.options.disabled) this.options.onSend?.();
          const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

          if (reduce) {
            this.root.setAttribute('data-sent', '');
            window.setTimeout(() => this.root.removeAttribute('data-sent'), 200);
          } else {
            this.power = clamp((Math.min(p, POWER_CAP) - 1) / (POWER_CAP - 1), 0, 1);
            this.dotPending = true;
            this.dotTimer = window.setTimeout(() => this.launchDot(), 150);
          }
        }

        this.settle({ x: v0x, y: v0y });
      }

      this.armed = false;
      this.held = false;
      this.root.removeAttribute('data-held');
      this.root.removeAttribute('data-armed');
      this.padNode.removeAttribute('data-held');
      this.padNode.removeAttribute('data-armed');
    }

    send() {
      if (this.options.disabled) return;
      this.launchDot();
      this.options.onSend?.();
    }

    setDisabled(disabled) {
      this.options.disabled = Boolean(disabled);
      if (this.options.disabled) {
        this.padNode.setAttribute('aria-disabled', 'true');
      } else {
        this.padNode.removeAttribute('aria-disabled');
      }
    }

    destroy() {
      this.alive = false;
      cancelAnimationFrame(this.springRaf);
      window.clearTimeout(this.dotTimer);
      this.root.remove();
    }
  }

  return SlingButton;
});
