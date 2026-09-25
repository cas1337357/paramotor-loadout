import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Check, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  CheckCircle2, 
  PlaneTakeoff, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PreflightItem } from '../types/paramotor';

interface PreflightChecklistProps {
  checklist: PreflightItem[];
  onToggleItem: (itemId: string) => void;
  onResetChecklist: () => void;
  onCheckAll: () => void;
}

const PHASES: { id: PreflightItem['phase']; title: string; icon: string }[] = [
  { id: 'airframe', title: '1. Airframe & Propeller', icon: '⚙️' },
  { id: 'fuel', title: '2. Fuel & Throttle System', icon: '⛽' },
  { id: 'harness', title: '3. Harness & Reserve Parachute', icon: '🪂' },
  { id: 'wing', title: '4. Wing & Riser Connections', icon: '🪁' },
  { id: 'avionics', title: '5. Avionics, PPE & Airspace', icon: '📡' },
  { id: 'launch', title: '6. Final Engine Warm-Up & Lineup', icon: '🚀' },
];

export const PreflightChecklist: React.FC<PreflightChecklistProps> = ({
  checklist,
  onToggleItem,
  onResetChecklist,
  onCheckAll,
}) => {
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [activePhase, setActivePhase] = useState<PreflightItem['phase'] | 'all'>('all');

  const completedCount = checklist.filter((c) => c.completed).length;
  const totalCount = checklist.length;
  const isAllComplete = completedCount === totalCount && totalCount > 0;
  const percentComplete = Math.round((completedCount / totalCount) * 100);

  const handleToggle = (item: PreflightItem) => {
    onToggleItem(item.id);

    // If item is now becoming completed and speech is enabled
    if (!item.completed && speechEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${item.title}: Checked.`);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }

    // If that was the last item to complete, trigger celebration
    if (!item.completed && completedCount + 1 === totalCount) {
      triggerLaunchCelebration();
    }
  };

  const triggerLaunchCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#fbbf24', '#34d399', '#ffffff'],
      });
    } catch {
      // Ignore if confetti blocked
    }

    if (speechEnabled && 'speechSynthesis' in window) {
      const clearanceMsg = new SpeechSynthesisUtterance('All pre-flight checks complete. You are cleared for takeoff. Have a safe flight!');
      window.speechSynthesis.speak(clearanceMsg);
    }
  };

  const filteredChecklist = activePhase === 'all'
    ? checklist
    : checklist.filter((c) => c.phase === activePhase);

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-sky-400" />
              <h2 className="text-lg sm:text-xl font-black text-white">
                Pre-Flight Inspection Checklist
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Standard operating procedures for foot-launch paramotors. Double-check all critical flight systems before throttle up.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition active:scale-95 ${
                speechEnabled
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Voice confirmation readout for hands-free inspection"
            >
              {speechEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4" />}
              <span>{speechEnabled ? 'Voice On' : 'Voice Off'}</span>
            </button>

            <button
              onClick={() => {
                onCheckAll();
                triggerLaunchCelebration();
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition active:scale-95"
            >
              Pass All
            </button>

            <button
              onClick={onResetChecklist}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Reset All Checklist Items"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Readiness Progress:</span>
              <span className="font-mono font-bold text-sky-400">{completedCount} of {totalCount} verified</span>
            </div>
            <span className="font-mono font-bold text-slate-200">{percentComplete}%</span>
          </div>

          <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isAllComplete ? 'bg-emerald-400' : 'bg-gradient-to-r from-sky-500 to-blue-500'
              }`}
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>

      {/* Cleared for Takeoff Callout */}
      {isAllComplete && (
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-xl animate-in zoom-in-95 duration-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
              <PlaneTakeoff className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                  Ready for Flight
                </span>
                <span className="text-xs text-emerald-400 font-bold">All 17 Checks Passed</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                PARAMOTOR CLEARED FOR TAKEOFF
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Check airspace one final time, announce intentions on radio CTAF, face the wind, and smooth throttle up!
              </p>
            </div>
          </div>

          <button
            onClick={triggerLaunchCelebration}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Zap className="w-4 h-4" />
            <span>Launch FX</span>
          </button>
        </div>
      )}

      {/* Phase Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          onClick={() => setActivePhase('all')}
          className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap border transition ${
            activePhase === 'all'
              ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-sm'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          All Phases ({totalCount})
        </button>

        {PHASES.map((p) => {
          const count = checklist.filter((c) => c.phase === p.id).length;
          const phaseDone = checklist.filter((c) => c.phase === p.id && c.completed).length;
          const isSelected = activePhase === p.id;
          const isPhaseFullyDone = count > 0 && phaseDone === count;

          return (
            <button
              key={p.id}
              onClick={() => setActivePhase(p.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap flex items-center gap-1.5 border transition ${
                isSelected
                  ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.title.split('. ')[1]}</span>
              <span
                className={`text-[10px] font-mono px-1 py-0.2 rounded-full ${
                  isPhaseFullyDone
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {phaseDone}/{count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Checklist Items Accordion / Cards */}
      <div className="space-y-2">
        {filteredChecklist.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item)}
              className={`p-3 sm:p-3.5 rounded-xl border cursor-pointer transition select-none flex items-start gap-3.5 ${
                item.completed
                  ? 'bg-slate-900/60 border-emerald-500/30 text-slate-400'
                  : 'bg-slate-900 border-slate-800 hover:border-sky-500/50 text-slate-100 shadow-sm'
              }`}
            >
              {/* Checkbox box */}
              <div
                className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition flex-shrink-0 ${
                  item.completed
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-sm'
                    : 'border-slate-700 bg-slate-950 hover:border-sky-500'
                }`}
              >
                <Check className={`w-4 h-4 stroke-[3] ${item.completed ? 'block' : 'opacity-0'}`} />
              </div>

              {/* Text detail */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`font-bold text-sm ${
                      item.completed ? 'line-through text-slate-400' : 'text-slate-100'
                    }`}
                  >
                    {item.title}
                  </span>
                  {item.isCritical && (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      Critical
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
