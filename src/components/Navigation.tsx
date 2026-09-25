import React from 'react';
import { 
  Backpack, 
  Scale, 
  ClipboardCheck, 
  Plane, 
  FileSpreadsheet 
} from 'lucide-react';

export type TabType = 'loadout' | 'weight' | 'preflight' | 'hangar' | 'backup';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  packedCount: number;
  totalGearCount: number;
  preflightCompletedCount: number;
  totalPreflightCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  packedCount,
  totalGearCount,
  preflightCompletedCount,
  totalPreflightCount,
}) => {
  const tabs = [
    {
      id: 'loadout' as TabType,
      label: 'Gear Loadout',
      shortLabel: 'Gear',
      icon: Backpack,
      badge: `${packedCount}/${totalGearCount}`,
    },
    {
      id: 'weight' as TabType,
      label: 'Weight & Balance',
      shortLabel: 'Weight',
      icon: Scale,
    },
    {
      id: 'preflight' as TabType,
      label: 'Pre-Flight',
      shortLabel: 'Pre-Flight',
      icon: ClipboardCheck,
      badge: preflightCompletedCount === totalPreflightCount ? '✓' : `${preflightCompletedCount}/${totalPreflightCount}`,
      badgeColor: preflightCompletedCount === totalPreflightCount ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300',
    },
    {
      id: 'hangar' as TabType,
      label: 'Aircraft Hangar',
      shortLabel: 'Hangar',
      icon: Plane,
    },
    {
      id: 'backup' as TabType,
      label: 'Export & Sync',
      shortLabel: 'Sync',
      icon: FileSpreadsheet,
    },
  ];

  return (
    <>
      {/* Desktop Tabs */}
      <nav className="hidden md:flex border-b border-slate-800 bg-slate-900/60 px-6">
        <div className="max-w-6xl mx-auto flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition relative ${
                  isActive
                    ? 'border-sky-500 text-sky-400 bg-sky-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[11px] font-mono px-1.5 py-0.2 rounded-full ${
                      tab.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 pb-safe safe-area-bottom">
        <div className="grid grid-cols-5 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition relative ${
                  isActive
                    ? 'text-sky-400 font-bold bg-sky-500/10'
                    : 'text-slate-400 hover:text-slate-200 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                  {tab.badge && (
                    <span
                      className={`absolute -top-1.5 -right-3 text-[9px] font-mono px-1 py-0 rounded-full font-bold leading-none ${
                        tab.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 leading-tight tracking-tight">
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
