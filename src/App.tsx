import React, { useState, useRef, useEffect } from 'react';
import { 
  Smartphone, 
  Terminal, 
  FolderTree, 
  Laptop, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  Download, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Workflow,
  FolderGit2
} from 'lucide-react';
import { PhoneSimulator } from './components/PhoneSimulator';
import { TestRunnerPanel } from './components/TestRunnerPanel';
import { CodeExplorer } from './components/CodeExplorer';
import { WindowsWorkflowGuide } from './components/WindowsWorkflowGuide';
import { ArchitectureViewer } from './components/ArchitectureViewer';
import { AITestModal } from './components/AITestModal';
import { InspectorDrawer } from './components/InspectorDrawer';
import { CORE_TEST_CASES, EXTRA_PRESET_TESTS } from './data/testDefinitions';
import { INITIAL_PROJECT_FILES } from './data/initialProject';
import { TestCase, XcodeLogEntry, ProjectFile } from './types';

export default function App() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'architecture' | 'windows'>('simulator');

  // Phone Simulator state
  const [currentScreen, setCurrentScreen] = useState<'login' | 'home'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Inspector & Pointer state
  const [inspectMode, setInspectMode] = useState(false);
  const [inspectedElement, setInspectedElement] = useState<{ id: string; type: string; label: string; value?: string } | null>(null);
  const [focusedTargetId, setFocusedTargetId] = useState<string | null>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number; active: boolean; label?: string } | null>(null);

  // Test Runner state
  const [testCases, setTestCases] = useState<TestCase[]>(CORE_TEST_CASES);
  const [currentRunningTestId, setCurrentRunningTestId] = useState<string | null>(null);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [logs, setLogs] = useState<XcodeLogEntry[]>([
    {
      timestamp: '00:00.00',
      level: 'system',
      message: 'Xcode 16.0 Build & Test System initialized. Ready to execute XCUITest runner.'
    }
  ]);

  // Project Files
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>(INITIAL_PROJECT_FILES);

  // AI Modal
  const [showAIModal, setShowAIModal] = useState(false);

  // Execution abort controller ref
  const abortRef = useRef(false);

  const resetDeviceToFreshState = () => {
    setCurrentScreen('login');
    setUsername('');
    setPassword('');
    setRememberMe(false);
    setShowPassword(false);
    setErrorMessage(null);
    setIsLoading(false);
    setShowLogoutModal(false);
    setPointerPos(null);
    setFocusedTargetId(null);
  };

  const addLog = (level: XcodeLogEntry['level'], message: string, testId?: string) => {
    const now = new Date();
    const ts = `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0')}`;
    setLogs(prev => [...prev, { timestamp: ts, level, message, testId }]);
  };

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms / speed));

  // Helper to locate an element by ID/data-testid inside the simulator
  const findElementPos = (targetId: string): { x: number; y: number } | null => {
    const el = document.getElementById(targetId) || document.querySelector(`[data-testid="${targetId}"]`);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const phoneContainer = el.closest('.relative.w-full.h-full');
    if (!phoneContainer) {
      return { x: 180, y: 350 };
    }
    const phoneRect = phoneContainer.getBoundingClientRect();
    return {
      x: rect.left - phoneRect.left + rect.width / 2,
      y: rect.top - phoneRect.top + rect.height / 2
    };
  };

  // Run a single test case
  const executeSingleTest = async (test: TestCase): Promise<boolean> => {
    if (abortRef.current) return false;

    setCurrentRunningTestId(test.id);
    setTestCases(prev => prev.map(t => t.id === test.id ? { ...t, status: 'running' } : t));
    
    addLog('system', `Test Case '-[LoginUITests ${test.swiftFunctionName.replace('()', '')}]' started.`, test.id);
    const startTime = Date.now();

    // Reset phone for this test if needed
    resetDeviceToFreshState();
    await delay(350);

    let success = true;

    try {
      for (const step of test.steps) {
        if (abortRef.current) {
          success = false;
          break;
        }

        setFocusedTargetId(step.targetId || null);

        // Position pointer
        if (step.targetId) {
          const pos = findElementPos(step.targetId);
          if (pos) {
            setPointerPos({ x: pos.x, y: pos.y, active: false, label: step.targetId });
          }
        }

        await delay(step.delayMs || 250);

        if (abortRef.current) break;

        // Perform Step Action
        switch (step.action) {
          case 'tap': {
            if (pointerPos) {
              setPointerPos(prev => prev ? { ...prev, active: true } : null);
            }
            addLog('action', `tQuery: ${step.targetId}.tap()`, test.id);

            // Trigger actual UI interaction on the simulated phone
            if (step.targetId === 'login_submit_button') {
              setIsLoading(true);
              await delay(400);
              setIsLoading(false);
              if (username === 'testuser' && password === 'password123') {
                setCurrentScreen('home');
                setErrorMessage(null);
              } else if (!username || !password) {
                setErrorMessage('Please enter both username and password');
              } else {
                setErrorMessage('Invalid credentials. Please check your credentials.');
              }
            } else if (step.targetId === 'home_logout_button') {
              setShowLogoutModal(true);
            } else if (step.targetId === 'logout_confirm_button') {
              setShowLogoutModal(false);
              setCurrentScreen('login');
              setUsername('');
              setPassword('');
              setErrorMessage(null);
            } else if (step.targetId === 'login_toggle_password') {
              setShowPassword(prev => !prev);
            } else if (step.targetId === 'login_remember_switch') {
              setRememberMe(prev => !prev);
            }

            await delay(150);
            setPointerPos(prev => prev ? { ...prev, active: false } : null);
            break;
          }

          case 'type': {
            addLog('action', `tQuery: ${step.targetId}.typeText("${step.value}")`, test.id);
            if (step.targetId === 'login_username_field' && step.value !== undefined) {
              // Typing simulation
              let current = '';
              for (let i = 0; i < step.value.length; i++) {
                current += step.value[i];
                setUsername(current);
                await delay(35);
              }
            } else if (step.targetId === 'login_password_field' && step.value !== undefined) {
              let current = '';
              for (let i = 0; i < step.value.length; i++) {
                current += step.value[i];
                setPassword(current);
                await delay(35);
              }
            }
            break;
          }

          case 'clear': {
            addLog('action', `tQuery: ${step.targetId}.clearText()`, test.id);
            if (step.targetId === 'login_username_field') setUsername('');
            if (step.targetId === 'login_password_field') setPassword('');
            break;
          }

          case 'assert_exists': {
            addLog('assert', `XCTAssertTrue(${step.targetId}.waitForExistence(timeout: 3.0))`, test.id);
            await delay(200);
            break;
          }

          case 'assert_text': {
            addLog('assert', `XCTAssertEqual(${step.targetId}.label, "${step.value}")`, test.id);
            await delay(150);
            break;
          }

          case 'wait': {
            addLog('info', `Waiting for animations to complete (${step.delayMs}ms)`, test.id);
            await delay(step.delayMs || 300);
            break;
          }
        }

        await delay(150);
      }
    } catch (err: unknown) {
      success = false;
      const errMsg = err instanceof Error ? err.message : String(err);
      addLog('fail', `Test failed with exception: ${errMsg}`, test.id);
    }

    const duration = Date.now() - startTime;

    if (!abortRef.current) {
      if (success) {
        addLog('pass', `Test Case '-[LoginUITests ${test.swiftFunctionName.replace('()', '')}]' passed (${(duration / 1000).toFixed(2)} seconds).`, test.id);
        setTestCases(prev => prev.map(t => t.id === test.id ? { ...t, status: 'passed', durationMs: duration } : t));
      } else {
        addLog('fail', `Test Case '-[LoginUITests ${test.swiftFunctionName.replace('()', '')}]' failed (${(duration / 1000).toFixed(2)} seconds).`, test.id);
        setTestCases(prev => prev.map(t => t.id === test.id ? { ...t, status: 'failed', durationMs: duration } : t));
      }
    }

    setCurrentRunningTestId(null);
    setPointerPos(null);
    setFocusedTargetId(null);
    return success;
  };

  // Run all tests sequentially
  const handleRunAll = async () => {
    if (isRunningAll || currentRunningTestId) return;
    abortRef.current = false;
    setIsRunningAll(true);
    addLog('system', `=== Starting Test Plan 'AuthDemo' (5 tests queued) ===`);

    for (const test of testCases) {
      if (abortRef.current) break;
      await executeSingleTest(test);
      await delay(400);
    }

    setIsRunningAll(false);
    if (!abortRef.current) {
      addLog('system', `=== Test Plan 'AuthDemo' completed with zero failures ===`);
    } else {
      addLog('system', `=== Test Plan 'AuthDemo' cancelled by user ===`);
    }
  };

  const handleRunSingle = async (testId: string) => {
    if (isRunningAll || currentRunningTestId) return;
    const test = testCases.find(t => t.id === testId);
    if (test) {
      abortRef.current = false;
      await executeSingleTest(test);
    }
  };

  const handleStop = () => {
    abortRef.current = true;
    setIsRunningAll(false);
    setCurrentRunningTestId(null);
    setPointerPos(null);
    setFocusedTargetId(null);
    addLog('system', 'Execution aborted by user.');
  };

  const handleResetAllStatus = () => {
    handleStop();
    setTestCases(prev => prev.map(t => ({ ...t, status: 'idle', durationMs: undefined })));
    resetDeviceToFreshState();
    addLog('system', 'Test suite and simulated device state reset.');
  };

  const handleAddAITest = (newTest: TestCase) => {
    setTestCases(prev => [...prev, newTest]);
    setProjectFiles(prev => prev.map(file => {
      if (file.path.endsWith('LoginUITests.swift')) {
        const insertionPoint = file.content.lastIndexOf('}');
        const newContent = insertionPoint !== -1 
          ? file.content.slice(0, insertionPoint) + `\n    // MARK: - AI Generated: ${newTest.name}\n    ${newTest.codeSnippet}\n}\n`
          : file.content + `\n${newTest.codeSnippet}\n`;
        return { ...file, content: newContent };
      }
      return file;
    }));
    addLog('info', `Added AI-generated test: ${newTest.name}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Application Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-white shadow-md">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  iOS XCUITest Automation Studio
                </h1>
                <span className="text-xs text-zinc-500 font-mono">v2.0</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                <span>Swift 5.10 / 6.0</span>
                <span aria-hidden="true">·</span>
                <span>Page Object Model</span>
                <span aria-hidden="true">·</span>
                <span>Physical iOS & Simulator</span>
                <span aria-hidden="true">·</span>
                <span>MIT License</span>
              </div>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs shadow-inner">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Simulator & Runner</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>GitHub Repo & Export</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>POM & Real iOS Setup</span>
            </button>

            <button
              onClick={() => setActiveTab('windows')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'windows'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Windows CI (~1-2h)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
            {/* Left Column: Simulated iPhone Device */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <PhoneSimulator
                currentScreen={currentScreen}
                setCurrentScreen={setCurrentScreen}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                showLogoutModal={showLogoutModal}
                setShowLogoutModal={setShowLogoutModal}
                inspectMode={inspectMode}
                onInspectElement={(info) => setInspectedElement(info)}
                focusedTargetId={focusedTargetId}
                pointerPos={pointerPos}
                onResetDevice={resetDeviceToFreshState}
              />
            </div>

            {/* Right Column: XCUITest Runner & Xcode Console */}
            <div className="lg:col-span-7 h-full min-h-[640px]">
              <TestRunnerPanel
                testCases={testCases}
                currentRunningTestId={currentRunningTestId}
                isRunningAll={isRunningAll}
                onRunAll={handleRunAll}
                onRunSingle={handleRunSingle}
                onStop={handleStop}
                onResetAllStatus={handleResetAllStatus}
                logs={logs}
                onClearLogs={() => setLogs([])}
                speed={speed}
                setSpeed={setSpeed}
                inspectMode={inspectMode}
                setInspectMode={setInspectMode}
                onOpenAIGenerator={() => setShowAIModal(true)}
              />
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="flex-1 min-h-[640px]">
            <CodeExplorer files={projectFiles} />
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="flex-1 min-h-[640px]">
            <ArchitectureViewer />
          </div>
        )}

        {activeTab === 'windows' && (
          <div className="flex-1 min-h-[640px]">
            <WindowsWorkflowGuide />
          </div>
        )}
      </main>

      {/* Footer Info Strip */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 px-4 py-3 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Based on XCUITest / Apple Human Interface Guidelines</span>
            <span aria-hidden="true">·</span>
            <span>MIT Licensed Open Source</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>5 Core Tests: Valid • Invalid • Empty • Home Navigation • Logout</span>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-400">Physical Device & XcodeGen Ready</span>
          </div>
        </div>
      </footer>

      {/* AI Test Generator Modal */}
      <AITestModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onAddTestCase={handleAddAITest}
      />

      {/* Xcode Accessibility Inspector Drawer */}
      <InspectorDrawer
        element={inspectedElement}
        onClose={() => setInspectedElement(null)}
      />
    </div>
  );
}
