import React, { useState, useMemo } from 'react';
import { 
  X, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Wind, 
  Flame, 
  Shield, 
  LifeBuoy, 
  HardHat, 
  Hand, 
  Footprints, 
  Radio, 
  Plus, 
  Trash2, 
  Search,
  Filter
} from 'lucide-react';
import { 
  GEAR_DATA, 
  EngineItem, 
  FrameItem, 
  ReserveItem, 
  AccessoryItem, 
  WearableItem, 
  GliderSize, 
  Rarity 
} from '../data/gearData';
import { SocketType } from './RPGSocket';
import { formatWeight } from '../utils/units';
import { getWingPhoto } from './DynamicPilotModel';

interface EquipDrawerProps {
  isOpen: boolean;
  type: SocketType | null;
  onClose: () => void;
  unit: 'kg' | 'lbs';
  onEquipEngine: (engine: EngineItem) => void;
  onEquipFrame: (frame: FrameItem) => void;
  onEquipWing: (glider: { brand: string; model: string; size: string; weight: number; area: number }) => void;
  onEquipReserve: (reserve: ReserveItem) => void;
  onEquipHelmet: (helmet: WearableItem) => void;
  onEquipGloves: (gloves: WearableItem) => void;
  onEquipBoots: (boots: WearableItem) => void;
  onEquipAccessory: (acc: AccessoryItem) => void;
  onUnequip: (type: SocketType) => void;
}

