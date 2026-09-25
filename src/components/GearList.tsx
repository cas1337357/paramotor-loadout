import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Check, 
  CheckCheck, 
  Circle, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  MapPin, 
  Backpack, 
  Filter, 
  Scale,
  Sparkles
} from 'lucide-react';
import { GearCategory, GearItem, ItemPackingStatus, UnitSystem } from '../types/paramotor';
import { formatWeight, convertInputWeightToKg, convertKgToDisplay } from '../utils/units';

interface GearListProps {
  allGear: GearItem[];
  includedItemIds: string[];
  unitSystem: UnitSystem;
  onToggleItemInLoadout: (itemId: string) => void;
  onUpdateItemPackingStatus: (itemId: string, status: ItemPackingStatus) => void;
  onAddItem: (item: Omit<GearItem, 'id'>) => void;
  onUpdateItem: (item: GearItem) => void;
  onDeleteItem: (itemId: string) => void;
  onPackAllInLoadout: () => void;
  onResetPackingStatus: () => void;
}

const CATEGORIES: { id: GearCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Items', icon: '📦' },
  { id: 'propulsion', label: 'Propulsion', icon: '⚙️' },
  { id: 'wing', label: 'Glider / Wing', icon: '🪂' },
  { id: 'avionics', label: 'Avionics', icon: '📡' },
  { id: 'safety', label: 'Safety & PPE', icon: '🦺' },
  { id: 'tools', label: 'Tools & Spares', icon: '🔧' },
  { id: 'comfort', label: 'Comfort', icon: '☕' },
  { id: 'camping', label: 'Camping', icon: '⛺' },
];

