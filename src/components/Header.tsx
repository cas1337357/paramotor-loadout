import React from 'react';
import { 
  Scale, 
  Settings2, 
  Github, 
  RotateCcw,
  Plane,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { LoadoutPreset, UnitSystem, WeightBreakdown } from '../types/paramotor';
import { formatWeight } from '../utils/units';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activePreset: LoadoutPreset;
  presets: LoadoutPreset[];
  onSelectPreset: (presetId: string) => void;
  onOpenPresetsModal: () => void;
  onOpenGitHubModal: () => void;
  unitSystem: UnitSystem;
  onToggleUnitSystem: () => void;
  weightBreakdown: WeightBreakdown;
}

export const Header: React.FC<HeaderProps> = ({
  activePreset,
  presets,
  onSelectPreset,
  onOpenPresetsModal,
  onOpenGitHubModal,
  unitSystem,
  onToggleUnitSystem,
  weightBreakdown,
}) => {
  const isOverweight = weightBreakdown.weightStatus === 'overweight';
  const isHeavy = weightBreakdown.weightStatus === 'heavy';
  const isUnder = weightBreakdown.weightStatus === 'under';

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2.5 transition">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* App Title & Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 p-0.5 shadow-md shadow-sky-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950/40 rounded-[10px] flex items-center justify-center">
              <Plane className="w-5 h-5 text-sky-300 transform -rotate-45" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                PPG <span className="text-sky-400">Loadout</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                PRO PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden xs:block truncate max-w-[130px] sm:max-w-none">
              Weight & Balance • Flight Ready
            </p>
          </div>
        </div>

        {/* Center / Preset Selector Dropdown */}
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <select
              value={activePreset.id}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="bg-slate-800/90 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-semibold rounded-lg pl-2.5 pr-7 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500 appearance-none cursor-pointer max-w-[140px] sm:max-w-[200px] truncate"
            >
              {presets.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                  {p.name}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <Settings2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <button
            onClick={onOpenPresetsModal}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Manage Loadout Presets"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Tools: AUW Badge, Units Toggle, GitHub, Install */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick AUW Chip */}
          <div
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
              isOverweight
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : isHeavy
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : isUnder
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
            title={`Takeoff All-Up Weight (AUW): ${formatWeight(weightBreakdown.takeoffAUWKg, unitSystem)}`}
          >
            {isOverweight ? (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Scale className="w-3.5 h-3.5" />
            )}
            <span className="font-mono">{formatWeight(weightBreakdown.takeoffAUWKg, unitSystem, 0)}</span>
          </div>

          {/* Unit Toggle Button */}
          <button
            onClick={onToggleUnitSystem}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono font-bold transition active:scale-95"
            title={`Switch to ${unitSystem === 'metric' ? 'Imperial (lbs/gal)' : 'Metric (kg/L)'}`}
          >
            {unitSystem === 'metric' ? 'KG' : 'LBS'}
          </button>

          {/* GitHub Connection */}
          <button
            onClick={onOpenGitHubModal}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition active:scale-95"
            title="GitHub Sync & Repository Link"
          >
            <Github className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Sync</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
