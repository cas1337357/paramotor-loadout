import React from 'react';
import { 
  Sparkles, 
  X, 
  Wind, 
  Flame, 
  Shield, 
  LifeBuoy, 
  Hand, 
  Footprints, 
  Radio, 
  HardHat 
} from 'lucide-react';
import { Rarity } from '../data/gearData';
import { formatWeight } from '../utils/units';

export type SocketType = 
  | 'helmet' 
  | 'wing' 
  | 'reserve' 
  | 'accessory' 
  | 'gloves' 
  | 'engine' 
  | 'frame' 
  | 'boots';

interface RPGSocketProps {
  type: SocketType;
  label: string;
  name: string;
  subText?: string;
  weightKg?: number;
  rarity?: Rarity;
  isActive: boolean;
  unit: 'kg' | 'lbs';
  onClick: () => void;
  onToggleActive?: (e: React.MouseEvent) => void;
}

export const RPGSocket: React.FC<RPGSocketProps> = ({
  type,
  label,
  name,
  subText,
  weightKg,
  rarity = 'common',
  isActive,
  unit,
  onClick,
  onToggleActive,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'helmet':
        return <HardHat className="w-5 h-5" />;
      case 'wing':
        return <Wind className="w-5 h-5" />;
      case 'engine':
        return <Flame className="w-5 h-5" />;
      case 'frame':
        return <Shield className="w-5 h-5" />;
      case 'reserve':
        return <LifeBuoy className="w-5 h-5" />;
      case 'gloves':
        return <Hand className="w-5 h-5" />;
      case 'boots':
        return <Footprints className="w-5 h-5" />;
      case 'accessory':
        return <Radio className="w-5 h-5" />;
    }
  };

  // Border & Glow based on RPG rarity
  const getRarityStyles = () => {
    if (!isActive) {
      return {
        border: 'border-slate-800 bg-slate-950/70 text-slate-500 opacity-60',
        badge: 'bg-slate-900 text-slate-500 border-slate-800',
        glow: '',
      };
    }

    switch (rarity) {
      case 'legendary':
        return {
          border: 'border-amber-500/90 bg-gradient-to-br from-amber-950/60 via-slate-900/90 to-amber-950/40 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.45)] hover:shadow-[0_0_30px_rgba(245,158,11,0.7)]',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
          glow: 'text-amber-400',
        };
      case 'epic':
        return {
          border: 'border-purple-500/90 bg-gradient-to-br from-purple-950/60 via-slate-900/90 to-purple-950/40 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.45)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)]',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
          glow: 'text-purple-400',
        };
      case 'rare':
        return {
          border: 'border-sky-500/90 bg-gradient-to-br from-sky-950/60 via-slate-900/90 to-sky-950/40 text-sky-300 shadow-[0_0_18px_rgba(14,165,233,0.4)] hover:shadow-[0_0_25px_rgba(14,165,233,0.65)]',
          badge: 'bg-sky-500/20 text-sky-300 border-sky-500/50',
          glow: 'text-sky-400',
        };
      default:
        return {
          border: 'border-slate-700 bg-slate-900/90 text-slate-200 hover:border-slate-500 shadow-md',
          badge: 'bg-slate-800 text-slate-400 border-slate-700',
          glow: 'text-slate-400',
        };
    }
  };

  const styles = getRarityStyles();

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl border-2 p-3 sm:p-3.5 backdrop-blur-md transition-all duration-200 cursor-pointer select-none active:scale-[0.98] ${styles.border}`}
    >
      {/* Top Header inside socket */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className={`p-1 rounded-lg bg-black/40 ${styles.glow}`}>
            {getIcon()}
          </div>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">
            {label}
          </span>
        </div>

        {/* Weight chip */}
        {isActive && weightKg !== undefined && (
          <span className="font-mono text-[11px] sm:text-xs font-bold text-slate-300 bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
            {formatWeight(weightKg, unit === 'kg' ? 'metric' : 'imperial')}
          </span>
        )}

        {/* Toggle Unequip button */}
        {onToggleActive && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleActive(e);
            }}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition"
            title={isActive ? 'Unequip slot' : 'Equip slot'}
          >
            {isActive ? (
              <X className="w-3.5 h-3.5" />
            ) : (
              <span className="text-[10px] font-bold text-sky-400">+ EQUIP</span>
            )}
          </button>
        )}
      </div>

      {/* Main Item Name */}
      <div className="min-h-[22px] flex items-center">
        <p className={`text-xs sm:text-sm font-black truncate tracking-wide ${isActive ? 'text-white' : 'text-slate-500 italic'}`}>
          {isActive ? name : '[ EMPTY SLOT ]'}
        </p>
      </div>

      {/* Subtext / Specs */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
        <span className="truncate">{isActive ? subText : 'Tap to Equip'}</span>
      </div>
    </div>
  );
};
