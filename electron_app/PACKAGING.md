# CareConnect Electron — Packaging Instructions for Windows

This guide explains how to package the CareConnect Electron desktop application for **Windows** as a distributable installer or portable executable.

---

## Prerequisites

- **Node.js** v18 or later
- **npm** (comes with Node.js)
- **Windows 10/11** (for building Windows packages)
- **Git** (optional, for version control)

---

## Step 1: Install electron-builder

From the `electron_app` directory:

```bash
cd electron_app
npm install --save-dev electron-builder
```

---

## Step 2: Add Build Configuration to package.json

Add the following `build` section to your `package.json`:

```json
{
  "name": "electron_app",
  "version": "1.0.0",
  "main": "index.js",
  "build": {
    "appId": "com.careconnect.team7",
    "productName": "CareConnect",
    "directories": {
      "output": "dist"
    },
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        }
      ],
      "icon": "build/icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "installerIcon": "build/icon.ico",
      "uninstallerIcon": "build/icon.ico",
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
```

**Note:** If you don't have an icon yet, remove the `"icon"` and `"installerIcon"` lines, or create a `build/` folder with a 256×256 `icon.ico` file.

---

## Step 3: Add Build Script

Add a `build` script to the `scripts` section of `package.json`:

```json
"scripts": {
  "start": "electron .",
  "test": "jest --coverage",
  "build": "electron-builder --win",
  "build:portable": "electron-builder --win portable"
}
```

---

## Step 4: Build the Application

### Option A: NSIS Installer (recommended for distribution)

Creates a `.exe` installer that users run to install the app:

```bash
npm run build
```

Output: `electron_app/dist/CareConnect Setup 1.0.0.exe`

### Option B: Portable Executable (no installation)

Creates a single `.exe` that runs without installing:

```bash
npm run build:portable
```

Output: `electron_app/dist/CareConnect 1.0.0.exe` (portable)

---

## Step 5: Locate the Built Files

After a successful build:

| Output Type | Location | Description |
|-------------|----------|-------------|
| **NSIS Installer** | `dist/CareConnect Setup 1.0.0.exe` | Standard Windows installer |
| **Portable** | `dist/CareConnect 1.0.0.exe` | Run without installing |
| **Unpacked** | `dist/win-unpacked/` | Raw app files (for debugging) |

---

## Optional: Simplified package.json (without icon)

If you skip the icon configuration, use this minimal `build` block:

```json
"build": {
  "appId": "com.careconnect.team7",
  "productName": "CareConnect",
  "directories": { "output": "dist" },
  "win": {
    "target": "nsis",
    "arch": ["x64"]
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true
  }
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `electron-builder` not found | Run `npm install --save-dev electron-builder` |
| Build fails with "Cannot find module" | Run `npm install` in `electron_app` |
| Antivirus flags the .exe | Common for unsigned apps; consider code signing for production |
| 32-bit build needed | Add `"ia32"` to `"arch": ["x64", "ia32"]` in `win` config |

---

## Code Signing (Production)

For production distribution, sign your Windows executable to avoid SmartScreen warnings:

1. Obtain a code signing certificate (e.g., from DigiCert, Sectigo).
2. Set environment variables:
   - `CSC_LINK` — path to your certificate
   - `CSC_KEY_PASSWORD` — certificate password
3. Add to `win` config: `"certificateFile": "path/to/cert.pfx"`

---

## Summary

```bash
cd electron_app
npm install
npm install --save-dev electron-builder
# Add build config to package.json (see Step 2)
npm run build
```

The installer will be in `electron_app/dist/`.
