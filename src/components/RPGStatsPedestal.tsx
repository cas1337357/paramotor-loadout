import React from 'react';
import { 
  Fuel, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  Gauge, 
  Scale, 
  Zap, 
  Flame 
} from 'lucide-react';
import { formatWeight, formatVolume, formatWingLoading } from '../utils/units';

interface RPGStatsPedestalProps {
  totalWeightKg: number;
  emptyWeightKg: number;
  fuelLiters: number;
  onFuelChange: (liters: number) => void;
  pilotWeightKg: number;
  onPilotWeightChange: (kg: number) => void;
  wingAreaSqM: number;
  engineThrustKg: number;
  unit: 'kg' | 'lbs';
  onToggleUnit: (toUnit: 'kg' | 'lbs') => void;
}

export const RPGStatsPedestal: React.FC<RPGStatsPedestalProps> = ({
  totalWeightKg,
  emptyWeightKg,
  fuelLiters,
  onFuelChange,
  pilotWeightKg,
  onPilotWeightChange,
  wingAreaSqM,
  engineThrustKg,
  unit,
  onToggleUnit,
}) => {
  const isKg = unit === 'kg';
  const unitLabel = isKg ? 'kg' : 'lbs';

  // Calculations
  const fuelWeightKg = fuelLiters * 0.748; // 2-stroke mix density
  const wingLoading = totalWeightKg / Math.max(10, wingAreaSqM);
  const thrustToWeight = engineThrustKg / Math.max(1, totalWeightKg);

  // FAA Part 103 Ultralight empty weight limit: 254 lbs (115.21 kg)
  const FAA_PART_103_MAX_KG = 115.21;
  const isPart103Compliant = emptyWeightKg <= FAA_PART_103_MAX_KG;

  // Wing loading safety rating
  let wingStatus: { label: string; color: string; desc: string } = {
    label: 'OPTIMAL VFR CRUISE',
    color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    desc: 'Balanced passive safety, collapse recovery, and responsive turn rate.',
  };

  if (wingLoading > 6.8) {
    wingStatus = {
      label: 'CRITICAL: OVERLOADED',
      color: 'text-rose-400 border-rose-500/50 bg-rose-500/15 animate-pulse',
      desc: 'Severe structural overload. High launch speed required; high sink rate.',
    };
  } else if (wingLoading > 6.2) {
    wingStatus = {
      label: 'WARNING: AGGRESSIVE ACRO',
      color: 'text-amber-400 border-amber-500/50 bg-amber-500/15',
      desc: 'Extremely dynamic roll, short brake travel, high landing groundspeed.',
    };
  } else if (wingLoading > 5.5) {
    wingStatus = {
      label: 'FAST / SPORT LOADING',
      color: 'text-sky-400 border-sky-500/40 bg-sky-500/10',
      desc: 'Crisp handling, good headwind penetration, faster trim speed.',
    };
  } else if (wingLoading < 3.2) {
    wingStatus = {
      label: 'DANGER: UNDER LOADED',
      color: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
      desc: 'Glider lacks internal pressure. Sluggish in turbulence and poor penetration.',
    };
  }

  // Display conversions
  const displayTotal = isKg ? totalWeightKg : totalWeightKg * 2.20462;
  const displayEmpty = isKg ? emptyWeightKg : emptyWeightKg * 2.20462;
  const displayPilot = isKg ? pilotWeightKg : pilotWeightKg * 2.20462;
  const displayFuelWeight = isKg ? fuelWeightKg : fuelWeightKg * 2.20462;

  return (
    <div className="space-y-4">
      {/* Command Sliders Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Fuel Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-black">
              <span className="flex items-center gap-1.5 text-amber-400 uppercase tracking-wider">
                <Fuel className="w-4 h-4" />
                <span>Fuel Load</span>
              </span>
              <span className="font-mono text-white text-base">
                {fuelLiters.toFixed(1)} L <span className="text-slate-400 text-xs font-normal">({(fuelLiters * 0.264172).toFixed(1)} gal)</span>
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="16"
              step="0.5"
              value={fuelLiters}
              onChange={(e) => onFuelChange(parseFloat(e.target.value))}
              className="rpg-slider"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>0L (Dry)</span>
              <span className="text-amber-300">
                Fuel Mass: <strong>{displayFuelWeight.toFixed(1)} {unitLabel}</strong>
              </span>
              <span>16L (Full Tank)</span>
            </div>
          </div>

          {/* Pilot Weight Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-black">
              <span className="flex items-center gap-1.5 text-sky-400 uppercase tracking-wider">
                <User className="w-4 h-4" />
                <span>Pilot Body Mass</span>
              </span>
              <span className="font-mono text-white text-base">
                {displayPilot.toFixed(1)} {unitLabel}
              </span>
            </div>

            <input
              type="range"
              min={isKg ? 45 : 100}
              max={isKg ? 140 : 310}
              step="1"
              value={displayPilot}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onPilotWeightChange(isKg ? val : val / 2.20462);
              }}
              className="rpg-slider"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{isKg ? '45 kg' : '100 lbs'}</span>
              <span className="text-slate-300">Adjust pilot weight</span>
              <span>{isKg ? '140 kg' : '310 lbs'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Flight Stats Pedestal */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
        {/* Pedestal Top Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {/* Unit Switcher */}
            <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => onToggleUnit('kg')}
                className={`px-3 py-1 text-xs font-black rounded-lg transition ${
                  isKg ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                KG
              </button>
              <button
                type="button"
                onClick={() => onToggleUnit('lbs')}
                className={`px-3 py-1 text-xs font-black rounded-lg transition ${
                  !isKg ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                LBS
              </button>
            </div>

            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider hidden xs:inline">
              Flight Attributes
            </span>
          </div>

          {/* FAA Part 103 Badge */}
          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-black tracking-wider flex items-center gap-1.5 ${
              isPart103Compliant
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                : 'border-amber-500/60 bg-amber-500/15 text-amber-300'
            }`}
          >
            {isPart103Compliant ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>✓ FAA PART 103 COMPLIANT (&le; 254 LBS)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>⚠ EXCEEDS PART 103 (EXPERIMENTAL PPG)</span>
              </>
            )}
          </div>
        </div>

        {/* 4 Stat Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
          {/* 1: Total AUW */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Total In-Flight AUW
            </span>
            <div className="my-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                {displayTotal.toFixed(1)}
              </span>
              <span className="text-sm font-black text-amber-400 ml-1.5 uppercase font-mono">
                {unitLabel}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Pilot + Fuel + All Gear
            </span>
          </div>

          {/* 2: Wing Loading */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Wing Loading ({wingAreaSqM} m²)
            </span>
            <div className="my-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-sky-400">
                {wingLoading.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 ml-1.5 font-mono">
                kg/m²
              </span>
            </div>
            <span className="text-[10px] font-bold truncate text-slate-300">
              {wingStatus.label}
            </span>
          </div>

          {/* 3: Empty Paramotor Mass */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Empty Mass (Airframe)
            </span>
            <div className="my-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                {displayEmpty.toFixed(1)}
              </span>
              <span className="text-sm font-black text-slate-400 ml-1.5 uppercase font-mono">
                {unitLabel}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Without Pilot & Fuel
            </span>
          </div>

          {/* 4: Thrust to Weight */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Thrust / Weight Ratio
            </span>
            <div className="my-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
                {thrustToWeight.toFixed(2)} : 1
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              {engineThrustKg} kg static thrust
            </span>
          </div>
        </div>

        {/* Wing Safety Status Callout */}
        <div className={`mt-4 p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${wingStatus.color}`}>
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 flex-shrink-0" />
            <div>
              <strong className="tracking-wide uppercase font-black mr-2">
                {wingStatus.label}:
              </strong>
              <span>{wingStatus.desc}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
