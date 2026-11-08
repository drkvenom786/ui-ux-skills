/**
 * StaggeredMenu Interactive Effect - Vanilla JavaScript + GSAP Engine
 * Staggered multi-layer sliding navigation menu with animated typography,
 * counter numbering, and spring-eased reveal choreography.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['gsap'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('gsap'));
  } else {
    root.StaggeredMenu = factory(root.gsap);
  }
})(typeof self !== 'undefined' ? self : this, function (gsap) {
  'use strict';

  var StaggeredMenu = {
    init: function (mountEl, options) {
      if (!mountEl) {
        console.error('[StaggeredMenu] Mount element is required');
        return null;
      }
      var gsapLib = gsap || (typeof window !== 'undefined' ? window.gsap : null);
      if (!gsapLib) {
        console.error('[StaggeredMenu] GSAP library is required but not found in scope or window.gsap');
        return null;
      }

      var opt = Object.assign({
        position: 'right',
        colors: ['#FF0055', '#9D4EDD', '#0e0a16'],
        panelBackground: '#0a0812',
        itemTextColor: '#ffffff',
        items: [],
        socialItems: [],
        displaySocials: true,
        displayItemNumbering: true,
        className: '',
        logoUrl: '',
        logoHtml: '',
        menuButtonColor: '#ffffff',
        openMenuButtonColor: '#00F5D4',
        accentColor: '#00F5D4',
        changeMenuColorOnOpen: true,
        isFixed: true,
        closeOnClickAway: true,
        onMenuOpen: null,
        onMenuClose: null,
        onItemClick: null
      }, options || {});

      var isOpen = false;
      var busy = false;
      var openTl = null;
      var closeTween = null;
      var spinTween = null;
      var textCycleAnim = null;
      var colorTween = null;

      // Build DOM Structure
      var wrapper = document.createElement('div');
      wrapper.className = 'staggered-menu-wrapper' + (opt.className ? ' ' + opt.className : '') + (opt.isFixed ? ' fixed-wrapper' : '');
      wrapper.setAttribute('data-position', opt.position);
      if (opt.accentColor) {
        wrapper.style.setProperty('--sm-accent', opt.accentColor);
      }
      if (opt.panelBackground) {
        wrapper.style.setProperty('--sm-panel-bg', opt.panelBackground);
      }
      if (opt.itemTextColor) {
        wrapper.style.setProperty('--sm-item-color', opt.itemTextColor);
      }

      // Prelayers container
      var preLayersContainer = document.createElement('div');
      preLayersContainer.className = 'sm-prelayers';
      preLayersContainer.setAttribute('aria-hidden', 'true');

      var rawColors = (opt.colors && opt.colors.length) ? opt.colors.slice(0, 4) : ['#FF0055', '#9D4EDD', '#0e0a16'];
      var arrColors = rawColors.slice();
      if (arrColors.length >= 3) {
        var mid = Math.floor(arrColors.length / 2);
        arrColors.splice(mid, 1);
      }
      var preLayerEls = [];
      arrColors.forEach(function (col) {
        var layer = document.createElement('div');
        layer.className = 'sm-prelayer';
        layer.style.background = col;
        preLayersContainer.appendChild(layer);
        preLayerEls.push(layer);
      });
      wrapper.appendChild(preLayersContainer);

      // Header
      var header = document.createElement('header');
      header.className = 'staggered-menu-header';
      header.setAttribute('aria-label', 'Main navigation header');

      var logoDiv = document.createElement('div');
      logoDiv.className = 'sm-logo';
      logoDiv.setAttribute('aria-label', 'Logo');

      if (opt.logoHtml) {
        logoDiv.innerHTML = opt.logoHtml;
      } else if (opt.logoUrl) {
        var logoImg = document.createElement('img');
        logoImg.src = opt.logoUrl;
        logoImg.alt = 'Logo';
        logoImg.className = 'sm-logo-img';
        logoImg.draggable = false;
        logoDiv.appendChild(logoImg);
      } else {
        logoDiv.innerHTML = '<span style="font-weight:800;letter-spacing:1px;font-size:1.1rem;color:#fff;">I TUBE</span>';
      }
      header.appendChild(logoDiv);

      // Toggle button
      var toggleBtn = document.createElement('button');
      toggleBtn.className = 'sm-toggle';
      toggleBtn.type = 'button';
      toggleBtn.setAttribute('aria-label', 'Open menu');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-controls', 'staggered-menu-panel');

      var textWrap = document.createElement('span');
      textWrap.className = 'sm-toggle-textWrap';
      textWrap.setAttribute('aria-hidden', 'true');

      var textInner = document.createElement('span');
      textInner.className = 'sm-toggle-textInner';
      textInner.innerHTML = '<span class="sm-toggle-line">Menu</span><span class="sm-toggle-line">Close</span>';
      textWrap.appendChild(textInner);
      toggleBtn.appendChild(textWrap);

      var iconSpan = document.createElement('span');
      iconSpan.className = 'sm-icon';
      iconSpan.setAttribute('aria-hidden', 'true');
      var plusH = document.createElement('span');
      plusH.className = 'sm-icon-line';
      var plusV = document.createElement('span');
      plusV.className = 'sm-icon-line sm-icon-line-v';
      iconSpan.appendChild(plusH);
      iconSpan.appendChild(plusV);
      toggleBtn.appendChild(iconSpan);

      header.appendChild(toggleBtn);
      wrapper.appendChild(header);

      // Panel
      var panel = document.createElement('aside');
      panel.id = 'staggered-menu-panel';
      panel.className = 'staggered-menu-panel';
      panel.setAttribute('aria-hidden', 'true');

      var panelInner = document.createElement('div');
      panelInner.className = 'sm-panel-inner';

      var ul = document.createElement('ul');
      ul.className = 'sm-panel-list';
      ul.setAttribute('role', 'list');
      if (opt.displayItemNumbering) {
        ul.setAttribute('data-numbering', 'true');
      }

      if (opt.items && opt.items.length) {
        opt.items.forEach(function (item, idx) {
          var li = document.createElement('li');
          li.className = 'sm-panel-itemWrap';
          var a = document.createElement('a');
          a.className = 'sm-panel-item';
          a.href = item.link || '#';
          if (item.ariaLabel) a.setAttribute('aria-label', item.ariaLabel);
          a.setAttribute('data-index', idx + 1);

          var labelSpan = document.createElement('span');
          labelSpan.className = 'sm-panel-itemLabel';
          labelSpan.textContent = item.label;
          a.appendChild(labelSpan);

          a.addEventListener('click', function (e) {
            if (typeof opt.onItemClick === 'function') {
              opt.onItemClick(item, e, idx);
            }
            closeMenu();
          });

          li.appendChild(a);
          ul.appendChild(li);
        });
      }
      panelInner.appendChild(ul);

      // Socials
      if (opt.displaySocials && opt.socialItems && opt.socialItems.length) {
        var socialsDiv = document.createElement('div');
        socialsDiv.className = 'sm-socials';
        socialsDiv.setAttribute('aria-label', 'Social links');

        var sTitle = document.createElement('h3');
        sTitle.className = 'sm-socials-title';
        sTitle.textContent = 'Socials';
        socialsDiv.appendChild(sTitle);

        var sUl = document.createElement('ul');
        sUl.className = 'sm-socials-list';
        sUl.setAttribute('role', 'list');

        opt.socialItems.forEach(function (s) {
          var sLi = document.createElement('li');
          sLi.className = 'sm-socials-item';
          var sA = document.createElement('a');
          sA.className = 'sm-socials-link';
          sA.href = s.link || '#';
          sA.target = '_blank';
          sA.rel = 'noopener noreferrer';
          sA.textContent = s.label;
          sLi.appendChild(sA);
          sUl.appendChild(sLi);
        });
        socialsDiv.appendChild(sUl);
        panelInner.appendChild(socialsDiv);
      }

      panel.appendChild(panelInner);
      wrapper.appendChild(panel);

      mountEl.appendChild(wrapper);

      // Initial GSAP Setup
      var offscreen = opt.position === 'left' ? -100 : 100;
      gsapLib.set([panel, ...preLayerEls], { xPercent: offscreen, opacity: 1 });
      gsapLib.set(preLayersContainer, { xPercent: 0, opacity: 1 });
      gsapLib.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsapLib.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsapLib.set(iconSpan, { rotate: 0, transformOrigin: '50% 50%' });
      gsapLib.set(textInner, { yPercent: 0 });
      gsapLib.set(toggleBtn, { color: opt.menuButtonColor });

      function buildOpenTimeline() {
        if (openTl) openTl.kill();
        if (closeTween) {
          closeTween.kill();
          closeTween = null;
        }

        var itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        var numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        var socialTitle = panel.querySelector('.sm-socials-title');
        var socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

        var off = opt.position === 'left' ? -100 : 100;
        var layerStates = preLayerEls.map(function (el) { return { el: el, start: off }; });

        if (itemEls.length) {
          gsapLib.set(itemEls, { yPercent: 140, rotate: 10 });
        }
        if (numberEls.length) {
          gsapLib.set(numberEls, { '--sm-num-opacity': 0 });
        }
        if (socialTitle) {
          gsapLib.set(socialTitle, { opacity: 0 });
        }
        if (socialLinks.length) {
          gsapLib.set(socialLinks, { y: 25, opacity: 0 });
        }

        var tl = gsapLib.timeline({ paused: true });

        layerStates.forEach(function (ls, i) {
          tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
        });

        var lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
        var panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
        var panelDuration = 0.65;

        tl.fromTo(
          panel,
          { xPercent: off },
          { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
          panelInsertTime
        );

        if (itemEls.length) {
          var itemsStart = panelInsertTime + panelDuration * 0.15;
          tl.to(
            itemEls,
            {
              yPercent: 0,
              rotate: 0,
              duration: 1,
              ease: 'power4.out',
              stagger: { each: 0.1, from: 'start' }
            },
            itemsStart
          );
          if (numberEls.length) {
            tl.to(
              numberEls,
              {
                duration: 0.6,
                ease: 'power2.out',
                '--sm-num-opacity': 1,
                stagger: { each: 0.08, from: 'start' }
              },
              itemsStart + 0.1
            );
          }
        }

        if (socialTitle || socialLinks.length) {
          var socialsStart = panelInsertTime + panelDuration * 0.4;
          if (socialTitle) {
            tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
          }
          if (socialLinks.length) {
            tl.to(
              socialLinks,
              {
                y: 0,
                opacity: 1,
                duration: 0.55,
                ease: 'power3.out',
                stagger: { each: 0.08, from: 'start' },
                onComplete: function () {
                  gsapLib.set(socialLinks, { clearProps: 'opacity' });
                }
              },
              socialsStart + 0.04
            );
          }
        }

        openTl = tl;
        return tl;
      }

      function playOpen() {
        if (busy) return;
        busy = true;
        var tl = buildOpenTimeline();
        if (tl) {
          tl.eventCallback('onComplete', function () {
            busy = false;
          });
          tl.play(0);
        } else {
          busy = false;
        }
      }

      function playClose() {
        if (openTl) {
          openTl.kill();
          openTl = null;
        }

        var all = [...preLayerEls, panel];
        if (closeTween) closeTween.kill();
        var off = opt.position === 'left' ? -100 : 100;

        closeTween = gsapLib.to(all, {
          xPercent: off,
          duration: 0.32,
          ease: 'power3.in',
          overwrite: 'auto',
          onComplete: function () {
            var itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
            if (itemEls.length) {
              gsapLib.set(itemEls, { yPercent: 140, rotate: 10 });
            }
            var numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
            if (numberEls.length) {
              gsapLib.set(numberEls, { '--sm-num-opacity': 0 });
            }
            var socialTitle = panel.querySelector('.sm-socials-title');
            var socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
            if (socialTitle) gsapLib.set(socialTitle, { opacity: 0 });
            if (socialLinks.length) gsapLib.set(socialLinks, { y: 25, opacity: 0 });
            busy = false;
          }
        });
      }

      function animateIcon(opening) {
        if (spinTween) spinTween.kill();
        if (opening) {
          spinTween = gsapLib.to(iconSpan, { rotate: 225, duration: 0.8, ease: 'power4.out', overwrite: 'auto' });
        } else {
          spinTween = gsapLib.to(iconSpan, { rotate: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' });
        }
      }

      function animateColor(opening) {
        if (colorTween) colorTween.kill();
        if (opt.changeMenuColorOnOpen) {
          var targetColor = opening ? opt.openMenuButtonColor : opt.menuButtonColor;
          colorTween = gsapLib.to(toggleBtn, {
            color: targetColor,
            delay: 0.18,
            duration: 0.3,
            ease: 'power2.out'
          });
        } else {
          gsapLib.set(toggleBtn, { color: opt.menuButtonColor });
        }
      }

      function animateText(opening) {
        if (textCycleAnim) textCycleAnim.kill();
        var currentLabel = opening ? 'Menu' : 'Close';
        var targetLabel = opening ? 'Close' : 'Menu';
        var cycles = 3;
        var seq = [currentLabel];
        var last = currentLabel;
        for (var i = 0; i < cycles; i++) {
          last = last === 'Menu' ? 'Close' : 'Menu';
          seq.push(last);
        }
        if (last !== targetLabel) seq.push(targetLabel);
        seq.push(targetLabel);

        textInner.innerHTML = seq.map(function (s) {
          return '<span class="sm-toggle-line">' + s + '</span>';
        }).join('');

        gsapLib.set(textInner, { yPercent: 0 });
        var lineCount = seq.length;
        var finalShift = ((lineCount - 1) / lineCount) * 100;
        textCycleAnim = gsapLib.to(textInner, {
          yPercent: -finalShift,
          duration: 0.5 + lineCount * 0.07,
          ease: 'power4.out'
        });
      }

      function toggleMenu() {
        var target = !isOpen;
        isOpen = target;
        toggleBtn.setAttribute('aria-expanded', String(target));
        toggleBtn.setAttribute('aria-label', target ? 'Close menu' : 'Open menu');
        panel.setAttribute('aria-hidden', String(!target));
        if (target) {
          wrapper.setAttribute('data-open', 'true');
          if (typeof opt.onMenuOpen === 'function') opt.onMenuOpen();
          playOpen();
        } else {
          wrapper.removeAttribute('data-open');
          if (typeof opt.onMenuClose === 'function') opt.onMenuClose();
          playClose();
        }
        animateIcon(target);
        animateColor(target);
        animateText(target);
      }

      function closeMenu() {
        if (isOpen) {
          isOpen = false;
          toggleBtn.setAttribute('aria-expanded', 'false');
          toggleBtn.setAttribute('aria-label', 'Open menu');
          panel.setAttribute('aria-hidden', 'true');
          wrapper.removeAttribute('data-open');
          if (typeof opt.onMenuClose === 'function') opt.onMenuClose();
          playClose();
          animateIcon(false);
          animateColor(false);
          animateText(false);
        }
      }

      toggleBtn.addEventListener('click', toggleMenu);

      function handleClickOutside(event) {
        if (!opt.closeOnClickAway || !isOpen) return;
        if (panel && !panel.contains(event.target) && toggleBtn && !toggleBtn.contains(event.target)) {
          closeMenu();
        }
      }

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });

      return {
        open: function () { if (!isOpen) toggleMenu(); },
        close: closeMenu,
        toggle: toggleMenu,
        isOpen: function () { return isOpen; },
        destroy: function () {
          document.removeEventListener('mousedown', handleClickOutside);
          document.removeEventListener('touchstart', handleClickOutside);
          if (openTl) openTl.kill();
          if (closeTween) closeTween.kill();
          if (spinTween) spinTween.kill();
          if (textCycleAnim) textCycleAnim.kill();
          if (colorTween) colorTween.kill();
          if (wrapper.parentNode) {
            wrapper.parentNode.removeChild(wrapper);
          }
        }
      };
    }
  };

  return StaggeredMenu;
});
