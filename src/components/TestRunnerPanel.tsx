import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Terminal, 
  Copy, 
  Trash2, 
  Code2, 
  Sliders, 
  Sparkles, 
  ChevronDown, 
  ChevronRight, 
  Crosshair, 
  Zap, 
  Info,
  Smartphone,
  Layers,
  Image,
  FileCheck
} from 'lucide-react';
import { TestCase, XcodeLogEntry, TestStatus } from '../types';

interface TestRunnerPanelProps {
  testCases: TestCase[];
  currentRunningTestId: string | null;
  isRunningAll: boolean;
  onRunAll: () => void;
  onRunSingle: (testId: string) => void;
  onStop: () => void;
  onResetAllStatus: () => void;
  logs: XcodeLogEntry[];
  onClearLogs: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  inspectMode: boolean;
  setInspectMode: (mode: boolean) => void;
  onOpenAIGenerator: () => void;
  onSelectTestSnippet?: (test: TestCase) => void;
}

export const TestRunnerPanel: React.FC<TestRunnerPanelProps> = ({
  testCases,
  currentRunningTestId,
  isRunningAll,
  onRunAll,
  onRunSingle,
  onStop,
  onResetAllStatus,
  logs,
  onClearLogs,
  speed,
  setSpeed,
  inspectMode,
  setInspectMode,
  onOpenAIGenerator
}) => {
  const [activeView, setActiveView] = useState<'tests' | 'logs' | 'artifacts'>('tests');
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [targetDevice, setTargetDevice] = useState<'simulator' | 'physical'>('simulator');
  const [copiedLogs, setCopiedLogs] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const passedCount = testCases.filter(t => t.status === 'passed').length;
  const failedCount = testCases.filter(t => t.status === 'failed').length;
  const isBusy = isRunningAll || !!currentRunningTestId;

  // Auto scroll logs
  useEffect(() => {
    if (activeView === 'logs') {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeView]);

  const handleCopyLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedLogs(true);
    setTimeout(() => setCopiedLogs(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Panel Header */}
      <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/60 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>XCUITest Automation Suite</span>
              <span className="text-[11px] font-mono text-zinc-400">· Page Object Model</span>
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            5 automated UI tests mapped to simulated iOS device
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Target Environment Switcher */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5 text-xs text-zinc-400">
            <button
              onClick={() => setTargetDevice('simulator')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                targetDevice === 'simulator' ? 'bg-zinc-800 text-white shadow-xs' : 'hover:text-zinc-200'
              }`}
            >
              <Smartphone className="w-3 h-3 text-blue-400" />
              <span>Simulator</span>
            </button>
            <button
              onClick={() => setTargetDevice('physical')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                targetDevice === 'physical' ? 'bg-zinc-800 text-white shadow-xs' : 'hover:text-zinc-200'
              }`}
            >
              <Smartphone className="w-3 h-3 text-emerald-400" />
              <span>Physical iOS</span>
            </button>
          </div>

          {/* Inspect Mode Toggle */}
          <button
            onClick={() => setInspectMode(!inspectMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              inspectMode 
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-800/80 border-zinc-700/80 text-zinc-300 hover:text-white'
            }`}
            title="Inspect Accessibility Identifiers on simulated phone"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{inspectMode ? 'Inspector ON' : 'Inspect'}</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs text-zinc-400">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                disabled={isBusy}
                className={`px-2 py-1 rounded font-mono text-[11px] transition-colors cursor-pointer ${
                  speed === s ? 'bg-zinc-700 text-white font-bold' : 'hover:text-zinc-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* AI Generator Button */}
          <button
            onClick={onOpenAIGenerator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-300 hover:text-white transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Test Gen</span>
          </button>

          {/* Reset / Stop */}
          {isBusy ? (
            <button
              onClick={onStop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all cursor-pointer"
            >
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={onResetAllStatus}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Reset Test Status"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Run All Button */}
          <button
            onClick={onRunAll}
            disabled={isBusy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isBusy ? 'Testing...' : 'Run All 5 Tests'}</span>
          </button>
        </div>
      </div>

      {/* View Switcher Bar */}
      <div className="px-4 py-2 bg-zinc-900/40 border-b border-zinc-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveView('tests')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              activeView === 'tests' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Test Cases ({testCases.length})
          </button>
          <button
            onClick={() => setActiveView('logs')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              activeView === 'logs' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <span>Xcode Console ({logs.length})</span>
          </button>
          <button
            onClick={() => setActiveView('artifacts')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              activeView === 'artifacts' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Image className="w-3.5 h-3.5 text-purple-400" />
            <span>Test Attachments (.xcresult)</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
          <span className="text-emerald-400 font-semibold">{passedCount} Passed</span>
          <span aria-hidden="true">·</span>
          <span>{failedCount} Failed</span>
          <span aria-hidden="true">·</span>
          <span className="text-zinc-500">
            {targetDevice === 'simulator' ? 'iPhone 16 Simulator (18.2)' : 'iPhone 15 Pro (USB devicectl)'}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* VIEW 1: Test Cases List */}
        {activeView === 'tests' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {testCases.map((test) => {
              const isRunning = currentRunningTestId === test.id;
              const isExpanded = expandedTestId === test.id;

              return (
                <div
                  key={test.id}
                  className={`border rounded-xl transition-all duration-200 ${
                    isRunning 
                      ? 'bg-blue-950/20 border-blue-500/40 shadow-md shadow-blue-900/20' 
                      : test.status === 'passed'
                      ? 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700'
                      : 'bg-zinc-900/30 border-zinc-800/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Status Icon */}
                      <div className="shrink-0">
                        {isRunning ? (
                          <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                        ) : test.status === 'passed' ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : test.status === 'failed' ? (
                          <div className="w-6 h-6 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/30">
                            <XCircle className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 text-xs font-semibold flex items-center justify-center border border-zinc-700 font-mono">
                            {test.number}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-zinc-200 truncate">
                            {test.name}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            · {test.category}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                          {test.swiftFunctionName}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {test.durationMs && (
                        <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                          {(test.durationMs / 1000).toFixed(2)}s
                        </span>
                      )}

                      <button
                        onClick={() => onRunSingle(test.id)}
                        disabled={isBusy}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-40 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Run this test"
                      >
                        <Play className="w-3 h-3 fill-current" />
                      </button>

                      <button
                        onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                        className="p-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                        title="Toggle Swift Code Snippet"
                      >
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details & Page Object Steps */}
                  {isExpanded && (
                    <div className="px-4 pb-3 pt-1 border-t border-zinc-800/60 text-xs space-y-3">
                      <p className="text-zinc-400 text-[11px]">
                        {test.description}
                      </p>

                      {/* Steps Checklist */}
                      <div className="bg-zinc-950/70 p-3 rounded-lg border border-zinc-800/80 space-y-1.5">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1">
                          POM Test Execution Sequence:
                        </div>
                        {test.steps.map((st, sIdx) => (
                          <div key={st.id} className="flex items-center gap-2 text-[11px] text-zinc-300 font-mono">
                            <span className="text-zinc-500 w-4">{sIdx + 1}.</span>
                            <span className="text-blue-400 font-semibold">{st.action}</span>
                            <span className="text-zinc-400">→</span>
                            <span className="text-zinc-300 truncate">{st.description}</span>
                          </div>
                        ))}
                      </div>

                      {/* Swift Snippet */}
                      <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/80 font-mono text-[11px] text-zinc-300 overflow-x-auto">
                        <div className="text-zinc-500 text-[10px] mb-1">// Page Object Model Swift Snippet</div>
                        <pre className="text-blue-300 whitespace-pre">{test.codeSnippet}</pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: Xcode CLI Logs */}
        {activeView === 'logs' && (
          <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden font-mono text-xs">
            <div className="px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-zinc-400 text-[11px]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>xcodebuild test console output</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLogs}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedLogs ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={onClearLogs}
                  className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1 text-[11px] select-text">
              {logs.map((log, idx) => {
                let color = 'text-zinc-400';
                if (log.level === 'action') color = 'text-cyan-400';
                if (log.level === 'assert') color = 'text-yellow-400';
                if (log.level === 'pass') color = 'text-emerald-400 font-semibold';
                if (log.level === 'fail') color = 'text-red-400 font-semibold';
                if (log.level === 'system') color = 'text-purple-400';

                return (
                  <div key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-zinc-600 select-none">[{log.timestamp}]</span>
                    <span className={color}>{log.message}</span>
                  </div>
                );
              })}
              <div ref={logsEndRef} />
            </div>
          </div>
        )}

        {/* VIEW 3: Test Attachments & Visual Diagnostics */}
        {activeView === 'artifacts' && (
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/40 text-xs text-purple-200">
              <span className="font-bold text-white">Apple XCTAttachment Diagnostics: </span>
              In production XCUITest, failed assertions and marked checkpoints automatically save PNG snapshots to the test result bundle (<code className="font-mono text-purple-300">TestResults.xcresult</code>).
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testCases.map((test) => (
                <div key={test.id} className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-200">{test.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      test.status === 'passed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {test.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500">
                    Artifact: {test.swiftFunctionName.replace('()', '')}_screenshot.png
                  </div>
                  <div className="h-28 rounded-lg bg-zinc-950 border border-zinc-800/80 flex flex-col items-center justify-center text-zinc-500 text-xs space-y-1">
                    <Image className="w-5 h-5 text-zinc-600" />
                    <span className="text-[11px]">
                      {test.status === 'passed' ? 'Attachment Captured (240 KB)' : 'Pending Test Run'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
