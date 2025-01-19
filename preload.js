const { contextBridge, ipcRenderer } = require('electron');

// Expose only specific APIs to the renderer
contextBridge.exposeInMainWorld('electron', {
  openDevWindow: () => ipcRenderer.send('open-dev-window'),
});

