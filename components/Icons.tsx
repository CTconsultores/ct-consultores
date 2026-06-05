interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const defaults = { size: 20, color: "currentColor", strokeWidth: 1.5 };

export function IconSavings({ size, color, strokeWidth }: IconProps) {
  const s = size ?? defaults.size;
  const c = color ?? defaults.color;
  const sw = strokeWidth ?? defaults.strokeWidth;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      <path d="M12 6v6l4 2" />
      <path d="M8 14h.01M12 14h.01M16 14h.01" />
    </svg>
  );
}

export function IconWallet({ size, color, strokeWidth }: IconProps) {
  const s = size ?? defaults.size;
  const c = color ?? defaults.color;
  const sw = strokeWidth ?? defaults.strokeWidth;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="3" />
      <path d="M16 14a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" fill={c} stroke="none" />
      <path d="M2 10h20" />
      <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export function IconDebt({ size, color, strokeWidth }: IconProps) {
  const s = size ?? defaults.size;
  const c = color ?? defaults.color;
  const sw = strokeWidth ?? defaults.strokeWidth;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 12h8M8 8h5M8 16h6" />
    </svg>
  );
}

export function IconTrendUp({ size, color, strokeWidth }: IconProps) {
  const s = size ?? defaults.size;
  const c = color ?? defaults.color;
  const sw = strokeWidth ?? defaults.strokeWidth;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

export function IconPatrimonio({ size, color, strokeWidth }: IconProps) {
  const s = size ?? defaults.size;
  const c = color ?? defaults.color;
  const sw = strokeWidth ?? defaults.strokeWidth;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function IconPerson({ size, color, strokeWidth }: IconProps) {
  const s = size ?? defaults.size;
  const c = color ?? defaults.color;
  const sw = strokeWidth ?? defaults.strokeWidth;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
    </svg>
  );
}

export function IconChart({ size, color, strokeWidth }: IconProps) {
  const s = size ?? defaults.size;
  const c = color ?? defaults.color;
  const sw = strokeWidth ?? defaults.strokeWidth;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="13" width="4" height="8" rx="1" />
      <rect x="10" y="8" width="4" height="13" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}

export function IconFinancing({ size, color, strokeWidth }: IconProps) {
  const s = size ?? defaults.size;
  const c = color ?? defaults.color;
  const sw = strokeWidth ?? defaults.strokeWidth;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

export function IconArrowRight({ size, color, strokeWidth }: IconProps) {
  const s = size ?? defaults.size;
  const c = color ?? defaults.color;
  const sw = strokeWidth ?? defaults.strokeWidth;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function IconShield({ size, color, strokeWidth }: IconProps) {
  const s = size ?? defaults.size;
  const c = color ?? defaults.color;
  const sw = strokeWidth ?? defaults.strokeWidth;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

export function IconStar({ size, color, strokeWidth }: IconProps) {
  const s = size ?? defaults.size;
  const c = color ?? defaults.color;
  const sw = strokeWidth ?? defaults.strokeWidth;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
