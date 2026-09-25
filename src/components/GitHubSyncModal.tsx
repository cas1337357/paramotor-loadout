import React, { useState } from 'react';
import { 
  Github, 
  X, 
  Check, 
  AlertCircle, 
  Download, 
  Upload, 
  Copy, 
  CheckCheck, 
  Key, 
  FolderGit2, 
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  FileJson
} from 'lucide-react';
import { AircraftProfile, GearItem, GitHubSyncState, LoadoutPreset } from '../types/paramotor';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncState: GitHubSyncState;
  onUpdateSyncState: (state: GitHubSyncState) => void;
  aircraft: AircraftProfile;
  presets: LoadoutPreset[];
  allGear: GearItem[];
  onImportFullState: (state: {
    aircraft: AircraftProfile;
    presets: LoadoutPreset[];
    allGear: GearItem[];
  }) => void;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({
  isOpen,
  onClose,
  syncState,
  onUpdateSyncState,
  aircraft,
  presets,
  allGear,
  onImportFullState,
}) => {
  const [tokenInput, setTokenInput] = useState(syncState.token || '');
  const [repoInput, setRepoInput] = useState(
    syncState.repoOwner && syncState.repoName
      ? `${syncState.repoOwner}/${syncState.repoName}`
      : 'cas1337357/paramotor-loadout'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build the export payload
  const currentManifest = {
    version: '2.0-pwa',
    exportedAt: new Date().toISOString(),
    aircraft,
    presets,
    allGear,
  };

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(JSON.stringify(currentManifest, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(currentManifest, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ppg-loadout-manifest-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.aircraft && parsed.presets && parsed.allGear) {
          onImportFullState({
            aircraft: parsed.aircraft,
            presets: parsed.presets,
            allGear: parsed.allGear,
          });
          setStatusMessage({
            type: 'success',
            text: 'Successfully restored all gear, aircraft profiles, and presets from backup!',
          });
        } else {
          throw new Error('Invalid loadout JSON structure.');
        }
      } catch (err: unknown) {
        setStatusMessage({
          type: 'error',
          text: `File import failed: ${(err as Error).message}`,
        });
      }
    };
    reader.readAsText(file);
  };

  const handleTestAndConnect = async () => {
    if (!tokenInput.trim()) {
      setStatusMessage({
        type: 'info',
        text: 'A GitHub Personal Access Token (PAT) with repo scope is required to access private repositories like cas1337357/paramotor-loadout.',
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      // Test the user token against GitHub API
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${tokenInput.trim()}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!userRes.ok) {
        throw new Error('GitHub token authentication failed. Please verify your token.');
      }

      const userData = await userRes.json();

      // Check repository access
      const [owner, repo] = repoInput.trim().split('/');
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Authorization: `Bearer ${tokenInput.trim()}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (repoRes.ok) {
        // Connected to repo!
        onUpdateSyncState({
          isConnected: true,
          token: tokenInput.trim(),
          repoOwner: owner,
          repoName: repo,
          syncMethod: 'repo',
          lastSynced: new Date().toISOString(),
        });
        setStatusMessage({
          type: 'success',
          text: `Connected to GitHub user @${userData.login} and repo ${owner}/${repo}!`,
        });
      } else {
        // Repo not yet initialized or 404, fallback to Gist sync
        onUpdateSyncState({
          isConnected: true,
          token: tokenInput.trim(),
          repoOwner: userData.login,
          syncMethod: 'gist',
          lastSynced: new Date().toISOString(),
        });
        setStatusMessage({
          type: 'success',
          text: `Authenticated with @${userData.login}. Repo ${repoInput} was not found, so cloud backups will use your private GitHub Gists!`,
        });
      }
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: (err as Error).message || 'Failed to connect to GitHub.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushToGitHubGist = async () => {
    if (!syncState.token) {
      setStatusMessage({
        type: 'error',
        text: 'Please connect your GitHub Token first.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        description: 'Paramotor Loadout & Weight Manifest Backup',
        public: false,
        files: {
          'paramotor-loadout.json': {
            content: JSON.stringify(currentManifest, null, 2),
          },
        },
      };

      const res = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${syncState.token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to create GitHub Gist backup.');
      }

      const gistData = await res.json();
      onUpdateSyncState({
        ...syncState,
        gistId: gistData.id,
        lastSynced: new Date().toISOString(),
      });

      setStatusMessage({
        type: 'success',
        text: `Successfully synced loadout to private GitHub Gist (#${gistData.id.slice(0, 7)})!`,
      });
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: (err as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    onUpdateSyncState({
      isConnected: false,
      token: undefined,
      syncMethod: 'none',
    });
    setTokenInput('');
    setStatusMessage({
      type: 'info',
      text: 'GitHub connection cleared. All your data remains safely stored in local browser cache.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-sky-400">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                GitHub Repository & Cloud Sync
              </h3>
              <p className="text-xs text-slate-400">
                Sync loadouts with <span className="font-mono text-sky-300">cas1337357/paramotor-loadout</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Callout if present */}
        {statusMessage && (
          <div
            className={`mt-4 p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : statusMessage.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-sky-500/10 border-sky-500/30 text-sky-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Section 1: GitHub Link Configuration */}
        <div className="mt-4 space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              GitHub Credentials
            </span>
            {syncState.isConnected ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Check className="w-3 h-3" /> Connected
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Not Connected
              </span>
            )}
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Target Repository</label>
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <input
                type="text"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                placeholder="username/paramotor-loadout"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              Personal Access Token (PAT)
            </label>
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx (Optional for private repos/gists)"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              For private repos or gist backups, generate a token on GitHub with <code>repo</code> or <code>gist</code> scope.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
            {syncState.isConnected ? (
              <>
                <button
                  onClick={handlePushToGitHubGist}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Push Backup to GitHub Gist</span>
                </button>
                <button
                  onClick={handleDisconnect}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={handleTestAndConnect}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Connect & Verify GitHub</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 2: Direct Local JSON Backup & Restore (Offline First) */}
        <div className="mt-4 space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <FileJson className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Offline Data Backup & Restore
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Export all your custom gear, pilot weight, and loadout presets into a standalone JSON file, or copy the manifest to your clipboard.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <button
              onClick={handleDownloadJSON}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Download JSON</span>
            </button>

            <button
              onClick={handleCopyManifest}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition active:scale-95"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Manifest</span>
                </>
              )}
            </button>

            <label className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold cursor-pointer transition active:scale-95">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Restore JSON</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
