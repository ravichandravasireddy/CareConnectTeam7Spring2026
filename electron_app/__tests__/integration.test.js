/**
 * Integration tests for CareConnect Electron app
 * Tests IPC communication between main and renderer, and window management.
 * These tests launch the real Electron app and verify end-to-end behavior.
 */

const path = require('path');

let electron;
let electronApp;

async function launchApp() {
  if (!electron) {
    const playwright = require('playwright');
    electron = playwright._electron;
  }
  const appPath = path.join(__dirname, '..');
  electronApp = await electron.launch({
    args: [path.join(appPath, 'index.js')],
    cwd: appPath,
    timeout: 15000,
  });
  return electronApp;
}

async function closeApp() {
  if (electronApp) {
    await electronApp.close();
    electronApp = null;
  }
}

describe('Integration Tests', () => {
  afterEach(async () => {
    await closeApp();
  });

  describe('IPC Communication (Main ↔ Renderer)', () => {
    it('renderer can invoke ping and receive pong from main', async () => {
      await launchApp();
      const window = await electronApp.firstWindow({ timeout: 10000 });

      const result = await window.evaluate(async () => {
        if (window.electronAPI?.invoke) {
          return await window.electronAPI.invoke('ping');
        }
        return null;
      });

      expect(result).toBe('pong');
    }, 15000);

    it('renderer can invoke get-app-info and receive app metadata from main', async () => {
      await launchApp();
      const window = await electronApp.firstWindow({ timeout: 10000 });

      const info = await window.evaluate(async () => {
        if (window.electronAPI?.invoke) {
          return await window.electronAPI.invoke('get-app-info');
        }
        return null;
      });

      expect(info).toBeDefined();
      expect(info).toHaveProperty('name');
      expect(info).toHaveProperty('version');
      expect(info).toHaveProperty('platform');
      expect(typeof info.name).toBe('string');
      expect(typeof info.version).toBe('string');
      expect(info.version.length).toBeGreaterThan(0);
    }, 15000);

    it('renderer receives menu-action events from main process', async () => {
      await launchApp();
      const window = await electronApp.firstWindow({ timeout: 10000 });

      await window.evaluate(() => {
        if (window.electronAPI?.onMenuAction) {
          window.electronAPI.onMenuAction((action) => {
            window.__lastMenuAction = action;
          });
        }
      });

      await electronApp.evaluate(async ({ BrowserWindow }) => {
        const win = BrowserWindow.getAllWindows()[0];
        if (win?.webContents) {
          win.webContents.send('menu-action', 'go-dashboard');
        }
      });

      await new Promise((r) => setTimeout(r, 150));

      const lastAction = await window.evaluate(() => window.__lastMenuAction);
      expect(lastAction).toBe('go-dashboard');
    }, 15000);

    it('invalid IPC channel is rejected by preload', async () => {
      await launchApp();
      const window = await electronApp.firstWindow({ timeout: 10000 });

      const error = await window.evaluate(async () => {
        try {
          await window.electronAPI.invoke('invalid-channel');
          return null;
        } catch (e) {
          return e.message;
        }
      });

      expect(error).toContain('Invalid IPC channel');
    }, 15000);
  });

  describe('Window Management', () => {
    it('main process creates a window with correct title', async () => {
      await launchApp();
      const window = await electronApp.firstWindow({ timeout: 10000 });

      const title = await window.title();
      expect(title).toBe('CareConnect');
    }, 15000);

    it('window has expected dimensions', async () => {
      await launchApp();
      const window = await electronApp.firstWindow({ timeout: 10000 });

      const bounds = await electronApp.evaluate(async ({ BrowserWindow }) => {
        const win = BrowserWindow.getAllWindows()[0];
        if (win) {
          const b = win.getBounds();
          return { width: b.width, height: b.height };
        }
        return null;
      });

      expect(bounds).toBeDefined();
      expect(bounds.width).toBe(1200);
      expect(bounds.height).toBe(800);
    }, 15000);

    it('window loads the renderer HTML', async () => {
      await launchApp();
      const window = await electronApp.firstWindow({ timeout: 10000 });

      const hasMainContent = await window.locator('#app').count() > 0;
      expect(hasMainContent).toBe(true);

      const hasWelcomeScreen = await window.locator('#screen-welcome').count() > 0;
      expect(hasWelcomeScreen).toBe(true);
    }, 15000);

    it('window is visible and not destroyed', async () => {
      await launchApp();
      const window = await electronApp.firstWindow({ timeout: 10000 });

      const state = await electronApp.evaluate(async ({ BrowserWindow }) => {
        const win = BrowserWindow.getAllWindows()[0];
        if (win) {
          return {
            isDestroyed: win.isDestroyed(),
            isVisible: win.isVisible(),
          };
        }
        return null;
      });

      expect(state).toBeDefined();
      expect(state.isDestroyed).toBe(false);
      expect(state.isVisible).toBe(true);
    }, 15000);

    it('window has minimum size constraints', async () => {
      await launchApp();
      await electronApp.firstWindow({ timeout: 10000 });

      const minSize = await electronApp.evaluate(async ({ BrowserWindow }) => {
        const win = BrowserWindow.getAllWindows()[0];
        if (win) {
          return win.getMinimumSize();
        }
        return null;
      });

      expect(minSize).toEqual([640, 480]);
    }, 15000);

    it('get-app-info returns platform from main process', async () => {
      await launchApp();
      const window = await electronApp.firstWindow({ timeout: 10000 });

      const info = await window.evaluate(async () => {
        if (window.electronAPI?.invoke) {
          return await window.electronAPI.invoke('get-app-info');
        }
        return null;
      });

      expect(['win32', 'darwin', 'linux']).toContain(info.platform);
    }, 15000);
  });
});
