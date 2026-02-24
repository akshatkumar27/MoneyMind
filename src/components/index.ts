// ─── Primitives ───────────────────────────────────────────────────────────────
export { Button } from './Button';
export type { ButtonProps, ButtonVariant } from './Button';

export { Input } from './Input';
export { Logo } from './Logo';
export { BackButton } from './BackButton';
export { OTPInput } from './OTPInput';
export { FooterLinks } from './FooterLinks';
export { AnimatedMascot } from './AnimatedMascot';
export { SkeletonLoader } from './SkeletonLoader';
export { ConfirmationModal } from './ConfirmationModal';
export { MascotLoader } from './MascotLoader';
export * from './Header';

// ─── New Design-System Primitives ─────────────────────────────────────────────
export { Badge } from './Badge';
export type { BadgeProps, BadgeVariant } from './Badge';

export { IconCircle } from './IconCircle';
export type { IconCircleProps } from './IconCircle';

// ─── Selectable Goal Card (Onboarding) ────────────────────────────────────────
// Named GoalCard — used on goal selection screens (selectable / checkmark card)
export { GoalCard } from './GoalCard';

// ─── Onboarding Components ────────────────────────────────────────────────────
export * from './OnboardingComponents';

// ─── Dashboard Components (split into focused modules) ────────────────────────
// GoalProgressCard is the dashboard progress-tracking card.
// It was previously also named GoalCard inside DashboardComponents.tsx — now renamed to avoid collision.
export * from './dashboard';

// ─── Toast ────────────────────────────────────────────────────────────────────
export { toastConfig } from './CustomToast';
