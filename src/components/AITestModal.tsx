import React, { useState } from 'react';
import { Sparkles, X, Loader2, Play, Code2, Plus } from 'lucide-react';
import { generateAITestCase } from '../services/aiGenerator';
import { TestCase } from '../types';

interface AITestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTestCase: (test: TestCase) => void;
}

export const AITestModal: React.FC<AITestModalProps> = ({
  isOpen,
  onClose,
  onAddTestCase
}) => {
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTest, setGeneratedTest] = useState<TestCase | null>(null);

  if (!isOpen) return null;

  const presets = [
    'Test account lockout after 3 consecutive failed login attempts',
    'Verify password show/hide eye toggle reveals plain text',
    'Test Remember Me UISwitch persists state across app launches',
    'Test input sanitization with emojis and SQL injection characters'
  ];

  const handleGenerate = async () => {
    if (!promptText.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateAITestCase(promptText);
      setGeneratedTest(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddAndClose = () => {
    if (generatedTest) {
      onAddTestCase(generatedTest);
      setGeneratedTest(null);
      setPromptText('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI XCUITest Scenario Generator</h3>
              <p className="text-xs text-zinc-400">
                Generate Swift XCUITest test code & interactive simulator steps from prompt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Describe what you want to automate & test:
            </label>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g. Verify that typing an invalid email format displays a specific field error before submitting..."
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all font-sans resize-none"
            />
          </div>

          {/* Quick preset chips */}
          <div>
            <span className="text-[11px] font-mono text-zinc-500 block mb-1.5">Or try a preset prompt:</span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setPromptText(preset)}
                  className="text-left text-[11px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg border border-zinc-800 transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Action Button */}
          <div className="pt-1 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !promptText.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white shadow-md shadow-purple-600/25 transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Swift Code...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Test Case</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Result Preview */}
          {generatedTest && (
            <div className="mt-4 p-4 rounded-xl bg-zinc-900/80 border border-purple-500/40 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{generatedTest.name}</h4>
                  <div className="text-[11px] font-mono text-purple-300">{generatedTest.swiftFunctionName}</div>
                </div>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">
                  {generatedTest.steps.length} Steps
                </span>
              </div>

              <div className="bg-black/80 rounded-lg p-3 border border-zinc-800 overflow-x-auto">
                <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed">
                  {generatedTest.codeSnippet}
                </pre>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleAddAndClose}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Active Test Suite & Runner</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
