const { app, BrowserWindow, Menu } = require('electron');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    menuBarVisible: false,
  });

  Menu.setApplicationMenu(null);

  mainWindow.loadFile('index.html');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});