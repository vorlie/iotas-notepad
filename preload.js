const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('API', {
  sendNotification: (title, body) => ipcRenderer.send('show-notification', title, body),
  openDevTools: () => ipcRenderer.send('open-dev-tools'),
  on: (channel, func) => ipcRenderer.on(channel, func),
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  removeListener: (channel, func) => ipcRenderer.removeListener(channel, func),
  openThemeEditor: () => ipcRenderer.send('open-theme-editor'),
  versions: {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    iotanotepad: () => "1.2.0"
  },
});