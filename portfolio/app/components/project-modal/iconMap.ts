import { Award, Car, Sparkles, Zap, Monitor, Gamepad2 } from 'lucide-react';

export const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  'Car': Car,
  'Sparkles': Sparkles,
  'Zap': Zap,
  'Award': Award,
  'Monitor': Monitor,
  'Gamepad2': Gamepad2,
};
