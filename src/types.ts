export type TestStatus = 'idle' | 'running' | 'passed' | 'failed';

export interface TestStep {
  id: string;
  description: string;
  action: 'tap' | 'type' | 'clear' | 'assert_exists' | 'assert_not_exists' | 'assert_text' | 'wait';
  targetId?: string; // accessibilityIdentifier
  value?: string;
  delayMs?: number;
  durationMs?: number;
  status?: 'pending' | 'running' | 'passed' | 'failed';
  screenshotState?: {
    screen: 'login' | 'home';
    username: string;
    hasError: boolean;
    errorText?: string;
    hasActionSheet: boolean;
    pointerTarget?: string;
  };
}

export interface TestCase {
  id: string;
  number: number;
  name: string;
  swiftFunctionName: string;
  description: string;
  status: TestStatus;
  durationMs?: number;
  errorMessage?: string;
  steps: TestStep[];
  codeSnippet: string;
  category: 'core' | 'validation' | 'navigation' | 'custom';
  failureScreenshot?: string;
}

export interface XcodeLogEntry {
  timestamp: string;
  level: 'info' | 'action' | 'assert' | 'pass' | 'fail' | 'system';
  message: string;
  testId?: string;
}

export interface ProjectFile {
  path: string;
  name: string;
  language: 'swift' | 'markdown' | 'yaml' | 'json';
  content: string;
  description: string;
}

export interface UIElementInfo {
  identifier: string;
  type: string;
  label: string;
  value?: string;
  selector: string;
  rect: { x: number; y: number; width: number; height: number };
}
