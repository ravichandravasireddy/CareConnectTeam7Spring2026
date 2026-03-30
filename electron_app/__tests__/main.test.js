/**
 * Unit tests for CareConnect Electron main process (index.js)
 * Uses mocked Electron APIs to test IPC handlers, menu, and lifecycle
 */

const mockMainWindow = {
  webContents: { send: jest.fn() },
  loadFile: jest.fn(),
  on: jest.fn(),
};

let capturedMenuTemplate;
let windowAllClosedHandler;
let activateHandler;

jest.mock('electron', () => ({
  app: {
    getName: jest.fn(() => 'CareConnect'),
    getVersion: jest.fn(() => '1.0.0'),
    quit: jest.fn(),
    isPackaged: false,
    whenReady: jest.fn().mockImplementation(() => Promise.resolve()),
    on: jest.fn((event, handler) => {
      if (event === 'window-all-closed') windowAllClosedHandler = handler;
      if (event === 'activate') activateHandler = handler;
    }),
  },
  BrowserWindow: Object.assign(jest.fn().mockImplementation(() => mockMainWindow), {
    getAllWindows: jest.fn().mockReturnValue([]),
  }),
  Menu: {
    buildFromTemplate: jest.fn().mockImplementation((template) => {
      capturedMenuTemplate = template;
      return {};
    }),
    setApplicationMenu: jest.fn(),
  },
  ipcMain: {
    handle: jest.fn(),
  },
  dialog: {
    showMessageBox: jest.fn().mockResolvedValue({ response: 0 }),
  },
}));

const electron = require('electron');
const { ipcMain, app, dialog, BrowserWindow, Menu } = electron;

