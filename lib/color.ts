// Shared color utilities for mixing and adjusting colors

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  if (!hex) return null;
  let h = hex.trim();
  if (h[0] === '#') h = h.slice(1);
  if (h.length === 3) {
    h = h.split('').map((c) => c + c).join('');
  }
  if (h.length !== 6) return null;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return { r, g, b };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function mixWithWhite(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const p = Math.max(0, Math.min(100, percent)) / 100;
  const r = rgb.r + (255 - rgb.r) * p;
  const g = rgb.g + (255 - rgb.g) * p;
  const b = rgb.b + (255 - rgb.b) * p;
  return rgbToHex(r, g, b);
}

export function mixWithBlack(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const p = Math.max(0, Math.min(100, percent)) / 100;
  const r = rgb.r * (1 - p);
  const g = rgb.g * (1 - p);
  const b = rgb.b * (1 - p);
  return rgbToHex(r, g, b);
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360; s /= 100; l /= 100;
  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
  return { r, g, b };
}

export function saturateHex(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const newS = Math.max(0, Math.min(100, hsl.s + percent));
  const newRgb = hslToRgb(hsl.h, newS, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

export function generateShades(base: string) {
  const lighter = mixWithWhite(base, 25);
  const darker = mixWithBlack(base, 15);
  const saturated = saturateHex(darker, 20);
  return { lighter, base, darker, saturated };
}

export function gradientAround(hex: string, strength = 15): string {
  const base = hex || '#FFFFFF';
  const light = mixWithWhite(base, strength);
  const dark = mixWithBlack(base, strength);
  return `linear-gradient(180deg, ${light} 0%, ${base} 50%, ${dark} 100%)`;
}


