const { app, BrowserWindow, Menu, ipcMain } = require('electron');

let mainWindow;
let devWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: __dirname + '/preload.js',
    },
    menuBarVisible: false,
    titleBarStyle: 'hidden',
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {})
  });

  mainWindow.setTitleBarOverlay({
    color: 'rgba(0, 0, 0, 0)', // Transparent background
    symbolColor: 'rgba(205, 214, 244, 1)', // Symbol color
    height: 48
  });
  mainWindow.setMinimumSize(950, 600);

  Menu.setApplicationMenu(null);

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    app.quit(); 
  });

  ipcMain.on('open-dev-window', () => {
    createDevWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit(); 
});

if (require('electron-squirrel-startup')) app.quit();

function createDevWindow() {
  if (devWindow) {
    devWindow.focus();
    return;
  }

  devWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    title: "Iota's Notepad - Developer Options"
  });

  devWindow.loadFile('developer-options.html');

  devWindow.on('closed', () => {
    devWindow = null;
  });
}
