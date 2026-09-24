import React, { useState, useMemo } from 'react';
import { 
  Folder, 
  FileCode, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  FolderOpen, 
  Layers, 
  FileCheck,
  Eye,
  Code2,
  Terminal,
  GitBranch,
  ExternalLink,
  Shield,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import JSZip from 'jszip';
import { ProjectFile } from '../types';

interface CodeExplorerProps {
  files: ProjectFile[];
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({ files }) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(
    files.find(f => f.name === 'README.md')?.path || files[0].path
  );
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [showGitModal, setShowGitModal] = useState(false);

  const selectedFile = files.find(f => f.path === selectedFilePath) || files[0];
  const isMarkdown = selectedFile.name.endsWith('.md') || selectedFile.name === 'LICENSE';

  // Group files logically for enterprise explorer
  const groupedFiles = useMemo(() => {
    return {
      docs: files.filter(f => f.name.endsWith('.md') || f.name === 'LICENSE' || f.name === '.gitignore'),
      app: files.filter(f => f.path.includes('/App/')),
      pages: files.filter(f => f.path.includes('/Tests/Pages/') || f.path.includes('/Tests/Common/')),
      tests: files.filter(f => f.path.endsWith('LoginUITests.swift')),
      automation: files.filter(f => f.path.includes('.github') || f.path.includes('fastlane') || f.path.endsWith('.xctestplan') || f.path.endsWith('project.yml'))
    };
  }, [files]);

  const handleCopy = () => {
    if (selectedFile) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadSingle = () => {
    if (!selectedFile) return;
    const blob = new Blob([selectedFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      files.forEach((file) => {
        zip.file(file.path, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'iOS-XCUITest-Demo.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName === 'LICENSE') return <Shield className="w-4 h-4 text-amber-400 shrink-0" />;
    if (fileName.endsWith('.swift')) return <FileCode className="w-4 h-4 text-orange-400 shrink-0" />;
    if (fileName.endsWith('.md')) return <FileText className="w-4 h-4 text-blue-400 shrink-0" />;
    if (fileName.endsWith('.yml') || fileName.endsWith('.yaml')) return <Layers className="w-4 h-4 text-emerald-400 shrink-0" />;
    if (fileName.endsWith('.json') || fileName.endsWith('.xctestplan')) return <FileCheck className="w-4 h-4 text-purple-400 shrink-0" />;
    return <FileCheck className="w-4 h-4 text-zinc-400 shrink-0" />;
  };

  // Simple Markdown Renderer for high legibility
  const renderSimpleMarkdown = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLang = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockLang = line.replace('```', '').trim();
          codeBlockContent = [];
        } else {
          inCodeBlock = false;
          elements.push(
            <div key={`code-${i}`} className="my-4 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 font-mono text-xs">
              {codeBlockLang && (
                <div className="px-4 py-1.5 bg-zinc-900 border-b border-zinc-800/80 text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                  {codeBlockLang}
                </div>
              )}
              <pre className="p-4 overflow-x-auto text-zinc-300 leading-relaxed">
                {codeBlockContent.join('\n')}
              </pre>
            </div>
          );
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${i}`} className="text-2xl font-bold text-white tracking-tight mt-6 mb-4 pb-2 border-b border-zinc-800">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${i}`} className="text-lg font-bold text-zinc-100 tracking-tight mt-6 mb-3">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-sm font-bold text-zinc-200 uppercase tracking-wide mt-5 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('---')) {
        elements.push(<hr key={`hr-${i}`} className="border-zinc-800 my-6" />);
      } else if (line.startsWith('|') && line.endsWith('|')) {
        // Table row
        const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        const isHeaderSep = cells.every(c => c.match(/^[-:]+$/));
        if (!isHeaderSep) {
          elements.push(
            <div key={`tbl-${i}`} className="grid grid-cols-4 gap-3 py-1.5 px-3 border-b border-zinc-800/60 text-xs font-mono">
              {cells.map((cell, cIdx) => (
                <span key={cIdx} className={cIdx === 0 ? "font-bold text-white" : "text-zinc-400"}>
                  {cell.replace(/`/g, '')}
                </span>
              ))}
            </div>
          );
        }
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={`li-${i}`} className="ml-5 list-disc text-sm text-zinc-300 my-1 leading-relaxed">
            {line.replace('- ', '')}
          </li>
        );
      } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
        elements.push(
          <li key={`oli-${i}`} className="ml-5 list-decimal text-sm text-zinc-300 my-1 leading-relaxed">
            {line.replace(/^\d+\.\s*/, '')}
          </li>
        );
      } else if (line.trim().length > 0) {
        elements.push(
          <p key={`p-${i}`} className="text-sm text-zinc-300 leading-relaxed my-2.5">
            {line}
          </p>
        );
      }
    }

    return elements;
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top GitHub Repo Meta Bar */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-200 border border-zinc-700/60 shadow-sm">
            <FolderOpen className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-400">aryansingh19gh</span>
              <span className="text-zinc-600">/</span>
              <h2 className="text-sm font-bold text-white tracking-tight">iOS-XCUITest-Demo</h2>
              <span className="text-[11px] font-mono text-zinc-400">· public</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
              <span>Swift 5.10 / 6.0</span>
              <span aria-hidden="true">·</span>
              <span>Page Object Model</span>
              <span aria-hidden="true">·</span>
              <span>MIT License</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-mono text-[11px]">Real Device & Simulator Ready</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowGitModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 transition-colors cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <span>Git Setup</span>
          </button>

          <button
            onClick={handleDownloadSingle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 transition-colors cursor-pointer"
            title="Download selected file"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Download File</span>
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
            title="Download complete ready-to-push repository as ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isZipping ? 'Bundling...' : 'Download Repository (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Tree Explorer */}
        <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-900/30 p-3 overflow-y-auto shrink-0 space-y-4">
          <div className="flex items-center justify-between px-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
            <span>Repository Structure</span>
            <span className="text-zinc-600">{files.length} items</span>
          </div>

          {/* Group 1: Root & Documentation */}
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-blue-400" />
              <span>Root & Docs</span>
            </div>
            <div className="mt-1 space-y-0.5">
              {groupedFiles.docs.map(file => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    selectedFilePath === file.path
                      ? 'bg-blue-600/20 text-blue-300 font-medium border border-blue-500/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  {getFileIcon(file.name)}
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Group 2: SwiftUI App Target */}
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-3 h-3 text-purple-400" />
              <span>App Target (SwiftUI)</span>
            </div>
            <div className="mt-1 space-y-0.5">
              {groupedFiles.app.map(file => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    selectedFilePath === file.path
                      ? 'bg-blue-600/20 text-blue-300 font-medium border border-blue-500/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  {getFileIcon(file.name)}
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Group 3: Page Object Model & Base */}
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-amber-400" />
              <span>Page Objects (POM)</span>
            </div>
            <div className="mt-1 space-y-0.5">
              {groupedFiles.pages.map(file => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    selectedFilePath === file.path
                      ? 'bg-blue-600/20 text-blue-300 font-medium border border-blue-500/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  {getFileIcon(file.name)}
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Group 4: Automated UITests Suite */}
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileCode className="w-3 h-3 text-orange-400" />
              <span>UI Test Suites</span>
            </div>
            <div className="mt-1 space-y-0.5">
              {groupedFiles.tests.map(file => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    selectedFilePath === file.path
                      ? 'bg-blue-600/20 text-blue-300 font-medium border border-blue-500/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  {getFileIcon(file.name)}
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Group 5: CI/CD & Project Specs */}
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-emerald-400" />
              <span>CI/CD & Xcode Config</span>
            </div>
            <div className="mt-1 space-y-0.5">
              {groupedFiles.automation.map(file => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    selectedFilePath === file.path
                      ? 'bg-blue-600/20 text-blue-300 font-medium border border-blue-500/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  {getFileIcon(file.name)}
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Code/Preview Editor Viewport */}
        <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
          {/* File Tab Info Bar */}
          <div className="px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-mono">
              <span className="text-zinc-500">{selectedFile.path}</span>
              <span className="text-zinc-700">·</span>
              <span className="text-zinc-400">{selectedFile.content.split('\n').length} lines</span>
              <span className="text-zinc-700">·</span>
              <span className="text-zinc-400 font-sans">{selectedFile.description}</span>
            </div>

            <div className="flex items-center gap-2">
              {isMarkdown && (
                <div className="flex items-center bg-zinc-800/90 rounded-lg p-0.5 border border-zinc-700/60">
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                      viewMode === 'preview'
                        ? 'bg-zinc-700 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => setViewMode('raw')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                      viewMode === 'raw'
                        ? 'bg-zinc-700 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Code2 className="w-3 h-3" />
                    <span>Raw Code</span>
                  </button>
                </div>
              )}

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer border border-zinc-700/50"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Content View */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs">
            {isMarkdown && viewMode === 'preview' ? (
              <div className="max-w-4xl mx-auto font-sans p-4 text-zinc-200">
                {renderSimpleMarkdown(selectedFile.content)}
              </div>
            ) : (
              <div className="flex leading-relaxed">
                {/* Line numbers */}
                <div className="select-none text-right pr-4 text-zinc-600 font-mono text-[11px] shrink-0 border-r border-zinc-800/80 mr-4">
                  {selectedFile.content.split('\n').map((_, idx) => (
                    <div key={idx}>{idx + 1}</div>
                  ))}
                </div>
                {/* Raw Code Content */}
                <pre className="text-zinc-300 font-mono overflow-x-auto whitespace-pre">
                  {selectedFile.content}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GitHub Setup Instructions Modal */}
      {showGitModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Push to GitHub in 3 Steps</h3>
              </div>
              <button
                onClick={() => setShowGitModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <p>
                Download the full ZIP via the <strong className="text-emerald-400">Download Repository (.zip)</strong> button, unzip it on your machine, then run:
              </p>

              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 font-mono text-zinc-200 space-y-2 select-all">
                <p className="text-zinc-500"># 1. Initialize and commit repository</p>
                <p>git init</p>
                <p>git add .</p>
                <p>git commit -m "feat: complete iOS XCUITest suite with Page Object Model"</p>
                <p className="text-zinc-500 mt-2"># 2. Create remote repo using GitHub CLI or web</p>
                <p>gh repo create iOS-XCUITest-Demo --public --source=. --remote=upstream --push</p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-blue-300">
                💡 The included <code className="text-white">.github/workflows/xcuitest.yml</code> will automatically trigger on GitHub with Apple Silicon <code className="text-white">macos-14</code> runners, compiling and testing your code for free!
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowGitModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
