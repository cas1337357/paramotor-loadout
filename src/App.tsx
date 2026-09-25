/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  GEAR_DATA, 
  EngineItem, 
  FrameItem, 
  ReserveItem, 
  AccessoryItem, 
  WearableItem, 
  Rarity 
} from './data/gearData';
import { RPGSocket, SocketType } from './components/RPGSocket';
import { EquipDrawer } from './components/EquipDrawer';
import { RPGStatsPedestal } from './components/RPGStatsPedestal';
import { DynamicPilotModel } from './components/DynamicPilotModel';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { 
  RotateCcw, 
  Sparkles, 
  Plane,
  Layers,
  Sparkle
} from 'lucide-react';

interface EquippedLoadout {
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
  // Slot active toggles
  isHelmetActive: boolean;
  isGlovesActive: boolean;
  isBootsActive: boolean;
  isReserveActive: boolean;
  isAccessoryActive: boolean;
}

const DEFAULT_LOADOUT: EquippedLoadout = {
  engine: GEAR_DATA.engines[0], // Moster 185 Plus MY25
  frame: GEAR_DATA.frames[0],   // Parajet Maverick Titanium
  glider: {
    brand: 'FlyOzone',
    model: 'Spyder 3 (Ultralight Reflex)',
    size: '22',
    weight: 4.19,
    area: 22.0,
  },
  reserve: GEAR_DATA.reserves[0], // Ultra Cross 100
  helmet: GEAR_DATA.helmets[0],  // Comms Pro Helmet
  gloves: GEAR_DATA.gloves[0],   // Heated Gloves
  boots: GEAR_DATA.boots[0],     // Crispi Airborne
  accessory: GEAR_DATA.accessories[0], // GoPro 13
  isHelmetActive: true,
  isGlovesActive: true,
  isBootsActive: true,
  isReserveActive: true,
  isAccessoryActive: true,
};

