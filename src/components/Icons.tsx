import {
  Info, DollarSign, Sparkles, ShieldCheck, Calendar, BookOpen, Map, User, Mail, Settings, Diamond, TrendingUp, Check, ChevronRight, ChevronLeft, X
} from 'lucide-react';

const icons: Record<string, any> = {
  user: User,
  shield: ShieldCheck,
  chart: TrendingUp, // Renamed from chart to match usage if needed, but keeping keys for now
  money: DollarSign,
  calendar: Calendar,
  info: Info,
  star: Sparkles,
  book: BookOpen,
  mail: Mail,
  map: Map,
  gear: Settings,
  diamond: Diamond,
  trend: TrendingUp,
  check: Check,
  arrow: ChevronRight,
  back: ChevronLeft,
  // 別名：部分頁面使用這兩個 key，原本找不到會退回成「資訊」圖示
  "arrow-left": ChevronLeft,
  arrowRight: ChevronRight,
  close: X,
};

export const Ic = ({ n, size=24, color="currentColor", className="" }: { n: string, size?: number, color?: string, className?: string }) => {
  const IconComponent = icons[n] || Info;
  return <IconComponent size={size} color={color} className={className} strokeWidth={1.5} />;
};
