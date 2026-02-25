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

The application menu (File, Edit, Go, View, Window, Help) is **native OS UI**, not part of the web page. It is **not in the tab order** of the document.

| Platform | How to focus the menu |
|----------|------------------------|
| **Windows / Linux** | Press **Alt** once to focus the menu bar. Then use **Arrow keys** to move between menus, **Enter** or **↓** to open a menu, **Arrow keys** to move between items, **Enter** to choose. You can also press **Alt** plus the underlined letter (e.g. **Alt+F** for File, **Alt+G** for Go). |
| **macOS** | The menu bar is at the top of the screen. Click a menu name or use **Ctrl+F2** (or **Fn+Ctrl+F2**) to focus the menu bar, then arrow keys and Enter. |

### File

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+N | New |
| Ctrl/Cmd+O | Open |
| Alt+F4 | Exit (Windows/Linux) |

### Go (navigation — same as top nav bar)

| Menu item | Action |
|-----------|--------|
| Dashboard | Go to Dashboard |
| Patients | Go to All Patients |
| Schedule | Go to Schedule |
| Reports | Go to Reports |
| Messages | Go to Communication Center |

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
| **Alt** (Win/Linux) | Focus application menu (then use arrows / letter keys) |

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
