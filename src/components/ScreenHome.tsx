import React from 'react';
import { UserCheck, Shield, KeyRound, LogOut, CheckCircle2, Clock } from 'lucide-react';

interface ScreenHomeProps {
  username: string;
  onRequestLogout: () => void;
  inspectMode: boolean;
  onInspectElement?: (info: { id: string; type: string; label: string; value?: string }) => void;
  focusedTargetId?: string | null;
}

export const ScreenHome: React.FC<ScreenHomeProps> = ({
  username,
  onRequestLogout,
  inspectMode,
  onInspectElement,
  focusedTargetId
}) => {
  const getInspectAttrs = (id: string, type: string, label: string, value?: string) => {
    const isTargeted = focusedTargetId === id;
    return {
      'data-testid': id,
      className: `${isTargeted ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white animate-pulse' : ''} ${
        inspectMode ? 'hover:outline-dashed hover:outline-2 hover:outline-emerald-500 cursor-crosshair' : ''
      }`,
      onClick: inspectMode && onInspectElement ? (e: React.MouseEvent) => {
        e.stopPropagation();
        onInspectElement({ id, type, label, value });
      } : undefined
    };
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 select-none">
      {/* iOS Navigation Bar */}
      <div className="px-6 pt-12 pb-4 border-b border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            AuthDemo App
          </span>
          <h1 
            id="home_nav_title"
            {...getInspectAttrs('home_nav_title', 'XCUIElementTypeStaticText', 'Dashboard')}
            className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white"
          >
            Dashboard
          </h1>
        </div>
        <div 
          {...getInspectAttrs('home_user_profile', 'XCUIElementTypeOther', `User: ${username}`)}
          className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-sm ring-2 ring-blue-500/20"
        >
          {username ? username.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 space-y-5 overflow-y-auto">
        {/* Welcome Banner / Session Card */}
        <div 
          id="home_session_card"
          {...getInspectAttrs('home_session_card', 'XCUIElementTypeOther', 'Session Card')}
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg shadow-blue-600/20"
        >
          <div className="flex items-center gap-2 mb-2 text-blue-200 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Authenticated Session</span>
          </div>
          <h2 
            id="home_welcome_title"
            {...getInspectAttrs('home_welcome_title', 'XCUIElementTypeStaticText', `Welcome, ${username}!`)}
            className="text-xl font-bold tracking-tight"
          >
            Welcome, {username}!
          </h2>
          <p className="text-xs text-blue-100/90 mt-1 leading-relaxed">
            Your credentials were encrypted and authenticated against the local mock backend.
          </p>
        </div>

        {/* Status Metrics Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
              <Shield className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-zinc-900 dark:text-white">Active Session</div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Token Verified</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5">
              <KeyRound className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-zinc-900 dark:text-white">Auth Method</div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Standard Pass</div>
          </div>
        </div>

        {/* Automation Status Panel */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 space-y-2.5">
          <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Automation Verifications</span>
          </div>
          <ul className="text-[11px] text-zinc-600 dark:text-zinc-300 space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Accessibility identifier: <code className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-700 px-1 py-0.5 rounded">home_welcome_title</code></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Navigation bar label: <code className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-700 px-1 py-0.5 rounded">home_nav_title</code></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Sign out button: <code className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-700 px-1 py-0.5 rounded">home_logout_button</code></span>
            </li>
          </ul>
        </div>
      </div>

      {/* Logout Action Bar */}
      <div className="p-6 pt-2 bg-white/70 dark:bg-zinc-900/70 border-t border-zinc-200/80 dark:border-zinc-800">
        <button
          type="button"
          id="home_logout_button"
          {...getInspectAttrs('home_logout_button', 'XCUIElementTypeButton', 'Sign Out')}
          onClick={onRequestLogout}
          className="w-full bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 text-red-600 dark:text-red-400 font-semibold py-3 px-4 rounded-xl border border-red-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