describe('Main Process', () => {
  beforeAll(async () => {
    require('../index.js');
    await new Promise((r) => setImmediate(r));
  });
  describe('IPC Handlers', () => {
    it('registers get-app-info handler', () => {
      expect(ipcMain.handle).toHaveBeenCalledWith('get-app-info', expect.any(Function));
    });

    it('registers show-message handler', () => {
      expect(ipcMain.handle).toHaveBeenCalledWith('show-message', expect.any(Function));
    });

    it('registers ping handler', () => {
      expect(ipcMain.handle).toHaveBeenCalledWith('ping', expect.any(Function));
    });

    it('registers get-is-dev handler', () => {
      expect(ipcMain.handle).toHaveBeenCalledWith('get-is-dev', expect.any(Function));
    });
  });

  describe('get-app-info handler', () => {
    let getAppInfoHandler;

    beforeEach(() => {
      const call = ipcMain.handle.mock.calls.find((c) => c[0] === 'get-app-info');
      getAppInfoHandler = call ? call[1] : null;
    });

    it('returns app name, version, and platform', async () => {
      const result = await getAppInfoHandler();
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('platform');
      expect(result.name).toBe('CareConnect');
      expect(result.version).toBe('1.0.0');
    });
  });

  describe('ping handler', () => {
    let pingHandler;

    beforeEach(() => {
      const call = ipcMain.handle.mock.calls.find((c) => c[0] === 'ping');
      pingHandler = call ? call[1] : null;
    });

    it('returns pong', async () => {
      const result = await pingHandler();
      expect(result).toBe('pong');
    });
  });

  describe('show-message handler', () => {
    let showMessageHandler;

    beforeEach(() => {
      const call = ipcMain.handle.mock.calls.find((c) => c[0] === 'show-message');
      showMessageHandler = call ? call[1] : null;
    });

    it('calls dialog.showMessageBox with options', async () => {
      await showMessageHandler({}, { type: 'info', title: 'Test', message: 'Hello' });
      expect(dialog.showMessageBox).toHaveBeenCalledWith(
        mockMainWindow,
        expect.objectContaining({
          type: 'info',
          title: 'Test',
          message: 'Hello',
        })
      );
    });
  });

  describe('App lifecycle', () => {
    it('calls app.whenReady', () => {
      expect(app.whenReady).toHaveBeenCalled();
    });

    it('registers window-all-closed handler', () => {
      expect(app.on).toHaveBeenCalledWith('window-all-closed', expect.any(Function));
    });

    it('registers activate handler', () => {
      expect(app.on).toHaveBeenCalledWith('activate', expect.any(Function));
    });

    it('window-all-closed calls app.quit when not on darwin', () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'win32', configurable: true });
      windowAllClosedHandler();
      expect(app.quit).toHaveBeenCalled();
      Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true });
    });

    it('window-all-closed does not quit on darwin', () => {
      const originalPlatform = process.platform;
      app.quit.mockClear();
      Object.defineProperty(process, 'platform', { value: 'darwin', configurable: true });
      windowAllClosedHandler();
      expect(app.quit).not.toHaveBeenCalled();
      Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true });
    });

    it('activate creates window when none exist', () => {
      BrowserWindow.getAllWindows.mockReturnValue([]);
      const callCountBefore = BrowserWindow.mock.calls.length;
      activateHandler();
      expect(BrowserWindow.mock.calls.length).toBe(callCountBefore + 1);
    });

    it('activate does not create window when windows already exist', () => {
      BrowserWindow.getAllWindows.mockReturnValue([{}]);
      const callCountBefore = BrowserWindow.mock.calls.length;
      activateHandler();
      expect(BrowserWindow.mock.calls.length).toBe(callCountBefore);
    });
  });

  describe('createWindow', () => {
    it('creates BrowserWindow with correct options', () => {
      expect(BrowserWindow).toHaveBeenCalledWith(
        expect.objectContaining({
          width: 1200,
          height: 800,
          minWidth: 640,
          minHeight: 480,
          webPreferences: expect.objectContaining({
            contextIsolation: true,
            nodeIntegration: false,
          }),
        })
      );
    });

    it('calls loadFile with renderer index.html', () => {
      expect(mockMainWindow.loadFile).toHaveBeenCalled();
      const loadPath = mockMainWindow.loadFile.mock.calls[0][0];
      expect(loadPath).toContain('renderer');
      expect(loadPath).toContain('index.html');
    });

    it('registers closed handler to clear mainWindow', () => {
      expect(mockMainWindow.on).toHaveBeenCalledWith('closed', expect.any(Function));
      const closedHandler = mockMainWindow.on.mock.calls.find((c) => c[0] === 'closed')?.[1];
      expect(closedHandler).toBeDefined();
    });
  });

  describe('createMenu', () => {
    it('builds menu from template', () => {
      expect(capturedMenuTemplate).toBeDefined();
      expect(Array.isArray(capturedMenuTemplate)).toBe(true);
    });

    it('has File menu with New, Open, Exit', () => {
      const fileMenu = capturedMenuTemplate.find((m) => m.label === 'File');
      expect(fileMenu).toBeDefined();
      const labels = fileMenu.submenu.map((i) => i.label).filter(Boolean);
      expect(labels).toContain('New');
      expect(labels).toContain('Open');
      expect(labels).toContain('Exit');
    });

    it('File > Exit calls app.quit', () => {
      const fileMenu = capturedMenuTemplate.find((m) => m.label === 'File');
      const exitItem = fileMenu.submenu.find((i) => i.label === 'Exit');
      exitItem.click();
      expect(app.quit).toHaveBeenCalled();
    });

    it('File > New sends menu-action to renderer', () => {
      const fileMenu = capturedMenuTemplate.find((m) => m.label === 'File');
      const newItem = fileMenu.submenu.find((i) => i.label === 'New' && i.click);
      expect(newItem).toBeDefined();
      newItem.click();
      expect(mockMainWindow.webContents.send).toHaveBeenCalledWith('menu-action', 'new');
    });

    it('File > Open sends menu-action to renderer', () => {
      const fileMenu = capturedMenuTemplate.find((m) => m.label === 'File');
      const openItem = fileMenu.submenu.find((i) => i.label === 'Open' && i.click);
      expect(openItem).toBeDefined();
      openItem.click();
      expect(mockMainWindow.webContents.send).toHaveBeenCalledWith('menu-action', 'open');
    });

    it('Go > Dashboard sends menu-action', () => {
      const goMenu = capturedMenuTemplate.find((m) => m.label === 'Go');
      const dashboardItem = goMenu.submenu.find((i) => i.label === 'Dashboard' && i.click);
      expect(dashboardItem).toBeDefined();
      dashboardItem.click();
      expect(mockMainWindow.webContents.send).toHaveBeenCalledWith('menu-action', 'go-dashboard');
    });

    it('Go > Patients, Schedule, Reports, Messages send menu-action', () => {
      const goMenu = capturedMenuTemplate.find((m) => m.label === 'Go');
      const items = [
        { label: 'Patients', action: 'go-patients' },
        { label: 'Schedule', action: 'go-schedule' },
        { label: 'Reports', action: 'go-reports' },
        { label: 'Messages', action: 'go-messages' },
      ];
      items.forEach(({ label, action }) => {
        const item = goMenu.submenu.find((i) => i.label === label && i.click);
        expect(item).toBeDefined();
        mockMainWindow.webContents.send.mockClear();
        item.click();
        expect(mockMainWindow.webContents.send).toHaveBeenCalledWith('menu-action', action);
      });
    });

    it('Help > About sends menu-action', () => {
      const helpMenu = capturedMenuTemplate.find((m) => m.label === 'Help');
      const aboutItem = helpMenu.submenu.find((i) => i.label === 'About' && i.click);
      expect(aboutItem).toBeDefined();
      aboutItem.click();
      expect(mockMainWindow.webContents.send).toHaveBeenCalledWith('menu-action', 'about');
    });

    it('sets application menu', () => {
      expect(Menu.setApplicationMenu).toHaveBeenCalled();
    });
  });

  describe('show-message handler options', () => {
    let showMessageHandler;

    beforeEach(() => {
      const call = ipcMain.handle.mock.calls.find((c) => c[0] === 'show-message');
      showMessageHandler = call ? call[1] : null;
      dialog.showMessageBox.mockClear();
    });

    it('uses default type and title when not provided', async () => {
      await showMessageHandler({}, { message: 'Test only' });
      const lastCall = dialog.showMessageBox.mock.calls[dialog.showMessageBox.mock.calls.length - 1];
      expect(lastCall[1]).toMatchObject({
        type: 'info',
        title: 'Message',
        message: 'Test only',
      });
    });

    it('passes detail when provided', async () => {
      await showMessageHandler({}, {
        type: 'warning',
        title: 'T',
        message: 'M',
        detail: 'Extra detail line',
      });
      const last = dialog.showMessageBox.mock.calls[dialog.showMessageBox.mock.calls.length - 1];
      expect(last[1]).toMatchObject({ detail: 'Extra detail line' });
    });
  });

  describe('get-is-dev handler', () => {
    let getIsDevHandler;

    beforeEach(() => {
      const call = ipcMain.handle.mock.calls.find((c) => c[0] === 'get-is-dev');
      getIsDevHandler = call ? call[1] : null;
    });

    it('returns true when app is not packaged', async () => {
      app.isPackaged = false;
      expect(await getIsDevHandler()).toBe(true);
    });

    it('returns false when app is packaged', async () => {
      app.isPackaged = true;
      expect(await getIsDevHandler()).toBe(false);
      app.isPackaged = false;
    });
  });

  describe('window closed handler', () => {
    it('invokes closed callback without error', () => {
      const closedHandler = mockMainWindow.on.mock.calls.find((c) => c[0] === 'closed')?.[1];
      expect(closedHandler).toBeDefined();
      expect(() => closedHandler()).not.toThrow();
    });
  });
});
