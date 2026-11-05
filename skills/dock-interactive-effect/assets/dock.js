/**
 * Dock.js - Standalone Vanilla JS macOS-style Interactive Dock
 * Inspired by React Bits <Dock />
 * 
 * Features:
 * - Damped harmonic spring magnification physics
 * - Parabolic click hop / launch bounce
 * - Auto-fit responsive scaling
 * - Proximity auto-hide
 * - SVG-tailed context menus with submenus & keyboard navigation
 * - Theme tokens (dark & light)
 * - Zero dependencies (No React required)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Dock = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  const SIDES = ['bottom', 'top', 'left', 'right'];
  const EDGE = 12;
  const HOP = 0.4;
  const HOP_TIME = 0.38;
  const HOLD_TIME = 450;
  const TAIL = 9;
  const TAIL_HALF = 9;
  const MENU_RADIUS = 10;
  const MENU_GAP = 8;
  const MARGIN = 8;
  const POP = 'cubic-bezier(0.2, 1.25, 0.4, 1)';

  const THEMES = {
    dark: {
      '--dock-panel': 'rgba(38, 35, 46, 0.66)',
      '--dock-panel-edge': 'rgba(255, 255, 255, 0.08)',
      '--dock-panel-highlight': 'rgba(255, 255, 255, 0.07)',
      '--dock-panel-shadow': '0 22px 44px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)',
      '--dock-tile': 'linear-gradient(180deg, #3a3644 0%, #27242f 100%)',
      '--dock-tile-edge': 'rgba(255, 255, 255, 0.07)',
      '--dock-tile-highlight': 'rgba(255, 255, 255, 0.12)',
      '--dock-tile-shadow': '0 4px 10px -4px rgba(0, 0, 0, 0.7)',
      '--dock-ink': '#f4f4f5',
      '--dock-label': '#2a2731',
      '--dock-label-ink': '#f4f4f5',
      '--dock-dot': 'rgba(255, 255, 255, 0.72)',
      '--dock-separator': 'rgba(255, 255, 255, 0.12)',
      '--dock-press': 'brightness(0.75)',
      '--dock-menu': 'rgba(40, 37, 47, 0.8)',
      '--dock-menu-edge': 'rgba(255, 255, 255, 0.13)',
      '--dock-menu-ink': '#f4f4f5',
      '--dock-menu-muted': 'rgba(244, 244, 245, 0.42)',
      '--dock-menu-separator': 'rgba(255, 255, 255, 0.1)',
      '--dock-menu-shadow': '0 18px 40px -12px rgba(0, 0, 0, 0.65), 0 3px 10px rgba(0, 0, 0, 0.3)'
    },
    light: {
      '--dock-panel': 'rgba(240, 240, 243, 0.8)',
      '--dock-panel-edge': 'rgba(24, 24, 27, 0.07)',
      '--dock-panel-highlight': 'rgba(255, 255, 255, 0.95)',
      '--dock-panel-shadow': '0 22px 44px -22px rgba(24, 24, 27, 0.3), 0 6px 16px -10px rgba(24, 24, 27, 0.16)',
      '--dock-tile': 'linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)',
      '--dock-tile-edge': 'rgba(24, 24, 27, 0.08)',
      '--dock-tile-highlight': 'rgba(255, 255, 255, 1)',
      '--dock-tile-shadow': '0 4px 10px -5px rgba(24, 24, 27, 0.25)',
      '--dock-ink': '#27272a',
      '--dock-label': '#ffffff',
      '--dock-label-ink': '#18181b',
      '--dock-dot': 'rgba(24, 24, 27, 0.55)',
      '--dock-separator': 'rgba(24, 24, 27, 0.12)',
      '--dock-press': 'brightness(0.9)',
      '--dock-menu': 'rgba(248, 248, 250, 0.86)',
      '--dock-menu-edge': 'rgba(24, 24, 27, 0.1)',
      '--dock-menu-ink': '#18181b',
      '--dock-menu-muted': 'rgba(24, 24, 27, 0.4)',
      '--dock-menu-separator': 'rgba(24, 24, 27, 0.1)',
      '--dock-menu-shadow': '0 18px 40px -14px rgba(24, 24, 27, 0.3), 0 3px 10px rgba(24, 24, 27, 0.1)'
    }
  };

  const hasBadge = badge => badge !== undefined && badge !== null && badge !== false;
  const usable = row => Boolean(row) && !row.separator && !row.disabled;
  const clamp = (val, min, max) => Math.min(Math.max(val, min), Math.max(min, max));

  const menuPath = (width, height, side, at) => {
    const r = MENU_RADIUS;
    const p = (x, y) => `${(x + TAIL).toFixed(2)} ${(y + TAIL).toFixed(2)}`;
    const tail = (x, y, dx, dy, nx, ny) => {
      const q = (u, v) => p(x + dx * u + nx * v, y + dy * u + ny * v);
      return `L ${q(-TAIL_HALF, 0)} L ${q(-TAIL_HALF * 0.18, TAIL * 0.82)} Q ${q(0, TAIL)} ${q(TAIL_HALF * 0.18, TAIL * 0.82)} L ${q(TAIL_HALF, 0)}`;
    };
    return [
      `M ${p(r, 0)}`,
      side === 'top' ? tail(at, 0, 1, 0, 0, -1) : '',
      `L ${p(width - r, 0)} A ${r} ${r} 0 0 1 ${p(width, r)}`,
      side === 'right' ? tail(width, at, 0, 1, 1, 0) : '',
      `L ${p(width, height - r)} A ${r} ${r} 0 0 1 ${p(width - r, height)}`,
      side === 'bottom' ? tail(at, height, -1, 0, 0, 1) : '',
      `L ${p(r, height)} A ${r} ${r} 0 0 1 ${p(0, height - r)}`,
      side === 'left' ? tail(0, at, 0, -1, -1, 0) : '',
      `L ${p(0, r)} A ${r} ${r} 0 0 1 ${p(r, 0)} Z`
    ].join(' ');
  };

  const CHECK_SVG = `<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M3.5 8.5l3 3 6-7" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
  const CHEVRON_SVG = `<svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3.5L10.5 8 6 12.5" stroke-linecap="round" stroke-linejoin="round" /></svg>`;

  class Dock {
    constructor(container, options = {}) {
      if (!container) throw new Error('Dock: container element is required.');
      this.container = container;
      this.options = Object.assign(
        {
          items: [],
          position: 'bottom',
          theme: 'dark',
          baseItemSize: 50,
          magnification: 70,
          distance: 200,
          panelHeight: 68,
          gap: 10,
          roundness: 0.5,
          spring: { mass: 0.1, stiffness: 150, damping: 12 },
          bounce: true,
          autoHide: false,
          tiles: true,
          showLabels: true,
          showIndicators: true,
          showBadges: true,
          badgeColor: '#ff453a',
          accentColor: '#0a84ff',
          className: '',
          style: {}
        },
        options
      );

      this.itemRefs = [];
      this.motion = new Map();
      this.fit = 1;
      this.menu = null;
      this.serial = 0;
      this.press = null;
      this.pressing = false;
      this.skip = -1;
      this.alive = true;
      this.raf = 0;
      this.last = 0;
      this.lastFocus = null;
      this.lastRest = [];
      this.lastBase = 0;
      this.hidden = false;
      this.hideTimer = 0;
      this.pointer = { x: 0, y: 0, inside: false };
      this.focused = -1;
      this.held = null;

      this.initDOM();
      this.initEvents();
      this.initResizeObserver();
      this.wake();
    }

    static init(container, options) {
      return new Dock(container, options);
    }

    get side() {
      return SIDES.includes(this.options.position) ? this.options.position : 'bottom';
    }

    get vertical() {
      return this.side === 'left' || this.side === 'right';
    }

    get rawBase() {
      return Math.max(16, this.options.baseItemSize);
    }

    get rawPeak() {
      return Math.max(this.rawBase, this.options.magnification);
    }

    get rawThickness() {
      return Math.max(this.rawBase, this.options.panelHeight);
    }

    get rawGap() {
      return Math.max(0, this.options.gap);
    }

    get base() {
      return this.rawBase * this.fit;
    }

    get peak() {
      return this.rawPeak * this.fit;
    }

    get thickness() {
      return this.rawThickness * this.fit;
    }

    get gap() {
      return this.rawGap * this.fit;
    }

    get distance() {
      return Math.max(1, this.options.distance) * this.fit;
    }

    get mass() {
      return Math.max(0.01, this.options.spring?.mass ?? 0.1);
    }

    get stiffness() {
      return Math.max(1, this.options.spring?.stiffness ?? 150);
    }

    get damping() {
      return Math.max(0, this.options.spring?.damping ?? 12);
    }

    get totalLength() {
      return (
        this.options.items.reduce((sum, item) => sum + (item?.separator ? 1 : this.rawBase), 0) +
        this.rawGap * Math.max(0, this.options.items.length - 1) +
        this.rawThickness -
        this.rawBase +
        this.rawPeak -
        this.rawBase
      );
    }

    getTokens() {
      const palette = THEMES[this.options.theme] || THEMES.dark;
      return Object.assign({}, palette, {
        '--dock-accent': this.options.accentColor,
        '--dock-badge': this.options.badgeColor,
        '--dock-base': `${this.base}px`,
        '--dock-thickness': `${this.thickness}px`,
        '--dock-gap': `${this.gap}px`,
        '--dock-pad': `${(this.thickness - this.base) / 2}px`,
        '--dock-reach': `${this.peak - this.base}px`,
        '--dock-round': clamp(this.options.roundness, 0, 1)
      });
    }

    initDOM() {
      const root = document.createElement('div');
      this.root = root;
      root.className = `dock dock--${this.side}${this.options.tiles ? '' : ' dock--bare'}${
        this.options.className ? ` ${this.options.className}` : ''
      }`;
      root.setAttribute('role', 'toolbar');
      root.setAttribute('aria-label', 'Dock');
      root.setAttribute('aria-orientation', this.vertical ? 'vertical' : 'horizontal');

      this.applyTokens();

      this.options.items.forEach((item, index) => {
        if (item?.separator) {
          const sep = document.createElement('span');
          sep.className = 'dock-separator';
          sep.setAttribute('aria-hidden', 'true');
          root.appendChild(sep);
          this.itemRefs.push(sep);
        } else {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `dock-item${item.className ? ` ${item.className}` : ''}`;
          if (item.label) btn.setAttribute('aria-label', item.label);
          if (item.menu?.length) {
            btn.setAttribute('aria-haspopup', 'menu');
            btn.setAttribute('aria-expanded', 'false');
          }

          const tile = document.createElement('span');
          tile.className = 'dock-tile';

          const face = document.createElement('span');
          face.className = 'dock-face';
          if (typeof item.icon === 'string') {
            face.innerHTML = item.icon;
          } else if (item.icon instanceof Node) {
            face.appendChild(item.icon.cloneNode(true));
          }
          tile.appendChild(face);

          if (this.options.showBadges && hasBadge(item.badge)) {
            const badge = document.createElement('span');
            badge.className = 'dock-badge';
            if (item.badge !== true) badge.textContent = item.badge;
            tile.appendChild(badge);
          }
          btn.appendChild(tile);

          if (this.options.showIndicators && item.active) {
            const dot = document.createElement('span');
            dot.className = 'dock-dot';
            dot.setAttribute('aria-hidden', 'true');
            btn.appendChild(dot);
          }

          if (this.options.showLabels && item.label) {
            const label = document.createElement('span');
            label.className = 'dock-label';
            label.setAttribute('aria-hidden', 'true');
            label.textContent = item.label;
            btn.appendChild(label);
          }

          root.appendChild(btn);
          this.itemRefs.push(btn);
        }
      });

      if (this.options.autoHide) {
        root.setAttribute('data-hidden', '');
        this.hidden = true;
      }

      this.container.appendChild(root);
      this.lastBase = this.base;
    }

    applyTokens() {
      const tokens = this.getTokens();
      Object.keys(tokens).forEach(k => {
        this.root.style.setProperty(k, tokens[k]);
      });
      if (this.options.style) {
        Object.assign(this.root.style, this.options.style);
      }
    }

    initResizeObserver() {
      const host = this.root.offsetParent || document.documentElement;
      const measure = () => {
        if (!this.alive) return;
        const room = (this.vertical ? host.clientHeight : host.clientWidth) - EDGE * 2;
        const total = this.totalLength;
        const next = total > 0 ? Math.min(1, Math.max(0.4, room / total)) : 1;
        this.fit = Math.round(next * 1000) / 1000;
        this.applyTokens();
        this.wake();
      };
      measure();
      this.observer = new ResizeObserver(measure);
      this.observer.observe(host);
    }

    entry(index) {
      let state = this.motion.get(index);
      if (!state) {
        state = {
          size: this.base,
          velocity: 0,
          lift: 0,
          rise: 0,
          launch: 0,
          gravity: 0,
          hopping: false,
          drawn: '',
          node: null
        };
        this.motion.set(index, state);
      }
      return state;
    }

    wake() {
      if (this.raf || !this.alive) return;
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.tick.bind(this));
    }

    tick(now) {
      this.raf = 0;
      if (!this.alive) return;

      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      const dt = Math.min(1 / 30, Math.max(0.001, (now - this.last) / 1000));
      this.last = now;

      if (this.base !== this.lastBase && this.lastBase > 0) {
        const ratio = this.base / this.lastBase;
        this.motion.forEach(state => {
          state.size *= ratio;
          state.velocity *= ratio;
        });
        this.lastBase = this.base;
      }

      const rect = this.root.getBoundingClientRect();
      const center = this.vertical ? rect.top + rect.height / 2 : rect.left + rect.width / 2;
      const spans = this.options.items.map(item => (item?.separator ? 1 : this.base));
      let cursor = -(spans.reduce((sum, span) => sum + span, 0) + this.gap * Math.max(0, spans.length - 1)) / 2;
      const rest = spans.map(span => {
        const middle = cursor + span / 2;
        cursor += span + this.gap;
        return middle;
      });

      let focus = null;
      if (this.held !== null) focus = this.held;
      else if (this.pointer.inside) focus = (this.vertical ? this.pointer.y : this.pointer.x) - center;
      else if (rest[this.focused] !== undefined) focus = rest[this.focused];

      this.lastFocus = focus;
      this.lastRest = rest;

      const steps = Math.max(1, Math.ceil(dt * 240));
      const h = dt / steps;
      const k = this.stiffness / this.mass;
      const c = this.damping / this.mass;
      let moving = false;

      this.options.items.forEach((item, index) => {
        const node = this.itemRefs[index];
        if (!node || item?.separator) return;

        const state = this.entry(index);
        const reach = focus === null ? 1 : Math.abs(focus - rest[index]) / this.distance;
        const target = this.base + (this.peak - this.base) * (reach < 1 ? Math.cos((reach * Math.PI) / 2) ** 2 : 0);

        if (reduce) {
          state.size = target;
          state.velocity = 0;
        } else {
          for (let i = 0; i < steps; i++) {
            state.velocity = (state.velocity + h * k * (target - state.size)) / (1 + h * c + h * h * k);
            state.size += state.velocity * h;
            if (!state.hopping) continue;
            state.rise -= state.gravity * h;
            state.lift += state.rise * h;
            if (state.lift > 0) continue;
            state.lift = 0;
            state.rise *= -0.36;
            if (state.rise < state.launch * 0.2) {
              state.rise = 0;
              state.hopping = false;
              node.removeAttribute('data-hop');
            }
          }
        }

        if (Math.abs(state.velocity) < 0.01 && Math.abs(target - state.size) < 0.01) {
          state.size = target;
          state.velocity = 0;
        } else {
          moving = true;
        }

        if (state.hopping) moving = true;

        const size = Math.max(1, state.size);
        const drawn = `${size.toFixed(2)} ${state.lift.toFixed(2)} ${this.side}`;
        if (drawn === state.drawn && node === state.node) return;
        state.drawn = drawn;
        state.node = node;

        const lift = this.side === 'bottom' || this.side === 'right' ? -state.lift : state.lift;
        const tile = node.firstElementChild;
        node.style.width = `${size}px`;
        node.style.height = `${size}px`;
        if (tile) {
          tile.style.transform = `translate(${this.vertical ? `${lift}px, 0` : `0, ${lift}px`}) scale(${size / this.base})`;
        }
      });

      if (moving) this.raf = requestAnimationFrame(this.tick.bind(this));
    }

    show() {
      window.clearTimeout(this.hideTimer);
      this.hideTimer = 0;
      if (!this.hidden) return;
      this.hidden = false;
      this.root.removeAttribute('data-hidden');
    }

    hide() {
      window.clearTimeout(this.hideTimer);
      this.hideTimer = 0;
      const blocked = this.pointer.inside || this.held !== null || this.root.contains(document.activeElement);
      if (this.hidden || !this.options.autoHide || blocked) return;
      this.hidden = true;
      this.root.setAttribute('data-hidden', '');
    }

    hideLater() {
      if (this.hidden || this.hideTimer || !this.options.autoHide) return;
      this.hideTimer = window.setTimeout(() => this.hide(), 600);
    }

    hop(index) {
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      const node = this.itemRefs[index];
      if (reduce || !this.options.bounce || !node) return;
      const state = this.entry(index);
      if (state.hopping) return;
      const height = state.size * HOP;
      state.gravity = (8 * height) / (HOP_TIME * HOP_TIME);
      state.launch = (state.gravity * HOP_TIME) / 2;
      state.rise = state.launch;
      state.hopping = true;
      node.setAttribute('data-hop', '');
      this.wake();
    }

    hold(index) {
      if (index === null) {
        this.held = null;
        this.wake();
        this.hideLater();
        return;
      }
      this.held = this.lastFocus ?? this.lastRest[index] ?? 0;
      this.show();
      this.wake();
    }

    initEvents() {
      const root = this.root;

      this.onMove = event => {
        this.pointer.x = event.clientX;
        this.pointer.y = event.clientY;
        this.pointer.inside = true;
        this.show();
        this.wake();
      };

      this.onLeave = () => {
        this.pointer.inside = false;
        this.wake();
        this.hideLater();
      };

      this.onFocusOut = event => {
        if (!root.contains(event.relatedTarget)) this.hideLater();
      };

      this.onWindowMove = event => {
        if (!this.options.autoHide || this.pointer.inside) return;
        const host = root.offsetParent;
        const rect = host
          ? host.getBoundingClientRect()
          : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
        const zone = EDGE + this.thickness * 0.6;
        const x = event.clientX;
        const y = event.clientY;
        const within = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        const near = {
          bottom: y >= rect.bottom - zone,
          top: y <= rect.top + zone,
          left: x <= rect.left + zone,
          right: x >= rect.right - zone
        }[this.side];
        if (within && near) this.show();
        else this.hideLater();
      };

      root.addEventListener('pointermove', this.onMove);
      root.addEventListener('pointerdown', this.onMove);
      root.addEventListener('pointerleave', this.onLeave);
      root.addEventListener('pointercancel', this.onLeave);
      root.addEventListener('focusin', () => this.show());
      root.addEventListener('focusout', this.onFocusOut);
      window.addEventListener('pointermove', this.onWindowMove);
      window.addEventListener('pointerdown', this.onWindowMove);

      // Item events
      this.options.items.forEach((item, index) => {
        if (item?.separator) return;
        const node = this.itemRefs[index];
        if (!node) return;

        node.addEventListener('pointerdown', event => {
          this.skip = -1;
          if (this.menu && !this.menu.closing) {
            if (event.button === 2 || event.ctrlKey) return;
            this.skip = index;
            this.closeMenu(false);
            return;
          }
          if (item.menu?.length && event.button === 0 && !event.ctrlKey) {
            this.startPress(event, index);
          }
        });

        node.addEventListener('contextmenu', event => {
          if (!item.menu?.length) return;
          event.preventDefault();
          this.endPress();
          this.openMenu(index, 'pointer');
        });

        node.addEventListener('click', () => {
          if (this.skip === index) {
            this.skip = -1;
            return;
          }
          this.hop(index);
          item.onClick?.();
        });

        node.addEventListener('focus', event => {
          if (event.currentTarget.matches?.(':focus-visible')) {
            this.focused = index;
            this.wake();
          }
        });

        node.addEventListener('blur', () => {
          this.focused = -1;
          this.wake();
        });

        node.addEventListener('keydown', event => this.onItemKeyDown(event, index));
      });
    }

    startPress(event, index) {
      this.endPress();
      const press = { id: event.pointerId, x: event.clientX, y: event.clientY, timer: 0 };
      const onMove = moved => {
        if (moved.pointerId !== press.id) return;
        if (Math.hypot(moved.clientX - press.x, moved.clientY - press.y) > 8) this.endPress();
      };
      const onUp = released => {
        if (released.pointerId === press.id) this.endPress();
      };

      press.cleanup = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
      };

      press.timer = window.setTimeout(() => {
        press.cleanup();
        this.press = null;
        if (!this.openMenu(index, 'press')) return;
        this.skip = index;
        this.pressing = true;
        window.addEventListener(
          'pointerup',
          () => {
            this.pressing = false;
          },
          { once: true }
        );
      }, HOLD_TIME);

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
      this.press = press;
    }

    endPress() {
      if (!this.press) return;
      window.clearTimeout(this.press.timer);
      this.press.cleanup();
      this.press = null;
    }

    onItemKeyDown(event, index) {
      const toward = { bottom: 'ArrowUp', top: 'ArrowDown', left: 'ArrowRight', right: 'ArrowLeft' }[this.side];
      if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10') || event.key === toward) {
        if (this.openMenu(index, 'keyboard')) event.preventDefault();
        return;
      }
      const order = this.options.items.flatMap((item, i) => (item?.separator ? [] : [i]));
      const at = order.indexOf(index);
      const keys = this.vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
      let next;
      if (event.key === keys[0]) next = order[(at - 1 + order.length) % order.length];
      else if (event.key === keys[1]) next = order[(at + 1) % order.length];
      else if (event.key === 'Home') next = order[0];
      else if (event.key === 'End') next = order[order.length - 1];
      if (next === undefined) return;
      event.preventDefault();
      this.itemRefs[next]?.focus();
    }

    openMenu(index, mode) {
      const node = this.itemRefs[index];
      const item = this.options.items[index];
      if (!node || !item?.menu?.length) return false;
      if (this.menu && this.menu.index === index && !this.menu.closing) return true;

      this.hold(index);
      const rect = node.getBoundingClientRect();
      const point = {
        bottom: { x: rect.left + rect.width / 2, y: rect.top - MENU_GAP },
        top: { x: rect.left + rect.width / 2, y: rect.bottom + MENU_GAP },
        left: { x: rect.right + MENU_GAP, y: rect.top + rect.height / 2 },
        right: { x: rect.left - MENU_GAP, y: rect.top + rect.height / 2 }
      }[this.side];

      this.serial += 1;
      node.setAttribute('aria-expanded', 'true');
      node.setAttribute('data-open', '');

      this.menu = new DockMenuDOM({
        rows: item.menu,
        label: item.label,
        side: this.side,
        point,
        tokens: this.getTokens(),
        keyboard: mode === 'keyboard',
        owner: node,
        onSelect: (row, keyboard) => {
          this.closeMenu(keyboard || Boolean(this.menu?.keyboard));
          row.onClick?.();
        },
        onDismiss: () => this.closeMenu(true),
        onExited: () => this.finishMenu(index)
      });

      return true;
    }

    closeMenu(restore = false) {
      if (!this.menu || this.menu.closing) return;
      this.menu.close(restore);
    }

    finishMenu(index) {
      const owner = this.itemRefs[index];
      if (owner) {
        owner.setAttribute('aria-expanded', 'false');
        owner.removeAttribute('data-open');
        if (this.menu?.restoreFocus) owner.focus({ preventScroll: true });
      }
      this.menu = null;
      this.hold(null);
    }

    destroy() {
      this.alive = false;
      cancelAnimationFrame(this.raf);
      window.clearTimeout(this.hideTimer);
      this.endPress();
      if (this.menu) this.menu.destroy();
      if (this.observer) this.observer.disconnect();

      this.root.removeEventListener('pointermove', this.onMove);
      this.root.removeEventListener('pointerdown', this.onMove);
      this.root.removeEventListener('pointerleave', this.onLeave);
      this.root.removeEventListener('pointercancel', this.onLeave);
      this.root.removeEventListener('focusout', this.onFocusOut);
      window.removeEventListener('pointermove', this.onWindowMove);
      window.removeEventListener('pointerdown', this.onWindowMove);

      this.root.remove();
    }
  }

  class DockMenuDOM {
    constructor({ rows, label, side = null, point, edge, tokens, nested = false, keyboard = false, owner = null, onSelect, onDismiss, onBack, onExited }) {
      this.rows = rows;
      this.label = label;
      this.side = side;
      this.point = point;
      this.edge = edge;
      this.tokens = tokens;
      this.nested = nested;
      this.keyboard = keyboard;
      this.owner = owner;
      this.onSelect = onSelect;
      this.onDismiss = onDismiss;
      this.onBack = onBack;
      this.onExited = onExited;
      this.closing = false;
      this.active = -1;
      this.rowNodes = [];
      this.subMenu = null;

      this.createDOM();
      this.positionAndAnimate();
      this.bindEvents();
    }

    createDOM() {
      const outer = document.createElement('div');
      outer.className = 'dock-menu';
      outer.setAttribute('data-dock-menu', '');
      Object.keys(this.tokens).forEach(k => outer.style.setProperty(k, this.tokens[k]));

      const glass = document.createElement('span');
      glass.className = 'dock-menu-glass';
      outer.appendChild(glass);

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'dock-menu-shape');
      svg.setAttribute('aria-hidden', 'true');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '1');
      svg.appendChild(path);
      outer.appendChild(svg);

      const list = document.createElement('div');
      list.className = 'dock-menu-list';
      list.setAttribute('role', 'menu');
      if (this.label) list.setAttribute('aria-label', this.label);
      list.tabIndex = -1;

      const highlight = document.createElement('span');
      highlight.className = 'dock-menu-highlight';
      list.appendChild(highlight);
      this.highlightNode = highlight;

      const hasChecks = this.rows.some(r => r && !r.separator && r.checked !== undefined);

      this.rows.forEach((row, i) => {
        if (!row) return;
        if (row.separator) {
          const sep = document.createElement('span');
          sep.className = 'dock-menu-separator';
          sep.setAttribute('role', 'separator');
          list.appendChild(sep);
          return;
        }

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'dock-menu-row';
        btn.setAttribute('role', row.checked !== undefined ? 'menuitemcheckbox' : 'menuitem');
        if (row.checked !== undefined) btn.setAttribute('aria-checked', String(Boolean(row.checked)));
        if (row.disabled) btn.setAttribute('aria-disabled', 'true');
        const isSub = Boolean(row.items?.length);
        if (isSub) {
          btn.setAttribute('aria-haspopup', 'menu');
          btn.setAttribute('aria-expanded', 'false');
        }
        btn.tabIndex = -1;
        btn.dataset.dockRow = i;

        if (hasChecks) {
          const chk = document.createElement('span');
          chk.className = 'dock-menu-check';
          if (row.checked) chk.innerHTML = CHECK_SVG;
          btn.appendChild(chk);
        }

        if (row.icon) {
          const ic = document.createElement('span');
          ic.className = 'dock-menu-icon';
          if (typeof row.icon === 'string') ic.innerHTML = row.icon;
          else if (row.icon instanceof Node) ic.appendChild(row.icon.cloneNode(true));
          btn.appendChild(ic);
        }

        const txt = document.createElement('span');
        txt.className = 'dock-menu-text';
        txt.textContent = row.label;
        btn.appendChild(txt);

        if (row.shortcut) {
          const sc = document.createElement('span');
          sc.className = 'dock-menu-shortcut';
          sc.textContent = row.shortcut;
          btn.appendChild(sc);
        }

        if (isSub) {
          const chev = document.createElement('span');
          chev.className = 'dock-menu-chevron';
          chev.innerHTML = CHEVRON_SVG;
          btn.appendChild(chev);
        }

        list.appendChild(btn);
        this.rowNodes[i] = btn;
      });

      outer.appendChild(list);
      document.body.appendChild(outer);

      this.outer = outer;
      this.glass = glass;
      this.shapePath = path;
      this.list = list;
    }

    positionAndAnimate() {
      const outer = this.outer;
      const list = this.list;
      const glass = this.glass;
      const shape = this.shapePath;
      const point = this.point || { x: 0, y: 0 };
      const box = this.edge || { left: 0, right: 0, top: 0 };
      const width = list.offsetWidth;
      const height = list.offsetHeight;
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

      let left, top, at = 0, origin;

      if (this.side === 'bottom' || this.side === 'top') {
        left = clamp(point.x - width / 2, MARGIN, vw - MARGIN - width);
        top = this.side === 'bottom' ? point.y - TAIL - height : point.y + TAIL;
        at = clamp(point.x - left, MENU_RADIUS + TAIL_HALF, width - MENU_RADIUS - TAIL_HALF);
        origin = `${at}px ${this.side === 'bottom' ? height + TAIL : -TAIL}px`;
      } else if (this.side === 'left' || this.side === 'right') {
        top = clamp(point.y - height / 2, MARGIN, vh - MARGIN - height);
        left = this.side === 'right' ? point.x - TAIL - width : point.x + TAIL;
        at = clamp(point.y - top, MENU_RADIUS + TAIL_HALF, height - MENU_RADIUS - TAIL_HALF);
        origin = `${this.side === 'right' ? width + TAIL : -TAIL}px ${at}px`;
      } else {
        const flip = box.right - 4 + width > vw - MARGIN && box.left + 4 - width >= MARGIN;
        left = flip ? box.left + 4 - width : box.right - 4;
        top = clamp(box.top - 5, MARGIN, vh - MARGIN - height);
        origin = flip ? 'right top' : 'left top';
      }

      const path = menuPath(width, height, this.side, at);
      outer.style.left = `${left}px`;
      outer.style.top = `${top}px`;
      outer.style.transformOrigin = origin;
      outer.style.visibility = 'visible';
      glass.style.clipPath = `path('${path}')`;
      shape.setAttribute('d', path);

      const layers = [outer.firstElementChild, glass, shape.parentElement, list].filter(Boolean);

      if (reduce) {
        layers.forEach(layer => layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, easing: 'ease-out' }));
      } else {
        outer.animate([{ transform: `scale(${this.nested ? 0.94 : 0.82})` }, { transform: 'scale(1)' }], {
          duration: this.nested ? 220 : 340,
          easing: POP
        });
        layers.forEach(layer =>
          layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: this.nested ? 120 : 160, easing: 'ease-out' })
        );
      }

      const first = this.rows.findIndex(usable);
      if (this.keyboard && first >= 0) {
        this.activateRow(first);
        this.rowNodes[first]?.focus({ preventScroll: true });
      }
    }

    activateRow(index) {
      this.active = index;
      const row = this.rowNodes[index];
      const hl = this.highlightNode;
      if (!row || !hl) return;
      hl.style.transform = `translateY(${row.offsetTop}px)`;
      hl.style.height = `${row.offsetHeight}px`;
      hl.style.opacity = '1';
    }

    bindEvents() {
      this.rowNodes.forEach((btn, index) => {
        if (!btn) return;
        const row = this.rows[index];

        btn.addEventListener('pointermove', () => {
          if (!usable(row)) return;
          this.activateRow(index);
        });

        btn.addEventListener('click', event => {
          if (!usable(row)) return;
          if (row.items?.length) {
            this.openSub(index, event.detail === 0);
          } else {
            this.choose(index, event.detail === 0);
          }
        });
      });

      this.list.addEventListener('pointerleave', () => {
        if (this.subMenu) return;
        this.active = -1;
        if (this.highlightNode) this.highlightNode.style.opacity = '0';
      });

      this.onGlobalDown = event => {
        const target = event.target;
        if (target instanceof Element && (target.closest('[data-dock-menu]') || this.owner?.contains(target))) return;
        this.close(false);
      };

      this.onGlobalScroll = event => {
        if (event.target instanceof Element && event.target.closest('[data-dock-menu]')) return;
        this.close(false);
      };

      document.addEventListener('pointerdown', this.onGlobalDown, true);
      window.addEventListener('scroll', this.onGlobalScroll, true);
      window.addEventListener('resize', this.onGlobalDown);
    }

    choose(index, keyboard) {
      const row = this.rows[index];
      if (!usable(row)) return;
      this.onSelect?.(row, keyboard);
    }

    openSub(index, keyboard) {
      const row = this.rows[index];
      const btn = this.rowNodes[index];
      if (!row?.items?.length || !btn) return;
      const rect = btn.getBoundingClientRect();
      this.subMenu = new DockMenuDOM({
        rows: row.items,
        label: typeof row.label === 'string' ? row.label : undefined,
        edge: { left: rect.left, right: rect.right, top: rect.top },
        tokens: this.tokens,
        nested: true,
        keyboard,
        owner: btn,
        onSelect: (subRow, k) => this.onSelect?.(subRow, k),
        onDismiss: () => this.closeSub(),
        onBack: () => this.closeSub()
      });
    }

    closeSub() {
      if (!this.subMenu) return;
      this.subMenu.destroy();
      this.subMenu = null;
    }

    close(restore = false) {
      if (this.closing) return;
      this.closing = true;
      this.restoreFocus = restore;
      if (this.subMenu) this.closeSub();
      this.destroy();
      this.onExited?.();
    }

    destroy() {
      document.removeEventListener('pointerdown', this.onGlobalDown, true);
      window.removeEventListener('scroll', this.onGlobalScroll, true);
      window.removeEventListener('resize', this.onGlobalDown);
      if (this.subMenu) this.subMenu.destroy();
      this.outer.remove();
    }
  }

  return Dock;
});
