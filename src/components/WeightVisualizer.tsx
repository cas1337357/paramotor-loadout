import React, { useState } from 'react';
import { 
  Fuel, 
  Flame, 
  Wind, 
  Compass, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  Gauge, 
  Layers,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { AircraftProfile, GearItem, LoadoutPreset, UnitSystem, WeightBreakdown } from '../types/paramotor';
import { 
  formatWeight, 
  formatVolume, 
  formatWingLoading, 
  formatClimbRate,
  convertKgToDisplay 
} from '../utils/units';
import { recommendHangPoint } from '../utils/calculations';

interface WeightVisualizerProps {
  aircraft: AircraftProfile;
  activePreset: LoadoutPreset;
  allGear: GearItem[];
  weightBreakdown: WeightBreakdown;
  unitSystem: UnitSystem;
  onUpdateFuel: (liters: number) => void;
}

export const WeightVisualizer: React.FC<WeightVisualizerProps> = ({
  aircraft,
  activePreset,
  allGear,
  weightBreakdown,
  unitSystem,
  onUpdateFuel,
}) => {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  const {
    pilotTotalKg,
    airframeTotalKg,
    wingTotalKg,
    fuelTotalKg,
    gearByCategoryKg,
    totalGearKg,
    takeoffAUWKg,
    landingAUWKg,
    wingLoadingKgPerM2,
    thrustToWeightRatio,
    estimatedClimbRateFpm,
    flightEnduranceMinutes,
    weightStatus,
  } = weightBreakdown;

  // Breakdown slices for donut chart
  const slices = [
    {
      id: 'pilot',
      label: 'Pilot & Suit',
      weightKg: pilotTotalKg,
      color: '#38bdf8', // sky-400
      accent: 'border-sky-500/50 bg-sky-500/10 text-sky-300',
    },
    {
      id: 'motor',
      label: 'Motor & Harness',
      weightKg: aircraft.motorDryWeightKg,
      color: '#f97316', // orange-500
      accent: 'border-orange-500/50 bg-orange-500/10 text-orange-300',
    },
    {
      id: 'fuel',
      label: 'Fuel (2-Stroke)',
      weightKg: fuelTotalKg,
      color: '#eab308', // yellow-500
      accent: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300',
    },
    {
      id: 'wing',
      label: 'Glider / Wing',
      weightKg: wingTotalKg,
      color: '#a855f7', // purple-500
      accent: 'border-purple-500/50 bg-purple-500/10 text-purple-300',
    },
    {
      id: 'reserve',
      label: 'Reserve Chute',
      weightKg: aircraft.reserveWeightKg,
      color: '#ec4899', // pink-500
      accent: 'border-pink-500/50 bg-pink-500/10 text-pink-300',
    },
    {
      id: 'gear',
      label: 'Pack Gear & Tools',
      weightKg: totalGearKg,
      color: '#10b981', // emerald-500
      accent: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    },
  ];

  // SVG Donut calculation
  const totalAUW = Math.max(1, takeoffAUWKg);
  const radius = 70;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;
  const arcSegments = slices.map((slice) => {
    const fraction = slice.weightKg / totalAUW;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativeAngle * circumference;
    cumulativeAngle += fraction;
    return {
      ...slice,
      fraction,
      percentage: Math.round(fraction * 100),
      strokeDasharray,
      strokeDashoffset,
    };
  });

  // Wing loading certified scale
  const minAUW = aircraft.wingCertifiedMinAUWKg;
  const maxAUW = aircraft.wingCertifiedMaxAUWKg;
  const span = Math.max(10, maxAUW - minAUW);
  const percentOfSpan = Math.min(115, Math.max(-15, ((takeoffAUWKg - minAUW) / span) * 100));

  // Hang point advisor
  const hangAdvice = recommendHangPoint(pilotTotalKg);

  // Format hours and minutes
  const enduranceHrs = Math.floor(flightEnduranceMinutes / 60);
  const enduranceMins = flightEnduranceMinutes % 60;

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-12">
      {/* Flight Mission Card Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                Active Loadout
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activePreset.flightType.toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {activePreset.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-xl">
              {activePreset.description}
            </p>
          </div>

          {/* Quick AUW Banner */}
          <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 p-2.5 sm:p-3 rounded-xl">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Takeoff AUW</div>
              <div className="text-xl sm:text-2xl font-black font-mono text-white">
                {formatWeight(takeoffAUWKg, unitSystem)}
              </div>
            </div>
            <div
              className={`w-3.5 h-10 rounded-full ${
                weightStatus === 'overweight'
                  ? 'bg-rose-500'
                  : weightStatus === 'heavy'
                  ? 'bg-amber-500'
                  : weightStatus === 'under'
                  ? 'bg-blue-400'
                  : 'bg-emerald-500'
              }`}
            />
          </div>
        </div>

        {/* Dynamic Fuel Slider */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Fuel className="w-4 h-4 text-amber-400" />
              <span>Fuel Tank Level:</span>
              <span className="text-amber-400 font-bold font-mono">
                {formatVolume(activePreset.fuelLiters, unitSystem)} / {formatVolume(aircraft.fuelTankCapacityLiters, unitSystem)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Burn: ~{aircraft.fuelBurnRateLitersPerHour} L/hr</span>
            </div>
          </div>

          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max={aircraft.fuelTankCapacityLiters}
              step="0.5"
              value={activePreset.fuelLiters}
              onChange={(e) => onUpdateFuel(parseFloat(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-mono">
            <span>Empty (0L)</span>
            <div className="flex items-center gap-3">
              <span className="text-slate-300">
                Endurance: <strong className="text-sky-400">{enduranceHrs}h {enduranceMins}m</strong>
              </span>
              <span>•</span>
              <span className="text-slate-300">
                Fuel Weight: <strong className="text-amber-400">{formatWeight(fuelTotalKg, unitSystem)}</strong>
              </span>
            </div>
            <span>Full ({aircraft.fuelTankCapacityLiters}L)</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Donut Chart & Category Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                All-Up Weight Composition
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Hover/Tap segment
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            {/* SVG Donut */}
            <div className="relative w-52 h-52 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Background Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="#1e293b"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />

                {/* Segments */}
                {arcSegments.map((seg) => {
                  const isHovered = activeSegment === seg.id;
                  return (
                    <circle
                      key={seg.id}
                      cx="100"
                      cy="100"
                      r={radius}
                      stroke={seg.color}
                      strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                      strokeDasharray={seg.strokeDasharray}
                      strokeDashoffset={seg.strokeDashoffset}
                      fill="transparent"
                      className="transition-all duration-200 cursor-pointer"
                      onMouseEnter={() => setActiveSegment(seg.id)}
                      onMouseLeave={() => setActiveSegment(null)}
                      onClick={() => setActiveSegment(activeSegment === seg.id ? null : seg.id)}
                    />
                  );
                })}
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
                {activeSegment ? (
                  <>
                    <span className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[110px]">
                      {slices.find((s) => s.id === activeSegment)?.label}
                    </span>
                    <span className="text-lg font-black font-mono text-white">
                      {formatWeight(slices.find((s) => s.id === activeSegment)?.weightKg || 0, unitSystem)}
                    </span>
                    <span className="text-[11px] text-sky-400 font-bold">
                      {Math.round(((slices.find((s) => s.id === activeSegment)?.weightKg || 0) / totalAUW) * 100)}% AUW
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Total AUW
                    </span>
                    <span className="text-xl font-black font-mono text-white">
                      {formatWeight(takeoffAUWKg, unitSystem, 1)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Takeoff
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Slices legend list */}
            <div className="w-full space-y-1.5 text-xs">
              {arcSegments.map((seg) => {
                const isHovered = activeSegment === seg.id;
                return (
                  <div
                    key={seg.id}
                    onMouseEnter={() => setActiveSegment(seg.id)}
                    onMouseLeave={() => setActiveSegment(null)}
                    onClick={() => setActiveSegment(activeSegment === seg.id ? null : seg.id)}
                    className={`flex items-center justify-between p-1.5 px-2.5 rounded-lg border cursor-pointer transition ${
                      isHovered
                        ? `${seg.accent} scale-[1.02] shadow-sm`
                        : 'border-slate-800/80 hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: seg.color }}
                      />
                      <span className="font-medium text-slate-200">{seg.label}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-400 text-[11px]">{seg.percentage}%</span>
                      <span className="font-bold text-slate-100">{formatWeight(seg.weightKg, unitSystem)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sub-bar for takeoff vs landing weight */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Takeoff Weight:</span>
              <span className="text-sm font-bold font-mono text-sky-300">{formatWeight(takeoffAUWKg, unitSystem)}</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Landing Weight (Res. 1.5L):</span>
              <span className="text-sm font-bold font-mono text-emerald-300">{formatWeight(landingAUWKg, unitSystem)}</span>
            </div>
          </div>
        </div>

        {/* Right: Wing Certified Range Gauge & Wing Loading (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Wing Loading & Cert Limits
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">{aircraft.wingModel}</span>
            </div>

            {/* Wing Loading Value Display */}
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl mb-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-medium">Calculated Wing Loading:</span>
                <span className="text-lg font-black font-mono text-sky-400">
                  {formatWingLoading(wingLoadingKgPerM2, unitSystem)}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Based on <strong className="text-slate-200">{aircraft.wingAreaSqM} m²</strong> flat area.
                {wingLoadingKgPerM2 > 5.5 ? (
                  <span className="text-amber-400 ml-1">High wing loading provides crisp handling and penetration, but requires faster takeoff runs.</span>
                ) : (
                  <span className="text-sky-300 ml-1">Balanced loading ideal for smooth launches and thermalling.</span>
                )}
              </p>
            </div>

            {/* Certified AUW Linear Gauge */}
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400">Glider Certified Range:</span>
                <span className="font-mono text-slate-200">
                  {formatWeight(minAUW, unitSystem, 0)} – {formatWeight(maxAUW, unitSystem, 0)}
                </span>
              </div>

              {/* Graphical Scale */}
              <div className="relative pt-6 pb-2">
                {/* Pointer Marker */}
                <div
                  className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300 z-10"
                  style={{ left: `${Math.min(96, Math.max(4, percentOfSpan))}%` }}
                >
                  <span className="bg-white text-slate-950 font-black font-mono text-[10px] px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap">
                    {formatWeight(takeoffAUWKg, unitSystem, 0)}
                  </span>
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-white mt-0.5" />
                </div>

                {/* Progress track */}
                <div className="h-3 rounded-full overflow-hidden bg-slate-800 flex">
                  {/* Underloaded zone */}
                  <div className="w-[15%] bg-blue-500/70" title="Underloaded" />
                  {/* Sweet spot zone */}
                  <div className="w-[60%] bg-emerald-500" title="Optimal Certified Range" />
                  {/* Dynamic / high zone */}
                  <div className="w-[25%] bg-amber-500" title="Heavy / Fast Certified Range" />
                </div>
              </div>

              {/* Status explanation */}
              <div className="mt-3">
                {weightStatus === 'overweight' && (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                    <div>
                      <strong>OVERWEIGHT WARNING:</strong> Current AUW exceeds wing certified maximum limit ({formatWeight(maxAUW, unitSystem)}). Structural safety and flight speeds may be compromised!
                    </div>
                  </div>
                )}

                {weightStatus === 'heavy' && (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                    <div>
                      <strong>TOP OF CERTIFIED WEIGHT:</strong> Dynamic flight characteristics. Higher stall speed, fast trim speed, and responsive handling.
                    </div>
                  </div>
                )}

                {weightStatus === 'optimal' && (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                    <div>
                      <strong>SWEET SPOT:</strong> Well within DGAC / EN certified weight range. Ideal balance of passive safety, glide ratio, and takeoff roll.
                    </div>
                  </div>
                )}

                {weightStatus === 'under' && (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                    <div>
                      <strong>UNDERLOADED:</strong> Below wing certified minimum ({formatWeight(minAUW, unitSystem)}). Glider may feel light on bar and sluggish in turbulent winds.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Engine Thrust & Climb Rate Card */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 text-[11px] block">Thrust / Weight Ratio:</span>
              <span className="text-sm font-bold font-mono text-amber-400">
                {thrustToWeightRatio.toFixed(2)} : 1
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                ({aircraft.motorThrustKg} kg static thrust)
              </span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 text-[11px] block">Est. Climb Rate:</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                +{formatClimbRate(estimatedClimbRateFpm, unitSystem)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                At full power @ MSL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hang Point Advisor & Pitch Balance */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Harness Hang Point & CG Pitch Balance
            </h3>
          </div>
          <span className="text-xs bg-sky-500/10 text-sky-400 px-2.5 py-0.5 rounded-full border border-sky-500/20 font-semibold">
            Recommended: Hole #{hangAdvice.recommendedHole}
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          Proper swan-neck / swing-arm hang point adjustment ensures the propeller thrust line is angled <strong>5° to 10° nose-up</strong> during launch. This creates forward lift and prevents the motor from pitching the pilot forward into the dirt on full power ground roll.
        </p>

        {/* Visual Holes Selector */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 mt-4">
          {[1, 2, 3, 4, 5].map((hole) => {
            const isRecommended = hole === hangAdvice.recommendedHole;
            const isCurrent = hole === aircraft.hangPointHole;
            return (
              <div
                key={hole}
                className={`p-3 rounded-xl border text-center transition ${
                  isCurrent
                    ? 'bg-sky-500/20 border-sky-500 text-white shadow-md'
                    : isRecommended
                    ? 'bg-slate-800/90 border-slate-700 text-slate-200'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="text-[11px] font-bold uppercase text-slate-400">Hole</div>
                <div className="text-lg font-black font-mono my-0.5">#{hole}</div>
                {isCurrent && (
                  <span className="inline-block text-[9px] font-bold bg-sky-500 text-white px-1.5 py-0.2 rounded-full">
                    Current
                  </span>
                )}
                {!isCurrent && isRecommended && (
                  <span className="inline-block text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full">
                    Ideal
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-sky-400" />
            <span>{hangAdvice.description}</span>
          </div>
          <span className="font-mono text-sky-400 font-bold text-xs whitespace-nowrap ml-2">
            Target Pitch: ~{hangAdvice.pitchDegree}°
          </span>
        </div>
      </div>
    </div>
  );
};
