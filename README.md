# Sharemates ✅

A mobile-first expense splitting app built with Expo and React Native for tracking shared expenses, groups, and settlements.

---

## Table of Contents

-   [About](#about)
-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Local Development](#local-development)
    -   [Building for Android / iOS](#building-for-android--ios)
-   [Project Structure](#project-structure)
-   [Environment & Firebase](#environment--firebase)
-   [Useful Scripts](#useful-scripts)
-   [Troubleshooting](#troubleshooting)
-   [Contributing](#contributing)
-   [License](#license)

---

## About

Sharemates is a social expense management app that lets groups track shared expenses, scan receipts, settle balances, and get notifications. The app uses Expo with native modules for push notifications, Firebase for backend services, and includes an Android native project for building/running on real devices.

## Features

-   Create groups and add friends
-   Scan receipts (OCR via tesseract.js integration)
-   Track expenses and settlements
-   Push notifications and in-app alerts
-   Offline-friendly, secure storage via Expo Secure Store

## Tech Stack

-   Expo (Router) + React Native
-   TypeScript
-   Firebase (Auth, Cloud Messaging)
-   Expo modules: Notifications, Image Picker, Secure Store, Splash Screen
-   Tesseract.js for OCR

## Getting Started

### Prerequisites

-   Node.js (LTS)
-   Yarn or npm
-   Expo CLI (optional, but recommended): `npm install -g expo-cli`
-   Android Studio (for Android builds/emulator) or Xcode (for iOS builds)

### Installation

1. Clone the repo
    ```bash
    git clone <repo-url>
    cd sharemates
    ```
2. Install dependencies
    ```bash
    yarn install
    # or
    npm install
    ```

### Local Development

-   Run the Expo dev server

    ```bash
    yarn dev
    # or
    npm run dev
    ```

-   Run on Android device/emulator

    ```bash
    yarn android
    # or
    npm run android
    ```

-   Run on iOS (macOS only)
    ```bash
    yarn ios
    # or
    npm run ios
    ```

> Tip: To clear Metro cache: `expo start -c` or `yarn dev -- --clear`.

### Building for Android / iOS

This project includes `eas.json` and supports EAS builds; use EAS for production builds:

```bash
eas build -p android
eas build -p ios
```

If you prefer local native builds, follow Expo docs for `expo run:android` / `expo run:ios` (native dependencies must be configured).

## Project Structure

A high-level overview of the main folders:

-   `app/` — Expo Router pages and screens
-   `components/` — Reusable UI components
-   `services/` — API clients, services (auth, users, groups, expenses)
-   `context/` — React contexts for auth, alerts, theme, etc.
-   `assets/` — Images and static assets
-   `android/` — Native Android project (Gradle, Google services files)

## Environment & Firebase

-   This project uses Firebase for auth/messaging and includes sample Firebase config files in the repo for reference.
-   **Important:** Do **not** commit private credentials or service account keys to public repos.

Recommended steps:

1. Create a Firebase project and enable Auth and Messaging.
2. Add `google-services.json` to `android/app/` for Android builds.
3. For server-side operations (if needed), use a Firebase service account JSON and keep it out of the repo (see `.gitignore`).
4. For iOS, configure the appropriate GoogleService-Info.plist in Xcode when building for iOS.

> Note: There is a `sharemates-*.json` admin key in this repo—ensure you understand the security implications and do not publish sensitive keys.

## Useful Scripts

-   `yarn dev` — Start Expo dev server
-   `yarn android` — Build & run on Android emulator/device (uses `expo run:android`)
-   `yarn ios` — Build & run on iOS simulator (macOS only)
-   `yarn build:web` — Export web build
-   `yarn lint` — Lint the codebase

(Replace `yarn` above with `npm run ...` if you use npm.)

## Troubleshooting

-   Rebuild native modules after installing new native deps:
    ```bash
    npx expo prebuild
    ```
-   If Android build fails, check `android/` Gradle settings and `google-services.json` placement.
-   If push notifications are not received, verify Firebase Cloud Messaging setup and device tokens.

## Contributing

Contributions are welcome. Open issues and PRs with a clear description, reproduction steps, and tests when possible.

## License

This repository does not include a license file. Add a `LICENSE` to make the licensing explicit.

---

If you'd like, I can also:

-   Add a `.env.example` with recommended environment variables
-   Add a CONTRIBUTING.md template or PR checklist
-   Add badges and CI instructions

If you want any of those, tell me which and I'll add them. ✨
