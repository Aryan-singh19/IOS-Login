import React, { useState } from 'react';
import { 
  Laptop, 
  Terminal, 
  Cloud, 
  CheckSquare, 
  Square, 
  ExternalLink, 
  FileCode, 
  Cpu, 
  Zap, 
  Copy, 
  Check, 
  GitBranch,
  ShieldCheck
} from 'lucide-react';

export const WindowsWorkflowGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ci' | 'cloud' | 'local' | 'checklist'>('ci');
  const [copiedScript, setCopiedScript] = useState(false);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({
    'c1': true,
    'c2': true,
    'c3': false,
    'c4': false
  });

  const toggleCheck = (id: string) => {
    setCompletedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const sampleWorkflowYaml = `name: iOS XCUITest CI (Windows Author)

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  run-ios-tests:
    runs-on: macos-14 # Apple Silicon M2 runner provided free by GitHub
    steps:
      - uses: actions/checkout@v4
      
      - name: Select Xcode 15.4
        run: sudo xcode-select -s /Applications/Xcode_15.4.app/Contents/Developer
        
      - name: Run 5 XCUITest Cases
        run: |
          xcodebuild test \\
            -project AuthDemo.xcodeproj \\
            -scheme AuthDemo \\
            -destination 'platform=iOS Simulator,name=iPhone 16,OS=17.5' \\
            -only-testing:LoginUITests/testValidLogin \\
            -only-testing:LoginUITests/testInvalidLogin \\
            -only-testing:LoginUITests/testEmptyCredentials \\
            -only-testing:LoginUITests/testNavigationToHomeScreen \\
            -only-testing:LoginUITests/testLogoutReturnsToLogin \\
            -resultBundlePath TestResults.xcresult
            
      - name: Publish Test Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: xcode-test-results
          path: TestResults.xcresult`;

  const copyYaml = () => {
    navigator.clipboard.writeText(sampleWorkflowYaml);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Laptop className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Windows Laptop Execution Guide</span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                ~1-2 Hours Target
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              How to write, prepare, and execute iOS XCUITest automation completely from Windows
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setActiveTab('ci')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'ci' ? 'bg-blue-600 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            GitHub Actions CI (Recommended)
          </button>
          <button
            onClick={() => setActiveTab('cloud')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'cloud' ? 'bg-blue-600 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Cloud Device Farms
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'checklist' ? 'bg-blue-600 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            1-2h Checklist
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {activeTab === 'ci' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 text-xs text-blue-200 leading-relaxed">
              <span className="font-semibold text-white">Why this works on Windows: </span>
              GitHub provides free macOS runners (<code className="font-mono bg-blue-900/40 px-1 py-0.5 rounded">macos-14</code> Apple Silicon M2 machines). You write the Swift test files on your Windows machine, commit them to git, and GitHub's cloud Mac spins up an iPhone 16 simulator, executes <code className="font-mono bg-blue-900/40 px-1 py-0.5 rounded">xcodebuild test</code>, and gives you full test results and screenshots!
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>.github/workflows/xcuitest.yml</span>
                <button
                  onClick={copyYaml}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Copied' : 'Copy Workflow'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-black border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed">
                <pre>{sampleWorkflowYaml}</pre>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs font-semibold text-white mb-1">1. Author on Windows</div>
                <p className="text-[11px] text-zinc-400">
                  Edit <code>LoginUITests.swift</code> and <code>TestCases.md</code> in VS Code or this simulator studio.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs font-semibold text-white mb-1">2. Git Push</div>
                <p className="text-[11px] text-zinc-400">
                  Push your branch to GitHub. The CI workflow triggers immediately on push.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs font-semibold text-white mb-1">3. Download Results</div>
                <p className="text-[11px] text-zinc-400">
                  Inspect pass/fail logs, execution times, and crash reports directly in GitHub Actions UI.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cloud' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="text-xs text-zinc-400 leading-relaxed">
              If your team requires testing against physical real iPhone devices or interactive cloud inspection directly from a Windows browser, connect your XCUITest suite to these industry standard cloud device farms:
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">BrowserStack App Automate</h3>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Native XCUITest
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Upload your app and test runner package via REST API from Windows PowerShell, and run tests concurrently across 50+ real iPhone models.
                </p>
                <div className="text-[11px] font-mono text-zinc-500 bg-black/60 p-2 rounded border border-zinc-800">
                  curl -u "user:key" -X POST https://api-cloud.browserstack.com/app-automate/xcuitest/v2/build
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Sauce Labs / AWS Device Farm</h3>
                  <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                    Enterprise
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Provides video recordings of test runs, step-by-step screenshots on assertion failures, and network log capture for iOS.
                </p>
                <div className="text-[11px] font-mono text-zinc-500 bg-black/60 p-2 rounded border border-zinc-800">
                  saucectl run --config .sauce/config.yml
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-300">
              Follow this 4-step checklist to complete your iOS testing automation demo on Windows within 1-2 hours:
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'c1', title: 'Prepare project structure and documentation (README.md & TestCases.md)', time: '20 mins', desc: 'Define TC-001 through TC-005 with explicit inputs, accessibility IDs, and expected results.' },
                { id: 'c2', title: 'Author Swift XCUITest automation suite (LoginUITests.swift)', time: '35 mins', desc: 'Implement testValidLogin, testInvalidLogin, testEmptyCredentials, testNavigationToHomeScreen, testLogout.' },
                { id: 'c3', title: 'Validate UI interactions and timing on the simulated iPhone', time: '20 mins', desc: 'Use the live interactive simulator and runner to verify every accessibilityIdentifier and step animation.' },
                { id: 'c4', title: 'Export ZIP and setup GitHub Actions macOS runner pipeline', time: '15 mins', desc: 'Download the ZIP archive, push to your repository, and observe cloud macOS execution.' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    completedItems[item.id]
                      ? 'bg-emerald-950/10 border-emerald-500/30'
                      : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="mt-0.5 text-emerald-400 shrink-0">
                    {completedItems[item.id] ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-zinc-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className={`text-xs font-semibold ${completedItems[item.id] ? 'text-zinc-200 line-through' : 'text-white'}`}>
                        {item.title}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/80 px-2 py-0.5 rounded">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      {item.desc}
                    </p>
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
