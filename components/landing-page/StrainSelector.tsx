'use client'

interface StrainSelectorItem {
  name: string;
  color: string;
}

interface StrainSelectorProps {
  title?: string;
  items: StrainSelectorItem[];
  selectedName?: string | null;
  onSelect: (name: string) => void;
  className?: string;
}

export function StrainSelector({ title = 'Select Strain', items, selectedName, onSelect, className }: StrainSelectorProps) {
  function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
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

  function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function mixWithWhite(hex: string, percent: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const p = Math.max(0, Math.min(100, percent)) / 100;
    const r = rgb.r + (255 - rgb.r) * p;
    const g = rgb.g + (255 - rgb.g) * p;
    const b = rgb.b + (255 - rgb.b) * p;
    return rgbToHex(r, g, b);
  }

  function mixWithBlack(hex: string, percent: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const p = Math.max(0, Math.min(100, percent)) / 100;
    const r = rgb.r * (1 - p);
    const g = rgb.g * (1 - p);
    const b = rgb.b * (1 - p);
    return rgbToHex(r, g, b);
  }

  return (
    <div className={`flex flex-col items-start gap-4 w-full ${className ?? ''}`}>
      <p className="text-lg sm:text-2xl font-bold leading-[120%] uppercase text-[#101010]">
        {title}
      </p>
      <div className="flex items-start gap-2.5 sm:gap-4 flex-wrap">
        {items.map((item, index) => {
          const isSelected = selectedName === item.name;
          const baseColor = item.color || '#FFFFFF';
          const backgroundColor = isSelected ? mixWithWhite(baseColor, 15) : baseColor;
          const borderColor = mixWithBlack(backgroundColor, 12);
          const circleColor = isSelected ? mixWithBlack(baseColor, 40) : borderColor;
          return (
            <button
              key={`${item.name}-${index}`}
              onClick={() => onSelect(item.name)}
              style={{ backgroundColor, border: `1px solid ${borderColor}` }}
              className={`flex px-3.5 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-3 items-center rounded-full transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-0.5 hover:brightness-105`}
              aria-pressed={isSelected}
            >
              <span
                className="relative flex items-center justify-center size-4 sm:size-6 rounded-full"
                style={{ backgroundColor: circleColor }}
              >
                {isSelected && (
                  <span className="block size-2 sm:size-3 rounded-full bg-white/70" />
                )}
              </span>
              <p className="text-sm sm:text-lg font-medium leading-[150%] text-[#202020]">
                {item.name}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}


