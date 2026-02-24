export const colors = {
  // ─── Backgrounds ──────────────────────────────────────────────────────────
  background: '#0a0a14',
  cardBackground: '#12121f',
  inputBackground: '#1a1a2e',

  // ─── Primary ──────────────────────────────────────────────────────────────
  primary: '#2d7ff9',
  primaryDark: '#1a5fc7',
  primarySubtle: 'rgba(45,127,249,0.12)',

  // ─── Text ─────────────────────────────────────────────────────────────────
  textPrimary: '#ffffff',
  textSecondary: '#8a8a9a',
  textMuted: '#cacadbff',

  // ─── Borders ──────────────────────────────────────────────────────────────
  border: '#2a2a3e',
  borderFocused: '#2d7ff9',
  lightloder: '#aca7a7ff', // keep for backward-compat

  // ─── Semantic ─────────────────────────────────────────────────────────────
  success: '#22c55e',
  successSubtle: 'rgba(34,197,94,0.12)',
  warning: '#f59e0b',
  warningSubtle: 'rgba(245,158,11,0.12)',
  info: '#3b82f6',
  infoSubtle: 'rgba(59,130,246,0.12)',
  danger: '#ef4444',
  dangerSubtle: 'rgba(239,68,68,0.12)',

  // ─── Misc (aliases kept for backward-compat) ───────────────────────────────
  link: '#2d7ff9',
  error: '#ff4d4d',
};

export const typography = {
  // Font sizes
  h1: 28,
  h2: 24,
  h3: 20,
  body: 16,
  bodySmall: 14,
  caption: 12,

  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/** Border-radius scale */
export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

/**
 * Border-width scale
 *  hairline – subtle row separators (0.3)
 *  thin     – standard card / input borders (1)
 *  base     – slightly heavier lines, e.g. form inputs (1.5)
 *  medium   – underline emphasis, progress tracks (2)
 */
export const borderWidths = {
  hairline: 0.3,
  thin: 1,
  base: 1.5,
  medium: 2,
};

/** Shadow presets (use with spread: `...shadows.sm`) */
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
};

/** Palette for chart / category colour coding */
export const categoryColors = {
  shopping: '#22c55e',
  bills: '#3b82f6',
  food: '#f59e0b',
  travel: '#a855f7',
  health: '#ec4899',
  other: '#6b7280',
};
