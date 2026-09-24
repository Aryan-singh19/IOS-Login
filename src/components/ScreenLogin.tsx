import React from 'react';
import { ShieldCheck, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

interface ScreenLoginProps {
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  rememberMe: boolean;
  setRememberMe: (v: boolean) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  errorMessage: string | null;
  isLoading: boolean;
  onLogin: () => void;
  inspectMode: boolean;
  onInspectElement?: (info: { id: string; type: string; label: string; value?: string }) => void;
  focusedTargetId?: string | null;
}

export const ScreenLogin: React.FC<ScreenLoginProps> = ({
  username,
  setUsername,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  showPassword,
  setShowPassword,
  errorMessage,
  isLoading,
  onLogin,
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
    <div className="flex flex-col h-full bg-slate-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-6 pt-12 select-none">
      {/* App Branding */}
      <div className="flex flex-col items-center mb-8">
        <div 
          {...getInspectAttrs('login_logo_icon', 'XCUIElementTypeImage', 'Auth Logo')}
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 mb-4"
        >
          <ShieldCheck className="w-9 h-9" />
        </div>
        <h1 
          {...getInspectAttrs('login_app_title', 'XCUIElementTypeStaticText', 'AuthDemo')}
          className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white"
        >
          AuthDemo
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Sign in to test automated iOS flows
        </p>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div 
          {...getInspectAttrs('login_error_message', 'XCUIElementTypeStaticText', errorMessage)}
          className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span className="leading-snug font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Input Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 px-0.5">
            Username
          </label>
          <div 
            {...getInspectAttrs('login_username_field', 'XCUIElementTypeTextField', 'Username', username)}
            className="relative"
          >
            <input
              type="text"
              id="login_username_field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. testuser"
              disabled={isLoading}
              className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 px-0.5">
            Password
          </label>
          <div 
            {...getInspectAttrs('login_password_field', 'XCUIElementTypeSecureTextField', 'Password', password ? '••••••••' : '')}
            className="relative"
          >
            <input
              type={showPassword ? 'text' : 'password'}
              id="login_password_field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g. password123"
              disabled={isLoading}
              className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 pr-10 transition-all shadow-xs"
            />
            <button
              type="button"
              id="login_toggle_password"
              {...getInspectAttrs('login_toggle_password', 'XCUIElementTypeButton', showPassword ? 'Hide Password' : 'Show Password')}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me Switch */}
        <div 
          {...getInspectAttrs('login_remember_switch', 'XCUIElementTypeSwitch', 'Remember Me', rememberMe ? '1' : '0')}
          className="flex items-center justify-between py-1 px-0.5"
        >
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Remember credentials
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={rememberMe}
            id="login_remember_switch"
            onClick={() => setRememberMe(!rememberMe)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
              rememberMe ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                rememberMe ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="button"
          id="login_submit_button"
          {...getInspectAttrs('login_submit_button', 'XCUIElementTypeButton', 'Sign In')}
          onClick={onLogin}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-75 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </div>

      {/* Demo helper hint */}
      <div className="mt-auto pt-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-200/60 dark:bg-zinc-800/80 text-[11px] text-zinc-600 dark:text-zinc-400">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">Demo account:</span>
          <span>testuser / password123</span>
        </div>
      </div>
    </div>
  );
};
