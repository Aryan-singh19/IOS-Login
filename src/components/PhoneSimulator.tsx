import React, { useEffect, useState, useRef } from 'react';
import { Wifi, BatteryMedium, Signal, RefreshCw, Sun, Moon, Eye, Smartphone } from 'lucide-react';
import { ScreenLogin } from './ScreenLogin';
import { ScreenHome } from './ScreenHome';
import { ActionSheetLogout } from './ActionSheetLogout';

interface PointerPosition {
  x: number;
  y: number;
  active: boolean;
  label?: string;
}

interface PhoneSimulatorProps {
  currentScreen: 'login' | 'home';
  setCurrentScreen: (screen: 'login' | 'home') => void;
  username: string;
  setUsername: (u: string) => void;
  password: string;
  setPassword: (p: string) => void;
  rememberMe: boolean;
  setRememberMe: (r: boolean) => void;
  showPassword: boolean;
  setShowPassword: (s: boolean) => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showLogoutModal: boolean;
  setShowLogoutModal: (show: boolean) => void;
  inspectMode: boolean;
  onInspectElement: (info: { id: string; type: string; label: string; value?: string }) => void;
  focusedTargetId: string | null;
  pointerPos: PointerPosition | null;
  onResetDevice: () => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  currentScreen,
  setCurrentScreen,
  username,
  setUsername,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  showPassword,
  setShowPassword,
  errorMessage,
  setErrorMessage,
  isLoading,
  setIsLoading,
  showLogoutModal,
  setShowLogoutModal,
  inspectMode,
  onInspectElement,
  focusedTargetId,
  pointerPos,
  onResetDevice
}) => {
  const [currentTime, setCurrentTime] = useState('9:41');
  const [deviceTheme, setDeviceTheme] = useState<'light' | 'dark'>('dark');
  const phoneContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleManualLogin = () => {
    setErrorMessage(null);
    if (!username.trim() || !password) {
      setErrorMessage('Please enter both username and password');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (username === 'testuser' && password === 'password123') {
        setCurrentScreen('home');
      } else {
        setErrorMessage('Invalid credentials. Please check your credentials.');
      }
    }, 600);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    setCurrentScreen('login');
    setUsername('');
    setPassword('');
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-2">
      {/* Device Toolbar Controls */}
      <div className="flex items-center gap-3 mb-3 bg-zinc-900/80 border border-zinc-800 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-zinc-300 shadow-lg">
        <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
          <Smartphone className="w-3.5 h-3.5 text-blue-400" />
          <span>iPhone 16 Pro</span>
        </div>
        <span className="text-zinc-700">|</span>
        <button
          onClick={() => setDeviceTheme(deviceTheme === 'dark' ? 'light' : 'dark')}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          title="Toggle iOS Theme"
        >
          {deviceTheme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
          <span>{deviceTheme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
        <span className="text-zinc-700">|</span>
        <button
          onClick={onResetDevice}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          title="Reset App State"
        >
          <RefreshCw className="w-3 h-3 text-zinc-400" />
          <span>Reset</span>
        </button>
      </div>

      {/* Outer Titanium Phone Chassis */}
      <div 
        ref={phoneContainerRef}
        className={`relative w-[340px] sm:w-[360px] h-[700px] rounded-[52px] p-[11px] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-black/80 transition-all ${
          deviceTheme === 'dark' ? 'dark' : ''
        }`}
      >
        {/* Hardware side buttons simulation */}
        <div className="absolute -left-[14px] top-[110px] w-[3px] h-[28px] bg-zinc-600 rounded-l-sm shadow-inner" title="Action Button"></div>
        <div className="absolute -left-[14px] top-[155px] w-[3px] h-[48px] bg-zinc-600 rounded-l-sm shadow-inner" title="Volume Up"></div>
        <div className="absolute -left-[14px] top-[215px] w-[3px] h-[48px] bg-zinc-600 rounded-l-sm shadow-inner" title="Volume Down"></div>
        <div className="absolute -right-[14px] top-[170px] w-[3px] h-[72px] bg-zinc-600 rounded-r-sm shadow-inner" title="Side Button"></div>

        {/* Screen Bezel & Display */}
        <div className="relative w-full h-full rounded-[42px] overflow-hidden bg-black flex flex-col select-none border border-black/40 shadow-inner">
          
          {/* iOS Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-11 px-7 flex items-center justify-between z-40 text-xs font-semibold text-zinc-900 dark:text-zinc-100 pointer-events-none">
            <span className="tracking-tight pl-1 text-[13px]">{currentTime}</span>
            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <BatteryMedium className="w-4 h-4 text-zinc-900 dark:text-white" />
            </div>
          </div>

          {/* Dynamic Island */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[105px] h-[28px] bg-black rounded-full z-40 flex items-center justify-between px-2.5 shadow-md ring-1 ring-white/10 pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-900/90 border border-zinc-800"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60 ring-1 ring-blue-500/40"></div>
            </div>
          </div>

          {/* Active Screen View */}
          <div className="flex-1 overflow-hidden relative">
            {currentScreen === 'login' ? (
              <ScreenLogin
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                errorMessage={errorMessage}
                isLoading={isLoading}
                onLogin={handleManualLogin}
                inspectMode={inspectMode}
                onInspectElement={onInspectElement}
                focusedTargetId={focusedTargetId}
              />
            ) : (
              <ScreenHome
                username={username || 'testuser'}
                onRequestLogout={() => setShowLogoutModal(true)}
                inspectMode={inspectMode}
                onInspectElement={onInspectElement}
                focusedTargetId={focusedTargetId}
              />
            )}

            {/* Logout Native iOS Action Sheet */}
            <ActionSheetLogout
              isOpen={showLogoutModal}
              onConfirm={handleConfirmLogout}
              onCancel={() => setShowLogoutModal(false)}
              inspectMode={inspectMode}
              onInspectElement={onInspectElement}
              focusedTargetId={focusedTargetId}
            />

            {/* Test Automation Touch Pointer / Ghost Finger */}
            {pointerPos && (
              <div
                className="absolute z-50 pointer-events-none transition-all duration-300 ease-out flex flex-col items-center"
                style={{
                  left: `${pointerPos.x}px`,
                  top: `${pointerPos.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className={`relative flex items-center justify-center ${pointerPos.active ? 'scale-90' : 'scale-100'}`}>
                  {/* Tap ripple ring */}
                  <div className="absolute w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400 animate-ping"></div>
                  {/* Finger touch circle */}
                  <div className="w-8 h-8 rounded-full bg-blue-500/40 border-2 border-white shadow-lg backdrop-blur-xs flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                </div>
                {pointerPos.label && (
                  <div className="mt-1 px-2 py-0.5 rounded bg-black/80 text-[10px] text-blue-300 font-mono whitespace-nowrap shadow-md border border-blue-500/30">
                    {pointerPos.label}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="h-6 w-full flex items-center justify-center bg-transparent z-40 pointer-events-none">
            <div className="w-32 h-1 bg-zinc-400 dark:bg-zinc-600 rounded-full opacity-60"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
