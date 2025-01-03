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
    titleBarStyle: 'hidden',
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {})
  });

  mainWindow.setTitleBarOverlay({
    color: 'rgba(49, 50, 68, 1)', // 49, 50, 68
    symbolColor: 'rgba(205, 214, 244, 1)', // 205, 214, 244
    height: 48
  });
  mainWindow.setMinimumSize(800, 600);

  Menu.setApplicationMenu(null);

  mainWindow.loadFile('index.html');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

if (require('electron-squirrel-startup')) app.quit();