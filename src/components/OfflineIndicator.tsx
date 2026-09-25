import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:right-auto sm:max-w-md z-40 flex items-center gap-2.5 rounded-xl bg-amber-500/90 text-slate-950 backdrop-blur-md px-3.5 py-2 text-xs font-semibold shadow-xl border border-amber-400/40 animate-in slide-in-from-bottom-2">
      <span className="flex h-2 w-2 rounded-full bg-slate-950 animate-ping" />
      <WifiOff className="w-4 h-4 flex-shrink-0" />
      <span>Offline Mode — All gear, weights, and checklists cached & ready.</span>
    </div>
  );
};
