import { GoogleGenAI } from '@google/genai';
import { TestCase } from '../types';

export async function generateAITestCase(userPrompt: string): Promise<TestCase> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (window as any).__GEMINI_API_KEY__ || '';
  
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an expert iOS QA automation engineer writing Swift XCUITest test cases.
Generate a single new test case for an iOS Login/Home/Logout demo app based on this requirement:
"${userPrompt}"

Available Accessibility Identifiers on the app:
- login_username_field (TextField)
- login_password_field (SecureTextField)
- login_submit_button (Button)
- login_remember_switch (Switch)
- login_toggle_password (Button)
- login_error_message (StaticText)
- home_nav_title (StaticText)
- home_welcome_title (StaticText)
- home_logout_button (Button)
- logout_confirm_button (Button)

Respond ONLY with valid JSON in this exact structure without markdown code blocks:
{
  "name": "Test Name",
  "swiftFunctionName": "testSomething()",
  "description": "Short explanation",
  "codeSnippet": "Swift code snippet...",
  "steps": [
    { "id": "s1", "description": "Step 1", "action": "tap", "targetId": "login_username_field", "delayMs": 400 },
    { "id": "s2", "description": "Step 2", "action": "type", "targetId": "login_username_field", "value": "text", "delayMs": 400 }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        id: `tc-${Date.now()}`,
        number: 6,
        name: parsed.name || 'AI Generated Test',
        swiftFunctionName: parsed.swiftFunctionName || 'testAIGeneratedScenario()',
        description: parsed.description || userPrompt,
        status: 'idle',
        category: 'custom',
        codeSnippet: parsed.codeSnippet || '// Swift XCUITest code',
        steps: Array.isArray(parsed.steps) ? parsed.steps : [
          { id: 's1', description: 'Interact with username', action: 'tap', targetId: 'login_username_field', delayMs: 400 },
          { id: 's2', description: 'Submit form', action: 'tap', targetId: 'login_submit_button', delayMs: 400 }
        ]
      };
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart generation:', err);
    }
  }

  // Smart algorithmic generator based on prompt keywords:
  const lower = userPrompt.toLowerCase();
  if (lower.includes('lockout') || lower.includes('attempt') || lower.includes('rate limit')) {
    return {
      id: `tc-${Date.now()}`,
      number: 6,
      name: 'Account Lockout After Multiple Failures',
      swiftFunctionName: 'testAccountLockoutAfterFailures()',
      description: 'Verifies that multiple repeated invalid attempts trigger account security lock message.',
      status: 'idle',
      category: 'custom',
      codeSnippet: `func testAccountLockoutAfterFailures() throws {
    let usernameField = app.textFields["login_username_field"]
    let passwordField = app.secureTextFields["login_password_field"]
    let submitButton = app.buttons["login_submit_button"]

    for _ in 1...3 {
        usernameField.tap()
        usernameField.typeText("testuser")
        passwordField.tap()
        passwordField.typeText("badpass")
        submitButton.tap()
    }

    let lockoutMsg = app.staticTexts["login_error_message"]
    XCTAssertTrue(lockoutMsg.waitForExistence(timeout: 2.0))
}`,
      steps: [
        { id: 's1', description: 'Type username "testuser"', action: 'type', targetId: 'login_username_field', value: 'testuser', delayMs: 300 },
        { id: 's2', description: 'Type bad password', action: 'type', targetId: 'login_password_field', value: 'badpass', delayMs: 300 },
        { id: 's3', description: 'Attempt #1 submit', action: 'tap', targetId: 'login_submit_button', delayMs: 400 },
        { id: 's4', description: 'Attempt #2 submit', action: 'tap', targetId: 'login_submit_button', delayMs: 400 },
        { id: 's5', description: 'Attempt #3 submit', action: 'tap', targetId: 'login_submit_button', delayMs: 400 },
        { id: 's6', description: 'Assert security validation appears', action: 'assert_exists', targetId: 'login_error_message', delayMs: 400 }
      ]
    };
  }

  if (lower.includes('special') || lower.includes('injection') || lower.includes('unicode')) {
    return {
      id: `tc-${Date.now()}`,
      number: 6,
      name: 'Special Characters and Unicode Sanitization',
      swiftFunctionName: 'testSpecialCharactersValidation()',
      description: 'Tests input sanitization and error handling when credentials contain emojis or SQL syntax.',
      status: 'idle',
      category: 'custom',
      codeSnippet: `func testSpecialCharactersValidation() throws {
    let usernameField = app.textFields["login_username_field"]
    let passwordField = app.secureTextFields["login_password_field"]
    let submitButton = app.buttons["login_submit_button"]

    usernameField.tap()
    usernameField.typeText("admin' OR '1'='1 🚀")
    passwordField.tap()
    passwordField.typeText("p@$$w0rd!#%&")
    submitButton.tap()

    let errorBanner = app.staticTexts["login_error_message"]
    XCTAssertTrue(errorBanner.waitForExistence(timeout: 2.0))
}`,
      steps: [
        { id: 's1', description: 'Type SQL/Emoji test username', action: 'type', targetId: 'login_username_field', value: "admin' OR 🚀", delayMs: 400 },
        { id: 's2', description: 'Type complex special characters password', action: 'type', targetId: 'login_password_field', value: "p@$$#%&!", delayMs: 400 },
        { id: 's3', description: 'Tap Sign In button', action: 'tap', targetId: 'login_submit_button', delayMs: 400 },
        { id: 's4', description: 'Assert sanitized rejection banner', action: 'assert_exists', targetId: 'login_error_message', delayMs: 400 }
      ]
    };
  }

  // Default custom scenario
  return {
    id: `tc-${Date.now()}`,
    number: 6,
    name: userPrompt.length > 30 ? userPrompt.slice(0, 30) + '...' : userPrompt,
    swiftFunctionName: `test${userPrompt.replace(/[^a-zA-Z0-9]/g, '')}()`,
    description: `Generated automated XCUITest scenario for: ${userPrompt}`,
    status: 'idle',
    category: 'custom',
    codeSnippet: `func testCustomScenario() throws {
    // Custom test scenario generated for: ${userPrompt}
    let usernameField = app.textFields["login_username_field"]
    let passwordField = app.secureTextFields["login_password_field"]
    let submitButton = app.buttons["login_submit_button"]

    XCTAssertTrue(usernameField.exists)
    usernameField.tap()
    usernameField.typeText("testuser")

    passwordField.tap()
    passwordField.typeText("password123")
    submitButton.tap()

    let welcomeTitle = app.staticTexts["home_welcome_title"]
    XCTAssertTrue(welcomeTitle.waitForExistence(timeout: 4.0))
}`,
    steps: [
      { id: 's1', description: 'Tap username field', action: 'tap', targetId: 'login_username_field', delayMs: 300 },
      { id: 's2', description: 'Type "testuser"', action: 'type', targetId: 'login_username_field', value: 'testuser', delayMs: 400 },
      { id: 's3', description: 'Tap password field', action: 'tap', targetId: 'login_password_field', delayMs: 300 },
      { id: 's4', description: 'Type "password123"', action: 'type', targetId: 'login_password_field', value: 'password123', delayMs: 400 },
      { id: 's5', description: 'Submit authentication', action: 'tap', targetId: 'login_submit_button', delayMs: 400 },
      { id: 's6', description: 'Assert home screen loaded', action: 'assert_exists', targetId: 'home_welcome_title', delayMs: 600 }
    ]
  };
}
