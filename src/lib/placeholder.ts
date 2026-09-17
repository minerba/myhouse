function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

const HUES = [16, 34, 84, 350];

export function placeholderImage(
  seed: string,
  {
    label,
    w = 900,
    h = 1125,
    variant = 0,
  }: { label?: string; w?: number; h?: number; variant?: number } = {}
) {
  const hash = hashString(seed + ':' + variant);
  const hue = HUES[hash % HUES.length];
  const lightA = 88 - (hash % 8);
  const lightB = 60 - (hash % 10);
  const monogram = label ? [...label][0] : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="hsl(${hue},30%,${lightA}%)" />
        <stop offset="100%" stop-color="hsl(${hue + 10},42%,${lightB}%)" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g)" />
    ${
      variant === 0 && monogram
        ? `<text x="50%" y="54%" font-family="Georgia, 'Noto Serif KR', serif" font-size="${Math.round(
            w * 0.32
          )}" fill="rgba(255,255,255,0.32)" text-anchor="middle" dominant-baseline="middle">${monogram}</text>`
        : `<circle cx="${w * 0.5}" cy="${h * 0.4}" r="${w * 0.26}" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="${Math.round(
            w * 0.01
          )}" />`
    }
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
