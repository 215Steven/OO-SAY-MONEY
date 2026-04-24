import {
  UserCircle,
  ChartLineUp,
  LockOpen,
  ShieldCheckered,
  CurrencyCircleDollar,
  CalendarCheck,
  Handshake,
  BookOpen,
  MapTrifold,
  House,
  Info,
  Star,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  Gear,
  Diamond,
  TrendUp,
  EnvelopeSimple,
  MapPin,
} from '@phosphor-icons/react';
import React from 'react';

// Phosphor duotone icon map — used across the app
// Usage: <Ic n="story" size={32} color="#f59e0b" />
const iconMap: Record<string, React.ElementType> = {
  // Nav / menu grid icons
  story:       UserCircle,
  chart:       ChartLineUp,
  unlock:      LockOpen,
  shield:      ShieldCheckered,
  money:       CurrencyCircleDollar,
  calendar:    CalendarCheck,
  info:        Handshake,
  book:        BookOpen,
  map:         MapTrifold,

  // Generic utility icons
  home:        House,
  hint:        Info,
  star:        Star,
  arrow:       ArrowRight,
  back:        ArrowLeft,
  close:       X,
  check:       Check,
  gear:        Gear,
  diamond:     Diamond,
  trend:       TrendUp,
  mail:        EnvelopeSimple,
  pin:         MapPin,
};

export const Ic = ({
  n,
  size = 24,
  color = 'currentColor',
  weight = 'duotone',
  className,
}: {
  n: string;
  size?: number;
  color?: string;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  className?: string;
}) => {
  const Icon = iconMap[n] ?? iconMap.hint;
  return <Icon size={size} color={color} weight={weight} className={className} />;
};

// Re-export individual icons for direct import if needed
export {
  UserCircle,
  ChartLineUp,
  LockOpen,
  ShieldCheckered,
  CurrencyCircleDollar,
  CalendarCheck,
  Handshake,
  BookOpen,
  MapTrifold,
};
