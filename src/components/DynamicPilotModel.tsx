import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Flame, 
  Sparkles, 
  Radio, 
  Eye, 
  Zap, 
  Activity, 
  Camera,
  Layers,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { 
  EngineItem, 
  FrameItem, 
  ReserveItem, 
  AccessoryItem, 
  WearableItem, 
  Rarity 
} from '../data/gearData';
import { SocketType } from './RPGSocket';
import pilotModelImg from '../assets/pilot_model.png';

interface DynamicPilotModelProps {
  engine: EngineItem;
  frame: FrameItem;
  glider: {
    brand: string;
    model: string;
    size: string;
    weight: number;
    area: number;
  };
  reserve: ReserveItem;
  helmet: WearableItem;
  gloves: WearableItem;
  boots: WearableItem;
  accessory: AccessoryItem;
  isHelmetActive: boolean;
  isGlovesActive: boolean;
  isBootsActive: boolean;
  isReserveActive: boolean;
  isAccessoryActive: boolean;
  totalWeightKg: number;
  unit: 'kg' | 'lbs';
  onOpenSlot: (slot: SocketType) => void;
  lastChangedSlot?: { slot: SocketType; name: string; weightDeltaKg: number } | null;
}

export const getWingPhoto = (brand: string): string => {
  const b = brand.toLowerCase();
  if (b.includes('dudek')) return '/wings/dudek.webp';
  if (b.includes('ozone')) return '/wings/ozone.webp';
  if (b.includes('goldsmith') || b.includes('bgd')) return '/wings/bgd.webp';
  if (b.includes('niviuk')) return '/wings/niviuk.webp';
  if (b.includes('macpara')) return '/wings/macpara.webp';
  if (b.includes('flare')) return '/wings/flare.webp';
  if (b.includes('velocity')) return '/wings/velocity.webp';
  if (b.includes('gin')) return '/wings/gin.webp';
  return '/wings/ozone.webp';
};

