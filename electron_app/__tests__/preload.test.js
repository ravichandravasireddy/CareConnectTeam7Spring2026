/**
 * Unit tests for CareConnect Electron preload script
 * Tests contextBridge API exposure and IPC channel validation
 */

let exposedAPI;
const mockIpcRenderer = {
  on: jest.fn((channel, handler) => {
    mockIpcRenderer._menuHandler = handler;
  }),
  invoke: jest.fn().mockResolvedValue('pong'),
};

jest.mock('electron', () => ({
  contextBridge: {
    exposeInMainWorld: jest.fn((name, api) => {
      exposedAPI = api;
    }),
  },
  ipcRenderer: mockIpcRenderer,
}));

describe('Preload (electronAPI)', () => {
  beforeAll(() => {
    jest.isolateModules(() => {
      require('../preload.js');
    });
  });

  beforeEach(() => {
    mockIpcRenderer.on.mockClear();
    mockIpcRenderer.invoke.mockClear();
  });

  describe('electronAPI contract', () => {
    it('exposes onMenuAction function', () => {
      expect(typeof exposedAPI.onMenuAction).toBe('function');
    });

    it('exposes invoke function', () => {
      expect(typeof exposedAPI.invoke).toBe('function');
    });

    it('exposes platform string', () => {
      expect(typeof exposedAPI.platform).toBe('string');
      expect(['win32', 'darwin', 'linux']).toContain(exposedAPI.platform);
    });
  });

  describe('onMenuAction', () => {
    it('registers ipcRenderer listener for menu-action', () => {
      const callback = jest.fn();
      exposedAPI.onMenuAction(callback);
      expect(mockIpcRenderer.on).toHaveBeenCalledWith('menu-action', expect.any(Function));
    });

    it('invokes callback when menu-action is received', () => {
      const callback = jest.fn();
      exposedAPI.onMenuAction(callback);
      mockIpcRenderer._menuHandler({}, 'go-dashboard');
      expect(callback).toHaveBeenCalledWith('go-dashboard');
    });
  });

  describe('invoke', () => {
    it('invokes ping channel successfully', async () => {
      mockIpcRenderer.invoke.mockResolvedValue('pong');
      const result = await exposedAPI.invoke('ping');
      expect(result).toBe('pong');
      expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('ping');
    });

    it('invokes get-app-info channel', async () => {
      mockIpcRenderer.invoke.mockResolvedValue({ name: 'CareConnect', version: '1.0.0' });
      const result = await exposedAPI.invoke('get-app-info');
      expect(result).toEqual({ name: 'CareConnect', version: '1.0.0' });
    });

    it('invokes show-message channel with args', async () => {
      mockIpcRenderer.invoke.mockResolvedValue({ response: 0 });
      await exposedAPI.invoke('show-message', { type: 'info', title: 'Test', message: 'Hello' });
      expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('show-message', {
        type: 'info',
        title: 'Test',
        message: 'Hello',
      });
    });

    it('rejects invalid channel', async () => {
      await expect(exposedAPI.invoke('invalid-channel')).rejects.toThrow('Invalid IPC channel');
      expect(mockIpcRenderer.invoke).not.toHaveBeenCalled();
    });

    it('rejects dangerous channels', async () => {
      await expect(exposedAPI.invoke('require')).rejects.toThrow('Invalid IPC channel');
      await expect(exposedAPI.invoke('child_process')).rejects.toThrow('Invalid IPC channel');
    });
  });
});
