import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Copy, 
  Trash2, 
  Check, 
  Flame, 
  Fuel, 
  Compass, 
  Mountain, 
  Tent, 
  Sunset,
  GraduationCap
} from 'lucide-react';
import { LoadoutPreset, UnitSystem } from '../types/paramotor';
import { formatVolume } from '../utils/units';

interface LoadoutPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: LoadoutPreset[];
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  onCreatePreset: (preset: Omit<LoadoutPreset, 'id'>) => void;
  onDuplicatePreset: (presetId: string) => void;
  onDeletePreset: (presetId: string) => void;
  unitSystem: UnitSystem;
}

export const LoadoutPresetsModal: React.FC<LoadoutPresetsModalProps> = ({
  isOpen,
  onClose,
  presets,
  activePresetId,
  onSelectPreset,
  onCreatePreset,
  onDuplicatePreset,
  onDeletePreset,
  unitSystem,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newFlightType, setNewFlightType] = useState<LoadoutPreset['flightType']>('sunset');
  const [newFuelLiters, setNewFuelLiters] = useState('6.0');
  const [newMissionNotes, setNewMissionNotes] = useState('');

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onCreatePreset({
      name: newName.trim(),
      description: newDescription.trim() || 'Custom paramotor flight profile',
      icon: newFlightType === 'bivy' ? 'Tent' : newFlightType === 'xc' ? 'Compass' : 'Sunset',
      fuelLiters: parseFloat(newFuelLiters) || 6.0,
      includedItemIds: [],
      missionNotes: newMissionNotes.trim(),
      flightType: newFlightType,
    });

    setIsCreating(false);
    setNewName('');
    setNewDescription('');
    setNewMissionNotes('');
  };

  const getFlightIcon = (type: LoadoutPreset['flightType']) => {
    switch (type) {
      case 'bivy':
        return <Tent className="w-4 h-4 text-emerald-400" />;
      case 'xc':
        return <Compass className="w-4 h-4 text-sky-400" />;
      case 'thermal':
        return <Mountain className="w-4 h-4 text-purple-400" />;
      case 'training':
        return <GraduationCap className="w-4 h-4 text-amber-400" />;
      default:
        return <Sunset className="w-4 h-4 text-orange-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Loadout Presets</h3>
            <p className="text-xs text-slate-400">
              Manage different gear combinations for XC, sunset cruises, or bivy camping
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Presets */}
        <div className="space-y-2.5 mt-4">
          {presets.map((preset) => {
            const isActive = preset.id === activePresetId;

            return (
              <div
                key={preset.id}
                className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-sky-500/10 border-sky-500/50 shadow-sm'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => {
                    onSelectPreset(preset.id);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2">
                    {getFlightIcon(preset.flightType)}
                    <span className="font-bold text-sm text-white">{preset.name}</span>
                    {isActive && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-500 text-slate-950">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {preset.description}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Fuel className="w-3 h-3 text-amber-400" />
                      <span>{formatVolume(preset.fuelLiters, unitSystem)} fuel</span>
                    </span>
                    <span>•</span>
                    <span>{preset.includedItemIds.length} items packed</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  {!isActive && (
                    <button
                      onClick={() => {
                        onSelectPreset(preset.id);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 text-xs font-semibold transition"
                    >
                      Select
                    </button>
                  )}
                  <button
                    onClick={() => onDuplicatePreset(preset.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Duplicate Preset"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {presets.length > 1 && (
                    <button
                      onClick={() => onDeletePreset(preset.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition"
                      title="Delete Preset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Create New Preset Button / Form */}
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full mt-4 flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-slate-700 hover:border-sky-500 text-slate-300 hover:text-sky-400 text-xs font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Mission Preset</span>
          </button>
        ) : (
          <form onSubmit={handleCreateSubmit} className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              New Loadout Profile
            </h4>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Preset Name *</label>
              <input
                type="text"
                required
                placeholder="e.g., Mountain Fly-In"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Flight Type</label>
                <select
                  value={newFlightType}
                  onChange={(e) => setNewFlightType(e.target.value as LoadoutPreset['flightType'])}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="sunset">Sunset Cruise</option>
                  <option value="xc">Cross Country (XC)</option>
                  <option value="bivy">Bivy Camping</option>
                  <option value="thermal">Thermal Soaring</option>
                  <option value="training">Training</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Default Fuel (Liters)</label>
                <input
                  type="number"
                  step="0.5"
                  value={newFuelLiters}
                  onChange={(e) => setNewFuelLiters(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Mission Notes / Plan</label>
              <input
                type="text"
                placeholder="e.g., Morning valley fog clearing, calm winds"
                value={newMissionNotes}
                onChange={(e) => setNewMissionNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-sky-500 text-xs font-bold text-slate-950 shadow-sm"
              >
                Create Preset
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
