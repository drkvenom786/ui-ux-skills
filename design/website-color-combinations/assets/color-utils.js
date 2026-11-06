/**
 * Website Color Combinations & WCAG Contrast Engine
 * Zero-dependency utility for web color theory, contrast auditing, and token generation.
 * Inspired by Onething Design's 2026 Color Combinations Architecture.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ColorUtils = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function rgbToHex(r, g, b) {
    const toHex = c => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  /**
   * Relative luminance as defined by W3C WCAG 2.1
   * @param {{r: number, g: number, b: number}} rgb 
   * @returns {number} 0 (black) to 1 (white)
   */
  function relativeLuminance(rgb) {
    const sRGB = [rgb.r, rgb.g, rgb.b].map(val => {
      const s = val / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  }

  /**
   * Contrast ratio between two colors (hex strings)
   * Formula: (L1 + 0.05) / (L2 + 0.05) where L1 is lighter
   * @param {string} hex1 
   * @param {string} hex2 
   * @returns {number} contrast ratio (1.0 to 21.0)
   */
  function getContrastRatio(hex1, hex2) {
    const lum1 = relativeLuminance(hexToRgb(hex1));
    const lum2 = relativeLuminance(hexToRgb(hex2));
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
  }

  /**
   * Evaluates WCAG compliance
   * @param {number} ratio 
   * @returns {{normalTextAA: boolean, normalTextAAA: boolean, largeTextAA: boolean, largeTextAAA: boolean, uiComponentsAA: boolean}}
   */
  function checkWcag(ratio) {
    return {
      ratio: ratio,
      normalTextAA: ratio >= 4.5,
      normalTextAAA: ratio >= 7.0,
      largeTextAA: ratio >= 3.0,
      largeTextAAA: ratio >= 4.5,
      uiComponentsAA: ratio >= 3.0
    };
  }

  /**
   * Generates standard CSS Custom Properties for a palette
   * @param {object} palette 
   * @returns {string} CSS rule block
   */
  function generateCssVariables(palette) {
    const roles = palette.roles || {};
    return `:root {
  /* ${palette.name} (${palette.category}) */
  --color-canvas: ${roles.canvas || palette.hexes[0]};
  --color-surface: ${roles.surface || palette.hexes[2] || '#ffffff'};
  --color-text-primary: ${roles.text || palette.hexes[1]};
  --color-brand-primary: ${roles.primary || palette.hexes[3]};
  --color-accent-cta: ${roles.accent || palette.hexes[4]};

  /* 60-30-10 distribution */
  --ratio-canvas: 60%;
  --ratio-surface: 30%;
  --ratio-accent: 10%;
}`;
  }

  /**
   * Generates Tailwind CSS v3 / v4 theme config extension
   */
  function generateTailwindConfig(palette) {
    const roles = palette.roles || {};
    return {
      theme: {
        extend: {
          colors: {
            canvas: roles.canvas || palette.hexes[0],
            surface: roles.surface || palette.hexes[2],
            'text-primary': roles.text || palette.hexes[1],
            'brand-primary': roles.primary || palette.hexes[3],
            'accent-cta': roles.accent || palette.hexes[4]
          }
        }
      }
    };
  }

  return {
    hexToRgb,
    rgbToHex,
    relativeLuminance,
    getContrastRatio,
    checkWcag,
    generateCssVariables,
    generateTailwindConfig
  };
});