export default function App() {
  // Local storage loader
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  // State
  const [unit, setUnit] = useState<'kg' | 'lbs'>(() =>
    loadStored('rpg_unit_v4', 'kg')
  );

  const [pilotWeightKg, setPilotWeightKg] = useState<number>(() =>
    loadStored('rpg_pilot_weight_v4', 82.0)
  );

  const [fuelLiters, setFuelLiters] = useState<number>(() =>
    loadStored('rpg_fuel_liters_v4', 7.0)
  );

  const [loadout, setLoadout] = useState<EquippedLoadout>(() =>
    loadStored('rpg_equipped_loadout_v4', DEFAULT_LOADOUT)
  );

  // Equip Drawer modal state
  const [drawerSlot, setDrawerSlot] = useState<SocketType | null>(null);

  // Feedback when changing gear
  const [lastChangedSlot, setLastChangedSlot] = useState<{
    slot: SocketType;
    name: string;
    weightDeltaKg: number;
  } | null>(null);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('rpg_unit_v4', JSON.stringify(unit));
  }, [unit]);

  useEffect(() => {
    localStorage.setItem('rpg_pilot_weight_v4', JSON.stringify(pilotWeightKg));
  }, [pilotWeightKg]);

  useEffect(() => {
    localStorage.setItem('rpg_fuel_liters_v4', JSON.stringify(fuelLiters));
  }, [fuelLiters]);

  useEffect(() => {
    localStorage.setItem('rpg_equipped_loadout_v4', JSON.stringify(loadout));
  }, [loadout]);

  // Total Weight & Empty Weight Calculations
  const { totalWeightKg, emptyWeightKg } = useMemo(() => {
    // Empty paramotor mass (frame + engine)
    const engineWeight = loadout.engine?.weight || 0;
    const frameWeight = loadout.frame?.weight || 0;
    const gliderWeight = loadout.glider?.weight || 0;
    const reserveWeight = loadout.isReserveActive ? (loadout.reserve?.weight || 0) : 0;
    const helmetWeight = loadout.isHelmetActive ? (loadout.helmet?.weight || 0) : 0;
    const glovesWeight = loadout.isGlovesActive ? (loadout.gloves?.weight || 0) : 0;
    const bootsWeight = loadout.isBootsActive ? (loadout.boots?.weight || 0) : 0;
    const accessoryWeight = loadout.isAccessoryActive ? (loadout.accessory?.weight || 0) : 0;

    // Fuel weight: 2-stroke mixed fuel has density ~0.748 kg/L
    const fuelWeight = fuelLiters * 0.748;

    // Standard baseline clothing & harness hardware
    const baselineHardwareKg = 2.5;

    // Empty paramotor unit weight (for FAA Part 103: engine + frame + prop/cage)
    const emptyMass = engineWeight + frameWeight + baselineHardwareKg;

    // Total in-flight All-Up Weight (AUW)
    const total = 
      pilotWeightKg +
      engineWeight +
      frameWeight +
      gliderWeight +
      reserveWeight +
      helmetWeight +
      glovesWeight +
      bootsWeight +
      accessoryWeight +
      fuelWeight +
      baselineHardwareKg;

    return {
      totalWeightKg: total,
      emptyWeightKg: emptyMass,
    };
  }, [loadout, pilotWeightKg, fuelLiters]);

  // Reset to default
  const handleReset = () => {
    if (window.confirm('Reset equipment loadout to default paramotor configuration?')) {
      setLoadout(DEFAULT_LOADOUT);
      setPilotWeightKg(82.0);
      setFuelLiters(7.0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Cyber / RPG Header */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* Logo & Branding */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950/70 rounded-[10px] flex items-center justify-center">
                <Plane className="w-5 h-5 text-amber-400 transform -rotate-45" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-sm sm:text-base tracking-wider uppercase text-white">
                  PARAMOTOR <span className="text-amber-400">CALCULATOR</span>
                </h1>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 hidden xs:inline">
                  RPG LOADOUT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                All-Up-Weight (AUW) • Dynamic Paper Doll • Wing Loading
              </p>
            </div>
          </div>

          {/* Quick Actions: Reset, Units, PWA Install */}
          <div className="flex items-center gap-2">
            {/* Unit toggle pill */}
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setUnit('kg')}
                className={`px-2.5 py-1 text-xs font-black rounded transition ${
                  unit === 'kg' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                KG
              </button>
              <button
                type="button"
                onClick={() => setUnit('lbs')}
                className={`px-2.5 py-1 text-xs font-black rounded transition ${
                  unit === 'lbs' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                LBS
              </button>
            </div>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
              title="Reset Loadout"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton />
          </div>
        </div>
      </header>

      {/* Main Content Arena */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* RPG Character Loadout Arena */}
        <div className="relative bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 border border-slate-800/90 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Subtle Cyber Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

          {/* Arena Header */}
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-300">
                PILOT EQUIPMENT LOADOUT
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Tap slots or pilot body to equip gear
            </span>
          </div>

          {/* The Paper Doll / Sockets Layout */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Left 4 Sockets (Desktop col 3, Mobile stack top) */}
            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-1 gap-2.5">
              {/* HEAD (Helmet) */}
              <RPGSocket
                type="helmet"
                label="HEAD"
                name={loadout.helmet.name}
                subText="Aviation Helmet"
                weightKg={loadout.helmet.weight}
                rarity={loadout.helmet.rarity}
                isActive={loadout.isHelmetActive}
                unit={unit}
                onClick={() => setDrawerSlot('helmet')}
                onToggleActive={() =>
                  setLoadout((prev) => ({ ...prev, isHelmetActive: !prev.isHelmetActive }))
                }
              />

              {/* WING (Glider) */}
              <RPGSocket
                type="wing"
                label="WING"
                name={`${loadout.glider.brand} ${loadout.glider.model}`}
                subText={`${loadout.glider.size}m • ${loadout.glider.area} m² Area`}
                weightKg={loadout.glider.weight}
                rarity="legendary"
                isActive={true}
                unit={unit}
                onClick={() => setDrawerSlot('wing')}
              />

              {/* RESERVE (Chute) */}
              <RPGSocket
                type="reserve"
                label="RESERVE"
                name={loadout.reserve.model}
                subText={`${loadout.reserve.brand} (${loadout.reserve.type})`}
                weightKg={loadout.reserve.weight}
                rarity={loadout.reserve.rarity}
                isActive={loadout.isReserveActive}
                unit={unit}
                onClick={() => setDrawerSlot('reserve')}
                onToggleActive={() =>
                  setLoadout((prev) => ({ ...prev, isReserveActive: !prev.isReserveActive }))
                }
              />

              {/* ACCESSORY (Misc) */}
              <RPGSocket
                type="accessory"
                label="MISC"
                name={loadout.accessory.name}
                subText={loadout.accessory.category}
                weightKg={loadout.accessory.weight}
                rarity={loadout.accessory.rarity}
                isActive={loadout.isAccessoryActive}
                unit={unit}
                onClick={() => setDrawerSlot('accessory')}
                onToggleActive={() =>
                  setLoadout((prev) => ({ ...prev, isAccessoryActive: !prev.isAccessoryActive }))
                }
              />
            </div>

            {/* Center Hero: Dynamic Interactive Pilot Model (Desktop col 6) */}
            <div className="md:col-span-6 flex flex-col items-center justify-center relative py-1">
              <DynamicPilotModel
                engine={loadout.engine}
                frame={loadout.frame}
                glider={loadout.glider}
                reserve={loadout.reserve}
                helmet={loadout.helmet}
                gloves={loadout.gloves}
                boots={loadout.boots}
                accessory={loadout.accessory}
                isHelmetActive={loadout.isHelmetActive}
                isGlovesActive={loadout.isGlovesActive}
                isBootsActive={loadout.isBootsActive}
                isReserveActive={loadout.isReserveActive}
                isAccessoryActive={loadout.isAccessoryActive}
                totalWeightKg={totalWeightKg}
                unit={unit}
                onOpenSlot={(slot) => setDrawerSlot(slot)}
                lastChangedSlot={lastChangedSlot}
              />
            </div>

            {/* Right 4 Sockets (Desktop col 3, Mobile stack bottom) */}
            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-1 gap-2.5">
              {/* GLOVES */}
              <RPGSocket
                type="gloves"
                label="GLOVES"
                name={loadout.gloves.name}
                subText="Handwear Protection"
                weightKg={loadout.gloves.weight}
                rarity={loadout.gloves.rarity}
                isActive={loadout.isGlovesActive}
                unit={unit}
                onClick={() => setDrawerSlot('gloves')}
                onToggleActive={() =>
                  setLoadout((prev) => ({ ...prev, isGlovesActive: !prev.isGlovesActive }))
                }
              />

              {/* ENGINE */}
              <RPGSocket
                type="engine"
                label="ENGINE"
                name={loadout.engine.model}
                subText={`${loadout.engine.brand} • ${loadout.engine.thrust} kg Thrust`}
                weightKg={loadout.engine.weight}
                rarity={loadout.engine.rarity}
                isActive={true}
                unit={unit}
                onClick={() => setDrawerSlot('engine')}
              />

              {/* FRAME */}
              <RPGSocket
                type="frame"
                label="FRAME"
                name={loadout.frame.model}
                subText={`${loadout.frame.brand} (${loadout.frame.material || 'Airframe'})`}
                weightKg={loadout.frame.weight}
                rarity={loadout.frame.rarity}
                isActive={true}
                unit={unit}
                onClick={() => setDrawerSlot('frame')}
              />

              {/* BOOTS */}
              <RPGSocket
                type="boots"
                label="BOOTS"
                name={loadout.boots.name}
                subText="Ankle Support Footwear"
                weightKg={loadout.boots.weight}
                rarity={loadout.boots.rarity}
                isActive={loadout.isBootsActive}
                unit={unit}
                onClick={() => setDrawerSlot('boots')}
                onToggleActive={() =>
                  setLoadout((prev) => ({ ...prev, isBootsActive: !prev.isBootsActive }))
                }
              />
            </div>
          </div>
        </div>

        {/* Sliders & Attribute Pedestal (Stats, Sliders, FAA Part 103, Wing Loading) */}
        <RPGStatsPedestal
          totalWeightKg={totalWeightKg}
          emptyWeightKg={emptyWeightKg}
          fuelLiters={fuelLiters}
          onFuelChange={setFuelLiters}
          pilotWeightKg={pilotWeightKg}
          onPilotWeightChange={setPilotWeightKg}
          wingAreaSqM={loadout.glider.area}
          engineThrustKg={loadout.engine.thrust}
          unit={unit}
          onToggleUnit={setUnit}
        />
      </main>

      {/* Offline Status Indicator */}
      <OfflineIndicator />

      {/* Equipment Loot Selection Drawer */}
      <EquipDrawer
        isOpen={drawerSlot !== null}
        type={drawerSlot}
        onClose={() => setDrawerSlot(null)}
        unit={unit}
        onEquipEngine={(engine) => {
          setLoadout((prev) => ({ ...prev, engine }));
          setLastChangedSlot({ slot: 'engine', name: `${engine.brand} ${engine.model}`, weightDeltaKg: engine.weight });
        }}
        onEquipFrame={(frame) => {
          setLoadout((prev) => ({ ...prev, frame }));
          setLastChangedSlot({ slot: 'frame', name: `${frame.brand} ${frame.model}`, weightDeltaKg: frame.weight });
        }}
        onEquipWing={(glider) => {
          setLoadout((prev) => ({ ...prev, glider }));
          setLastChangedSlot({ slot: 'wing', name: `${glider.brand} ${glider.model} (${glider.size}m)`, weightDeltaKg: glider.weight });
        }}
        onEquipReserve={(reserve) => {
          setLoadout((prev) => ({ ...prev, reserve, isReserveActive: true }));
          setLastChangedSlot({ slot: 'reserve', name: reserve.model, weightDeltaKg: reserve.weight });
        }}
        onEquipHelmet={(helmet) => {
          setLoadout((prev) => ({ ...prev, helmet, isHelmetActive: true }));
          setLastChangedSlot({ slot: 'helmet', name: helmet.name, weightDeltaKg: helmet.weight });
        }}
        onEquipGloves={(gloves) => {
          setLoadout((prev) => ({ ...prev, gloves, isGlovesActive: true }));
          setLastChangedSlot({ slot: 'gloves', name: gloves.name, weightDeltaKg: gloves.weight });
        }}
        onEquipBoots={(boots) => {
          setLoadout((prev) => ({ ...prev, boots, isBootsActive: true }));
          setLastChangedSlot({ slot: 'boots', name: boots.name, weightDeltaKg: boots.weight });
        }}
        onEquipAccessory={(accessory) => {
          setLoadout((prev) => ({ ...prev, accessory, isAccessoryActive: true }));
          setLastChangedSlot({ slot: 'accessory', name: accessory.name, weightDeltaKg: accessory.weight });
        }}
        onUnequip={(slotType) => {
          if (slotType === 'helmet') setLoadout((prev) => ({ ...prev, isHelmetActive: false }));
          if (slotType === 'gloves') setLoadout((prev) => ({ ...prev, isGlovesActive: false }));
          if (slotType === 'boots') setLoadout((prev) => ({ ...prev, isBootsActive: false }));
          if (slotType === 'reserve') setLoadout((prev) => ({ ...prev, isReserveActive: false }));
          if (slotType === 'accessory') setLoadout((prev) => ({ ...prev, isAccessoryActive: false }));
          setDrawerSlot(null);
        }}
      />
    </div>
  );
}
