import React, { useState } from 'react';
import { Crosshair, Copy, Check, X, ShieldAlert, Sparkles } from 'lucide-react';

interface ElementInfo {
  id: string;
  type: string;
  label: string;
  value?: string;
}

interface InspectorDrawerProps {
  element: ElementInfo | null;
  onClose: () => void;
}

export const InspectorDrawer: React.FC<InspectorDrawerProps> = ({ element, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!element) return null;

  const getSelector = (id: string, type: string) => {
    if (type.includes('TextField') && !type.includes('Secure')) {
      return `let field = app.textFields["${id}"]`;
    }
    if (type.includes('SecureTextField')) {
      return `let secureField = app.secureTextFields["${id}"]`;
    }
    if (type.includes('Button')) {
      return `let button = app.buttons["${id}"]`;
    }
    if (type.includes('Switch')) {
      return `let toggle = app.switches["${id}"]`;
    }
    if (type.includes('StaticText')) {
      return `let text = app.staticTexts["${id}"]`;
    }
    return `let elem = app.otherElements["${id}"]`;
  };

  const selectorCode = getSelector(element.id, element.type);
  const assertionCode = `XCTAssertTrue(app.descendants(matching: .any)["${element.id}"].waitForExistence(timeout: 3.0))`;

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-zinc-950/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-emerald-400">
          <Crosshair className="w-4 h-4 animate-spin-slow" />
          <span className="text-xs font-bold uppercase tracking-wider">Xcode Accessibility Inspector</span>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="py-3 space-y-2.5 text-xs">
        <div>
          <span className="text-[10px] uppercase font-mono text-zinc-500">Accessibility Identifier</span>
          <div className="font-mono text-white bg-zinc-900 px-2 py-1 rounded border border-zinc-800 flex items-center justify-between">
            <span className="text-emerald-300 font-semibold">{element.id}</span>
            <button
              onClick={() => copyText(element.id)}
              className="text-zinc-400 hover:text-white cursor-pointer"
              title="Copy ID"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-zinc-900/60 p-2 rounded border border-zinc-800/80">
            <div className="text-[10px] text-zinc-500 font-mono uppercase">XCUI Element Type</div>
            <div className="text-zinc-200 font-mono truncate">{element.type}</div>
          </div>
          <div className="bg-zinc-900/60 p-2 rounded border border-zinc-800/80">
            <div className="text-[10px] text-zinc-500 font-mono uppercase">UI Label</div>
            <div className="text-zinc-200 truncate">{element.label || 'None'}</div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[10px] uppercase font-mono text-zinc-500 mb-1">
            <span>XCUITest Swift Selector</span>
            <button
              onClick={() => copyText(selectorCode)}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
          </div>
          <pre className="p-2 bg-black rounded font-mono text-[11px] text-blue-300 border border-zinc-800/80 overflow-x-auto">
            {selectorCode}
          </pre>
        </div>

        <div>
          <div className="flex items-center justify-between text-[10px] uppercase font-mono text-zinc-500 mb-1">
            <span>Assertion Snippet</span>
            <button
              onClick={() => copyText(assertionCode)}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
          </div>
          <pre className="p-2 bg-black rounded font-mono text-[10px] text-amber-300/90 border border-zinc-800/80 overflow-x-auto whitespace-pre-wrap">
            {assertionCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
