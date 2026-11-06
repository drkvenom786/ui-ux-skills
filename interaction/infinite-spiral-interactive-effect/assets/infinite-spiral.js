/**
 * InfiniteSpiral.js - Standalone Vanilla JS 3D Cylindrical Spiral Gallery
 * Inspired by React Bits <InfiniteSpiral />
 * 
 * Features:
 * - 3D cylindrical helix layout with continuous circular wrap
 * - Multi-mode interaction (auto spin, pointer drag, page scroll, or hybrid)
 * - Perspective depth scaling, smoothstep edge fading, and distance blur
 * - Responsive auto-fitting and touch gesture support
 * - Zero dependencies (No React, Three.js or external animation libraries)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.InfiniteSpiral = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor;
  const smoothstep = (min, max, value) => {
    const x = clamp((value - min) / (max - min || 1), 0, 1);
    return x * x * (3 - 2 * x);
  };

  class InfiniteSpiral {
    constructor(container, options = {}) {
      if (!container) throw new Error('InfiniteSpiral: container element is required.');
      this.container = container;
      this.options = Object.assign(
        {
          items: [],
          speed: 0.55,
          direction: 'up',
          animationMode: 'auto',
          radius: 170,
          cardWidth: 100,
          cardHeight: 100,
          verticalSpacing: 60,
          perspective: 1000,
          cardsPerTurn: 7,
          rotation: 0,
          cardTilt: 0,
          cardRadius: 10,
          centerScale: 1.2,
          edgeFade: 0.3,
          edgeBlur: 6,
          pauseOnHover: true,
          imageFit: 'cover',
          grayscale: 0,
          className: ''
        },
        options
      );

      this.cardRefs = [];
      this.progress = 0;
      this.targetProgress = 0;
      this.autoSpeed = 0;
      this.hovered = false;
      this.visible = true;
      this.dragging = false;
      this.lastPointerY = 0;
      this.dragMoved = false;
      this.alive = true;
      this.frameId = 0;
      this.previousTime = performance.now();
      this.lastScrollY = window.scrollY;

      this.normalizeItems();
      this.initDOM();
      this.initObserversAndEvents();
      this.startRenderLoop();
    }

    static init(container, options) {
      return new InfiniteSpiral(container, options);
    }

    normalizeItems() {
      this.normalizedItems = this.options.items.map((item, index) =>
        typeof item === 'string'
          ? { src: item, alt: `Spiral image ${index + 1}` }
          : Object.assign({ alt: `Spiral image ${index + 1}` }, item)
      );
    }

    initDOM() {
      const o = this.options;
      const root = document.createElement('div');
      this.root = root;
      root.className = `infinite-spiral${o.className ? ` ${o.className}` : ''}`.trim();

      this.applyRootStyles();

      const stage = document.createElement('div');
      stage.className = 'infinite-spiral__stage';
      stage.setAttribute('role', 'list');
      stage.setAttribute('aria-label', 'Infinite spiral gallery');

      this.cardRefs = [];
      this.normalizedItems.forEach((item, index) => {
        const card = item.href ? document.createElement('a') : document.createElement('div');
        card.className = 'infinite-spiral__item';
        card.style.width = `${o.cardWidth}px`;
        card.style.height = `${o.cardHeight}px`;
        card.style.borderRadius = `${o.cardRadius}px`;

        if (item.href) {
          card.href = item.href;
          if (item.target) card.target = item.target;
          if (item.target === '_blank') card.rel = 'noreferrer';
        }

        card.setAttribute('role', 'listitem');
        card.setAttribute('aria-label', item.label || item.alt);

        const img = document.createElement('img');
        img.className = 'infinite-spiral__image';
        img.src = item.src;
        img.alt = item.alt;
        img.loading = index < 6 ? 'eager' : 'lazy';
        img.draggable = false;
        img.style.width = `${o.cardWidth}px`;
        img.style.height = `${o.cardHeight}px`;
        img.style.maxWidth = 'none';
        img.style.maxHeight = 'none';
        img.style.objectFit = o.imageFit;
        img.style.filter = `grayscale(${Math.min(1, Math.max(0, o.grayscale))})`;

        card.appendChild(img);
        stage.appendChild(card);
        this.cardRefs.push(card);
      });

      root.appendChild(stage);
      this.container.appendChild(root);
      this.stage = stage;
      this.bounds = root.getBoundingClientRect();
    }

    applyRootStyles() {
      const o = this.options;
      const root = this.root;
      const dragEnabled = o.animationMode === 'drag' || o.animationMode === 'all';

      root.style.perspective = `${o.perspective}px`;
      root.style.setProperty('--infinite-spiral-card-width', `${o.cardWidth}px`);
      root.style.setProperty('--infinite-spiral-card-height', `${o.cardHeight}px`);
      root.style.setProperty('--infinite-spiral-card-radius', `${o.cardRadius}px`);
      root.style.cursor = dragEnabled ? 'grab' : 'default';
      root.style.touchAction = dragEnabled ? 'pan-x' : 'auto';
      root.style.userSelect = dragEnabled ? 'none' : 'auto';
    }

    initObserversAndEvents() {
      const root = this.root;
      const o = this.options;

      this.resizeObserver = new ResizeObserver(() => {
        if (!this.alive) return;
        this.bounds = root.getBoundingClientRect();
      });
      this.resizeObserver.observe(root);

      this.intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          this.visible = entry.isIntersecting;
        },
        { threshold: 0.02 }
      );
      this.intersectionObserver.observe(root);

      this.onScroll = () => {
        const scrollEnabled = o.animationMode === 'scroll' || o.animationMode === 'all';
        const nextScrollY = window.scrollY;
        const scrollDelta = nextScrollY - this.lastScrollY;
        this.lastScrollY = nextScrollY;

        if (!scrollEnabled || !this.visible || scrollDelta === 0) return;
        const scrollSpeedMultiplier = Math.max(o.speed, 0) / 0.55;
        this.targetProgress += clamp(
          (scrollDelta * scrollSpeedMultiplier) / Math.max(o.verticalSpacing * 2, 1),
          -1.5,
          1.5
        );
      };
      window.addEventListener('scroll', this.onScroll, { passive: true });

      // Hover
      root.addEventListener('mouseenter', () => {
        this.hovered = true;
      });
      root.addEventListener('mouseleave', () => {
        this.hovered = false;
      });

      // Pointer Drag
      this.dragEnabled = o.animationMode === 'drag' || o.animationMode === 'all';

      this.onPointerDown = event => {
        if (!this.dragEnabled || event.button !== 0) return;
        this.dragging = true;
        this.dragMoved = false;
        this.lastPointerY = event.clientY;
        this.targetProgress = this.progress;
        try {
          root.setPointerCapture(event.pointerId);
        } catch {}
        root.style.cursor = 'grabbing';
      };

      this.onPointerMove = event => {
        if (!this.dragging) return;
        const pointerDelta = event.clientY - this.lastPointerY;
        this.lastPointerY = event.clientY;
        if (Math.abs(pointerDelta) > 0.5) this.dragMoved = true;
        this.targetProgress -= pointerDelta / Math.max(this.options.verticalSpacing, 1);
      };

      this.stopDragging = event => {
        if (!this.dragging) return;
        this.dragging = false;
        try {
          if (root.hasPointerCapture(event.pointerId)) {
            root.releasePointerCapture(event.pointerId);
          }
        } catch {}
        root.style.cursor = this.dragEnabled ? 'grab' : 'default';
      };

      root.addEventListener('pointerdown', this.onPointerDown);
      root.addEventListener('pointermove', this.onPointerMove);
      root.addEventListener('pointerup', this.stopDragging);
      root.addEventListener('pointercancel', this.stopDragging);

      root.addEventListener(
        'click',
        event => {
          if (!this.dragMoved) return;
          event.preventDefault();
          event.stopPropagation();
          this.dragMoved = false;
        },
        true
      );
    }

    startRenderLoop() {
      const render = time => {
        if (!this.alive) return;
        const delta = Math.min((time - this.previousTime) / 1000, 0.05);
        this.previousTime = time;

        const o = this.options;
        const count = this.normalizedItems.length;

        if (count > 0) {
          const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
          const autoEnabled = o.animationMode === 'auto' || o.animationMode === 'all';
          const motionPaused = this.dragging || (o.pauseOnHover && this.hovered);
          const directionMultiplier = o.direction === 'down' ? -1 : 1;
          const desiredAutoSpeed =
            autoEnabled && this.visible && !reducedMotion && !motionPaused ? o.speed * directionMultiplier : 0;

          const speedBlend = 1 - Math.exp(-delta * 7);
          this.autoSpeed += (desiredAutoSpeed - this.autoSpeed) * speedBlend;
          this.targetProgress += this.autoSpeed * delta;

          const followBlend = 1 - Math.exp(-delta * (this.dragging ? 22 : 11));
          this.progress += (this.targetProgress - this.progress) * followBlend;

          const half = count / 2;
          const bounds = this.bounds || this.root.getBoundingClientRect();
          const width = Math.max(bounds.width, 1);
          const height = Math.max(bounds.height, 1);
          const fit = Math.min(1, width / (o.cardWidth * 2.8), height / (o.cardHeight * 2.35));
          const responsiveRadius = Math.min(o.radius, Math.max(72, width * 0.36)) * fit;
          const fadeStart = clamp(1 - o.edgeFade, 0, 0.98);
          const turnSize = Math.max(o.cardsPerTurn, 1);

          this.cardRefs.forEach((card, index) => {
            if (!card) return;
            let offset = index - this.progress;
            offset = modulo(offset + half, count) - half;

            const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1);
            const opacity = 1 - smoothstep(fadeStart, 1, edge);
            const focus = 1 - Math.min(Math.abs(offset) / Math.max(turnSize * 0.65, 1), 1);
            const scale = (1 + (o.centerScale - 1) * focus) * fit;
            const angle = offset * (360 / turnSize) + o.rotation;
            const angleRadians = (angle * Math.PI) / 180;
            const x = Math.sin(angleRadians) * responsiveRadius;
            const z = Math.cos(angleRadians) * responsiveRadius;
            const depthScale = clamp(o.perspective / Math.max(o.perspective - z, 1), 0.72, 1.45);
            const visualScale = scale * depthScale;
            const depth = (z / Math.max(responsiveRadius, 1) + 1) / 2;
            const blur = o.edgeBlur * smoothstep(0.35, 1, edge);

            card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${(
              offset *
              o.verticalSpacing *
              fit
            ).toFixed(2)}px, 0) rotateZ(${o.cardTilt}deg) scale(${visualScale.toFixed(3)})`;
            card.style.opacity = opacity.toFixed(3);
            card.style.filter = blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : 'none';
            card.style.zIndex = String(Math.round(depth * 100000) + index);
            card.style.pointerEvents = opacity > 0.25 ? 'auto' : 'none';
          });
        }

        this.frameId = requestAnimationFrame(render);
      };

      this.frameId = requestAnimationFrame(render);
    }

    update(newOptions = {}) {
      Object.assign(this.options, newOptions);
      if (newOptions.items) {
        this.normalizeItems();
        this.stage.innerHTML = '';
        this.initDOM();
      }
      this.applyRootStyles();
    }

    setProgress(progress) {
      this.progress = progress;
      this.targetProgress = progress;
    }

    destroy() {
      this.alive = false;
      cancelAnimationFrame(this.frameId);
      this.resizeObserver?.disconnect();
      this.intersectionObserver?.disconnect();
      window.removeEventListener('scroll', this.onScroll);
      this.root.remove();
    }
  }

  return InfiniteSpiral;
});