export const EquipDrawer: React.FC<EquipDrawerProps> = ({
  isOpen,
  type,
  onClose,
  unit,
  onEquipEngine,
  onEquipFrame,
  onEquipWing,
  onEquipReserve,
  onEquipHelmet,
  onEquipGloves,
  onEquipBoots,
  onEquipAccessory,
  onUnequip,
}) => {
  // Wing drill-down steps: 'mfr' -> 'model' -> 'size'
  const [wingStep, setWingStep] = useState<'mfr' | 'model' | 'size'>('mfr');
  const [selectedMfr, setSelectedMfr] = useState<string>('FlyOzone');
  const [selectedModel, setSelectedModel] = useState<string>('Spyder 3 (Ultralight Reflex)');

  // Filter / Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [engineBrandFilter, setEngineBrandFilter] = useState<string>('all');
  const [frameBrandFilter, setFrameBrandFilter] = useState<string>('all');

  // Custom Item Mode
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customWeightDisplay, setCustomWeightDisplay] = useState('5.0');
  const [customArea, setCustomArea] = useState('22.0');
  const [customThrust, setCustomThrust] = useState('75.0');

  // Reset drill-down when opening drawer
  React.useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setIsCustomMode(false);
      if (type === 'wing') {
        setWingStep('mfr');
      }
    }
  }, [isOpen, type]);

  if (!isOpen || !type) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const rawWeight = parseFloat(customWeightDisplay) || 1.0;
    const weightKg = unit === 'lbs' ? rawWeight / 2.20462 : rawWeight;

    if (type === 'engine') {
      const thrustKg = unit === 'lbs' ? (parseFloat(customThrust) || 160) / 2.20462 : parseFloat(customThrust) || 75;
      onEquipEngine({
        id: `custom-eng-${Date.now()}`,
        brand: 'Custom',
        model: customName.trim(),
        weight: weightKg,
        thrust: thrustKg,
        rarity: 'rare',
      });
    } else if (type === 'frame') {
      onEquipFrame({
        id: `custom-frame-${Date.now()}`,
        brand: 'Custom',
        model: customName.trim(),
        weight: weightKg,
        rarity: 'rare',
      });
    } else if (type === 'wing') {
      onEquipWing({
        brand: 'Custom',
        model: customName.trim(),
        size: `${Math.round(parseFloat(customArea) || 22)}`,
        weight: weightKg,
        area: parseFloat(customArea) || 22.0,
      });
    } else if (type === 'reserve') {
      onEquipReserve({
        id: `custom-res-${Date.now()}`,
        brand: 'Custom',
        model: customName.trim(),
        weight: weightKg,
        type: 'Square',
        rarity: 'rare',
      });
    } else if (type === 'helmet') {
      onEquipHelmet({
        id: `custom-helm-${Date.now()}`,
        name: customName.trim(),
        weight: weightKg,
        rarity: 'rare',
      });
    } else if (type === 'gloves') {
      onEquipGloves({
        id: `custom-glove-${Date.now()}`,
        name: customName.trim(),
        weight: weightKg,
        rarity: 'rare',
      });
    } else if (type === 'boots') {
      onEquipBoots({
        id: `custom-boot-${Date.now()}`,
        name: customName.trim(),
        weight: weightKg,
        rarity: 'rare',
      });
    } else if (type === 'accessory') {
      onEquipAccessory({
        id: `custom-acc-${Date.now()}`,
        name: customName.trim(),
        weight: weightKg,
        category: 'Custom',
        rarity: 'rare',
      });
    }

    onClose();
  };

  // Filtered engines
  const filteredEngines = GEAR_DATA.engines.filter((eng) => {
    if (engineBrandFilter !== 'all' && eng.brand.toLowerCase() !== engineBrandFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return eng.model.toLowerCase().includes(q) || eng.brand.toLowerCase().includes(q);
    }
    return true;
  });

  // Filtered frames
  const filteredFrames = GEAR_DATA.frames.filter((frame) => {
    if (frameBrandFilter !== 'all') {
      if (frameBrandFilter === 'parajet' && !frame.brand.toLowerCase().includes('parajet')) return false;
      if (frameBrandFilter === 'pap' && !frame.brand.toLowerCase().includes('pap')) return false;
      if (frameBrandFilter === 'iris' && !frame.brand.toLowerCase().includes('iris')) return false;
      if (frameBrandFilter === 'macfly' && !frame.brand.toLowerCase().includes('macfly')) return false;
      if (frameBrandFilter === 'kangook' && !frame.brand.toLowerCase().includes('kangook')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return frame.model.toLowerCase().includes(q) || frame.brand.toLowerCase().includes(q) || (frame.material && frame.material.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <span className="text-xs uppercase font-black tracking-widest text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              EQUIP
            </span>
            <h3 className="text-lg font-black text-white capitalize">
              {type === 'wing' ? 'Glider / Paraglider Wing' : type === 'engine' ? 'Paramotor Motor Unit' : type === 'frame' ? 'Paramotor Airframe Cage' : type}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUnequip(type)}
              className="text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Unequip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-toolbar: Search & Custom Toggle */}
        <div className="px-5 pt-3 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-950/40 border-b border-slate-850">
          {/* Quick Search */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder={`Search ${type} brand or model...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={() => setIsCustomMode(!isCustomMode)}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 self-end sm:self-center"
          >
            {isCustomMode ? '← Back to Catalog' : '+ Custom Item'}
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 flex-1 overflow-y-auto no-scrollbar">
          {isCustomMode ? (
            /* Custom Item Form */
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Item / Model Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Vittorazi Moster 185 Classic / Custom Frame"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Weight ({unit}) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={customWeightDisplay}
                    onChange={(e) => setCustomWeightDisplay(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {type === 'wing' && (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Wing Area (m²) *</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={customArea}
                      onChange={(e) => setCustomArea(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                {type === 'engine' && (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Static Thrust ({unit})</label>
                    <input
                      type="number"
                      step="1"
                      value={customThrust}
                      onChange={(e) => setCustomThrust(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/30 active:scale-95 mt-2"
              >
                Equip Custom Item
              </button>
            </form>
          ) : (
            /* Catalog Selector by Slot Type */
            <div className="space-y-3">
              {/* ENGINES (Vittorazi, Polini, Air Conception, Corsair, EOS, Minari) */}
              {type === 'engine' && (
                <div className="space-y-3">
                  {/* Brand Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                    {['all', 'vittorazi', 'polini', 'air conception', 'corsair'].map((b) => (
                      <button
                        key={b}
                        onClick={() => setEngineBrandFilter(b)}
                        className={`px-3 py-1 rounded-xl font-bold uppercase transition whitespace-nowrap border ${
                          engineBrandFilter === b
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {b === 'all' ? 'All Engines' : b}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {filteredEngines.map((eng) => (
                      <div
                        key={eng.id}
                        onClick={() => {
                          onEquipEngine(eng);
                          onClose();
                        }}
                        className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-amber-500 hover:bg-slate-900 transition cursor-pointer select-none group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                            {eng.brand}
                          </span>
                        </div>
                        <p className="text-sm font-black text-white group-hover:text-amber-300 transition">
                          {eng.model}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-mono">
                          <span>
                            {eng.displacementCc ? `${eng.displacementCc} cc` : ''} • {formatWeight(eng.weight, unit === 'kg' ? 'metric' : 'imperial')}
                          </span>
                          <span className="text-amber-400 font-bold">{eng.thrust} kg thrust</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FRAMES (Parajet, PAP, Iris, Macfly, Kangook, Power2Fly, Scout, Adventure) */}
              {type === 'frame' && (
                <div className="space-y-3">
                  {/* Brand Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                    {[
                      { id: 'all', label: 'All Frames' },
                      { id: 'parajet', label: 'Parajet' },
                      { id: 'pap', label: 'PAP' },
                      { id: 'iris', label: 'Iris' },
                      { id: 'macfly', label: 'Macfly' },
                      { id: 'kangook', label: 'Kangook' },
                    ].map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setFrameBrandFilter(b.id)}
                        className={`px-3 py-1 rounded-xl font-bold uppercase transition whitespace-nowrap border ${
                          frameBrandFilter === b.id
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {filteredFrames.map((frame) => (
                      <div
                        key={frame.id}
                        onClick={() => {
                          onEquipFrame(frame);
                          onClose();
                        }}
                        className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-amber-500 hover:bg-slate-900 transition cursor-pointer select-none group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                            {frame.brand}
                          </span>
                        </div>
                        <p className="text-sm font-black text-white group-hover:text-amber-300 transition">
                          {frame.model}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-mono">
                          <span>{frame.material}</span>
                          <span className="text-slate-200 font-bold">{formatWeight(frame.weight, unit === 'kg' ? 'metric' : 'imperial')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WING (Hierarchical Drill-Down: Dudek, FlyOzone, BGD, Niviuk, Macpara, Velocity, Gin, Flare) */}
              {type === 'wing' && (
                <div className="space-y-3">
                  {/* Step breadcrumbs */}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 pb-2 border-b border-slate-800">
                    <button
                      onClick={() => setWingStep('mfr')}
                      className={`hover:text-amber-400 transition ${wingStep === 'mfr' ? 'text-amber-400 font-black underline' : ''}`}
                    >
                      1. Manufacturer ({selectedMfr})
                    </button>
                    <span>/</span>
                    <button
                      onClick={() => setWingStep('model')}
                      className={`hover:text-amber-400 transition ${wingStep === 'model' ? 'text-amber-400 font-black underline' : ''}`}
                    >
                      2. Model ({selectedModel.split(' (')[0]})
                    </button>
                    <span>/</span>
                    <span className={wingStep === 'size' ? 'text-amber-400 font-black underline' : ''}>
                      3. Size
                    </span>
                  </div>

                  {/* Step 1: Select Manufacturer with Real Wing Photography */}
                  {wingStep === 'mfr' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {Object.keys(GEAR_DATA.manufacturers)
                        .filter((mfr) => searchQuery ? mfr.toLowerCase().includes(searchQuery.toLowerCase()) : true)
                        .map((mfr) => {
                          const modelCount = Object.keys(GEAR_DATA.manufacturers[mfr].models).length;
                          const photoUrl = getWingPhoto(mfr);
                          return (
                            <div
                              key={mfr}
                              onClick={() => {
                                setSelectedMfr(mfr);
                                const firstModel = Object.keys(GEAR_DATA.manufacturers[mfr].models)[0];
                                setSelectedModel(firstModel);
                                setWingStep('model');
                              }}
                              className="relative h-28 rounded-2xl border-2 border-slate-800 hover:border-amber-400 overflow-hidden cursor-pointer group transition-all duration-200 shadow-lg active:scale-95"
                            >
                              {/* Authentic Paraglider Wing Photo */}
                              <img
                                src={photoUrl}
                                alt={`${mfr} Paraglider Wing`}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-65"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                              <div className="relative z-10 p-2.5 h-full flex flex-col justify-end text-left">
                                <div className="flex items-center gap-1 mb-0.5">
                                  <Wind className="w-3.5 h-3.5 text-amber-400" />
                                  <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider">
                                    {modelCount} Models
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm font-black text-white truncate drop-shadow-md">
                                  {mfr}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* Step 2: Select Model with Brand Showcase Banner */}
                  {wingStep === 'model' && (
                    <div className="space-y-3">
                      {/* Brand Hero Photo Showcase */}
                      <div className="relative h-24 rounded-2xl border border-slate-800 overflow-hidden">
                        <img
                          src={getWingPhoto(selectedMfr)}
                          alt={`${selectedMfr} Paraglider Showcase`}
                          className="absolute inset-0 w-full h-full object-cover filter brightness-50"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
                        <div className="relative z-10 p-3 h-full flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block mb-0.5">
                              SELECTED BRAND
                            </span>
                            <h4 className="text-base font-black text-white">{selectedMfr}</h4>
                            <p className="text-[11px] text-slate-300">
                              {Object.keys(GEAR_DATA.manufacturers[selectedMfr]?.models || {}).length} Flight Models
                            </p>
                          </div>
                          <button
                            onClick={() => setWingStep('mfr')}
                            className="text-xs text-amber-400 hover:text-white px-2.5 py-1 rounded-lg bg-black/60 border border-amber-400/40 font-bold transition flex items-center gap-1"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Change Brand</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.keys(GEAR_DATA.manufacturers[selectedMfr]?.models || {})
                          .filter((mod) => searchQuery ? mod.toLowerCase().includes(searchQuery.toLowerCase()) : true)
                          .map((modelName) => (
                            <div
                              key={modelName}
                              onClick={() => {
                                setSelectedModel(modelName);
                                setWingStep('size');
                              }}
                              className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-amber-500 hover:bg-slate-900 transition cursor-pointer flex items-center justify-between group"
                            >
                              <div>
                                <p className="text-sm font-black text-white group-hover:text-amber-300">
                                  {modelName}
                                </p>
                                <span className="text-[10px] text-slate-400">
                                  {GEAR_DATA.manufacturers[selectedMfr].models[modelName].length} sizes available
                                </span>
                              </div>
                              <span className="text-xs text-amber-400 font-bold group-hover:translate-x-1 transition">
                                →
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Select Size */}
                  {wingStep === 'size' && (
                    <div className="space-y-2">
                      <button
                        onClick={() => setWingStep('model')}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-1 font-semibold"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>← Back to {selectedMfr} Models</span>
                      </button>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {GEAR_DATA.manufacturers[selectedMfr]?.models[selectedModel]?.map((sizeItem) => (
                          <div
                            key={sizeItem.size}
                            onClick={() => {
                              onEquipWing({
                                brand: selectedMfr,
                                model: selectedModel,
                                size: sizeItem.size,
                                weight: sizeItem.weight,
                                area: sizeItem.area,
                              });
                              onClose();
                            }}
                            className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-emerald-500 hover:bg-slate-900 transition cursor-pointer text-center group"
                          >
                            <span className="text-2xl font-black text-emerald-400 font-mono group-hover:scale-110 transition block">
                              {sizeItem.size}m
                            </span>
                            <span className="text-xs text-slate-300 font-bold block mt-1">
                              {sizeItem.area} m² area
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                              {formatWeight(sizeItem.weight, unit === 'kg' ? 'metric' : 'imperial')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* RESERVES */}
              {type === 'reserve' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GEAR_DATA.reserves
                    .filter((r) => searchQuery ? r.model.toLowerCase().includes(searchQuery.toLowerCase()) || r.brand.toLowerCase().includes(searchQuery.toLowerCase()) : true)
                    .map((res) => (
                      <div
                        key={res.id}
                        onClick={() => {
                          onEquipReserve(res);
                          onClose();
                        }}
                        className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-amber-500 hover:bg-slate-900 transition cursor-pointer select-none group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                            {res.brand}
                          </span>
                        </div>
                        <p className="text-sm font-black text-white group-hover:text-amber-300 transition">
                          {res.model}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-mono">
                          <span>{res.type}</span>
                          <span className="text-slate-200 font-bold">{formatWeight(res.weight, unit === 'kg' ? 'metric' : 'imperial')}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* HELMETS */}
              {type === 'helmet' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GEAR_DATA.helmets
                    .filter((h) => searchQuery ? h.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
                    .map((helm) => (
                      <div
                        key={helm.id}
                        onClick={() => {
                          onEquipHelmet(helm);
                          onClose();
                        }}
                        className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-amber-500 hover:bg-slate-900 transition cursor-pointer select-none group"
                      >
                        <p className="text-sm font-black text-white group-hover:text-amber-300 transition">
                          {helm.name}
                        </p>
                        <div className="text-right text-xs text-slate-200 font-mono font-bold mt-2">
                          {formatWeight(helm.weight, unit === 'kg' ? 'metric' : 'imperial')}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* GLOVES */}
              {type === 'gloves' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GEAR_DATA.gloves
                    .filter((g) => searchQuery ? g.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
                    .map((glove) => (
                      <div
                        key={glove.id}
                        onClick={() => {
                          onEquipGloves(glove);
                          onClose();
                        }}
                        className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-amber-500 hover:bg-slate-900 transition cursor-pointer select-none group"
                      >
                        <p className="text-sm font-black text-white group-hover:text-amber-300 transition">
                          {glove.name}
                        </p>
                        <div className="text-right text-xs text-slate-200 font-mono font-bold mt-2">
                          {formatWeight(glove.weight, unit === 'kg' ? 'metric' : 'imperial')}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* BOOTS */}
              {type === 'boots' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GEAR_DATA.boots
                    .filter((b) => searchQuery ? b.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
                    .map((boot) => (
                      <div
                        key={boot.id}
                        onClick={() => {
                          onEquipBoots(boot);
                          onClose();
                        }}
                        className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-amber-500 hover:bg-slate-900 transition cursor-pointer select-none group"
                      >
                        <p className="text-sm font-black text-white group-hover:text-amber-300 transition">
                          {boot.name}
                        </p>
                        <div className="text-right text-xs text-slate-200 font-mono font-bold mt-2">
                          {formatWeight(boot.weight, unit === 'kg' ? 'metric' : 'imperial')}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* ACCESSORIES */}
              {type === 'accessory' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GEAR_DATA.accessories
                    .filter((a) => searchQuery ? a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.category.toLowerCase().includes(searchQuery.toLowerCase()) : true)
                    .map((acc) => (
                      <div
                        key={acc.id}
                        onClick={() => {
                          onEquipAccessory(acc);
                          onClose();
                        }}
                        className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-amber-500 hover:bg-slate-900 transition cursor-pointer select-none group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black uppercase text-slate-400">
                            {acc.category}
                          </span>
                        </div>
                        <p className="text-sm font-black text-white group-hover:text-amber-300 transition">
                          {acc.name}
                        </p>
                        <div className="text-right text-xs text-slate-200 font-mono font-bold mt-2">
                          {formatWeight(acc.weight, unit === 'kg' ? 'metric' : 'imperial')}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
