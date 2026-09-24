import { TestCase } from '../types';

export const CORE_TEST_CASES: TestCase[] = [
  {
    id: 'tc-001',
    number: 1,
    name: 'Valid Login',
    swiftFunctionName: 'testValidLogin()',
    description: 'Enters valid credentials (testuser / password123) via LoginPage, taps Sign In, and asserts Home dashboard loaded.',
    status: 'idle',
    category: 'core',
    codeSnippet: `func testValidLogin() throws {
    loginPage
        .typeUsername("testuser")
        .typePassword("password123")
        .tapSubmit()

    homePage.assertDashboardLoaded(for: "testuser")
}`,
    steps: [
      { id: 's1', description: 'Locate login_username_field', action: 'assert_exists', targetId: 'login_username_field', delayMs: 350 },
      { id: 's2', description: 'Tap login_username_field', action: 'tap', targetId: 'login_username_field', delayMs: 250 },
      { id: 's3', description: 'Type "testuser"', action: 'type', targetId: 'login_username_field', value: 'testuser', delayMs: 450 },
      { id: 's4', description: 'Tap login_password_field', action: 'tap', targetId: 'login_password_field', delayMs: 250 },
      { id: 's5', description: 'Type "password123"', action: 'type', targetId: 'login_password_field', value: 'password123', delayMs: 450 },
      { id: 's6', description: 'Tap login_submit_button', action: 'tap', targetId: 'login_submit_button', delayMs: 400 },
      { id: 's7', description: 'Wait for home_welcome_title', action: 'assert_exists', targetId: 'home_welcome_title', delayMs: 650 },
      { id: 's8', description: 'Assert label == "Welcome, testuser!"', action: 'assert_text', targetId: 'home_welcome_title', value: 'Welcome, testuser!', delayMs: 300 }
    ]
  },
  {
    id: 'tc-002',
    number: 2,
    name: 'Invalid Login Credentials',
    swiftFunctionName: 'testInvalidLogin()',
    description: 'Enters valid username but incorrect password, taps Sign In, and asserts error banner displays contextual error message.',
    status: 'idle',
    category: 'validation',
    codeSnippet: `func testInvalidLogin() throws {
    loginPage
        .typeUsername("testuser")
        .typePassword("wrongpass")
        .tapSubmit()
        .assertErrorMessage(contains: "Invalid credentials")
}`,
    steps: [
      { id: 's1', description: 'Tap login_username_field', action: 'tap', targetId: 'login_username_field', delayMs: 250 },
      { id: 's2', description: 'Type "testuser"', action: 'type', targetId: 'login_username_field', value: 'testuser', delayMs: 400 },
      { id: 's3', description: 'Tap login_password_field', action: 'tap', targetId: 'login_password_field', delayMs: 250 },
      { id: 's4', description: 'Type "wrongpass"', action: 'type', targetId: 'login_password_field', value: 'wrongpass', delayMs: 400 },
      { id: 's5', description: 'Tap login_submit_button', action: 'tap', targetId: 'login_submit_button', delayMs: 350 },
      { id: 's6', description: 'Assert login_error_message exists', action: 'assert_exists', targetId: 'login_error_message', delayMs: 500 },
      { id: 's7', description: 'Verify error text contains "Invalid credentials"', action: 'assert_text', targetId: 'login_error_message', value: 'Invalid credentials. Please check your credentials.', delayMs: 250 }
    ]
  },
  {
    id: 'tc-003',
    number: 3,
    name: 'Empty Credentials Validation',
    swiftFunctionName: 'testEmptyCredentials()',
    description: 'Leaves username and password blank, taps Sign In, and asserts client-side validation message without backend trip.',
    status: 'idle',
    category: 'validation',
    codeSnippet: `func testEmptyCredentials() throws {
    loginPage
        .tapSubmit()
        .assertErrorMessage(contains: "Please enter both username and password")
}`,
    steps: [
      { id: 's1', description: 'Clear login_username_field', action: 'clear', targetId: 'login_username_field', delayMs: 250 },
      { id: 's2', description: 'Clear login_password_field', action: 'clear', targetId: 'login_password_field', delayMs: 250 },
      { id: 's3', description: 'Tap login_submit_button directly', action: 'tap', targetId: 'login_submit_button', delayMs: 350 },
      { id: 's4', description: 'Assert login_error_message exists', action: 'assert_exists', targetId: 'login_error_message', delayMs: 400 },
      { id: 's5', description: 'Verify message text content', action: 'assert_text', targetId: 'login_error_message', value: 'Please enter both username and password', delayMs: 250 }
    ]
  },
  {
    id: 'tc-004',
    number: 4,
    name: 'Successful Navigation to Home',
    swiftFunctionName: 'testNavigationToHomeScreen()',
    description: 'Completes login and verifies that Dashboard navigation bar, user profile, session overview card, and controls render.',
    status: 'idle',
    category: 'navigation',
    codeSnippet: `func testNavigationToHomeScreen() throws {
    loginPage.login(username: "testuser", password: "password123")
    homePage.assertDashboardLoaded(for: "testuser")
    XCTAssertTrue(homePage.logoutButton.isHittable)
}`,
    steps: [
      { id: 's1', description: 'Type username "testuser"', action: 'type', targetId: 'login_username_field', value: 'testuser', delayMs: 300 },
      { id: 's2', description: 'Type password "password123"', action: 'type', targetId: 'login_password_field', value: 'password123', delayMs: 300 },
      { id: 's3', description: 'Tap login_submit_button', action: 'tap', targetId: 'login_submit_button', delayMs: 350 },
      { id: 's4', description: 'Wait for dashboard transition', action: 'wait', delayMs: 600 },
      { id: 's5', description: 'Assert home_nav_title exists', action: 'assert_exists', targetId: 'home_nav_title', delayMs: 250 },
      { id: 's6', description: 'Assert home_session_card exists', action: 'assert_exists', targetId: 'home_session_card', delayMs: 250 },
      { id: 's7', description: 'Assert home_logout_button is hittable', action: 'assert_exists', targetId: 'home_logout_button', delayMs: 250 }
    ]
  },
  {
    id: 'tc-005',
    number: 5,
    name: 'Logout Flow & Confirmation',
    swiftFunctionName: 'testLogoutReturnsToLogin()',
    description: 'Taps Sign Out from Home screen, confirms the native iOS action sheet dialog, and verifies clean return to Login.',
    status: 'idle',
    category: 'core',
    codeSnippet: `func testLogoutReturnsToLogin() throws {
    let home = loginPage.login(username: "testuser", password: "password123")
    let login = home.performLogout()
    login.assertIsPresented()
}`,
    steps: [
      { id: 's1', description: 'Type username "testuser"', action: 'type', targetId: 'login_username_field', value: 'testuser', delayMs: 250 },
      { id: 's2', description: 'Type password "password123"', action: 'type', targetId: 'login_password_field', value: 'password123', delayMs: 250 },
      { id: 's3', description: 'Tap login_submit_button', action: 'tap', targetId: 'login_submit_button', delayMs: 300 },
      { id: 's4', description: 'Wait for home screen transition', action: 'wait', delayMs: 500 },
      { id: 's5', description: 'Tap home_logout_button', action: 'tap', targetId: 'home_logout_button', delayMs: 350 },
      { id: 's6', description: 'Assert action sheet presented', action: 'assert_exists', targetId: 'logout_confirm_button', delayMs: 400 },
      { id: 's7', description: 'Tap logout_confirm_button', action: 'tap', targetId: 'logout_confirm_button', delayMs: 350 },
      { id: 's8', description: 'Assert login_username_field exists on return', action: 'assert_exists', targetId: 'login_username_field', delayMs: 400 }
    ]
  }
];