export const DynamicPilotModel: React.FC<DynamicPilotModelProps> = ({
  engine,
  frame,
  glider,
  reserve,
  helmet,
  gloves,
  boots,
  accessory,
  isHelmetActive,
  isGlovesActive,
  isBootsActive,
  isReserveActive,
  isAccessoryActive,
  totalWeightKg,
  unit,
  onOpenSlot,
  lastChangedSlot,
}) => {
  const [flightMode, setFlightMode] = useState<'ground' | 'inflight'>('ground');
  const [showReticule, setShowReticule] = useState(true);
  const [floatingAlert, setFloatingAlert] = useState<{ text: string; rarity?: Rarity } | null>(null);

  // Trigger floating equip feedback when gear changes
  useEffect(() => {
    if (lastChangedSlot) {
      setFloatingAlert({
        text: `EQUIPPED: ${lastChangedSlot.name.toUpperCase()}`,
      });
      const timer = setTimeout(() => setFloatingAlert(null), 2400);
      return () => clearTimeout(timer);
    }
  }, [lastChangedSlot]);

  // Brand-specific wing canopy styling & accent
  const getWingColorway = () => {
    const brand = glider.brand.toLowerCase();
    if (brand.includes('dudek')) {
      return {
        accent: 'text-red-400 border-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.45)]',
        badge: 'bg-red-950/80 text-red-300 border-red-700/60',
        glow: 'rgba(239, 68, 68, 0.4)',
      };
    }
    if (brand.includes('ozone')) {
      return {
        accent: 'text-sky-400 border-sky-400/80 shadow-[0_0_25px_rgba(14,165,233,0.45)]',
        badge: 'bg-sky-950/80 text-sky-300 border-sky-700/60',
        glow: 'rgba(14, 165, 233, 0.4)',
      };
    }
    if (brand.includes('goldsmith') || brand.includes('bgd')) {
      return {
        accent: 'text-purple-300 border-purple-400/80 shadow-[0_0_25px_rgba(168,85,247,0.45)]',
        badge: 'bg-purple-950/80 text-purple-300 border-purple-700/60',
        glow: 'rgba(168, 85, 247, 0.4)',
      };
    }
    if (brand.includes('niviuk')) {
      return {
        accent: 'text-lime-400 border-lime-400/80 shadow-[0_0_25px_rgba(132,204,22,0.45)]',
        badge: 'bg-lime-950/80 text-lime-300 border-lime-700/60',
        glow: 'rgba(132, 204, 22, 0.4)',
      };
    }
    if (brand.includes('macpara')) {
      return {
        accent: 'text-blue-400 border-blue-400/80 shadow-[0_0_25px_rgba(37,99,235,0.45)]',
        badge: 'bg-blue-950/80 text-blue-300 border-blue-700/60',
        glow: 'rgba(37, 99, 235, 0.4)',
      };
    }
    if (brand.includes('flare')) {
      return {
        accent: 'text-yellow-400 border-yellow-400/80 shadow-[0_0_25px_rgba(234,179,8,0.45)]',
        badge: 'bg-yellow-950/80 text-yellow-300 border-yellow-700/60',
        glow: 'rgba(234, 179, 8, 0.4)',
      };
    }
    if (brand.includes('velocity')) {
      return {
        accent: 'text-orange-400 border-orange-500/80 shadow-[0_0_25px_rgba(249,115,22,0.45)]',
        badge: 'bg-orange-950/80 text-orange-300 border-orange-700/60',
        glow: 'rgba(249, 115, 22, 0.4)',
      };
    }
    return {
      accent: 'text-rose-400 border-rose-400/80 shadow-[0_0_25px_rgba(244,63,94,0.45)]',
      badge: 'bg-rose-950/80 text-rose-300 border-rose-700/60',
      glow: 'rgba(244, 63, 94, 0.4)',
    };
  };

  const wingColors = getWingColorway();
  const wingPhotoUrl = getWingPhoto(glider.brand);

  // Frame material styling
  const isTitanium = frame.material?.toLowerCase().includes('titanium') || frame.model.toLowerCase().includes('titanium');
  const isCarbon = frame.material?.toLowerCase().includes('carbon') || frame.model.toLowerCase().includes('carbon');

  // Engine power level for prop spin speed & thrust heat aura
  const isHighPower = engine.thrust >= 80;
  const propSpeedSec = flightMode === 'inflight' ? (isHighPower ? '0.15s' : '0.22s') : '0.9s';

  // Heated gloves indicator
  const hasHeatedGloves = gloves.name.toLowerCase().includes('heated');

  return (
    <div className="relative w-full max-w-[460px] mx-auto flex flex-col items-center select-none">
      {/* Flight Mode Toggle Controls */}
      <div className="w-full flex items-center justify-between mb-2 z-20 px-2">
        <div className="flex bg-slate-950/80 border border-slate-800 rounded-xl p-0.5 shadow-md">
          <button
            type="button"
            onClick={() => setFlightMode('ground')}
            className={`px-3 py-1 text-[11px] font-black uppercase rounded-lg transition ${
              flightMode === 'ground' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hangar View
          </button>
          <button
            type="button"
            onClick={() => setFlightMode('inflight')}
            className={`px-3 py-1 text-[11px] font-black uppercase rounded-lg transition flex items-center gap-1 ${
              flightMode === 'inflight' ? 'bg-sky-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wind className="w-3 h-3" />
            <span>In-Flight Thrust</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowReticule(!showReticule)}
          className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
            showReticule
              ? 'bg-slate-900 border-slate-700 text-amber-400'
              : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}
          title="Toggle Cyber HUD Hotspots"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="text-[10px] hidden xs:inline">{showReticule ? 'HUD ON' : 'HUD OFF'}</span>
        </button>
      </div>

      {/* DYNAMIC WING CANOPY BANNER WITH REAL PARAGLIDER PHOTO */}
      <div
        onClick={() => onOpenSlot('wing')}
        className={`w-full relative z-20 mb-[-12px] h-[78px] rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-2xl group overflow-hidden ${wingColors.accent}`}
      >
        {/* Real Paraglider Wing Photo in Flight */}
        <img
          src={wingPhotoUrl}
          alt={`${glider.brand} ${glider.model} Paraglider Wing in flight`}
          className="absolute inset-0 w-full h-full object-cover object-center filter saturate-125 group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Ambient Darkened Gradient Overlay so text pops with high contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

        {/* Paraglider Wing Information Overlay */}
        <div className="relative z-10 h-full p-2.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-amber-400 shadow-md group-hover:rotate-12 transition">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded border ${wingColors.badge}`}>
                  {glider.brand}
                </span>
                <span className="text-[10px] font-mono px-1 rounded bg-black/60 font-bold text-amber-300">
                  {glider.size}m²
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-black tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] truncate max-w-[210px]">
                {glider.model}
              </h4>
            </div>
          </div>

          <div className="text-right bg-black/60 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10">
            <span className="text-[9px] text-slate-300 uppercase block font-bold tracking-wider">Surface Area</span>
            <span className="font-mono text-xs font-black text-amber-300">
              {glider.area} m²
            </span>
          </div>
        </div>

        {/* Suspension Lines running down from wing into pilot harness */}
        <div className="absolute left-1/4 right-1/4 bottom-[-16px] h-4 flex justify-between pointer-events-none opacity-40">
          <div className="w-[1.5px] h-full bg-slate-300 transform -rotate-12" />
          <div className="w-[1.5px] h-full bg-slate-300 transform -rotate-6" />
          <div className="w-[1.5px] h-full bg-slate-300 transform rotate-6" />
          <div className="w-[1.5px] h-full bg-slate-300 transform rotate-12" />
        </div>
      </div>

      {/* CENTRAL COMPOSITE ARENA */}
      <div className="relative w-full aspect-[4/5] flex items-center justify-center overflow-hidden rounded-3xl bg-slate-950/60 border border-slate-800/80">
        {/* Dynamic Background Thrust Particles in In-Flight Mode */}
        {flightMode === 'inflight' && (
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Wind streamlines */}
            <div className="absolute top-1/4 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-60 animate-pulse" />
            <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-sky-300 to-transparent opacity-40 animate-pulse delay-100" />
            <div className="absolute top-3/4 left-1 right-1 h-[1px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-50 animate-pulse delay-200" />
            
            {/* Propeller thrust cone at rear */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gradient-to-t from-orange-500/20 via-amber-500/10 to-transparent blur-2xl animate-pulse" />
          </div>
        )}

        {/* ROTATING PROPELLER BLADES (Behind pilot back) */}
        <div 
          onClick={() => onOpenSlot('engine')}
          className="absolute z-[5] w-64 h-64 rounded-full flex items-center justify-center cursor-pointer group"
          title={`${engine.model} (${engine.thrust} kg static thrust)`}
        >
          {/* Outer Cage Ring with Material Glow */}
          <div 
            className={`w-full h-full rounded-full border-2 transition-all duration-300 ${
              isCarbon
                ? 'border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : isTitanium
                ? 'border-amber-400/70 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'border-slate-500/60 shadow-[0_0_15px_rgba(148,163,184,0.3)]'
            } group-hover:scale-105`}
          >
            {/* Internal Safety Netting Mesh */}
            <div className="w-full h-full rounded-full border border-dashed border-white/20 opacity-30" />
          </div>

          {/* Propeller Blades with dynamic rotation animation */}
          <div
            className="absolute w-52 h-6 flex items-center justify-between"
            style={{
              animation: `spin ${propSpeedSec} linear infinite`,
            }}
          >
            {/* Blade 1 */}
            <div className="w-24 h-5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-transparent shadow-lg" />
            {/* Prop hub center */}
            <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-amber-400 shadow-md flex-shrink-0" />
            {/* Blade 2 */}
            <div className="w-24 h-5 rounded-full bg-gradient-to-l from-amber-400 via-amber-500 to-transparent shadow-lg" />
          </div>
        </div>

        {/* MAIN PHOTOGRAPH (Pilot Model) */}
        <img
          src={pilotModelImg}
          alt="Paramotor Pilot Character Model"
          className={`relative z-10 w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] transition-all duration-300 ${
            flightMode === 'inflight' ? 'scale-105 -translate-y-2' : ''
          }`}
        />

        {/* DYNAMIC EQUIPPED GEAR OVERLAYS ON PILOT BODY */}

        {/* 1. Helmet Cyber Visor Glow */}
        {isHelmetActive && (
          <div 
            onClick={() => onOpenSlot('helmet')}
            className="absolute top-[28%] left-1/2 -translate-x-1/2 z-20 w-16 h-8 rounded-full bg-sky-400/25 border border-sky-400/70 shadow-[0_0_15px_rgba(14,165,233,0.8)] backdrop-blur-[1px] cursor-pointer hover:bg-sky-400/40 transition group"
            title={`${helmet.name}`}
          >
            {/* HUD scanline */}
            <div className="w-full h-[1px] bg-white opacity-70 animate-pulse mt-3" />
            {showReticule && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-bold text-sky-300 bg-black/70 px-1 rounded whitespace-nowrap">
                HELMET
              </span>
            )}
          </div>
        )}

        {/* 2. Heated / Tactical Gloves Glow on Hands */}
        {isGlovesActive && (
          <>
            {/* Left Hand */}
            <div 
              onClick={() => onOpenSlot('gloves')}
              className={`absolute top-[48%] left-[26%] z-20 w-7 h-7 rounded-full cursor-pointer transition ${
                hasHeatedGloves
                  ? 'bg-orange-500/30 border border-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.8)]'
                  : 'bg-sky-500/20 border border-sky-400/60 shadow-[0_0_8px_rgba(14,165,233,0.6)]'
              }`}
              title={gloves.name}
            />
            {/* Right Hand */}
            <div 
              onClick={() => onOpenSlot('gloves')}
              className={`absolute top-[48%] right-[26%] z-20 w-7 h-7 rounded-full cursor-pointer transition ${
                hasHeatedGloves
                  ? 'bg-orange-500/30 border border-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.8)]'
                  : 'bg-sky-500/20 border border-sky-400/60 shadow-[0_0_8px_rgba(14,165,233,0.6)]'
              }`}
              title={gloves.name}
            />
          </>
        )}

        {/* 3. Flight Boots Glow at Feet */}
        {isBootsActive && (
          <div 
            onClick={() => onOpenSlot('boots')}
            className="absolute bottom-[8%] left-1/2 -translate-x-1/2 z-20 flex gap-6 cursor-pointer"
            title={boots.name}
          >
            <div className="w-8 h-4 rounded-lg bg-amber-500/20 border border-amber-400/60 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            <div className="w-8 h-4 rounded-lg bg-amber-500/20 border border-amber-400/60 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          </div>
        )}


        {/* 5. Cockpit Accessory / Camera Mount */}
        {isAccessoryActive && (
          <div 
            onClick={() => onOpenSlot('accessory')}
            className="absolute top-[40%] left-[22%] z-20 p-1 rounded-md bg-purple-500/30 border border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.7)] cursor-pointer hover:scale-110 transition flex items-center gap-1"
            title={`Accessory: ${accessory.name}`}
          >
            <Camera className="w-3 h-3 text-purple-300" />
            <span className="text-[8px] font-black text-purple-200 uppercase truncate max-w-[45px]">
              {accessory.name.split(' ')[0]}
            </span>
          </div>
        )}

        {/* FLOATING RPG NOTIFICATION (When gear is swapped) */}
        {floatingAlert && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 bg-amber-500 text-slate-950 px-3.5 py-1.5 rounded-full font-black text-xs shadow-2xl tracking-wider animate-bounce flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>{floatingAlert.text}</span>
          </div>
        )}

        {/* CHEST HERO AUW TELEMETRY DISPLAY */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-slate-950/90 border-2 border-amber-500/90 px-4 py-2 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.65)] backdrop-blur-md text-center min-w-[200px] cursor-pointer hover:scale-105 transition">
          <div className="flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Activity className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>TOTAL ALL-UP WEIGHT</span>
          </div>
          <div className="flex items-baseline justify-center gap-1.5 mt-0.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white">
              {(unit === 'kg' ? totalWeightKg : totalWeightKg * 2.20462).toFixed(1)}
            </span>
            <span className="text-sm font-black text-amber-400 uppercase font-mono">
              {unit}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">
            {engine.brand} {engine.model.split(' ')[0]} • {glider.area}m² {glider.brand}
          </span>
        </div>
      </div>
    </div>
  );
};
