const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('API', {
  sendNotification: (title, body) => ipcRenderer.send('show-notification', title, body),
  openDevTools: () => ipcRenderer.send('open-dev-tools'),
  on: (channel, func) => ipcRenderer.on(channel, func),
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  removeListener: (channel, func) => ipcRenderer.removeListener(channel, func)
});