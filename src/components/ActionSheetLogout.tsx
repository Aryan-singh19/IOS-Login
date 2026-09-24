import React from 'react';

interface ActionSheetLogoutProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  inspectMode: boolean;
  onInspectElement?: (info: { id: string; type: string; label: string }) => void;
  focusedTargetId?: string | null;
}

export const ActionSheetLogout: React.FC<ActionSheetLogoutProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  inspectMode,
  onInspectElement,
  focusedTargetId
}) => {
  if (!isOpen) return null;

  const isTargeted = focusedTargetId === 'logout_confirm_button';

  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex flex-col justify-end p-3 animate-in fade-in duration-200">
      <div className="space-y-2">
        {/* Actions Card */}
        <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-700/50 shadow-2xl">
          <div className="px-4 py-3 text-center border-b border-zinc-200/60 dark:border-zinc-700/60">
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Are you sure you want to log out?
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              This will safely clear your active session.
            </p>
          </div>

          <button
            type="button"
            id="logout_confirm_button"
            data-testid="logout_confirm_button"
            onClick={inspectMode && onInspectElement ? () => onInspectElement({
              id: 'logout_confirm_button',
              type: 'XCUIElementTypeButton',
              label: 'Log Out'
            }) : onConfirm}
            className={`w-full py-3.5 text-center text-red-600 font-semibold text-base active:bg-red-50 dark:active:bg-red-950/30 transition-colors cursor-pointer ${
              isTargeted ? 'ring-2 ring-blue-500 bg-red-50 dark:bg-red-950/40 animate-pulse' : ''
            } ${inspectMode ? 'hover:outline-dashed hover:outline-2 hover:outline-emerald-500' : ''}`}
          >
            Log Out
          </button>
        </div>

        {/* Cancel Button */}
        <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg">
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3.5 text-center text-blue-600 dark:text-blue-400 font-semibold text-base active:bg-zinc-100 dark:active:bg-zinc-700/40 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