export const GearList: React.FC<GearListProps> = ({
  allGear,
  includedItemIds,
  unitSystem,
  onToggleItemInLoadout,
  onUpdateItemPackingStatus,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onPackAllInLoadout,
  onResetPackingStatus,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GearCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyInLoadout, setOnlyInLoadout] = useState(false);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GearItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<GearCategory>('avionics');
  const [formWeightDisplay, setFormWeightDisplay] = useState('0.5');
  const [formLocation, setFormLocation] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formEssential, setFormEssential] = useState(false);

  const openAddModal = () => {
    setFormName('');
    setFormCategory('avionics');
    setFormWeightDisplay(unitSystem === 'metric' ? '0.5' : '1.0');
    setFormLocation('Harness pocket');
    setFormNotes('');
    setFormEssential(false);
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: GearItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormWeightDisplay(convertKgToDisplay(item.weightKg, unitSystem).toFixed(2));
    setFormLocation(item.location || '');
    setFormNotes(item.notes || '');
    setFormEssential(item.isEssential);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    const weightVal = parseFloat(formWeightDisplay) || 0.1;
    const weightKg = convertInputWeightToKg(weightVal, unitSystem);

    onAddItem({
      name: formName.trim(),
      category: formCategory,
      weightKg,
      location: formLocation.trim() || undefined,
      notes: formNotes.trim() || undefined,
      isEssential: formEssential,
      packingStatus: 'unpacked',
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !formName.trim()) return;
    const weightVal = parseFloat(formWeightDisplay) || 0.1;
    const weightKg = convertInputWeightToKg(weightVal, unitSystem);

    onUpdateItem({
      ...editingItem,
      name: formName.trim(),
      category: formCategory,
      weightKg,
      location: formLocation.trim() || undefined,
      notes: formNotes.trim() || undefined,
      isEssential: formEssential,
    });
    setEditingItem(null);
  };

  // Filtered Items
  const filteredGear = useMemo(() => {
    return allGear.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Loadout filter
      if (onlyInLoadout && !includedItemIds.includes(item.id)) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesLocation = item.location?.toLowerCase().includes(q);
        const matchesNotes = item.notes?.toLowerCase().includes(q);
        return matchesName || matchesLocation || matchesNotes;
      }
      return true;
    });
  }, [allGear, selectedCategory, onlyInLoadout, includedItemIds, searchQuery]);

  // Statistics
  const includedItems = allGear.filter((g) => includedItemIds.includes(g.id));
  const totalIncludedWeight = includedItems.reduce((sum, g) => sum + g.weightKg, 0);
  const packedCount = includedItems.filter((g) => g.packingStatus === 'packed').length;

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-16">
      {/* Top Banner & Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Backpack className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg sm:text-xl font-black text-white">
              Gear Locker & Loadout Packing
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Toggle items into your active loadout and check them off during physical staging and packing.
          </p>
        </div>

        {/* Quick Pack / Add Gear Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onPackAllInLoadout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition active:scale-95"
            title="Mark all items in active loadout as packed"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Pack All</span>
          </button>

          <button
            onClick={onResetPackingStatus}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition active:scale-95"
            title="Reset packing checkmarks for next flight"
          >
            Reset Checks
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition shadow-md shadow-sky-500/20 active:scale-95 ml-auto sm:ml-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Custom Item</span>
          </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[11px] text-slate-400 block">In Active Loadout:</span>
          <span className="text-lg font-black font-mono text-white">
            {includedItems.length} <span className="text-xs font-normal text-slate-400">items</span>
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[11px] text-slate-400 block">Total Gear Weight:</span>
          <span className="text-lg font-black font-mono text-sky-400">
            {formatWeight(totalIncludedWeight, unitSystem)}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[11px] text-slate-400 block">Packed Status:</span>
          <span className="text-lg font-black font-mono text-emerald-400">
            {packedCount} / {includedItems.length}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[11px] text-slate-400 block">Master Locker:</span>
          <span className="text-lg font-black font-mono text-slate-300">
            {allGear.length} <span className="text-xs font-normal text-slate-400">total</span>
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          {/* Search bar */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search gear by name, location, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          {/* Toggle: Only in loadout */}
          <button
            onClick={() => setOnlyInLoadout(!onlyInLoadout)}
            className={`w-full sm:w-auto px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition active:scale-95 ${
              onlyInLoadout
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{onlyInLoadout ? 'Active Loadout Only' : 'Showing All Locker'}</span>
          </button>
        </div>

        {/* Category Pills (Horizontal scrollable on mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = cat.id === 'all'
              ? allGear.length
              : allGear.filter((g) => g.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap flex items-center gap-1.5 border transition ${
                  isSelected
                    ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-sm'
                    : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-slate-900/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gear Items List */}
      <div className="space-y-2">
        {filteredGear.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-2">
            <Backpack className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold">No gear items match your filter.</p>
            <p className="text-xs text-slate-500">
              Try searching a different keyword or create a custom item using "Add Custom Item".
            </p>
          </div>
        ) : (
          filteredGear.map((item) => {
            const isIncluded = includedItemIds.includes(item.id);
            const isPacked = item.packingStatus === 'packed';
            const isStaged = item.packingStatus === 'staged';

            return (
              <div
                key={item.id}
                className={`border rounded-xl p-3 sm:p-3.5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isIncluded
                    ? isPacked
                      ? 'bg-slate-900/90 border-emerald-500/30'
                      : 'bg-slate-900 border-sky-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-60 hover:opacity-90'
                }`}
              >
                {/* Left: Pack Checkbox & Info */}
                <div className="flex items-start gap-3">
                  {/* Packing status button (only active if included in loadout) */}
                  <button
                    disabled={!isIncluded}
                    onClick={() => {
                      if (!isIncluded) return;
                      const nextStatus = isPacked ? 'unpacked' : 'packed';
                      onUpdateItemPackingStatus(item.id, nextStatus);
                    }}
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition flex-shrink-0 ${
                      !isIncluded
                        ? 'border-slate-800 bg-slate-900/40 text-slate-600 cursor-not-allowed'
                        : isPacked
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-sm'
                        : 'border-slate-700 bg-slate-950 hover:border-sky-500 text-transparent'
                    }`}
                    title={isIncluded ? (isPacked ? 'Packed (tap to uncheck)' : 'Tap to mark packed') : 'Enable item in loadout first'}
                  >
                    <Check className={`w-4 h-4 stroke-[3] ${isPacked ? 'text-slate-950' : 'hidden'}`} />
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-100">{item.name}</span>
                      {item.isEssential && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Essential
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 uppercase font-mono bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                      {item.location && (
                        <span className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3 h-3 text-sky-400" />
                          <span>{item.location}</span>
                        </span>
                      )}
                      {item.notes && (
                        <span className="text-slate-400 italic">
                          "{item.notes}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Weight, Loadout Toggle, Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                  {/* Weight Badge */}
                  <div className="text-right">
                    <span className="text-xs font-black font-mono text-sky-400">
                      {formatWeight(item.weightKg, unitSystem)}
                    </span>
                  </div>

                  {/* Toggle In/Out of Loadout */}
                  <button
                    onClick={() => onToggleItemInLoadout(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition active:scale-95 ${
                      isIncluded
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 hover:bg-sky-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {isIncluded ? 'In Loadout' : '+ Add to Flight'}
                  </button>

                  {/* Edit / Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
                      title="Edit Item"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      title="Delete Item from Locker"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white mb-4">Add Custom Gear Item</h3>
            <form onSubmit={handleSaveAdd} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Anker 20,000mAh Battery"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as GearCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="propulsion">Propulsion</option>
                    <option value="wing">Glider / Wing</option>
                    <option value="avionics">Avionics</option>
                    <option value="safety">Safety & PPE</option>
                    <option value="tools">Tools & Spares</option>
                    <option value="comfort">Comfort</option>
                    <option value="camping">Camping</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formWeightDisplay}
                    onChange={(e) => setFormWeightDisplay(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Storage Location / Mount</label>
                <input
                  type="text"
                  placeholder="e.g., Left harness pocket, Flight deck, Helmet"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Notes / Specifications</label>
                <input
                  type="text"
                  placeholder="e.g., Quick disconnect, fully charged"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="add-essential"
                  checked={formEssential}
                  onChange={(e) => setFormEssential(e.target.checked)}
                  className="rounded border-slate-800 text-sky-500 focus:ring-sky-500 h-4 w-4 bg-slate-950"
                />
                <label htmlFor="add-essential" className="text-xs text-slate-300 font-medium">
                  Mark as Mission-Essential (Required for flight)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-slate-950 transition shadow-md"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white mb-4">Edit Gear Item</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as GearCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="propulsion">Propulsion</option>
                    <option value="wing">Glider / Wing</option>
                    <option value="avionics">Avionics</option>
                    <option value="safety">Safety & PPE</option>
                    <option value="tools">Tools & Spares</option>
                    <option value="comfort">Comfort</option>
                    <option value="camping">Camping</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formWeightDisplay}
                    onChange={(e) => setFormWeightDisplay(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Storage Location / Mount</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Notes / Specifications</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-essential"
                  checked={formEssential}
                  onChange={(e) => setFormEssential(e.target.checked)}
                  className="rounded border-slate-800 text-sky-500 focus:ring-sky-500 h-4 w-4 bg-slate-950"
                />
                <label htmlFor="edit-essential" className="text-xs text-slate-300 font-medium">
                  Mark as Mission-Essential
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-slate-950 transition shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
