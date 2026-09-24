import React, { useState } from 'react';
import { 
  Layers, 
  Smartphone, 
  FileCode, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  Code2,
  Workflow
} from 'lucide-react';

export const ArchitectureViewer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'pom' | 'real_device' | 'testplan'>('pom');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/15 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">Enterprise Architecture & Real iOS Environment</h2>
              <span className="text-[11px] font-mono text-zinc-400">· Page Object Model (POM)</span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Production-grade test design patterns, element decoupling, and physical device provisioning
            </p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setActiveSection('pom')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeSection === 'pom' ? 'bg-blue-600 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Page Object Model
          </button>
          <button
            onClick={() => setActiveSection('real_device')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeSection === 'real_device' ? 'bg-blue-600 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Physical Device Setup
          </button>
          <button
            onClick={() => setActiveSection('testplan')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeSection === 'testplan' ? 'bg-blue-600 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Xcode Test Plan
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {activeSection === 'pom' && (
          <div className="space-y-6">
            {/* Visual Flow Diagram */}
            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Data & Control Flow Diagram
                </span>
                <span className="text-xs text-zinc-400 font-mono">Zero hardcoded coordinates or raw text strings</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Level 1: Test Cases */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-blue-500/30 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-blue-400 font-mono font-semibold mb-2">
                      <span className="flex items-center gap-1.5">
                        <FileCode className="w-4 h-4" />
                        <span>LoginUITests.swift</span>
                      </span>
                      <span className="text-[10px] bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">Suite</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed mb-3">
                      High-level declarative test scenarios. Expresses <strong>intent</strong> without caring about UI coordinates or implementation details.
                    </p>
                    <div className="bg-zinc-900/80 p-2.5 rounded-lg font-mono text-[11px] text-zinc-300 space-y-1">
                      <p className="text-zinc-500">// Fluent POM Call</p>
                      <p className="text-blue-300">loginPage</p>
                      <p className="pl-2">.typeUsername("testuser")</p>
                      <p className="pl-2">.typePassword("password123")</p>
                      <p className="pl-2">.tapSubmit()</p>
                      <p className="text-emerald-300">homePage.assertDashboardLoaded()</p>
                    </div>
                  </div>
                </div>

                {/* Level 2: Page Objects */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-amber-500/30 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-amber-400 font-mono font-semibold mb-2">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-4 h-4" />
                        <span>LoginPage & HomePage</span>
                      </span>
                      <span className="text-[10px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">POM</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed mb-3">
                      Encapsulates queries, timeouts, and element selectors. When the UI changes, you update only this class!
                    </p>
                    <div className="bg-zinc-900/80 p-2.5 rounded-lg font-mono text-[11px] text-zinc-300 space-y-1">
                      <p className="text-zinc-500">// Typed Resilient Locators</p>
                      <p className="text-amber-300">var usernameField: XCUIElement &#123;</p>
                      <p className="pl-2 text-zinc-400">app.textFields["login_username_field"]</p>
                      <p className="text-amber-300">&#125;</p>
                      <p className="text-purple-300 mt-2">func typeUsername(...) -&gt; Self &#123;</p>
                      <p className="pl-2 text-zinc-400">usernameField.typeText(text)</p>
                      <p className="text-purple-300">&#125;</p>
                    </div>
                  </div>
                </div>

                {/* Level 3: SwiftUI Target */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/30 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-emerald-400 font-mono font-semibold mb-2">
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4" />
                        <span>SwiftUI Views</span>
                      </span>
                      <span className="text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">App</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed mb-3">
                      Production application code tagged with Apple's official accessibility modifiers for automation.
                    </p>
                    <div className="bg-zinc-900/80 p-2.5 rounded-lg font-mono text-[11px] text-zinc-300 space-y-1">
                      <p className="text-zinc-500">// SwiftUI View Modifier</p>
                      <p className="text-emerald-300">TextField("Username", ...)</p>
                      <p className="pl-2 text-cyan-300">.accessibilityIdentifier(</p>
                      <p className="pl-4 text-amber-200">"login_username_field"</p>
                      <p className="pl-2 text-cyan-300">)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why POM Wins */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30 text-xs space-y-2">
                <span className="font-semibold text-red-300 flex items-center gap-1.5">
                  <span>❌ Brittle Anti-Pattern (Common in beginner repos)</span>
                </span>
                <ul className="text-zinc-400 space-y-1.5 list-disc pl-4">
                  <li>Directly calling <code>app.buttons["Sign In"].tap()</code> inside every test method.</li>
                  <li>Breaks whenever text is localized into Spanish, German, or Japanese.</li>
                  <li>Using arbitrary <code>sleep(2)</code> instead of dynamic condition expectations.</li>
                  <li>Requires updating 20+ test methods when a single button is renamed or moved.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-xs space-y-2">
                <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <span>✅ Enterprise Page Object Model (In this repo)</span>
                </span>
                <ul className="text-zinc-400 space-y-1.5 list-disc pl-4">
                  <li>Single point of maintenance in <code>LoginPage.swift</code> and <code>HomePage.swift</code>.</li>
                  <li>Immune to localization changes via <code>accessibilityIdentifier</code>.</li>
                  <li>Fluent chaining: <code>loginPage.typeUsername().typePassword().tapSubmit()</code>.</li>
                  <li>Automatic failure screenshots attached to Xcode <code>.xcresult</code> bundle.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'real_device' && (
          <div className="space-y-5 text-xs text-zinc-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-2">
              <h3 className="font-bold text-white text-sm">Physical iOS Device Testing Checklist</h3>
              <p className="text-zinc-400">
                To run these automated tests on a connected physical iPhone or iPad (rather than the simulator), follow this industry standard workflow:
              </p>
            </div>

            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">1. Enable iOS Developer Mode (iOS 16, 17, 18)</span>
                <span className="text-[11px] font-mono text-zinc-400">On Physical Device</span>
              </div>
              <p className="text-zinc-400">
                Apple requires explicit Developer Mode toggling before apps or UI test runners can be deployed:
              </p>
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-zinc-300">
                Settings → Privacy & Security → scroll down to Developer Mode → Toggle ON → Restart iPhone
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">2. Automatic Signing & Provisioning</span>
                <span className="text-[11px] font-mono text-zinc-400">Xcode Signing</span>
              </div>
              <p className="text-zinc-400">
                In <code>project.yml</code> or Xcode project settings, set your personal Apple Development Team:
              </p>
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-zinc-300 space-y-1">
                <p className="text-zinc-500"># Set signing for both app and test runner</p>
                <p>DEVELOPMENT_TEAM = "YOUR_TEAM_ID"</p>
                <p>CODE_SIGN_STYLE = "Automatic"</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">3. Find Physical Device UDID via Terminal</span>
                <button
                  onClick={() => copyToClipboard('xcrun devicectl list devices', 'devicectl')}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                  {copiedCmd === 'devicectl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-zinc-300">
                xcrun devicectl list devices
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">4. Run XCUITest on Physical Device via CLI</span>
                <button
                  onClick={() => copyToClipboard(`xcodebuild test -project AuthDemo.xcodeproj -scheme AuthDemo -destination "id=<YOUR_DEVICE_UDID>" -testPlan AuthDemo -resultBundlePath TestResults.xcresult`, 'real_run')}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                  {copiedCmd === 'real_run' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 font-mono text-zinc-300 overflow-x-auto text-[11px]">
{`xcodebuild test \\
  -project AuthDemo.xcodeproj \\
  -scheme AuthDemo \\
  -destination "id=<YOUR_DEVICE_UDID>" \\
  -testPlan AuthDemo \\
  -resultBundlePath TestResults.xcresult`}
              </pre>
            </div>
          </div>
        )}

        {activeSection === 'testplan' && (
          <div className="space-y-4 text-xs text-zinc-300">
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/40 space-y-2">
              <h3 className="font-bold text-white text-sm">AuthDemo.xctestplan Configuration</h3>
              <p className="text-zinc-400">
                Modern Xcode workflows deprecate legacy scheme configurations in favor of standalone <strong>Test Plans</strong> (<code className="font-mono text-purple-300">.xctestplan</code>). This allows independent configurations for Localization, Code Coverage, and Execution Timeouts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-1.5">
                <span className="font-semibold text-white">Code Coverage</span>
                <p className="text-zinc-400 text-[11px]">
                  Configured to track line and branch coverage across SwiftUI views and ViewModels automatically.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-1.5">
                <span className="font-semibold text-white">Execution Timeouts</span>
                <p className="text-zinc-400 text-[11px]">
                  Hard limit of 60 seconds per test case prevents hanging CI pipelines and zombie processes.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-1.5">
                <span className="font-semibold text-white">Test Attachments</span>
                <p className="text-zinc-400 text-[11px]">
                  Retains full-resolution screenshots only on failure (<code>lifetime: .keepAlways</code>) to conserve disk space.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
