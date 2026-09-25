import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  Copy, 
  Check, 
  Github, 
  Printer, 
  Share2, 
  FileText, 
  ShieldCheck, 
  Cloud, 
  ExternalLink,
  Plane
} from 'lucide-react';
import { 
  AircraftProfile, 
  GearItem, 
  GitHubSyncState, 
  LoadoutPreset, 
  UnitSystem, 
  WeightBreakdown 
} from '../types/paramotor';
import { formatWeight, formatVolume, formatWingLoading } from '../utils/units';

interface SyncTabProps {
  aircraft: AircraftProfile;
  activePreset: LoadoutPreset;
  presets: LoadoutPreset[];
  allGear: GearItem[];
  weightBreakdown: WeightBreakdown;
  unitSystem: UnitSystem;
  syncState: GitHubSyncState;
  onOpenGitHubModal: () => void;
  onImportFullState: (state: {
    aircraft: AircraftProfile;
    presets: LoadoutPreset[];
    allGear: GearItem[];
  }) => void;
}

export const SyncTab: React.FC<SyncTabProps> = ({
  aircraft,
  activePreset,
  presets,
  allGear,
  weightBreakdown,
  unitSystem,
  syncState,
  onOpenGitHubModal,
  onImportFullState,
}) => {
  const [copied, setCopied] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const includedGear = allGear.filter((g) => activePreset.includedItemIds.includes(g.id));

  const handlePrintManifest = () => {
    window.print();
  };

  const handleShareSummary = () => {
    const summary = `🪂 PARAMOTOR FLIGHT LOADOUT: ${activePreset.name.toUpperCase()}
• Pilot: ${aircraft.pilotWeightKg} kg body (${formatWeight(weightBreakdown.pilotTotalKg, unitSystem)} all-up)
• Motor: ${aircraft.motorModel} (${formatWeight(aircraft.motorDryWeightKg, unitSystem)})
• Wing: ${aircraft.wingModel} (${aircraft.wingAreaSqM} m²)
• Fuel: ${formatVolume(activePreset.fuelLiters, unitSystem)} (${Math.round((activePreset.fuelLiters / aircraft.fuelBurnRateLitersPerHour) * 60)} min endurance)
• Gear Count: ${includedGear.length} items packed
• Takeoff AUW: ${formatWeight(weightBreakdown.takeoffAUWKg, unitSystem)}
• Wing Loading: ${formatWingLoading(weightBreakdown.wingLoadingKgPerM2, unitSystem)}
• Status: ${weightBreakdown.weightStatus.toUpperCase()} (Cert: ${formatWeight(aircraft.wingCertifiedMinAUWKg, unitSystem)} - ${formatWeight(aircraft.wingCertifiedMaxAUWKg, unitSystem)})
• Mission Notes: ${activePreset.missionNotes || 'None'}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setCopyStatus('Flight summary copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setCopyStatus(null);
      }, 2500);
    }
  };

  const handleDownloadBackup = () => {
    const backup = {
      version: '2.0-pwa',
      timestamp: new Date().toISOString(),
      aircraft,
      presets,
      allGear,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paramotor-loadout-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg sm:text-xl font-black text-white">
              Flight Manifest, Cloud & GitHub Sync
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Share flight loadout cards with crew, export offline JSON backups, or sync to GitHub.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareSummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition active:scale-95 shadow-md shadow-sky-500/20"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handlePrintManifest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition active:scale-95"
            title="Print paper checklist & loadout card"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Card</span>
          </button>
        </div>
      </div>

      {copyStatus && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{copyStatus}</span>
        </div>
      )}

      {/* GitHub Repository Connection Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-sky-400 border border-slate-700">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">GitHub Integration</h3>
              <p className="text-xs text-slate-400">
                Target Repo: <span className="font-mono text-sky-300">cas1337357/paramotor-loadout</span>
              </p>
            </div>
          </div>

          <button
            onClick={onOpenGitHubModal}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            {syncState.isConnected ? 'Configure Sync' : 'Connect Token'}
          </button>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                syncState.isConnected ? 'bg-emerald-400' : 'bg-slate-600'
              }`}
            />
            <span>
              {syncState.isConnected
                ? `Connected (${syncState.syncMethod === 'repo' ? 'Repository' : 'Private Gist'} Mode)`
                : 'Offline standalone mode (All gear saved to browser cache)'}
            </span>
          </div>
          {syncState.lastSynced && (
            <span className="font-mono text-[11px] text-slate-500">
              Synced: {new Date(syncState.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Printable Flight Manifest Preview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Flight Manifest & Loadout Sheet
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {new Date().toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </span>
        </div>

        {/* Aircraft & Performance Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Glider Wing</span>
            <span className="text-slate-100 font-bold text-sm truncate block mt-0.5">{aircraft.wingModel}</span>
            <span className="text-slate-400 text-[11px]">{aircraft.wingAreaSqM} m²</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Paramotor</span>
            <span className="text-slate-100 font-bold text-sm truncate block mt-0.5">{aircraft.motorModel.split(' (')[0]}</span>
            <span className="text-amber-400 text-[11px]">{aircraft.motorThrustKg} kg thrust</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Takeoff AUW</span>
            <span className="text-sky-400 font-bold text-sm block mt-0.5">{formatWeight(weightBreakdown.takeoffAUWKg, unitSystem)}</span>
            <span className="text-slate-400 text-[11px]">{formatWingLoading(weightBreakdown.wingLoadingKgPerM2, unitSystem)}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Fuel Endurance</span>
            <span className="text-emerald-400 font-bold text-sm block mt-0.5">
              {Math.floor(weightBreakdown.flightEnduranceMinutes / 60)}h {weightBreakdown.flightEnduranceMinutes % 60}m
            </span>
            <span className="text-slate-400 text-[11px]">{formatVolume(activePreset.fuelLiters, unitSystem)}</span>
          </div>
        </div>

        {/* Packed Items List in active preset */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Packed Gear Items ({includedGear.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {includedGear.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                  <span className="text-slate-200 truncate">{item.name}</span>
                </div>
                <span className="font-mono text-slate-400 font-bold ml-2">
                  {formatWeight(item.weightKg, unitSystem)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Notes */}
        {activePreset.missionNotes && (
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold block mb-0.5">Mission Briefing Notes:</span>
            <p className="text-slate-300 italic">{activePreset.missionNotes}</p>
          </div>
        )}
      </div>

      {/* Offline Storage & Quick Backup */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Offline Storage & Instant Backup
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          This Progressive Web App stores all your modifications in offline persistent storage. You can freely launch this app without internet connectivity at the flying field.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleDownloadBackup}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Download Full Backup JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};
