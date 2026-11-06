/**
 * DodgeField.js - Standalone Vanilla JS Evasive Catch-Me Interactive Button
 * Inspired by React Bits <DodgeField />
 * 
 * Features:
 * - Dynamic cursor evasion with vector bearing calculation
 * - Nonlinear power falloff reaction curves
 * - Field perimeter constraint with clamp and bounce boundary modes
 * - Configurable patience threshold with relenting behavior
 * - Automatic taunts progression and catch celebration hold
 * - Zero dependencies (No React or external motion library required)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DodgeField = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  const COUNT_LINE = 0.55;
  const DEAD_ZONE = 6;
  const CAUGHT_HOLD_MS = 760;
  const INSET = 12;
  const DEFAULT_TAUNTS = ['Catch me', 'Nope', 'Too slow', 'Almost', 'Okay, okay'];

  const wallIt = (t, room, wall) => {
    if (wall === 'bounce') {
      if (t > room) return Math.max(-room, 2 * room - t);
      if (t < -room) return Math.min(room, -2 * room - t);
      return t;
    }
    return Math.min(room, Math.max(-room, t));
  };

  const bearingOf = (dx, dy, d, axis) => {
    if (axis === 'x') return { x: Math.sign(dx) || 1, y: 0 };
    if (axis === 'y') return { x: 0, y: Math.sign(dy) || 1 };
    return { x: dx / d, y: dy / d };
  };

  class DodgeField {
    constructor(container, options = {}) {
      if (!container) throw new Error('DodgeField: container element is required.');
      this.container = container;
      this.options = Object.assign(
        {
          taunts: DEFAULT_TAUNTS,
          notice: '',
          inkColor: '#f5f5f5',
          contrastColor: '#18181b',
          fieldHeight: 240,
          reach: 72,
          radius: 120,
          falloff: 2,
          fleeDuration: 130,
          returnDuration: 620,
          returnBounce: 0.1,
          axis: 'both',
          wall: 'clamp',
          patience: 4,
          disabled: false,
          content: null,
          onDodge: null,
          onRelent: null,
          onCatch: null,
          className: '',
          style: {}
        },
        options
      );

      this.dodges = 0;
      this.caught = false;
      this.inside = false;
      this.fine = true;
      this.pointer = null;
      this.bearing = { x: 1, y: 0 };
      this.armed = true;
      this.room = { x: 0, y: 0 };
      this.raf = 0;
      this.holdTimer = null;
      this.alive = true;

      // Spring physics state
      this.posX = 0;
      this.posY = 0;
      this.velX = 0;
      this.velY = 0;
      this.targetX = 0;
      this.targetY = 0;
      this.lastTime = performance.now();

      this.initDOM();
      this.initMediaAndEvents();
      this.initResizeObserver();
      this.updateState();
    }

    static init(container, options) {
      return new DodgeField(container, options);
    }

    get gave() {
      return this.dodges >= Math.max(1, this.options.patience);
    }

    get still() {
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      return this.gave || this.caught || this.options.disabled || reduce;
    }

    initDOM() {
      const field = document.createElement('div');
      this.field = field;
      field.className = `dodge-field${this.options.className ? ` ${this.options.className}` : ''}`;
      field.style.setProperty('--df-ink', this.options.inkColor);
      field.style.setProperty('--df-contrast', this.options.contrastColor);
      field.style.setProperty('--df-height', `${this.options.fieldHeight}px`);

      if (this.options.style) {
        Object.assign(field.style, this.options.style);
      }

      const mover = document.createElement('div');
      this.mover = mover;
      mover.className = 'dodge-field__mover';
      mover.setAttribute('data-fled', 'false');
      mover.setAttribute('data-relented', 'false');
      mover.setAttribute('data-caught', 'false');

      this.renderContent();

      mover.addEventListener('click', () => this.handleClick());
      field.appendChild(mover);

      this.container.appendChild(field);
    }

    renderContent() {
      const state = {
        dodges: this.dodges,
        gave: this.gave,
        caught: this.caught,
        fleeing: this.inside && !this.still
      };

      if (typeof this.options.content === 'function') {
        const custom = this.options.content(state);
        this.mover.innerHTML = '';
        if (typeof custom === 'string') {
          this.mover.innerHTML = custom;
        } else if (custom instanceof Node) {
          this.mover.appendChild(custom);
        }
        return;
      }

      if (this.options.content instanceof Node) {
        this.mover.innerHTML = '';
        this.mover.appendChild(this.options.content);
        return;
      }

      // Default built-in pill
      let pill = this.mover.querySelector('.dodge-field__pill');
      if (!pill) {
        pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'dodge-field__pill';
        pill.setAttribute('aria-label', this.options.taunts[0] || 'Catch me');

        const labels = document.createElement('span');
        labels.className = 'dodge-field__labels';

        this.labelNodes = [];
        this.options.taunts.forEach((taunt, i) => {
          const lbl = document.createElement('span');
          lbl.className = 'dodge-field__label';
          lbl.textContent = taunt;
          lbl.setAttribute('aria-hidden', 'true');
          labels.appendChild(lbl);
          this.labelNodes.push(lbl);
        });

        pill.appendChild(labels);
        this.mover.appendChild(pill);
      }

      this.updateActiveLabel();
    }

    updateActiveLabel() {
      if (!this.labelNodes || !this.labelNodes.length) return;
      const taunts = this.options.taunts;
      const index = this.gave || this.caught ? taunts.length - 1 : Math.min(this.dodges, Math.max(0, taunts.length - 2));

      this.labelNodes.forEach((node, i) => {
        node.setAttribute('data-active', i === index ? 'true' : 'false');
      });
    }

    initResizeObserver() {
      const measure = () => {
        if (!this.alive) return;
        this.room = {
          x: Math.max(0, (this.field.clientWidth - this.mover.offsetWidth) / 2 - INSET),
          y: Math.max(0, (this.field.clientHeight - this.mover.offsetHeight) / 2 - INSET)
        };
      };
      measure();
      this.observer = new ResizeObserver(measure);
      this.observer.observe(this.field);
      this.observer.observe(this.mover);
    }

    initMediaAndEvents() {
      const query = window.matchMedia('(hover: hover) and (pointer: fine)');
      const syncMedia = () => {
        this.fine = query.matches;
        if (this.fine) {
          this.field.removeAttribute('data-coarse');
          if (this.noticeNode) {
            this.noticeNode.remove();
            this.noticeNode = null;
          }
        } else {
          this.field.setAttribute('data-coarse', '');
          if (this.options.notice && !this.noticeNode) {
            const notice = document.createElement('p');
            notice.className = 'dodge-field__notice';
            notice.textContent = this.options.notice;
            this.field.appendChild(notice);
            this.noticeNode = notice;
          }
        }
      };
      syncMedia();
      this.mediaQuery = query;
      this.mediaListener = syncMedia;
      query.addEventListener('change', syncMedia);

      this.onPointerMove = e => {
        if (e.pointerType === 'touch' || !this.fine || this.options.disabled) return;
        this.pointer = { x: e.clientX, y: e.clientY };
        this.requestTick();
      };

      this.onPointerLeave = () => {
        this.pointer = null;
        this.requestTick();
      };

      this.onScroll = () => {
        if (!this.fine || this.options.disabled) return;
        this.requestTick();
      };

      window.addEventListener('pointermove', this.onPointerMove, { passive: true });
      window.addEventListener('scroll', this.onScroll, { passive: true, capture: true });
      document.addEventListener('pointerleave', this.onPointerLeave);
      window.addEventListener('blur', this.onPointerLeave);

      // Start animation loop
      this.startPhysicsLoop();
    }

    requestTick() {
      if (!this.raf && this.alive) {
        this.raf = requestAnimationFrame(() => this.tick());
      }
    }

    tick() {
      this.raf = 0;
      if (!this.alive) return;

      const field = this.field;
      const p = this.pointer;
      if (!field) return;

      const rect = field.getBoundingClientRect();
      const zoom = rect.width / (field.offsetWidth || rect.width) || 1;
      const dx = p ? (p.x - (rect.left + rect.width / 2)) / zoom : Infinity;
      const dy = p ? (p.y - (rect.top + rect.height / 2)) / zoom : Infinity;
      const d = Math.hypot(dx, dy);

      const isInside = d <= this.options.radius;
      if (!isInside && !this.inside && this.posX === 0 && this.posY === 0) return;

      const still = this.still;

      if (!still) {
        if (d < this.options.radius * COUNT_LINE) {
          if (this.armed) {
            this.armed = false;
            this.dodges += 1;
            this.updateState();
            this.options.onDodge?.(this.dodges);
            if (this.gave) {
              this.options.onRelent?.();
            }
          }
        } else if (d > this.options.radius) {
          this.armed = true;
        }
      }

      if (Number.isFinite(d) && d > DEAD_ZONE) {
        this.bearing = bearingOf(dx, dy, d, this.options.axis);
      }

      const flee = isInside && !still ? Math.pow(1 - d / this.options.radius, this.options.falloff) : 0;
      this.targetX = wallIt(-this.bearing.x * flee * this.options.reach, this.room.x, this.options.wall);
      this.targetY = wallIt(-this.bearing.y * flee * this.options.reach, this.room.y, this.options.wall);

      if (isInside !== this.inside) {
        this.inside = isInside;
        this.updateState();
      }
    }

    startPhysicsLoop() {
      const step = now => {
        if (!this.alive) return;
        const dt = Math.min(1 / 30, Math.max(0.001, (now - this.lastTime) / 1000));
        this.lastTime = now;

        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

        if (reduce) {
          this.posX = this.targetX;
          this.posY = this.targetY;
          this.velX = 0;
          this.velY = 0;
        } else {
          // Spring configuration
          const fleeing = this.targetX !== 0 || this.targetY !== 0;
          const duration = fleeing ? this.options.fleeDuration / 1000 : this.options.returnDuration / 1000;
          const bounce = fleeing ? 0 : this.options.returnBounce;

          // Convert duration and bounce to spring stiffness and damping
          const omega = (2 * Math.PI) / Math.max(0.05, duration);
          const zeta = Math.max(0.1, 1 - bounce);
          const stiffness = omega * omega;
          const damping = 2 * zeta * omega;

          // 240Hz sub-stepping Euler integration
          const steps = Math.max(1, Math.ceil(dt * 240));
          const h = dt / steps;

          for (let i = 0; i < steps; i++) {
            this.velX = (this.velX + h * stiffness * (this.targetX - this.posX)) / (1 + h * damping + h * h * stiffness);
            this.posX += this.velX * h;

            this.velY = (this.velY + h * stiffness * (this.targetY - this.posY)) / (1 + h * damping + h * h * stiffness);
            this.posY += this.velY * h;
          }

          if (Math.abs(this.velX) < 0.01 && Math.abs(this.targetX - this.posX) < 0.01) {
            this.posX = this.targetX;
            this.velX = 0;
          }
          if (Math.abs(this.velY) < 0.01 && Math.abs(this.targetY - this.posY) < 0.01) {
            this.posY = this.targetY;
            this.velY = 0;
          }
        }

        this.mover.style.transform = `translate(${this.posX.toFixed(2)}px, ${this.posY.toFixed(2)}px)`;
        requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    }

    updateState() {
      const fleeing = this.inside && !this.still;
      this.mover.setAttribute('data-fled', fleeing ? 'true' : 'false');
      this.mover.setAttribute('data-relented', this.gave ? 'true' : 'false');
      this.mover.setAttribute('data-caught', this.caught ? 'true' : 'false');

      if (typeof this.options.content === 'function') {
        this.renderContent();
      } else {
        this.updateActiveLabel();
      }
    }

    handleClick() {
      this.caught = true;
      this.updateState();
      this.options.onCatch?.();

      window.clearTimeout(this.holdTimer);
      this.holdTimer = window.setTimeout(() => {
        this.caught = false;
        this.dodges = 0;
        this.armed = false;
        this.updateState();
        this.requestTick();
      }, CAUGHT_HOLD_MS);
    }

    reset() {
      this.dodges = 0;
      this.caught = false;
      this.armed = true;
      this.targetX = 0;
      this.targetY = 0;
      this.updateState();
      this.requestTick();
    }

    setDisabled(disabled) {
      this.options.disabled = Boolean(disabled);
      if (this.options.disabled) {
        this.targetX = 0;
        this.targetY = 0;
      }
      this.updateState();
      this.requestTick();
    }

    destroy() {
      this.alive = false;
      cancelAnimationFrame(this.raf);
      window.clearTimeout(this.holdTimer);
      if (this.observer) this.observer.disconnect();

      this.mediaQuery?.removeEventListener('change', this.mediaListener);
      window.removeEventListener('pointermove', this.onPointerMove);
      window.removeEventListener('scroll', this.onScroll, { capture: true });
      document.removeEventListener('pointerleave', this.onPointerLeave);
      window.removeEventListener('blur', this.onPointerLeave);

      this.field.remove();
    }
  }

  return DodgeField;
});