export const EXTRA_PRESET_TESTS: Omit<TestCase, 'id' | 'number'>[] = [
  {
    name: 'Remember Me Persistence Toggle',
    swiftFunctionName: 'testRememberMeToggle()',
    description: 'Toggles the Remember Me switch and validates state persistence in keychain.',
    status: 'idle',
    category: 'custom',
    codeSnippet: `func testRememberMeToggle() throws {
    let rememberSwitch = app.switches["login_remember_switch"]
    XCTAssertTrue(rememberSwitch.waitForExistence(timeout: 2.0))
    XCTAssertEqual(rememberSwitch.value as? String, "0")
    rememberSwitch.tap()
    XCTAssertEqual(rememberSwitch.value as? String, "1")
}`,
    steps: [
      { id: 's1', description: 'Locate login_remember_switch', action: 'assert_exists', targetId: 'login_remember_switch', delayMs: 300 },
      { id: 's2', description: 'Toggle login_remember_switch to ON', action: 'tap', targetId: 'login_remember_switch', delayMs: 400 }
    ]
  },
  {
    name: 'Password Masking Toggle',
    swiftFunctionName: 'testPasswordVisibilityToggle()',
    description: 'Taps the eye icon to toggle secure password field to clear text and back.',
    status: 'idle',
    category: 'custom',
    codeSnippet: `func testPasswordVisibilityToggle() throws {
    let toggleBtn = app.buttons["login_toggle_password"]
    loginPage.typePassword("secretPass")
    toggleBtn.tap()
    XCTAssertTrue(app.textFields["login_password_field"].exists)
    toggleBtn.tap()
    XCTAssertTrue(app.secureTextFields["login_password_field"].exists)
}`,
    steps: [
      { id: 's1', description: 'Tap password field', action: 'tap', targetId: 'login_password_field', delayMs: 250 },
      { id: 's2', description: 'Type "secretPass"', action: 'type', targetId: 'login_password_field', value: 'secretPass', delayMs: 400 },
      { id: 's3', description: 'Tap password reveal button', action: 'tap', targetId: 'login_toggle_password', delayMs: 350 },
      { id: 's4', description: 'Tap password reveal button again to mask', action: 'tap', targetId: 'login_toggle_password', delayMs: 350 }
    ]
  }
];
