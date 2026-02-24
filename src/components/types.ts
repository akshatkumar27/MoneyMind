import { ViewStyle, TextStyle, ImageSourcePropType, StyleProp, TextInputProps, TouchableOpacityProps, KeyboardTypeOptions, DimensionValue } from 'react-native';
import React, { ReactNode } from 'react';


export interface HeaderProps {
    title?: string;
    titleStyle?: TextStyle;
    rightElement?: React.ReactNode;
    onBack?: () => void;
    style?: ViewStyle;
    showBackButton?: boolean;
}

export interface AnimatedMascotProps {
    text?: string;
    mascotImage?: ImageSourcePropType;
    mascotWidth?: number;
    mascotHeight?: number;
    /** Fraction of mascotHeight where the arrow should point (0=top, 1=bottom). Default 0.40 targets Fino's mouth. */
    arrowTopRatio?: number;
    customTooltipStyle?: StyleProp<ViewStyle>;
}

export interface BackButtonProps {
    onPress: () => void;
    style?: ViewStyle;
}

export interface ButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    showArrow?: boolean;
}

export interface AppModalProps {
    visible: boolean;
    title: string;
    /** Main descriptive paragraph below the title (for alert/confirm modals). */
    message?: string;
    /** Secondary line below the title, rendered smaller (for form modals). */
    subtitle?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    /** Controls the icon and default confirm-button colour. */
    type?: 'success' | 'error' | 'warning' | 'info' | 'danger';
    /** Overrides the confirm-button colour only. */
    confirmVariant?: 'primary' | 'danger';
    /** Override the auto-selected emoji icon. */
    customIcon?: string;
    showCancelButton?: boolean;
    /** Shows a spinner on the confirm button during async actions. */
    confirmLoading?: boolean;
    /** Arbitrary form content rendered between subtitle and buttons. */
    children?: React.ReactNode;
}

/** @deprecated Use AppModalProps instead */
export type ConfirmationModalProps = AppModalProps;


export interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    gradient?: boolean;
}

export interface ProgressBarProps {
    progress: number; // 0-100
    color?: string;
    backgroundColor?: string;
    height?: number;
}

export interface StatCardProps {
    label: string;
    value: string;
    valueColor?: string;
    small?: boolean;
}

export interface AccountRowProps {
    icon: string;
    name: string;
    subtitle?: string;
    amount: string;
    badge?: string;
    badgeColor?: string;
}

export interface GoalCardProps {
    icon: string;
    title: string;
    progress: number;
    subtitle: string;
    color?: string;
}

export interface GoalCardWithSuggestionProps {
    icon?: string;
    title: string;
    progress: number;
    subtitle?: string;
    color?: string;
    suggestionTitle?: string;
    suggestionDescription?: string;
    suggestionHighlight?: string;
    achieveInMonths?: number;
    targetAmount?: number;
    savedAmount?: number;
    onEditPress?: () => void;
    onAskAiPress?: () => void;
    onCardPress?: () => void;
}

export interface AIInsightCardProps {
    type: 'suggestion' | 'strategy' | 'insight';
    title: string;
    description: string;
    highlight?: string;
}

export interface AssetRowProps {
    icon: string;
    name: string;
    subtitle: string;
    value: string;
    change: string;
    isPositive: boolean;
}

export interface FooterLinksProps {
    showAuthLink?: boolean;
    authLinkType?: 'login' | 'signup';
    onAuthLinkPress?: () => void;
}

export interface SelectableGoalCardProps {
    icon: string;
    title: string;
    description: string;
    selected: boolean;
    onPress: () => void;
    style?: ViewStyle;
    highlightedAmount?: string;
}

export interface InputProps extends TextInputProps {
    label?: string;
    icon?: React.ReactNode;
    containerStyle?: ViewStyle;
    error?: string;
}

export interface LogoProps {
    size?: 'small' | 'medium' | 'large';
}

export interface MascotLoaderProps {
    size?: number;
}

export interface OTPInputProps {
    value: string;
    onChangeText: (text: string) => void;
    length?: number;
}

export interface SelectOptionProps {
    icon?: string;
    label: string;
    sublabel?: string;
    selected: boolean;
    onPress: () => void;
    style?: ViewStyle;
}

export interface ChipOptionProps {
    label: string;
    selected: boolean;
    onPress: () => void;
}

export interface CounterProps {
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    min?: number;
    max?: number;
}

export interface SkeletonLoaderProps {
    width?: DimensionValue;
    height?: DimensionValue;
    borderRadius?: number;
    style?: ViewStyle;
}
