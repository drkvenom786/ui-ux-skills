/**
 * PillNav - Interactive Floating Pill Navbar Engine (Vanilla JS)
 * Inspired by React Bits <PillNav />
 * Zero external dependencies - pure CSS & Web Animations API
 */
(function (global) {
  'use strict';

  const THEMES = {
    dark: {
      '--pn-surface': 'rgba(38, 35, 46, 0.66)',
      '--pn-solid': '#26232e',
      '--pn-edge': 'rgba(255, 255, 255, 0.08)',
      '--pn-rim': 'rgba(255, 255, 255, 0.07)',
      '--pn-shadow': '0 22px 44px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)',
      '--pn-text': 'rgba(244, 244, 245, 0.64)',
      '--pn-strong': '#f4f4f5',
      '--pn-pill': 'linear-gradient(180deg, #ffffff 0%, #ebebf0 100%)',
      '--pn-pill-ink': '#121016',
      '--pn-pill-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 6px 16px -6px rgba(0, 0, 0, 0.6)',
      '--pn-dot': '#f4f4f5',
      '--pn-ring': 'rgba(244, 244, 245, 0.55)',
      '--pn-row-hover': 'rgba(255, 255, 255, 0.06)',
      '--pn-tile': 'linear-gradient(180deg, #3a3644 0%, #27242f 100%)',
      '--pn-tile-rim':
        'inset 0 0 0 1px rgba(255, 255, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 10px -4px rgba(0, 0, 0, 0.7)'
    },
    light: {
      '--pn-surface': 'rgba(240, 240, 243, 0.8)',
      '--pn-solid': '#f0f0f3',
      '--pn-edge': 'rgba(24, 24, 27, 0.07)',
      '--pn-rim': 'rgba(255, 255, 255, 0.95)',
      '--pn-shadow': '0 22px 44px -22px rgba(24, 24, 27, 0.3), 0 6px 16px -10px rgba(24, 24, 27, 0.16)',
      '--pn-text': 'rgba(24, 24, 27, 0.6)',
      '--pn-strong': '#18181b',
      '--pn-pill': 'linear-gradient(180deg, #2c2c31 0%, #18181b 100%)',
      '--pn-pill-ink': '#ffffff',
      '--pn-pill-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 6px 14px -6px rgba(24, 24, 27, 0.45)',
      '--pn-dot': '#18181b',
      '--pn-ring': 'rgba(24, 24, 27, 0.45)',
      '--pn-row-hover': 'rgba(24, 24, 27, 0.05)',
      '--pn-tile': 'linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)',
      '--pn-tile-rim':
        'inset 0 0 0 1px rgba(24, 24, 27, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 10px -5px rgba(24, 24, 27, 0.25)'
    }
  };

  const SIZES = {
    sm: {
      '--pn-h': '36px',
      '--pn-pad': '3px',
      '--pn-inner': '30px',
      '--pn-x': '12px',
      '--pn-font': '13px',
      '--pn-gap': '6px',
      '--pn-mark': '18px'
    },
    md: {
      '--pn-h': '44px',
      '--pn-pad': '4px',
      '--pn-inner': '36px',
      '--pn-x': '16px',
      '--pn-font': '14px',
      '--pn-gap': '8px',
      '--pn-mark': '22px'
    },
    lg: {
      '--pn-h': '52px',
      '--pn-pad': '5px',
      '--pn-inner': '42px',
      '--pn-x': '20px',
      '--pn-font': '15px',
      '--pn-gap': '10px',
      '--pn-mark': '26px'
    }
  };

  const DEFAULT_ITEMS = [
    { label: 'Home', href: '#' },
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ];

  const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const contrastInk = color => {
    const hex = String(color || '')
      .trim()
      .replace('#', '');
    if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return null;
    const full =
      hex.length === 3
        ? hex
            .split('')
            .map(c => c + c)
            .join('')
        : hex;
    const channel = index => {
      const value = parseInt(full.slice(index, index + 2), 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };
    const luminance = 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
    return luminance > 0.36 ? '#121016' : '#ffffff';
  };

  const readVar = (element, name) => parseFloat(getComputedStyle(element).getPropertyValue(name)) || 0;

  class PillNavInstance {
    constructor(container, options = {}) {
      if (typeof container === 'string') {
        container = document.querySelector(container);
      }
      if (!container) {
        throw new Error('[PillNav] Container element not found.');
      }
      this.container = container;
      this.options = {
        logo: null,
        logoAlt: 'Logo',
        logoHref: '#',
        items: DEFAULT_ITEMS,
        activeHref: undefined,
        defaultActiveIndex: 0,
        theme: 'dark',
        layout: 'split',
        size: 'md',
        surface: 'glass',
        itemStyle: 'pill',
        hoverEffect: 'fill',
        indicator: 'dot',
        highlightColor: null,
        highlightTextColor: null,
        barColor: null,
        textColor: null,
        bounce: 0.3,
        stretch: 0.5,
        intro: true,
        collapse: 'auto',
        onItemClick: null,
        onMenuToggle: null,
        ariaLabel: 'Main',
        className: '',
        style: {},
        ...options
      };

      this.controlled = this.options.activeHref !== undefined;
      this.selectedIndex = this.controlled
        ? this.options.items.findIndex(item => item.href === this.options.activeHref)
        : this.options.defaultActiveIndex || 0;

      this.collapsed = this.options.collapse === 'always';
      this.open = false;
      this.panelShown = false;

      this._init();
    }

    _sanitizeVars() {
      const opts = this.options;
      const palette = THEMES[opts.theme] ?? THEMES.dark;
      const vars = { ...palette, ...(SIZES[opts.size] ?? SIZES.md) };
      if (opts.surface === 'glass') vars['--pn-blur'] = 'blur(20px) saturate(1.6)';
      if (opts.surface === 'solid') {
        vars['--pn-surface'] = palette['--pn-solid'];
        vars['--pn-blur'] = 'none';
      }
      if (opts.surface === 'none') {
        vars['--pn-surface'] = 'transparent';
        vars['--pn-shadow'] = 'none';
        vars['--pn-blur'] = 'none';
        vars['--pn-edge'] = 'transparent';
        vars['--pn-rim'] = 'transparent';
      }
      if (opts.barColor) {
        vars['--pn-surface'] = opts.barColor;
        vars['--pn-solid'] = opts.barColor;
      }
      if (opts.textColor) {
        vars['--pn-strong'] = opts.textColor;
        vars['--pn-text'] = `color-mix(in srgb, ${opts.textColor} 64%, transparent)`;
      }
      if (opts.highlightColor) {
        vars['--pn-pill'] = opts.highlightColor;
        vars['--pn-dot'] = opts.highlightColor;
        vars['--pn-pill-shadow'] = 'inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 6px 16px -6px rgba(0, 0, 0, 0.45)';
        vars['--pn-pill-ink'] = opts.highlightTextColor || contrastInk(opts.highlightColor) || palette['--pn-pill-ink'];
      } else if (opts.highlightTextColor) {
        vars['--pn-pill-ink'] = opts.highlightTextColor;
      }
      return vars;
    }

    _init() {
      const opts = this.options;
      const root = this.container;
      const joined = opts.layout === 'joined';

      root.className = `pill-nav ${joined ? 'pill-nav__surface' : ''} ${opts.className || ''}`.trim();
      root.setAttribute('data-layout', opts.layout);
      root.setAttribute('data-items', opts.itemStyle);
      if (this.collapsed) root.setAttribute('data-collapsed', '');
      root.setAttribute('aria-label', opts.ariaLabel || 'Main');

      const vars = this._sanitizeVars();
      Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
      if (opts.style) Object.assign(root.style, opts.style);

      root.innerHTML = '';

      if (opts.logo) {
        const logoSpan = document.createElement('span');
        logoSpan.className = `pill-nav__logo ${joined ? '' : 'pill-nav__surface'}`.trim();

        const logoLink = document.createElement('a');
        logoLink.href = opts.logoHref || '#';
        logoLink.className = 'pill-nav__logo-link';
        logoLink.setAttribute('aria-label', opts.logoAlt || 'Logo');

        const mark = document.createElement('span');
        mark.className = 'pill-nav__mark';
        if (typeof opts.logo === 'string') {
          const img = document.createElement('img');
          img.src = opts.logo;
          img.alt = '';
          img.draggable = false;
          mark.appendChild(img);
        } else if (opts.logo instanceof Node) {
          mark.appendChild(opts.logo.cloneNode(true));
        }
        logoLink.appendChild(mark);
        logoSpan.appendChild(logoLink);

        if (!joined) {
          const rim = document.createElement('span');
          rim.className = 'pill-nav__rim';
          logoSpan.appendChild(rim);
        }

        logoLink.addEventListener('pointerenter', e => {
          if (e.pointerType === 'touch' || mark.getAnimations().length) return;
          mark.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], {
            duration: 900,
            easing: 'cubic-bezier(0.65, 0, 0.25, 1)'
          });
        });

        root.appendChild(logoSpan);
        this.logoSpan = logoSpan;
      }

      const bar = document.createElement('div');
      bar.className = `pill-nav__bar ${joined ? '' : 'pill-nav__surface'}`.trim();
      this.bar = bar;

      const track = document.createElement('div');
      track.className = 'pill-nav__track';
      bar.appendChild(track);
      this.track = track;

      const list = document.createElement('ul');
      list.className = 'pill-nav__list';
      track.appendChild(list);
      this.list = list;

      const fill = opts.hoverEffect === 'fill';
      const glide = !fill && (opts.hoverEffect === 'glide' || opts.indicator === 'pill');

      let glideEl = null;
      let inkEl = null;
      if (glide) {
        glideEl = document.createElement('span');
        glideEl.className = 'pill-nav__glide';
        glideEl.setAttribute('aria-hidden', 'true');
        track.appendChild(glideEl);
        this.glideEl = glideEl;

        inkEl = document.createElement('div');
        inkEl.className = 'pill-nav__ink';
        inkEl.setAttribute('aria-hidden', 'true');
        track.appendChild(inkEl);
        this.inkEl = inkEl;
      }

      let dotEl = null;
      if (opts.indicator === 'dot') {
        dotEl = document.createElement('span');
        dotEl.className = 'pill-nav__dot';
        dotEl.setAttribute('aria-hidden', 'true');
        track.appendChild(dotEl);
        this.dotEl = dotEl;
      }

      if (!joined) {
        const rim = document.createElement('span');
        rim.className = 'pill-nav__rim';
        bar.appendChild(rim);
      }
      root.appendChild(bar);

      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = `pill-nav__toggle ${joined ? 'pill-nav__toggle--bare' : 'pill-nav__surface'}`.trim();
      toggleBtn.setAttribute('aria-label', 'Open menu');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML = `
        <span class="pill-nav__burger" aria-hidden="true">
          <span class="pill-nav__line pill-nav__line--top"></span>
          <span class="pill-nav__line pill-nav__line--bottom"></span>
        </span>
      `;
      if (!joined) {
        const rim = document.createElement('span');
        rim.className = 'pill-nav__rim';
        toggleBtn.appendChild(rim);
      }
      this.toggleBtn = toggleBtn;
      toggleBtn.addEventListener('click', () => this.toggleMenu());
      root.appendChild(toggleBtn);

      const panel = document.createElement('div');
      panel.className = 'pill-nav__panel pill-nav__surface';
      panel.style.display = 'none';
      const menu = document.createElement('ul');
      menu.className = 'pill-nav__menu';
      panel.appendChild(menu);
      const panelRim = document.createElement('span');
      panelRim.className = 'pill-nav__rim';
      panel.appendChild(panelRim);
      this.panel = panel;
      this.menu = menu;
      root.appendChild(panel);

      const measureEl = document.createElement('div');
      measureEl.className = 'pill-nav__measure';
      measureEl.setAttribute('aria-hidden', 'true');
      const measureList = document.createElement('div');
      measureList.className = 'pill-nav__list';
      measureEl.appendChild(measureList);
      this.measureEl = measureEl;
      this.measureList = measureList;
      root.appendChild(measureEl);

      if (joined) {
        const rootRim = document.createElement('span');
        rootRim.className = 'pill-nav__rim pill-nav__rim--root';
        root.appendChild(rootRim);
      }

      this._renderItems();
      this._initSpringPhysics();
      this._initAutoCollapse();
    }

    _renderItems() {
      const opts = this.options;
      const fill = opts.hoverEffect === 'fill';
      const glide = !fill && (opts.hoverEffect === 'glide' || opts.indicator === 'pill');
      const cur = this.selectedIndex;

      this.list.innerHTML = '';
      if (this.inkEl) this.inkEl.innerHTML = '';
      this.measureList.innerHTML = '';
      this.menu.innerHTML = '';
      this.slotRefs = [];

      opts.items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'pill-nav__slot';
        if (fill && opts.indicator === 'pill' && index === cur) {
          li.setAttribute('data-on', '');
        }

        let link;
        if (item.href && item.href !== '#') {
          link = document.createElement('a');
          link.href = item.href;
        } else {
          link = document.createElement('button');
          link.type = 'button';
        }
        link.className = 'pill-nav__item';
        if (index === cur) link.setAttribute('aria-current', 'page');
        if (item.ariaLabel) link.setAttribute('aria-label', item.ariaLabel);

        let faceHTML = '';
        if (item.icon) faceHTML += item.icon;
        if (item.label) faceHTML += item.label;

        let innerHTML = '';
        if (fill) innerHTML += '<span class="pill-nav__fill" aria-hidden="true"></span>';
        innerHTML += `<span class="pill-nav__face">${faceHTML}</span>`;
        if (fill) innerHTML += `<span class="pill-nav__face-alt" aria-hidden="true">${faceHTML}</span>`;
        link.innerHTML = innerHTML;

        link.addEventListener('click', e => {
          if (!item.href || item.href === '#') e.preventDefault();
          this.select(index, e);
        });

        li.appendChild(link);
        this.list.appendChild(li);
        this.slotRefs[index] = li;

        if (glide && this.inkEl) {
          const inkItem = document.createElement('span');
          inkItem.className = 'pill-nav__ink-item';
          inkItem.innerHTML = faceHTML;
          this.inkEl.appendChild(inkItem);
        }

        const measureItem = document.createElement('span');
        measureItem.className = 'pill-nav__ink-item';
        measureItem.innerHTML = faceHTML;
        this.measureList.appendChild(measureItem);

        const rowLi = document.createElement('li');
        let rowLink;
        if (item.href && item.href !== '#') {
          rowLink = document.createElement('a');
          rowLink.href = item.href;
        } else {
          rowLink = document.createElement('button');
          rowLink.type = 'button';
        }
        rowLink.className = 'pill-nav__row';
        if (index === cur) rowLink.setAttribute('aria-current', 'page');
        rowLink.innerHTML = faceHTML;
        rowLink.addEventListener('click', e => {
          if (!item.href || item.href === '#') e.preventDefault();
          this.select(index, e);
          this.toggleMenu(false);
        });
        rowLi.appendChild(rowLink);
        this.menu.appendChild(rowLi);
      });
    }

    _initSpringPhysics() {
      const root = this.container;
      const opts = this.options;
      const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

      const state = {
        x0: 0,
        x1: 0,
        v0: 0,
        v1: 0,
        alpha: 0,
        pop: 1,
        press: 1,
        pressVelocity: 0,
        dotX: 0,
        dotVelocity: 0,
        dotAlpha: 0,
        hover: -1,
        focus: false,
        sliding: false,
        pressing: false,
        waiting: false
      };

      const rects = [];
      let trackWidth = 0;
      let trackHeight = 0;
      let raf = 0;
      let last = 0;

      const measure = () => {
        if (!this.track) return;
        trackWidth = this.track.offsetWidth;
        trackHeight = this.track.offsetHeight;
        this.slotRefs.forEach((slot, index) => {
          if (!slot) return;
          rects[index] = { left: slot.offsetLeft, width: slot.offsetWidth };
          const reach = Math.ceil(2 * Math.sqrt((slot.offsetWidth / 2) ** 2 + slot.offsetHeight ** 2)) + 2;
          slot.style.setProperty('--pn-fill', `${reach}px`);
        });
      };

      const glideIndex = () => {
        if (opts.hoverEffect === 'fill') return -1;
        if (opts.hoverEffect === 'glide' && state.hover >= 0) return state.hover;
        return opts.indicator === 'pill' ? this.selectedIndex : -1;
      };

      const sync = () => {
        this.slotRefs.forEach((slot, index) => {
          if (!slot) return;
          const hovered = state.hover === index;
          slot.toggleAttribute('data-lit', hovered);
          slot.toggleAttribute('data-hover', hovered && opts.hoverEffect === 'fill');
        });
        root.toggleAttribute('data-focus', state.focus && state.hover >= 0);
        root.toggleAttribute(
          'data-dot-lit',
          opts.hoverEffect === 'fill' && state.hover >= 0 && state.hover === this.selectedIndex
        );
      };

      const render = () => {
        const width = Math.max(0, state.x1 - state.x0);
        const scale = state.press * state.pop;
        const target = rects[glideIndex()];
        const squash = target ? 1 - clamp((width / Math.max(target.width, 1) - 1) * 0.3, 0, 0.14) : 1;
        if (this.glideEl) {
          this.glideEl.style.width = `${width}px`;
          this.glideEl.style.transform = `translate3d(${state.x0}px, 0, 0) scale(${scale}, ${scale * squash})`;
          this.glideEl.style.opacity = `${state.alpha}`;
        }
        if (this.inkEl) {
          const half = (width * scale) / 2;
          const center = (state.x0 + state.x1) / 2;
          const inset = (trackHeight * (1 - scale * squash)) / 2;
          this.inkEl.style.clipPath = `inset(${inset}px ${trackWidth - center - half}px ${inset}px ${center - half}px round ${trackHeight / 2}px)`;
          this.inkEl.style.opacity = `${state.alpha}`;
        }
        if (this.dotEl) {
          const pull = clamp(Math.abs(state.dotVelocity) / 700, 0, 2.2);
          this.dotEl.style.transform = `translate3d(${state.dotX}px, 0, 0) scaleX(${1 + pull})`;
          this.dotEl.style.opacity = `${state.dotAlpha}`;
        }
      };

      const tick = now => {
        raf = 0;
        const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
        last = now;
        const index = glideIndex();
        const target = rects[index];
        const zeta = 1 - 0.55 * clamp(opts.bounce ?? 0.3, 0, 1);
        const base = 520;
        let busy = false;

        if (target && !state.waiting) {
          const t0 = target.left;
          const t1 = target.left + target.width;
          if (state.alpha < 0.02 && !state.sliding) {
            state.x0 = t0;
            state.x1 = t1;
            state.v0 = 0;
            state.v1 = 0;
            state.pop = 0.9;
          }
          if (reduce) {
            state.x0 = t0;
            state.x1 = t1;
            state.v0 = 0;
            state.v1 = 0;
          } else {
            const direction = Math.sign((t0 + t1) / 2 - (state.x0 + state.x1) / 2);
            const lead = base * (1 + 0.9 * clamp(opts.stretch ?? 0.5, 0, 1));
            const trail = base * (1 - 0.5 * clamp(opts.stretch ?? 0.5, 0, 1));
            const k0 = direction < 0 ? lead : direction > 0 ? trail : base;
            const k1 = direction > 0 ? lead : direction < 0 ? trail : base;
            const steps = Math.ceil(dt / (1 / 240));
            const h = dt / steps;
            for (let i = 0; i < steps; i++) {
              state.v0 += (-k0 * (state.x0 - t0) - 2 * zeta * Math.sqrt(k0) * state.v0) * h;
              state.x0 += state.v0 * h;
              state.v1 += (-k1 * (state.x1 - t1) - 2 * zeta * Math.sqrt(k1) * state.v1) * h;
              state.x1 += state.v1 * h;
            }
          }
          state.alpha += (1 - state.alpha) * (reduce ? 1 : 1 - Math.exp(-dt / 0.06));
          busy =
            Math.abs(state.x0 - t0) > 0.05 ||
            Math.abs(state.x1 - t1) > 0.05 ||
            Math.abs(state.v0) > 0.5 ||
            Math.abs(state.v1) > 0.5 ||
            state.alpha < 0.999;
          if (!busy) state.sliding = false;
        } else {
          state.alpha += (0 - state.alpha) * (reduce ? 1 : 1 - Math.exp(-dt / 0.07));
          if (state.alpha > 0.002) busy = true;
          else state.alpha = 0;
        }

        state.pop += (1 - state.pop) * (reduce ? 1 : 1 - Math.exp(-dt / 0.09));
        if (Math.abs(1 - state.pop) > 0.001) busy = true;

        const pressTarget = state.pressing ? 0.95 : 1;
        if (reduce) {
          state.press = pressTarget;
          state.pressVelocity = 0;
        } else {
          state.pressVelocity += (-700 * (state.press - pressTarget) - 30 * state.pressVelocity) * dt;
          state.press += state.pressVelocity * dt;
        }
        if (Math.abs(state.press - pressTarget) > 0.0005 || Math.abs(state.pressVelocity) > 0.01) busy = true;

        const dotTarget = opts.indicator === 'dot' ? rects[this.selectedIndex] : null;
        if (dotTarget && !state.waiting) {
          const center = dotTarget.left + dotTarget.width / 2;
          if (state.dotAlpha < 0.02) {
            state.dotX = center;
            state.dotVelocity = 0;
          }
          if (reduce) {
            state.dotX = center;
            state.dotVelocity = 0;
          } else {
            const k = 360;
            const steps = Math.ceil(dt / (1 / 240));
            const h = dt / steps;
            for (let i = 0; i < steps; i++) {
              state.dotVelocity +=
                (-k * (state.dotX - center) - 2 * (1 - 0.5 * clamp(opts.bounce ?? 0.3, 0, 1)) * Math.sqrt(k) * state.dotVelocity) * h;
              state.dotX += state.dotVelocity * h;
            }
          }
          state.dotAlpha += (1 - state.dotAlpha) * (reduce ? 1 : 1 - Math.exp(-dt / 0.1));
          if (Math.abs(state.dotX - center) > 0.05 || Math.abs(state.dotVelocity) > 0.5 || state.dotAlpha < 0.999)
            busy = true;
        } else {
          state.dotAlpha += (0 - state.dotAlpha) * (reduce ? 1 : 1 - Math.exp(-dt / 0.1));
          if (state.dotAlpha > 0.002) busy = true;
          else state.dotAlpha = 0;
        }

        render();
        if (busy) raf = requestAnimationFrame(tick);
      };

      const wake = () => {
        if (!raf) {
          last = 0;
          raf = requestAnimationFrame(tick);
        }
      };

      this.slotRefs.forEach((slot, index) => {
        slot.addEventListener('pointerenter', e => {
          if (e.pointerType === 'touch') return;
          state.hover = index;
          state.focus = false;
          sync();
          wake();
        });
        slot.addEventListener('pointerdown', e => {
          if (e && e.button > 0) return;
          state.pressing = true;
          wake();
        });
        slot.addEventListener('focusin', e => {
          const visible = e.target instanceof Element && e.target.matches(':focus-visible');
          state.focus = visible;
          state.hover = visible ? index : state.hover;
          sync();
          wake();
        });
        slot.addEventListener('focusout', () => {
          state.focus = false;
          state.hover = -1;
          sync();
          wake();
        });
      });

      this.track.addEventListener('pointerleave', () => {
        if (state.focus) return;
        state.hover = -1;
        sync();
        wake();
      });

      window.addEventListener('pointerup', () => {
        state.pressing = false;
        wake();
      });
      window.addEventListener('pointercancel', () => {
        state.pressing = false;
        wake();
      });

      this.physicsEngine = {
        refresh: () => {
          measure();
          sync();
          render();
          wake();
        }
      };

      measure();
      sync();
      render();
      wake();
    }

    _initAutoCollapse() {
      const root = this.container;
      const opts = this.options;
      const joined = opts.layout === 'joined';
      const hasLogo = Boolean(opts.logo);

      const evaluate = () => {
        if (opts.collapse === 'always' || opts.collapse === 'never') {
          this.setCollapsed(opts.collapse === 'always');
          return;
        }
        const parent = root.parentElement;
        if (!parent) return;
        const styles = getComputedStyle(parent);
        const available =
          parent.clientWidth - (parseFloat(styles.paddingLeft) || 0) - (parseFloat(styles.paddingRight) || 0);
        const listWidth = this.measureList?.offsetWidth ?? 0;
        const height = readVar(root, '--pn-h');
        const pad = readVar(root, '--pn-pad');
        const gap = readVar(root, '--pn-gap');
        const inner = readVar(root, '--pn-inner');
        const need = joined
          ? pad * 2 + (hasLogo ? inner + 2 : 0) + listWidth
          : (hasLogo ? height + gap : 0) + listWidth + pad * 2;
        const next = need > available + 0.5;
        this.setCollapsed(next);
      };

      evaluate();
      this.collapseObserver = new ResizeObserver(evaluate);
      if (root.parentElement) this.collapseObserver.observe(root.parentElement);
      if (this.measureEl) this.collapseObserver.observe(this.measureEl);
    }

    setCollapsed(collapsed) {
      if (this.collapsed === collapsed) return;
      this.collapsed = collapsed;
      if (collapsed) {
        this.container.setAttribute('data-collapsed', '');
        this.toggleMenu(false);
      } else {
        this.container.removeAttribute('data-collapsed');
        this.toggleMenu(false);
      }
      this.physicsEngine?.refresh();
    }

    toggleMenu(open) {
      const next = open !== undefined ? open : !this.open;
      this.open = next;
      this.toggleBtn?.setAttribute('aria-expanded', String(next));
      this.toggleBtn?.setAttribute('aria-label', next ? 'Close menu' : 'Open menu');

      if (next) {
        this.container.setAttribute('data-open', '');
        this.container.setAttribute('data-panel', '');
        this.panel.style.display = 'block';
        const height = this.panel.offsetHeight;
        const width = this.panel.offsetWidth;
        const header = this.container.offsetHeight;
        const start = `inset(0px 0px ${Math.max(0, height - header)}px 0px round ${header / 2}px)`;
        const end = 'inset(0px 0px 0px 0px round 24px)';
        this.panel.animate([{ clipPath: start }, { clipPath: end }], { duration: 560, easing: EASE_OUT });
      } else {
        this.container.removeAttribute('data-open');
        this.container.removeAttribute('data-panel');
        const height = this.panel.offsetHeight;
        const header = this.container.offsetHeight;
        const start = 'inset(0px 0px 0px 0px round 24px)';
        const end = `inset(0px 0px ${Math.max(0, height - header)}px 0px round ${header / 2}px)`;
        const anim = this.panel.animate([{ clipPath: start }, { clipPath: end }], {
          duration: 380,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        anim.onfinish = () => {
          if (!this.open) this.panel.style.display = 'none';
        };
      }

      if (typeof this.options.onMenuToggle === 'function') {
        this.options.onMenuToggle(next);
      }
    }

    select(index, event) {
      const items = this.options.items || DEFAULT_ITEMS;
      if (index < 0 || index >= items.length) return;

      this.selectedIndex = index;
      const fill = this.options.hoverEffect === 'fill';
      const indicator = this.options.indicator;

      this.slotRefs.forEach((slot, idx) => {
        const itemLink = slot.querySelector('.pill-nav__item');
        if (idx === index) {
          itemLink?.setAttribute('aria-current', 'page');
          if (fill && indicator === 'pill') slot.setAttribute('data-on', '');
        } else {
          itemLink?.removeAttribute('aria-current');
          slot.removeAttribute('data-on');
        }
      });

      this.menu.querySelectorAll('.pill-nav__row').forEach((row, idx) => {
        if (idx === index) row.setAttribute('aria-current', 'page');
        else row.removeAttribute('aria-current');
      });

      this.physicsEngine?.refresh();

      if (typeof this.options.onItemClick === 'function') {
        this.options.onItemClick(items[index], index, event);
      }
    }

    update(newOptions = {}) {
      Object.assign(this.options, newOptions);
      const vars = this._sanitizeVars();
      Object.entries(vars).forEach(([k, v]) => this.container.style.setProperty(k, v));
      this._renderItems();
      this.physicsEngine?.refresh();
    }

    destroy() {
      this.collapseObserver?.disconnect();
      this.container.innerHTML = '';
    }
  }

  const PillNav = {
    init(container, options) {
      return new PillNavInstance(container, options);
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PillNav;
  } else {
    global.PillNav = PillNav;
  }
})(typeof window !== 'undefined' ? window : globalThis);
