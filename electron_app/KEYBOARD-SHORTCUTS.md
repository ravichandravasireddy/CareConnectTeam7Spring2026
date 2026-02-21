# CareConnect — Keyboard Shortcuts Reference

**Last updated:** February 2026  
**Platforms:** Windows, macOS, Linux (Electron desktop app)

---

## Platform Conventions

| Platform | Modifier Key | Example |
|----------|--------------|---------|
| **Windows / Linux** | `Ctrl` | Ctrl+S, Ctrl+N |
| **macOS** | `⌘` (Command) | ⌘S, ⌘N |

Throughout this document, **Ctrl/Cmd** means:
- **Windows/Linux:** Use `Ctrl`
- **macOS:** Use `⌘` (Command)

---

## 1. Navigation Shortcuts

These shortcuts work across all CareConnect screens for keyboard and screen reader users.

| Shortcut | Action |
|----------|--------|
| **Tab** | Move focus forward through interactive elements (buttons, links, form fields) |
| **Shift+Tab** | Move focus backward through interactive elements |
| **Enter** | Activate buttons and submit forms |
| **Space** | Activate buttons and toggle switches |
| **Arrow keys** | Navigate within lists, radio groups, and dropdown menus |
| **Esc** | Close modals, dialogs, and dropdowns |
| **Home** | Jump to first item in a list |
| **End** | Jump to last item in a list |

### Skip Link

- **Tab** (from top of page) → Focus "Skip to main content" link first to bypass navigation and jump to main content.

---

## 2. Application Menu Shortcuts (Electron Desktop)

### File

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+N | New |
| Ctrl/Cmd+O | Open |
| Alt+F4 | Exit (Windows/Linux) |

### Edit

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+Z | Undo |
| Shift+Ctrl/Cmd+Z | Redo |
| Ctrl/Cmd+X | Cut |
| Ctrl/Cmd+C | Copy |
| Ctrl/Cmd+V | Paste |
| Ctrl/Cmd+A | Select All |

### View

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+R | Reload |
| Ctrl/Cmd+Shift+R | Force Reload |
| F12 | Toggle Developer Tools |
| F11 | Toggle Full Screen |

### Window

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+M | Minimize window |
| Ctrl/Cmd+W | Close window |

---

## 3. OS Shortcut Conflicts

The following shortcuts are **reserved by the OS** or common applications. CareConnect does not override them:

| Shortcut | Typical OS/App Use |
|----------|--------------------|
| Ctrl/Cmd+Q | Quit application (macOS) |
| Alt+F4 | Close window (Windows) |
| Ctrl/Cmd+Tab | Switch tabs (browsers) |
| Ctrl/Cmd+Shift+Esc | Task Manager (Windows) |

### Known Conflict: Ctrl/Cmd+M

- **Electron desktop:** Ctrl/Cmd+M = **Minimize window** (standard OS convention)
- **Other CareConnect apps (Flutter/React Native):** Cmd/Ctrl+M was proposed for "Messages" in accessibility guidelines.
- **Resolution:** On the desktop app, use the navigation bar or menu to open Messages. The Minimize shortcut takes precedence for consistency with OS behavior.

---

## 4. Printable Reference Card

Use the section below as a quick reference. Print or save as PDF.

---

### CareConnect Keyboard Shortcuts — Quick Reference

**Navigation**

| Key | Action |
|-----|--------|
| Tab | Next element |
| Shift+Tab | Previous element |
| Enter / Space | Activate |
| Esc | Close dialog |
| Arrows | Lists / menus |

**File & Edit**

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+N | New |
| Ctrl/Cmd+O | Open |
| Ctrl/Cmd+Z | Undo |
| Shift+Ctrl/Cmd+Z | Redo |
| Ctrl/Cmd+X | Cut |
| Ctrl/Cmd+C | Copy |
| Ctrl/Cmd+V | Paste |
| Ctrl/Cmd+A | Select All |

**View & Window**

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+R | Reload |
| Ctrl/Cmd+Shift+R | Force Reload |
| F11 | Full Screen |
| F12 | Dev Tools |
| Ctrl/Cmd+M | Minimize |
| Ctrl/Cmd+W | Close |
| Alt+F4 | Exit (Win/Linux) |

**Platform:** Windows/Linux = Ctrl | macOS = ⌘

---

*CareConnect — Care coordination for patients and caregivers*
