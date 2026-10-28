/**
 * Ícones próprios do Nexo (traço de 1.75 em grade 24×24). Decorativos por padrão;
 * passe `label` quando o ícone carregar significado sozinho.
 */
const PATHS = {
  home: 'M4 11.5 12 5l8 6.5M6.5 9.5V19h11V9.5M10 19v-5h4v5',
  map: 'M9 5 4 7v12l5-2 6 2 5-2V5l-5 2-6-2Zm0 0v12m6-10v12',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  dumbbell: 'M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10',
  book: 'M5 4.5h10.5A3.5 3.5 0 0 1 19 8v11.5H8.5A3.5 3.5 0 0 1 5 16V4.5Zm0 11.5A3.5 3.5 0 0 1 8.5 12.5H19',
  trophy: 'M8 4h8v5a4 4 0 0 1-8 0V4Zm0 2H5v1.5A3.5 3.5 0 0 0 8 11m8-5h3v1.5A3.5 3.5 0 0 1 16 11M12 13v4m-4 3h8l-1-3H9l-1 3Z',
  chart: 'M4 20h16M7 16v-5m5 5V7m5 9v-8',
  gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm7.4 3a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4.9a7.5 7.5 0 0 0-2-1.2L14.5 3h-5l-.4 2.5a7.5 7.5 0 0 0-2 1.2l-2.4-.9-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-.9a7.5 7.5 0 0 0 2 1.2l.4 2.5h5l.4-2.5a7.5 7.5 0 0 0 2-1.2l2.4.9 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  x: 'M6 6l12 12M18 6 6 18',
  alert: 'M12 4 2.8 19.5h18.4L12 4Zm0 6v4.5m0 2.5h.01',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v6m0-9h.01',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M5.5 11h13v9h-13v-9Zm6.5 3.5v2',
  unlock: 'M7 11V8a5 5 0 0 1 9.6-2M5.5 11h13v9h-13v-9Z',
  'arrow-left': 'M19 12H5m6-6-6 6 6 6',
  'arrow-right': 'M5 12h14m-6-6 6 6-6 6',
  'arrow-up': 'M12 19V5m-6 6 6-6 6 6',
  'arrow-down': 'M12 5v14m6-6-6 6-6-6',
  'chevron-right': 'm9 6 6 6-6 6',
  'chevron-down': 'm6 9 6 6 6-6',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13.5V12l3 2',
  bolt: 'M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z',
  star: 'm12 3.5 2.6 5.3 5.9.8-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.8L12 3.5Z',
  flag: 'M5 21V4m0 0h11l-2 4 2 4H5',
  search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Zm4.7-1.8L20 20',
  folder: 'M3.5 7.5A1.5 1.5 0 0 1 5 6h4.2l2 2.2H19a1.5 1.5 0 0 1 1.5 1.5v8.3A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18V7.5Z',
  file: 'M7 3.5h7l4.5 4.5v12.5h-11.5V3.5Zm7 0V8h4.5',
  archive: 'M4 5h16v4H4V5Zm1 4h14v10.5H5V9Zm5 3.5h4',
  terminal: 'M4 5h16v14H4V5Zm3.5 4 3 3-3 3m5 0H16',
  keyboard: 'M3 7h18v10H3V7Zm4 3h.01M10 10h.01M13 10h.01M16 10h.01M7 13.5h10',
  shield: 'M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6l-7-3Zm-3 9 2.2 2.2L15.5 10',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  wrench: 'M14.5 5.5a4.5 4.5 0 0 0-5.9 5.6L4 15.7 8.3 20l4.6-4.6a4.5 4.5 0 0 0 5.6-5.9l-2.8 2.8-2.9-.4-.4-2.9 2.1-3.5Z',
  cpu: 'M7 7h10v10H7V7Zm3 3h4v4h-4v-4ZM9.5 3v4m5-4v4m-5 10v4m5-4v4M3 9.5h4m-4 5h4m10-5h4m-4 5h4',
  layers: 'm12 3.5 9 4.5-9 4.5L3 8l9-4.5Zm-9 8.5 9 4.5 9-4.5M3 16l9 4.5 9-4.5',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-12.5-2 5-5 2 2-5 5-2Z',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  crosshair: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM12 2v5m0 10v5M2 12h5m10 0h5',
  spark: 'M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M18 6l-2.5 2.5m-7 7L6 18',
  repeat: 'M17 3.5 20 6.5l-3 3M4 12V10a3.5 3.5 0 0 1 3.5-3.5H20M7 20.5 4 17.5l3-3m13-2.5v2a3.5 3.5 0 0 1-3.5 3.5H4',
  brain: 'M9.5 4.5a3 3 0 0 0-3 3 3 3 0 0 0-2 5.2 3 3 0 0 0 2.5 4.8 3 3 0 0 0 5 1.5V6a2.5 2.5 0 0 0-2.5-1.5Zm5 0a3 3 0 0 1 3 3 3 3 0 0 1 2 5.2 3 3 0 0 1-2.5 4.8 3 3 0 0 1-5 1.5',
  medal: 'M8 3h8l-2.5 6h-3L8 3Zm4 18a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-6.5v3',
  flame: 'M12 21c3.6 0 6-2.5 6-6 0-4.5-4-6.5-4.5-11-2.5 2-5 5-5 8.5-1.2-.6-1.8-1.6-2-3C5.2 11.2 6 15.5 6 15c0 3.5 2.4 6 6 6Z',
  command: 'M9 9V6.5A2.5 2.5 0 1 0 6.5 9H9Zm0 0h6m-6 0v6m6-6V6.5A2.5 2.5 0 1 1 17.5 9H15Zm0 0v6m0 0h-6m6 0v2.5a2.5 2.5 0 1 0 2.5-2.5H15Zm-6 0H6.5A2.5 2.5 0 1 0 9 17.5V15Z',
  play: 'M7 4.5v15l12-7.5-12-7.5Z',
  volume: 'M4 9.5h3.5L12 5.5v13l-4.5-4H4v-5Zm11.5-.5a4 4 0 0 1 0 6m2.5-8.5a7.5 7.5 0 0 1 0 11',
  'volume-off': 'M4 9.5h3.5L12 5.5v13l-4.5-4H4v-5Zm11 0 5 5m0-5-5 5',
  download: 'M12 4v11m-5-5 5 5 5-5M5 19.5h14',
  upload: 'M12 15V4m-5 5 5-5 5 5M5 19.5h14',
  trash: 'M4.5 6.5h15M10 4h4m-7.5 2.5 1 13.5h9l1-13.5M10 10v6m4-6v6',
  plus: 'M12 5v14M5 12h14',
  edit: 'M4 20h4L19 9l-4-4L4 16v4Zm9.5-13.5 4 4',
  refresh: 'M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4v4.5H15',
  sliders: 'M4 7h9m4 0h3M4 17h3m4 0h9M15 4.5v5M9 14.5v5',
  wifi: 'M3 9a13 13 0 0 1 18 0M6 12.5a8.5 8.5 0 0 1 12 0M9 16a4 4 0 0 1 6 0M12 19.5h.01',
  scissors: 'M6.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM8.5 8.5 20 18M8.5 15.5 20 6',
  clipboard: 'M9 4.5h6v2.5H9V4.5Zm-2.5 1.5H5v14h14V6h-1.5',
  restore: 'M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4v4.5H9',
  hint: 'M9.5 18h5m-4.5 2.5h4M12 3.5a6 6 0 0 0-3.5 10.9V16h7v-1.6A6 6 0 0 0 12 3.5Z',
  logout: 'M14 4h5v16h-5M10 8l-4 4 4 4m-4-4h10',
  window: 'M3.5 5h17v14h-17V5Zm0 4h17',
  mail: 'M3.5 6h17v12h-17V6Zm0 0 8.5 7 8.5-7',
  phone: 'M8 3h8v18H8V3Zm3.5 15h1',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3Z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  sparkles: 'M12 3.5 13.7 9 19 10.5l-5.3 1.6L12 17.5l-1.7-5.4L5 10.5 10.3 9 12 3.5ZM19 16l.7 2 2 .7-2 .6L19 21.5l-.7-2.2-2-.6 2-.7.7-2Z',
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  label?: string;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, label, className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
