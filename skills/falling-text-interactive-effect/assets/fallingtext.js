/**
 * FallingText - Interactive 2D Physics Kinetic Typography Engine (Vanilla JS)
 * Inspired by React Bits <FallingText />
 * Requires: Matter.js (window.Matter or global Matter)
 */
(function (global) {
  'use strict';

  const THEMES = {
    dark: {
      '--falling-text-tile': 'linear-gradient(180deg, #3a3644 0%, #27242f 100%)',
      '--falling-text-tile-edge': 'rgba(255, 255, 255, 0.07)',
      '--falling-text-tile-highlight': 'rgba(255, 255, 255, 0.12)',
      '--falling-text-tile-shadow': '0 4px 10px -4px rgba(0, 0, 0, 0.7)',
      '--falling-text-tile-ink': '#f4f4f5'
    },
    light: {
      '--falling-text-tile': 'linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)',
      '--falling-text-tile-edge': 'rgba(24, 24, 27, 0.08)',
      '--falling-text-tile-highlight': 'rgba(255, 255, 255, 1)',
      '--falling-text-tile-shadow': '0 4px 10px -5px rgba(24, 24, 27, 0.25)',
      '--falling-text-tile-ink': '#27272a'
    }
  };

  const STEP = 1000 / 120;
  const WALL = 400;
  const SPRING =
    'linear(0, 0.0603, 0.2033, 0.3821, 0.5633, 0.7258, 0.8584, 0.9574, 1.0242, 1.0634, 1.0809, 1.0828, 1.0747, 1.0613, 1.046, 1.0313, 1.0186, 1.0085, 1.0012, 0.9965, 0.994, 0.9931, 0.9933, 0.9941, 0.9953, 0.9966, 0.9978, 0.9988, 1)';

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const readableOn = color => {
    let hex = String(color || '')
      .trim()
      .replace('#', '');
    if (hex.length === 3) hex = hex.replace(/./g, c => c + c);
    if (!/^[0-9a-f]{6}$/i.test(hex)) return '#ffffff';
    const [r, g, b] = [0, 2, 4].map(index => {
      const c = parseInt(hex.slice(index, index + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4 ? '#18181b' : '#ffffff';
  };

  const springEase = () =>
    typeof CSS !== 'undefined' && CSS.supports?.('transition-timing-function', 'linear(0, 1)')
      ? SPRING
      : 'cubic-bezier(0.34, 1.4, 0.64, 1)';

  class FallingTextInstance {
    constructor(container, options = {}) {
      if (typeof container === 'string') {
        container = document.querySelector(container);
      }
      if (!container) {
        throw new Error('[FallingText] Container element not found.');
      }

      this.container = container;
      this.options = {
        text: '',
        highlightWords: [],
        highlightClass: 'highlighted',
        trigger: 'auto',
        variant: 'text',
        split: 'words',
        gravity: 1,
        bounciness: 0.2,
        scatter: 0.5,
        stagger: 0.03,
        order: 'random',
        draggable: true,
        mouseConstraintStiffness: 0.2,
        cursorPush: 0.5,
        restoreDelay: 0,
        fontSize: '1rem',
        accentColor: '#5b8cff',
        theme: 'dark',
        backgroundColor: 'transparent',
        wireframes: false,
        className: '',
        ...options
      };

      this.phase = 'idle';
      this.engine = null;
      this.pieces = [];
      this.walls = [];
      this.drag = null;
      this.raf = 0;
      this.last = 0;
      this.clock = 0;
      this.accumulator = 0;
      this.quietSince = null;
      this.inside = false;
      this.visible = true;
      this.armed = true;
      this.lastBounciness = null;
      this.pointer = { x: 0, y: 0, vx: 0, vy: 0, time: 0 };
      this.destroyed = false;

      this._initDOM();
      this._bindEvents();
    }

    _initDOM() {
      const {
        text,
        highlightWords,
        highlightClass,
        trigger,
        variant,
        split,
        fontSize,
        accentColor,
        theme,
        backgroundColor,
        wireframes,
        className,
        draggable
      } = this.options;

      this.container.classList.add('falling-text');
      if (wireframes) this.container.classList.add('falling-text--wireframes');
      if (className) this.container.classList.add(...className.split(/\s+/).filter(Boolean));
      this.container.dataset.trigger = trigger;
      if (draggable) this.container.dataset.draggable = '';

      const themeTokens = THEMES[theme] || THEMES.dark;
      Object.entries(themeTokens).forEach(([k, v]) => this.container.style.setProperty(k, v));
      this.container.style.setProperty('--falling-text-accent', accentColor);
      this.container.style.setProperty('--falling-text-accent-ink', readableOn(accentColor));
      if (backgroundColor && backgroundColor !== 'transparent') {
        this.container.style.background = backgroundColor;
      }
      if (fontSize) {
        this.container.style.fontSize = fontSize;
      }

      const initialText = text || this.container.textContent.trim();
      this.text = initialText;

      const marks = Array.isArray(highlightWords) ? highlightWords.filter(Boolean) : [];
      const words = initialText.split(/\s+/).filter(Boolean);
      const groups = words.map(word => ({
        word,
        highlighted: marks.some(m => word.startsWith(m))
      }));

      const pieceClass = `falling-text__piece${variant === 'tiles' ? ' falling-text__piece--tile' : ''}`;
      const textBlock = document.createElement('div');
      textBlock.className = 'falling-text__text';

      groups.forEach((group, index) => {
        if (index > 0) {
          textBlock.appendChild(document.createTextNode(' '));
        }

        if (split === 'letters') {
          const groupSpan = document.createElement('span');
          groupSpan.className = 'falling-text__group';

          [...group.word].forEach(letter => {
            const span = document.createElement('span');
            span.className = `${pieceClass}${group.highlighted ? ` ${highlightClass}` : ''}`;
            span.dataset.piece = '';
            if (group.highlighted) span.dataset.highlight = '';
            span.textContent = letter;
            groupSpan.appendChild(span);
          });
          textBlock.appendChild(groupSpan);
        } else {
          const span = document.createElement('span');
          span.className = `${pieceClass}${group.highlighted ? ` ${highlightClass}` : ''}`;
          span.dataset.piece = '';
          if (group.highlighted) span.dataset.highlight = '';
          span.textContent = group.word;
          textBlock.appendChild(span);
        }
      });

      this.container.innerHTML = '';
      this.container.appendChild(textBlock);
      this.textBlock = textBlock;
    }

    _local(event) {
      const box = this.container.getBoundingClientRect();
      return {
        x: event.clientX - box.left - this.container.clientLeft,
        y: event.clientY - box.top - this.container.clientTop
      };
    }

    _placeWalls() {
      const M = global.Matter;
      if (!this.engine || !M) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      const [floor, left, right, ceiling] = this.walls;
      M.Body.setPosition(floor, { x: width / 2, y: height + WALL / 2 });
      M.Body.setPosition(left, { x: -WALL / 2, y: height / 2 });
      M.Body.setPosition(right, { x: width + WALL / 2, y: height / 2 });
      M.Body.setPosition(ceiling, { x: width / 2, y: -WALL / 2 });
      this.pieces.forEach(piece => M.Sleeping.set(piece.body, false));
    }

    _draw(alpha) {
      for (const piece of this.pieces) {
        const { body } = piece;
        const x = piece.px + (body.position.x - piece.px) * alpha;
        const y = piece.py + (body.position.y - piece.py) * alpha;
        const angle = piece.pa + (body.angle - piece.pa) * alpha;
        if (Math.abs(x - piece.dx) < 0.01 && Math.abs(y - piece.dy) < 0.01 && Math.abs(angle - piece.da) < 0.0001)
          continue;
        piece.dx = x;
        piece.dy = y;
        piece.da = angle;
        piece.element.style.transform = `translate3d(${(x - piece.w / 2).toFixed(2)}px, ${(y - piece.h / 2).toFixed(2)}px, 0) rotate(${angle.toFixed(4)}rad)`;
      }
    }

    _release(piece) {
      const M = global.Matter;
      const s = this.options;
      piece.released = true;
      M.Body.setStatic(piece.body, false);
      M.Sleeping.set(piece.body, false);
      const kick = clamp(s.scatter, 0, 1) * (piece.knocked ? 0.4 : 1);
      M.Body.setVelocity(piece.body, { x: (Math.random() - 0.5) * 6 * kick, y: -Math.random() * 2.5 * kick });
      M.Body.setAngularVelocity(piece.body, (Math.random() - 0.5) * 0.12 * kick);
    }

    _frame(now) {
      const M = global.Matter;
      this.raf = 0;
      if (!this.engine || !this.visible || !M) return;
      const dt = Math.min(0.05, this.last ? (now - this.last) / 1000 : 1 / 60);
      this.last = now;
      this.clock += dt;
      const s = this.options;
      this.engine.gravity.y = clamp(s.gravity, -3, 4) * 1.4;
      const bounce = clamp(s.bounciness, 0, 1);
      if (bounce !== this.lastBounciness) {
        this.lastBounciness = bounce;
        this.pieces.forEach(piece => {
          piece.body.restitution = bounce;
        });
      }
      for (const piece of this.pieces) {
        if (!piece.released && (this.clock >= piece.at || piece.knocked)) {
          this._release(piece);
        }
      }
      this.accumulator += dt * 1000;
      while (this.accumulator >= STEP) {
        for (const piece of this.pieces) {
          piece.px = piece.body.position.x;
          piece.py = piece.body.position.y;
          piece.pa = piece.body.angle;
        }
        M.Engine.update(this.engine, STEP);
        this.accumulator -= STEP;
      }
      this._draw(this.accumulator / STEP);
      const settled = this.pieces.every(piece => piece.released && (piece.body.isSleeping || piece.body.speed < 0.05));
      if (s.restoreDelay > 0 && settled && !this.inside && !this.drag) {
        this.quietSince = this.quietSince ?? now;
        if (now - this.quietSince > s.restoreDelay * 1000) {
          this.restore();
          return;
        }
      } else {
        this.quietSince = null;
      }
      this.raf = requestAnimationFrame(t => this._frame(t));
    }

    _wake() {
      if (!this.raf && this.engine && this.visible) {
        this.last = 0;
        this.raf = requestAnimationFrame(t => this._frame(t));
      }
    }

    fall() {
      const M = global.Matter;
      if (!M) {
        console.warn('[FallingText] Matter.js is required. Ensure matter.js is loaded.');
        return;
      }
      const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      if (this.phase !== 'idle' || reduced) return;

      const elements = [...this.textBlock.querySelectorAll('[data-piece]')];
      if (!elements.length) return;

      const s = this.options;
      const box = this.container.getBoundingClientRect();
      const originX = box.left + this.container.clientLeft;
      const originY = box.top + this.container.clientTop;

      const rects = elements.map(element => {
        const rect = element.getBoundingClientRect();
        return { x: rect.left - originX, y: rect.top - originY, w: rect.width, h: rect.height };
      });

      this.textBlock.style.minHeight = `${this.textBlock.offsetHeight}px`;
      const world = M.Engine.create({ enableSleeping: true, positionIterations: 10, velocityIterations: 8 });
      world.gravity.y = clamp(s.gravity, -3, 4) * 1.4;

      this.walls = [
        M.Bodies.rectangle(0, 0, 10000, WALL, { isStatic: true, friction: 0.8 }),
        M.Bodies.rectangle(0, 0, WALL, 10000, { isStatic: true, friction: 0.3 }),
        M.Bodies.rectangle(0, 0, WALL, 10000, { isStatic: true, friction: 0.3 }),
        M.Bodies.rectangle(0, 0, 10000, WALL, { isStatic: true, friction: 0.3 })
      ];

      const count = rects.length;
      const center = rects.reduce((sum, rect) => sum + rect.x + rect.w / 2, 0) / count;
      const span = Math.max(1, ...rects.map(rect => Math.abs(rect.x + rect.w / 2 - center)));
      const shuffled = rects.map((_, index) => index).sort(() => Math.random() - 0.5);

      this.pieces = elements.map((element, index) => {
        const rect = rects[index];
        const radius = Math.max(
          0,
          Math.min(s.variant === 'tiles' ? rect.h * 0.28 : 4, rect.w / 2 - 1, rect.h / 2 - 1)
        );
        const body = M.Bodies.rectangle(
          rect.x + rect.w / 2,
          rect.y + rect.h / 2,
          Math.max(2, rect.w - 1),
          Math.max(2, rect.h - 1),
          {
            chamfer: radius > 0.5 ? { radius } : undefined,
            restitution: clamp(s.bounciness, 0, 1),
            friction: 0.4,
            frictionStatic: 0.8,
            frictionAir: 0.012,
            density: 0.0015,
            slop: 0.02
          }
        );
        M.Body.setStatic(body, true);
        const rank =
          s.order === 'random'
            ? shuffled.indexOf(index)
            : s.order === 'center'
              ? (Math.abs(rect.x + rect.w / 2 - center) / span) * (count - 1)
              : index;
        element.style.position = 'absolute';
        element.style.left = '0';
        element.style.top = '0';
        element.style.width = `${rect.w}px`;
        element.style.height = `${rect.h}px`;
        element.style.margin = '0';
        element.style.transform = `translate3d(${rect.x}px, ${rect.y}px, 0)`;

        return {
          element,
          body,
          w: rect.w,
          h: rect.h,
          x0: rect.x,
          y0: rect.y,
          px: body.position.x,
          py: body.position.y,
          pa: 0,
          dx: body.position.x,
          dy: body.position.y,
          da: 0,
          at: s.order === 'together' ? 0 : rank * Math.max(0, s.stagger),
          released: false
        };
      });

      M.Composite.add(world.world, [...this.walls, ...this.pieces.map(p => p.body)]);
      const byBody = new Map(this.pieces.map(p => [p.body, p]));

      M.Events.on(world, 'collisionStart', event => {
        const down = Math.sign(world.gravity.y) || 1;
        for (const pair of event.pairs) {
          const a = byBody.get(pair.bodyA);
          const b = byBody.get(pair.bodyB);
          if (!a || !b || a.released === b.released) continue;
          const [moving, still] = a.released ? [a, b] : [b, a];
          if ((still.body.position.y - moving.body.position.y) * down > still.h * 0.25) {
            still.knocked = true;
          }
        }
      });

      this.engine = world;
      this._placeWalls();
      this.phase = 'falling';
      this.container.dataset.phase = 'falling';
      this.clock = 0;
      this.accumulator = 0;
      this.quietSince = null;
      this.lastBounciness = clamp(s.bounciness, 0, 1);
      this._wake();
    }

    restore() {
      const M = global.Matter;
      if (this.phase !== 'falling') return;
      this.phase = 'restoring';
      this.container.dataset.phase = 'restoring';

      if (this.drag && this.engine && M) {
        M.Composite.remove(this.engine.world, this.drag.constraint);
        this.drag = null;
      }
      cancelAnimationFrame(this.raf);
      this.raf = 0;

      const easing = springEase();
      const order = [...this.pieces].sort((a, b) => a.body.position.y - b.body.position.y);
      const animations = order.map((piece, index) => {
        const angle = Math.atan2(Math.sin(piece.body.angle), Math.cos(piece.body.angle));
        const from = `translate3d(${(piece.body.position.x - piece.w / 2).toFixed(2)}px, ${(piece.body.position.y - piece.h / 2).toFixed(2)}px, 0) rotate(${angle.toFixed(4)}rad)`;
        const to = `translate3d(${piece.x0}px, ${piece.y0}px, 0) rotate(0rad)`;
        piece.element.style.transform = to;
        return piece.element.animate([{ transform: from }, { transform: to }], {
          duration: 760,
          delay: Math.min(index * 14, 360),
          easing,
          fill: 'backwards'
        });
      });

      Promise.all(animations.map(animation => animation.finished.catch(() => null))).then(() => {
        if (this.phase !== 'restoring') return;
        this.reset();
      });
    }

    reset(rearm = true) {
      const M = global.Matter;
      cancelAnimationFrame(this.raf);
      this.raf = 0;

      if (this.engine && M) {
        M.Composite.clear(this.engine.world, false);
        M.Engine.clear(this.engine);
      }
      this.engine = null;

      for (const piece of this.pieces) {
        piece.element.getAnimations().forEach(animation => animation.cancel());
        piece.element.style.position = '';
        piece.element.style.left = '';
        piece.element.style.top = '';
        piece.element.style.width = '';
        piece.element.style.height = '';
        piece.element.style.margin = '';
        piece.element.style.transform = '';
      }
      this.pieces = [];
      this.walls = [];
      this.drag = null;
      if (this.textBlock) this.textBlock.style.minHeight = '';
      this.phase = 'idle';
      delete this.container.dataset.phase;
      delete this.container.dataset.dragging;
      if (rearm) this.armed = true;
    }

    _bindEvents() {
      const M = global.Matter;
      const container = this.container;

      this._onEnter = () => {
        this.inside = true;
        if (this.options.trigger === 'hover') this.fall();
      };
      this._onLeave = () => {
        this.inside = false;
      };
      this._onClick = () => {
        if (this.options.trigger === 'click') this.fall();
      };

      this._onDown = event => {
        const s = this.options;
        if (!this.engine || this.phase !== 'falling' || !s.draggable || (event.pointerType === 'mouse' && event.button !== 0))
          return;
        const point = this._local(event);
        const bodies = this.pieces.filter(p => p.released).map(p => p.body);
        const hit = M.Query.point(bodies, point)[0];
        if (!hit) return;
        event.preventDefault();
        container.setPointerCapture?.(event.pointerId);
        M.Sleeping.set(hit, false);
        const constraint = M.Constraint.create({
          pointA: point,
          bodyB: hit,
          pointB: { x: point.x - hit.position.x, y: point.y - hit.position.y },
          stiffness: clamp(s.mouseConstraintStiffness, 0.01, 1),
          damping: 0.08,
          length: 0
        });
        M.Composite.add(this.engine.world, constraint);
        this.drag = { constraint, id: event.pointerId };
        container.dataset.dragging = '';
        this._wake();
      };

      this._onMove = event => {
        const point = this._local(event);
        const now = performance.now();
        const dt = Math.max(1, now - this.pointer.time);
        if (this.pointer.time && dt < 120) {
          const blend = Math.min(1, dt / 40);
          this.pointer.vx += ((point.x - this.pointer.x) / dt - this.pointer.vx) * blend;
          this.pointer.vy += ((point.y - this.pointer.y) / dt - this.pointer.vy) * blend;
        } else {
          this.pointer.vx = 0;
          this.pointer.vy = 0;
        }
        this.pointer.x = point.x;
        this.pointer.y = point.y;
        this.pointer.time = now;
        this.inside = true;

        if (this.phase === 'idle' && this.options.trigger === 'hover') this.fall();
        if (this.phase !== 'falling') return;

        if (this.drag && event.pointerId === this.drag.id) {
          this.drag.constraint.pointA = point;
          return;
        }

        const s = this.options;
        const push = clamp(s.cursorPush, 0, 2);
        const speed = Math.hypot(this.pointer.vx, this.pointer.vy);
        if (!push || speed < 0.35) return;

        let touched = false;
        for (const piece of this.pieces) {
          if (!piece.released) continue;
          const { body } = piece;
          const reach = Math.max(piece.w, piece.h) / 2 + 18;
          const distance = Math.hypot(body.position.x - point.x, body.position.y - point.y);
          if (distance > reach) continue;
          if (now - (piece.pushed || 0) < 60) continue;
          piece.pushed = now;
          const falloff = 1 - (distance / reach) ** 2;
          const kick = Math.min(20, speed * push * falloff * 16);
          M.Sleeping.set(body, false);
          M.Body.setVelocity(body, {
            x: body.velocity.x + (this.pointer.vx / speed) * kick,
            y: body.velocity.y + (this.pointer.vy / speed) * kick - kick * 0.7
          });
          M.Body.setAngularVelocity(body, body.angularVelocity + (Math.random() - 0.5) * 0.06 * push);
          touched = true;
        }
        if (touched) this._wake();
      };

      this._onUp = event => {
        if (!this.drag || event.pointerId !== this.drag.id) return;
        if (this.engine && M) M.Composite.remove(this.engine.world, this.drag.constraint);
        this.drag = null;
        delete container.dataset.dragging;
      };

      container.addEventListener('pointerenter', this._onEnter);
      container.addEventListener('pointerleave', this._onLeave);
      container.addEventListener('click', this._onClick);
      container.addEventListener('pointerdown', this._onDown);
      container.addEventListener('pointermove', this._onMove);
      container.addEventListener('pointerup', this._onUp);
      container.addEventListener('pointercancel', this._onUp);

      this.observer =
        typeof IntersectionObserver === 'undefined'
          ? null
          : new IntersectionObserver(
              entries => {
                const entry = entries[entries.length - 1];
                this.visible = entry.isIntersecting;
                if (this.visible) this._wake();
                if (this.options.trigger !== 'scroll') return;
                if (entry.intersectionRatio >= 0.3) {
                  if (this.armed) {
                    this.armed = false;
                    this.fall();
                  }
                } else if (this.phase === 'idle') {
                  this.armed = true;
                }
              },
              { threshold: [0, 0.3] }
            );
      this.observer?.observe(container);

      this.resizeObserver = new ResizeObserver(() => {
        if (this.phase === 'falling') {
          this._placeWalls();
          this._wake();
        }
      });
      this.resizeObserver.observe(container);

      if (this.options.trigger === 'auto') {
        const ready = document.fonts?.ready ?? Promise.resolve();
        ready.then(() => {
          if (!this.destroyed) {
            requestAnimationFrame(() => !this.destroyed && this.fall());
          }
        });
      }
    }

    destroy() {
      this.destroyed = true;
      this.reset(false);
      this.observer?.disconnect();
      this.resizeObserver?.disconnect();

      const container = this.container;
      container.removeEventListener('pointerenter', this._onEnter);
      container.removeEventListener('pointerleave', this._onLeave);
      container.removeEventListener('click', this._onClick);
      container.removeEventListener('pointerdown', this._onDown);
      container.removeEventListener('pointermove', this._onMove);
      container.removeEventListener('pointerup', this._onUp);
      container.removeEventListener('pointercancel', this._onUp);
    }
  }

  const FallingText = {
    init(container, options) {
      return new FallingTextInstance(container, options);
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = FallingText;
  } else {
    global.FallingText = FallingText;
  }
})(typeof window !== 'undefined' ? window : globalThis);
