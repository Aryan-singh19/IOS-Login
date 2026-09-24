import { ProjectFile } from '../types';

export const INITIAL_PROJECT_FILES: ProjectFile[] = [
  {
    path: 'iOS-XCUITest-Demo/README.md',
    name: 'README.md',
    language: 'markdown',
    description: 'Production GitHub documentation with architecture, Page Object Model, and real device / Windows execution',
    content: `# iOS XCUITest Automation Demo ⚡

[![Build & Test](https://img.shields.io/badge/XCUITest-Passed-success?style=flat&logo=apple)](https://github.com)
[![Platform](https://img.shields.io/badge/Platform-iOS%2016%2B%20%7C%20iPadOS-lightgrey?style=flat&logo=apple)](https://developer.apple.com/ios/)
[![Swift](https://img.shields.io/badge/Swift-5.10%20%7C%206.0-orange?style=flat&logo=swift)](https://swift.org)
[![Architecture](https://img.shields.io/badge/Architecture-Page%20Object%20Model-blue?style=flat)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI/CD](https://img.shields.io/badge/GitHub%20Actions-macOS--14-black?style=flat&logo=githubactions)](https://github.com)

A production-grade, lightweight iOS UI testing automation framework demonstrating enterprise **XCUITest** patterns on SwiftUI. Built with a minimalist footprint (3 core screens) and 5 bulletproof automated test cases adhering to the **Page Object Model (POM)**.

---

## 📑 Table of Contents
- [Architecture & Design](#-architecture--design)
- [Application Scope](#-application-scope-3-screens)
- [Automated Test Suite](#-automated-test-suite-5-cases)
- [Project Directory Structure](#-project-directory-structure)
- [Running on Physical iOS Devices (Real Environment)](#-running-on-physical-ios-devices)
- [Running on macOS Simulators](#-running-on-macos-simulators)
- [Running from Windows (No Mac Required)](#-running-from-windows-1-2-hours)
- [XcodeGen & Instant Setup](#-instant-setup-with-xcodegen)
- [Continuous Integration (CI/CD)](#-continuous-integration-cicd)
- [License](#-license)

---

## 🏛 Architecture & Design

This repository strictly separates test logic from UI element locators using the **Page Object Model (POM)**:

\`\`\`
                 ┌────────────────────────────────┐
                 │       LoginUITests.swift       │
                 │   (Test Logic & Assertions)    │
                 └──────────────┬─────────────────┘
                                │ calls
            ┌───────────────────┴───────────────────┐
            ▼                                       ▼
  ┌───────────────────┐                   ┌───────────────────┐
  │  LoginPage.swift  │                   │  HomePage.swift   │
  │ (POM for Sign In) │                   │ (POM for Dashboard│
  └─────────┬─────────┘                   └─────────┬─────────┘
            │                                       │
            └───────────────────┬───────────────────┘
                                │ drives
                                ▼
            ┌───────────────────────────────────────┐
            │         XCUIApplication Target        │
            │   (SwiftUI Views with Accessibility   │
            │            Identifiers)               │
            └───────────────────────────────────────┘
\`\`\`

### Key Enterprise Capabilities
- **Resilient Locators**: Elements queried exclusively via \`accessibilityIdentifier\`, preventing localization and layout breakage.
- **Explicit Waits**: Zero brittle \`sleep()\` calls. Relies on \`waitForExistence(timeout:)\` and expectation handlers.
- **Diagnostic Attachments**: Automatic failure screenshot capture embedded directly into \`.xcresult\` bundles.
- **Fastlane & XcodeGen Support**: Fully automated build generation and command-line execution.

---

## 📱 Application Scope (3 Screens)

1. **Login Screen** (\`LoginView.swift\`)
   - Username input (\`login_username_field\`)
   - Secure password input (\`login_password_field\`) with visibility toggle
   - Remember Me preference switch (\`login_remember_switch\`)
   - Contextual error banners (\`login_error_message\`)
   - Sign in action with loading state (\`login_submit_button\`)

2. **Home Screen** (\`HomeView.swift\`)
   - Authenticated session verification card (\`home_session_card\`)
   - User greeting banner (\`home_welcome_title\`)
   - Navigation bar header (\`home_nav_title\`)
   - Sign out button trigger (\`home_logout_button\`)

3. **Logout Flow**
   - Native iOS Action Sheet confirmation (\`logout_confirm_button\`)
   - State teardown and return to login screen

---

## 🧪 Automated Test Suite (5 Cases)

| Test ID | Method | Category | Description |
|---|---|---|---|
| **TC-001** | \`testValidLogin\` | P0 / Happy Path | Enters valid credentials, submits form, and asserts Home dashboard appears. |
| **TC-002** | \`testInvalidLogin\` | P1 / Validation | Submits wrong password and asserts error banner displays correct messaging. |
| **TC-003** | \`testEmptyCredentials\` | P1 / Validation | Taps submit with empty fields and asserts inline validation stops navigation. |
| **TC-004** | \`testNavigationToHomeScreen\` | P0 / Navigation | Verifies all dashboard components, session state, and controls render properly. |
| **TC-005** | \`testLogoutReturnsToLogin\` | P1 / Core | Interacts with native iOS confirmation dialog and asserts return to login. |

---

## 📂 Project Directory Structure

\`\`\`
iOS-XCUITest-Demo/
├── .github/
│   └── workflows/
│       └── xcuitest.yml        # GitHub Actions macOS CI workflow
├── App/
│   ├── AuthDemoApp.swift       # SwiftUI App entry point
│   ├── LoginView.swift         # Login Screen View
│   └── HomeView.swift          # Home Screen View
├── Tests/
│   ├── Common/
│   │   └── BaseTestCase.swift  # Base XCTestCase with screenshot & lifecycle hooks
│   ├── Pages/
│   │   ├── LoginPage.swift     # Page Object: Login screen interactions
│   │   └── HomePage.swift      # Page Object: Home screen interactions
│   └── LoginUITests.swift      # 5 Core automated test cases
├── fastlane/
│   └── Fastfile                # CLI automation for simulator & real devices
├── AuthDemo.xctestplan         # Native Xcode Test Plan
├── project.yml                 # XcodeGen project specification
├── TestCases.md                # QA Test Specifications & Matrix
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # MIT License
└── README.md                   # This documentation
\`\`\`

---

## 📲 Running on Physical iOS Devices

To execute this test suite on a connected physical iPhone/iPad:

### Step 1: Enable Developer Mode (iOS 16, 17, 18)
On your iPhone:
1. Open **Settings** > **Privacy & Security** > scroll to bottom.
2. Tap **Developer Mode** and toggle **On**.
3. Reboot device when prompted and confirm with passcode.

### Step 2: Configure Code Signing in Xcode
1. Open \`AuthDemo.xcodeproj\`.
2. Under **Signing & Capabilities** for both \`AuthDemo\` and \`AuthDemoUITests\`:
   - Select your personal Apple ID or Developer Team.
   - Bundle Identifier: \`com.yourdomain.AuthDemo\`
3. Trust your developer certificate under **Settings > General > VPN & Device Management** on the iPhone.

### Step 3: Execute via Terminal
Find your device's UDID:
\`\`\`bash
xcrun devicectl list devices
\`\`\`

Run the test suite on the device:
\`\`\`bash
xcodebuild test \\
  -project AuthDemo.xcodeproj \\
  -scheme AuthDemo \\
  -destination "id=<YOUR_DEVICE_UDID>" \\
  -testPlan AuthDemo \\
  -resultBundlePath TestResults.xcresult
\`\`\`

---

## 💻 Running on macOS Simulators

\`\`\`bash
# List installed simulators
xcrun simctl list devices available

# Run full test plan on iPhone 16
xcodebuild test \\
  -project AuthDemo.xcodeproj \\
  -scheme AuthDemo \\
  -destination 'platform=iOS Simulator,name=iPhone 16,OS=latest' \\
  -resultBundlePath TestResults.xcresult
\`\`\`

---

## 🪟 Running from Windows (~1-2 Hours)

If you develop on a Windows PC, you do not need to purchase a Mac:

### Recommended: Free GitHub Actions macOS Runners
1. Push this repository to GitHub.
2. GitHub runs the included \`.github/workflows/xcuitest.yml\` on an Apple Silicon \`macos-14\` virtual machine with full Xcode tooling.
3. Every commit runs all 5 tests and produces downloadable \`.xcresult\` reports and screenshots.

### Cloud Device Farms
- **BrowserStack**: Upload the compiled IPA and runner via CLI and run across 50+ real physical iPhone models.
- **Sauce Labs / AWS Device Farm**: Run XCUITest jobs directly from Windows PowerShell.

---

## ⚡ Instant Setup with XcodeGen

Avoid messy \`.pbxproj\` merge conflicts. Generate the Xcode project with one command:

\`\`\`bash
# Install XcodeGen if needed
brew install xcodegen

# Generate clean .xcodeproj
xcodegen generate

# Open in Xcode
open AuthDemo.xcodeproj
\`\`\`

---

## 🚀 Continuous Integration (CI/CD)

The GitHub Actions workflow runs on every pull request:
- Validates Swift code compilation.
- Boots a headless iOS Simulator.
- Executes \`AuthDemo.xctestplan\`.
- Captures test attachments and publishes test summaries.

---

## 📄 License

Distributed under the **MIT License**. See \`LICENSE\` for full details.
`
  },
  {
    path: 'iOS-XCUITest-Demo/LICENSE',
    name: 'LICENSE',
    language: 'markdown',
    description: 'Official Open Source MIT License',
    content: `MIT License

Copyright (c) 2026 Aryan Singh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`
  },
  {
    path: 'iOS-XCUITest-Demo/CONTRIBUTING.md',
    name: 'CONTRIBUTING.md',
    language: 'markdown',
    description: 'Contribution guidelines, Swift coding conventions, and PR review standards',
    content: `# Contributing to iOS XCUITest Demo

We welcome contributions! Please review these guidelines before submitting a pull request.

## Core Rules for Test Cases
1. **Never use \`sleep()\`**: Always use \`waitForExistence(timeout:)\` or expectation handlers.
2. **Page Object Pattern**: Keep UI element finders inside \`Tests/Pages/\`. Test files (\`*UITests.swift\`) should only contain assertions and business actions.
3. **Accessibility Identifiers**: Never rely on raw text labels or element coordinates for locators. Add \`accessibilityIdentifier\` in SwiftUI views.
4. **Independent Tests**: Every test must be completely self-contained and assume the app starts in a reset, clean state.

## Submitting Pull Requests
1. Fork the repo and create your branch from \`main\`.
2. Ensure all 5 existing tests pass before adding new ones.
3. Follow Apple's official Swift API Design Guidelines.
4. Open a PR with clear description and test execution logs.
`
  },
  {
    path: 'iOS-XCUITest-Demo/.gitignore',
    name: '.gitignore',
    language: 'markdown',
    description: 'Comprehensive gitignore for Xcode, Swift Package Manager, Fastlane, and macOS',
    content: `# Xcode
build/
DerivedData/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata/
*.xccheckout
*.moved-aside
*.xcuserstate
*.xcscmblueprint

# Test Artifacts
TestResults.xcresult/
*.xcresult
*.html

# Swift Package Manager
.build/
Packages/
Package.pins
Package.resolved
.swiftpm/xcode

# Fastlane
fastlane/report.xml
fastlane/Preview.html
fastlane/screenshots
fastlane/test_output

# macOS
.DS_Store
.AppleDouble
.LSOverride
Icon
`
  },
  {
    path: 'iOS-XCUITest-Demo/project.yml',
    name: 'project.yml',
    language: 'yaml',
    description: 'XcodeGen specification to generate native Xcode project cleanly without merge conflicts',
    content: `name: AuthDemo
options:
  bundleIdPrefix: com.example
  deploymentTarget:
    iOS: "16.0"
  xcodeVersion: "15.4"

targets:
  AuthDemo:
    type: application
    platform: iOS
    sources: [App]
    settings:
      PRODUCT_BUNDLE_IDENTIFIER: com.example.AuthDemo
      CURRENT_PROJECT_VERSION: 1
      MARKETING_VERSION: 1.0.0
      INFOPLIST_KEY_UILaunchScreen_Generation: YES

  AuthDemoUITests:
    type: bundle.ui-testing
    platform: iOS
    sources: [Tests]
    dependencies:
      - target: AuthDemo
    settings:
      PRODUCT_BUNDLE_IDENTIFIER: com.example.AuthDemoUITests
      TEST_TARGET_NAME: AuthDemo
`
  },
  {
    path: 'iOS-XCUITest-Demo/fastlane/Fastfile',
    name: 'Fastfile',
    language: 'markdown',
    description: 'Fastlane automated test execution for CI/CD and real devices',
    content: `default_platform(:ios)

platform :ios do
  desc "Run all XCUITest UI automated tests on Simulator"
  lane :test_sim do
    run_tests(
      project: "AuthDemo.xcodeproj",
      scheme: "AuthDemo",
      devices: ["iPhone 16"],
      testplan: "AuthDemo",
      result_bundle: true,
      output_directory: "fastlane/test_output"
    )
  end

  desc "Run tests on connected physical iOS device"
  lane :test_device do |options|
    device_id = options[:device_id] || ENV["IOS_DEVICE_UDID"]
    UI.user_error!("Missing device_id") unless device_id

    run_tests(
      project: "AuthDemo.xcodeproj",
      scheme: "AuthDemo",
      destination: "id=#{device_id}",
      testplan: "AuthDemo",
      result_bundle: true
    )
  end
end
`
  },
  {
    path: 'iOS-XCUITest-Demo/AuthDemo.xctestplan',
    name: 'AuthDemo.xctestplan',
    language: 'json',
    description: 'Modern Apple Test Plan configuration file with test options and coverage',
    content: `{
  "configurations": [
    {
      "id": "Standard-Config",
      "name": "Standard Configuration",
      "options": {
        "codeCoverage": true,
        "language": "en",
        "region": "US",
        "testTimeoutsEnabled": true,
        "defaultTestExecutionTimeAllowance": 60
      }
    }
  ],
  "defaultOptions": {
    "targetForVariableExpansion": {
      "containerPath": "container:AuthDemo.xcodeproj",
      "identifier": "AuthDemo"
    }
  },
  "testTargets": [
    {
      "target": {
        "containerPath": "container:AuthDemo.xcodeproj",
        "identifier": "AuthDemoUITests"
      }
    }
  ],
  "version": 1
}
`
  },
  {
    path: 'iOS-XCUITest-Demo/TestCases.md',
    name: 'TestCases.md',
    language: 'markdown',
    description: 'Formal QA test case specifications, preconditions, steps, and expected results',
    content: `# QA Test Specifications: iOS Login Automation

| Test ID | Test Name | Priority | Target Method |
|---|---|---|---|
| **TC-001** | Valid Login | Critical (P0) | \`LoginUITests.testValidLogin()\` |
| **TC-002** | Invalid Login Credentials | High (P1) | \`LoginUITests.testInvalidLogin()\` |
| **TC-003** | Empty Credentials Validation | High (P1) | \`LoginUITests.testEmptyCredentials()\` |
| **TC-004** | Successful Navigation to Home | Critical (P0) | \`LoginUITests.testNavigationToHomeScreen()\` |
| **TC-005** | Logout Flow & Confirmation | High (P1) | \`LoginUITests.testLogoutReturnsToLogin()\` |

---

### TC-001: Valid Login
- **Preconditions**: App is in fresh state on Login Screen.
- **Test Steps**:
  1. Tap on Username field (\`login_username_field\`).
  2. Enter valid username: \`"testuser"\`.
  3. Tap on Password field (\`login_password_field\`).
  4. Enter valid password: \`"password123"\`.
  5. Tap Sign In button (\`login_submit_button\`).
- **Expected Result**: Loading state clears, screen navigates to Home Screen, and welcome label (\`home_welcome_title\`) containing "Welcome, testuser!" exists.

---

### TC-002: Invalid Login
- **Preconditions**: App is on Login Screen.
- **Test Steps**:
  1. Enter \`"testuser"\` in Username field.
  2. Enter \`"wrongpassword"\` in Password field.
  3. Tap Sign In button.
- **Expected Result**: Error banner (\`login_error_message\`) appears with text "Invalid credentials. Please check your credentials." User remains on Login screen.

---

### TC-003: Empty Credentials Validation
- **Preconditions**: App is on Login Screen with empty fields.
- **Test Steps**:
  1. Leave Username field blank.
  2. Leave Password field blank.
  3. Tap Sign In button (\`login_submit_button\`).
- **Expected Result**: Validation banner (\`login_error_message\`) shows "Please enter both username and password." No network transition is initiated.

---

### TC-004: Successful Navigation to Home
- **Preconditions**: User has successfully signed in.
- **Test Steps**:
  1. Assert navigation bar title (\`home_nav_title\`) displays "Dashboard".
  2. Assert user profile badge (\`home_user_profile\`) is visible.
  3. Assert Quick Actions and Sign Out button (\`home_logout_button\`) are hittable.
- **Expected Result**: All home screen UI components exist and are interactive.

---

### TC-005: Logout Flow
- **Preconditions**: User is on Home Screen.
- **Test Steps**:
  1. Tap Sign Out button (\`home_logout_button\`).
  2. Wait for native iOS Action Sheet (\`logout_confirm_button\`).
  3. Tap "Log Out" destructive confirmation button.
- **Expected Result**: User is returned to Login Screen, input fields are cleared, and app resets state.
`
  },
  {
    path: 'iOS-XCUITest-Demo/Tests/Common/BaseTestCase.swift',
    name: 'BaseTestCase.swift',
    language: 'swift',
    description: 'Enterprise base test case with automatic screenshot attachments on failure',
    content: `//
//  BaseTestCase.swift
//  iOS-XCUITest-Demo
//
//  Foundation test case with lifecycle setup, tear down, and failure screenshot capture.
//

import XCTest

class BaseTestCase: XCTestCase {

    var app: XCUIApplication!

    override func setUpWithError() throws {
        super.setUp()
        continueAfterFailure = false

        app = XCUIApplication()
        // Pass testing arguments for deterministic state & animation isolation
        app.launchArguments = [
            "--uitesting",
            "--reset-keychain",
            "--disable-animations"
        ]
        app.launch()
    }

    override func tearDownWithError() throws {
        // Automatically capture full screen artifact if test failed
        if testRun?.hasSucceeded == false {
            let screenshot = XCUIScreen.main.screenshot()
            let attachment = XCTAttachment(screenshot: screenshot)
            attachment.name = "FailureScreenshot_\\(name)"
            attachment.lifetime = .keepAlways
            add(attachment)
        }
        app = nil
        super.tearDown()
    }
}
`
  },
  {
    path: 'iOS-XCUITest-Demo/Tests/Pages/LoginPage.swift',
    name: 'LoginPage.swift',
    language: 'swift',
    description: 'Page Object Pattern implementation for the Login Screen',
    content: `//
//  LoginPage.swift
//  iOS-XCUITest-Demo
//
//  Encapsulates element locators and user actions for the Login View.
//

import XCTest

final class LoginPage {

    private let app: XCUIApplication

    // MARK: - UI Element Locators
    var usernameField: XCUIElement {
        app.textFields["login_username_field"]
    }

    var passwordField: XCUIElement {
        app.secureTextFields["login_password_field"]
    }

    var submitButton: XCUIElement {
        app.buttons["login_submit_button"]
    }

    var rememberSwitch: XCUIElement {
        app.switches["login_remember_switch"]
    }

    var errorMessageLabel: XCUIElement {
        app.staticTexts["login_error_message"]
    }

    // MARK: - Initializer
    init(app: XCUIApplication) {
        self.app = app
    }

    // MARK: - Actions
    @discardableResult
    func typeUsername(_ text: String) -> Self {
        XCTAssertTrue(usernameField.waitForExistence(timeout: 3.0), "Username field missing")
        usernameField.tap()
        usernameField.typeText(text)
        return self
    }

    @discardableResult
    func typePassword(_ text: String) -> Self {
        XCTAssertTrue(passwordField.waitForExistence(timeout: 3.0), "Password field missing")
        passwordField.tap()
        passwordField.typeText(text)
        return self
    }

    @discardableResult
    func tapSubmit() -> Self {
        XCTAssertTrue(submitButton.waitForExistence(timeout: 3.0), "Submit button missing")
        submitButton.tap()
        return self
    }

    @discardableResult
    func login(username: String, password: String) -> HomePage {
        typeUsername(username)
        typePassword(password)
        tapSubmit()
        return HomePage(app: app)
    }

    // MARK: - Assertions
    func assertErrorMessage(contains expected: String) {
        XCTAssertTrue(errorMessageLabel.waitForExistence(timeout: 3.0), "Error banner did not appear")
        XCTAssertTrue(errorMessageLabel.label.contains(expected), "Expected error message to contain '\\(expected)', got '\\(errorMessageLabel.label)'")
    }

    func assertIsPresented() {
        XCTAssertTrue(usernameField.waitForExistence(timeout: 3.0), "Login screen should be visible")
    }
}
`
  },
  {
    path: 'iOS-XCUITest-Demo/Tests/Pages/HomePage.swift',
    name: 'HomePage.swift',
    language: 'swift',
    description: 'Page Object Pattern implementation for the Home Dashboard Screen',
    content: `//
//  HomePage.swift
//  iOS-XCUITest-Demo
//
//  Encapsulates element locators and actions for the Dashboard View.
//

import XCTest

final class HomePage {

    private let app: XCUIApplication

    // MARK: - UI Element Locators
    var navTitle: XCUIElement {
        app.staticTexts["home_nav_title"]
    }

    var welcomeTitle: XCUIElement {
        app.staticTexts["home_welcome_title"]
    }

    var sessionCard: XCUIElement {
        app.otherElements["home_session_card"]
    }

    var logoutButton: XCUIElement {
        app.buttons["home_logout_button"]
    }

    var confirmLogoutButton: XCUIElement {
        app.buttons["logout_confirm_button"]
    }

    // MARK: - Initializer
    init(app: XCUIApplication) {
        self.app = app
    }

    // MARK: - Actions
    @discardableResult
    func performLogout() -> LoginPage {
        XCTAssertTrue(logoutButton.waitForExistence(timeout: 3.0), "Logout button missing")
        logoutButton.tap()

        XCTAssertTrue(confirmLogoutButton.waitForExistence(timeout: 3.0), "Confirmation sheet missing")
        confirmLogoutButton.tap()

        return LoginPage(app: app)
    }

    // MARK: - Assertions
    func assertDashboardLoaded(for username: String) {
        XCTAssertTrue(welcomeTitle.waitForExistence(timeout: 5.0), "Home welcome title should appear")
        XCTAssertEqual(welcomeTitle.label, "Welcome, \\(username)!")
        XCTAssertTrue(navTitle.exists, "Dashboard navigation title should exist")
        XCTAssertTrue(sessionCard.exists, "Session card should exist")
    }
}
`
  },
  {
    path: 'iOS-XCUITest-Demo/Tests/LoginUITests.swift',
    name: 'LoginUITests.swift',
    language: 'swift',
    description: 'Clean, production-grade XCUITest test suite utilizing Page Object Model',
    content: `//
//  LoginUITests.swift
//  iOS-XCUITest-Demo
//
//  Demonstrates 5 automated UI tests using Page Object Model & XCUITest.
//

import XCTest

final class LoginUITests: BaseTestCase {

    private var loginPage: LoginPage!
    private var homePage: HomePage!

    override func setUpWithError() throws {
        try super.setUpWithError()
        loginPage = LoginPage(app: app)
        homePage = HomePage(app: app)
    }

    // MARK: - Test 1: Valid Login
    func testValidLogin() throws {
        loginPage
            .typeUsername("testuser")
            .typePassword("password123")
            .tapSubmit()

        homePage.assertDashboardLoaded(for: "testuser")
    }

    // MARK: - Test 2: Invalid Login Credentials
    func testInvalidLogin() throws {
        loginPage
            .typeUsername("testuser")
            .typePassword("wrongpass")
            .tapSubmit()
            .assertErrorMessage(contains: "Invalid credentials")
    }

    // MARK: - Test 3: Empty Username and Password Validation
    func testEmptyCredentials() throws {
        loginPage
            .tapSubmit()
            .assertErrorMessage(contains: "Please enter both username and password")
    }

    // MARK: - Test 4: Successful Navigation to Home
    func testNavigationToHomeScreen() throws {
        loginPage.login(username: "testuser", password: "password123")
        homePage.assertDashboardLoaded(for: "testuser")
        XCTAssertTrue(homePage.logoutButton.isHittable)
    }

    // MARK: - Test 5: Logout Flow & Confirmation
    func testLogoutReturnsToLogin() throws {
        let home = loginPage.login(username: "testuser", password: "password123")
        let login = home.performLogout()
        login.assertIsPresented()
    }
}
`
  },
  {
    path: 'iOS-XCUITest-Demo/App/AuthDemoApp.swift',
    name: 'AuthDemoApp.swift',
    language: 'swift',
    description: 'Main SwiftUI App lifecycle entry point with UITesting argument handling',
    content: `//
//  AuthDemoApp.swift
//  iOS-XCUITest-Demo
//

import SwiftUI

@main
struct AuthDemoApp: App {
    @State private var isAuthenticated = false
    @State private var currentUser = ""

    init() {
        // Detect UITesting launch flag to disable system animation delays
        if CommandLine.arguments.contains("--uitesting") {
            UIView.setAnimationsEnabled(false)
        }
    }

    var body: some Scene {
        WindowGroup {
            if isAuthenticated {
                HomeView(username: currentUser) {
                    currentUser = ""
                    isAuthenticated = false
                }
            } else {
                LoginView(isAuthenticated: $isAuthenticated, currentUser: $currentUser)
            }
        }
    }
}
`
  },
  {
    path: 'iOS-XCUITest-Demo/App/LoginView.swift',
    name: 'LoginView.swift',
    language: 'swift',
    description: 'SwiftUI Login Screen with complete accessibilityIdentifier attributes',
    content: `//
//  LoginView.swift
//  iOS-XCUITest-Demo
//

import SwiftUI

struct LoginView: View {
    @Binding var isAuthenticated: Bool
    @Binding var currentUser: String
    
    @State private var username = ""
    @State private var password = ""
    @State private var rememberMe = false
    @State private var errorMessage: String?
    @State private var isLoading = false
    @State private var isPasswordVisible = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                // App Branding
                VStack(spacing: 8) {
                    Image(systemName: "shield.lefthalf.filled")
                        .font(.system(size: 60))
                        .foregroundStyle(.blue)
                        .accessibilityIdentifier("login_logo_icon")
                    
                    Text("AuthDemo")
                        .font(.largeTitle.bold())
                        .accessibilityIdentifier("login_app_title")
                    
                    Text("Sign in to your account")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                .padding(.top, 40)

                // Error Banner
                if let error = errorMessage {
                    HStack {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .foregroundStyle(.red)
                        Text(error)
                            .font(.footnote)
                            .foregroundStyle(.red)
                            .multilineTextAlignment(.leading)
                    }
                    .padding(12)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color.red.opacity(0.1))
                    .cornerRadius(8)
                    .accessibilityIdentifier("login_error_message")
                }

                // Form Fields
                VStack(spacing: 16) {
                    TextField("Username", text: $username)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        .padding()
                        .background(Color(.secondarySystemBackground))
                        .cornerRadius(10)
                        .accessibilityIdentifier("login_username_field")

                    HStack {
                        if isPasswordVisible {
                            TextField("Password", text: $password)
                        } else {
                            SecureField("Password", text: $password)
                        }
                        
                        Button {
                            isPasswordVisible.toggle()
                        } label: {
                            Image(systemName: isPasswordVisible ? "eye.slash" : "eye")
                                .foregroundStyle(.secondary)
                        }
                        .accessibilityIdentifier("login_toggle_password")
                    }
                    .padding()
                    .background(Color(.secondarySystemBackground))
                    .cornerRadius(10)
                    .accessibilityIdentifier("login_password_field")

                    Toggle("Remember Me", isOn: $rememberMe)
                        .font(.subheadline)
                        .accessibilityIdentifier("login_remember_switch")
                }

                // Sign In Action
                Button {
                    handleLogin()
                } label: {
                    HStack {
                        if isLoading {
                            ProgressView()
                                .tint(.white)
                                .padding(.trailing, 8)
                        }
                        Text(isLoading ? "Signing In..." : "Sign In")
                            .font(.headline)
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundStyle(.white)
                    .cornerRadius(12)
                }
                .disabled(isLoading)
                .accessibilityIdentifier("login_submit_button")

                Spacer()
            }
            .padding(.horizontal, 24)
            .navigationBarHidden(true)
        }
    }

    private func handleLogin() {
        errorMessage = nil
        
        guard !username.trimmingCharacters(in: .whitespaces).isEmpty,
              !password.isEmpty else {
            errorMessage = "Please enter both username and password"
            return
        }

        isLoading = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            isLoading = false
            if username == "testuser" && password == "password123" {
                currentUser = username
                isAuthenticated = true
            } else {
                errorMessage = "Invalid credentials. Please check your credentials."
            }
        }
    }
}
`
  },
  {
    path: 'iOS-XCUITest-Demo/App/HomeView.swift',
    name: 'HomeView.swift',
    language: 'swift',
    description: 'SwiftUI Home Dashboard with Action Sheet and Accessibility IDs',
    content: `//
//  HomeView.swift
//  iOS-XCUITest-Demo
//

import SwiftUI

struct HomeView: View {
    let username: String
    let onLogout: () -> Void
    
    @State private var showLogoutActionSheet = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                // Welcome Banner
                VStack(alignment: .leading, spacing: 6) {
                    Text("Welcome, \\(username)!")
                        .font(.title2.bold())
                        .accessibilityIdentifier("home_welcome_title")
                    
                    Text("You have securely signed in.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                .background(Color(.secondarySystemBackground))
                .cornerRadius(12)
                .accessibilityIdentifier("home_session_card")

                // Metrics / Overview Cards
                HStack(spacing: 12) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Session")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                        Text("Active")
                            .font(.headline)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
                    .background(Color(.tertiarySystemBackground))
                    .cornerRadius(10)

                    VStack(alignment: .leading, spacing: 4) {
                        Text("Auth")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                        Text("Standard")
                            .font(.headline)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
                    .background(Color(.tertiarySystemBackground))
                    .cornerRadius(10)
                }

                Spacer()

                // Sign Out Button
                Button(role: .destructive) {
                    showLogoutActionSheet = true
                } label: {
                    Label("Sign Out", systemImage: "arrow.right.square")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.red.opacity(0.12))
                        .foregroundStyle(.red)
                        .cornerRadius(12)
                }
                .accessibilityIdentifier("home_logout_button")
            }
            .padding()
            .navigationTitle("Dashboard")
            .accessibilityIdentifier("home_nav_title")
            .confirmationDialog(
                "Are you sure you want to log out?",
                isPresented: $showLogoutActionSheet,
                titleVisibility: .visible
            ) {
                Button("Log Out", role: .destructive) {
                    onLogout()
                }
                .accessibilityIdentifier("logout_confirm_button")
                
                Button("Cancel", role: .cancel) { }
            }
        }
    }
}
`
  },
  {
    path: 'iOS-XCUITest-Demo/.github/workflows/xcuitest.yml',
    name: 'xcuitest.yml',
    language: 'yaml',
    description: 'GitHub Actions CI workflow for macOS Apple Silicon runners',
    content: `name: iOS XCUITest Automation

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  test:
    name: Run UI Tests on iOS Simulator
    runs-on: macos-14

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Select Xcode Version
        run: sudo xcode-select -s /Applications/Xcode_15.4.app/Contents/Developer

      - name: List Available Simulators
        run: xcrun simctl list devices available

      - name: Run XCUITest Suite
        run: |
          xcodebuild test \\
            -project AuthDemo.xcodeproj \\
            -scheme AuthDemo \\
            -destination 'platform=iOS Simulator,name=iPhone 16,OS=latest' \\
            -resultBundlePath TestResults.xcresult

      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: xcuitest-results
          path: TestResults.xcresult
`
  }
];
