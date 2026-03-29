# 📦 Build Guide — Expense Tracker

This document contains all commands needed to build and deploy the Expense Tracker app as an Android APK.

---

## ✅ Prerequisites

Before running any build commands, ensure the following are installed on your machine:

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | >= 18.x | https://nodejs.org |
| npm | >= 9.x | Comes with Node.js |
| Java JDK | 17+ | Required by Gradle |
| Android Studio | Latest | Required for Android SDK |
| Android SDK | API 33+ | Install via Android Studio |

---

## 📁 Android SDK Configuration

After cloning/opening the project, make sure the file `android/local.properties` exists with your SDK path:

```properties
sdk.dir=C:\Users\tulip\AppData\Local\Android\Sdk
```

> ⚠️ Update the path above to match your machine's actual Android SDK location.
> You can find it in Android Studio → **Settings > SDK Manager**.

---

## 🔧 Step-by-Step Build Commands

### Step 1 — Install Dependencies
Run this once after cloning the project:
```bash
npm install
```

---

### Step 2 — Build the Web App (React/Vite)
Compiles the React source into the `dist/` folder:
```bash
npm run build
```

---

### Step 3 — Sync Web Assets to Android
Copies the compiled `dist/` into the Capacitor Android project:
```bash
npx cap sync android
```

---

### Step 4 — Build Debug APK (Windows)
Run the Gradle build inside the `android/` directory:

**PowerShell / CMD:**
```powershell
cd android
.\gradlew.bat assembleDebug
```

**Or as a one-liner from the project root:**
```powershell
cd android; .\gradlew.bat assembleDebug; cd ..
```

---

## 🚀 Full Build — All Steps in One Go

Copy and run these commands in sequence from the **project root**:

```powershell
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
cd ..
```

---

## 📂 APK Output Location

After a successful build, your APK will be at:

```
android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 📲 Install APK on Device

### Option A — USB (ADB)
Connect your Android device via USB with USB Debugging enabled:
```bash
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

### Option B — Manual Transfer
Copy `app-debug.apk` to your phone and open it.
Make sure **"Install from unknown sources"** is enabled on your device.

---

## 🔄 Rebuild After Code Changes

Whenever you make changes to the source code, run:

```powershell
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
cd ..
```

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| `SDK location not found` | Create `android/local.properties` with `sdk.dir=<your SDK path>` |
| `Could not find the capacitor config` | Create `capacitor.config.ts` in the project root |
| `Gradle build fails` | Run `.\gradlew.bat assembleDebug --stacktrace` for details |
| `npx cap sync` fails | Make sure `npm run build` ran successfully first |
| APK installs but crashes | Check Firebase config in `firebase-applet-config.json` |

---

## ⚙️ Capacitor Config Reference

The `capacitor.config.ts` file at the project root should look like:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.expensetracker.app',
  appName: 'Expense Tracker',
  webDir: 'dist',
  bundledWebRuntime: false
};

export default config;
```

---

*Last updated: March 2026*
