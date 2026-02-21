const menuStatus = document.getElementById('menu-status');
const ipcResult = document.getElementById('ipc-result');

if (window.electronAPI) {
  // Main → Renderer: listen for menu actions
  window.electronAPI.onMenuAction((action) => {
    menuStatus.textContent = `Menu action: ${action}`;
  });

  // Renderer → Main: invoke handlers
  document.getElementById('btn-ping')?.addEventListener('click', async () => {
    try {
      const result = await window.electronAPI.invoke('ping');
      ipcResult.textContent = `Ping response: ${result}`;
    } catch (err) {
      ipcResult.textContent = `Error: ${err.message}`;
    }
  });

  document.getElementById('btn-app-info')?.addEventListener('click', async () => {
    try {
      const info = await window.electronAPI.invoke('get-app-info');
      ipcResult.textContent = JSON.stringify(info, null, 2);
    } catch (err) {
      ipcResult.textContent = `Error: ${err.message}`;
    }
  });

  document.getElementById('btn-show-dialog')?.addEventListener('click', async () => {
    try {
      const result = await window.electronAPI.invoke('show-message', {
        type: 'info',
        title: 'IPC Demo',
        message: 'This dialog was triggered from the renderer via IPC.',
      });
      ipcResult.textContent = `Dialog response: ${result.response}`;
    } catch (err) {
      ipcResult.textContent = `Error: ${err.message}`;
    }
  });
}
