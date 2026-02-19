const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Main → Renderer: listen for messages from main process
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-action', (event, action) => callback(action));
  },

  // Renderer → Main: invoke handlers (returns Promise)
  invoke: (channel, ...args) => {
    const validChannels = ['get-app-info', 'show-message', 'ping'];
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    }
    return Promise.reject(new Error(`Invalid IPC channel: ${channel}`));
  },

  platform: process.platform,
});
