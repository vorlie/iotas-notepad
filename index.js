const { app, Tray, Menu, BrowserWindow, ipcMain, Notification } = require('electron');
const { PARAMS, VALUE, MicaBrowserWindow, IS_WINDOWS_11, WIN10 } = require('mica-electron');
const path = require('path');

let mainWindow;
let themeEditorWindow = null;
let tray = null;


app.on('ready', () => {
  mainWindow = new MicaBrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: __dirname + '/preload.js',
    },
    menuBarVisible: false,
    frame: false,
    show: false,
    titleBarStyle: 'hidden',
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {})
  });

  if (require('electron-squirrel-startup')) app.quit();

  mainWindow.setRoundedCorner();
  mainWindow.setMicaAcrylicEffect();

  mainWindow.setTitleBarOverlay({
    color: 'rgba(0, 0, 0, 0)', // Transparent background
    symbolColor: 'rgba(255, 255, 255, 1)', // Symbol color
    height: 48
  });

  mainWindow.setMinimumSize(1200, 700);

  //Menu.setApplicationMenu(null);

  mainWindow.loadFile('index.html');

  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.show(); // Show the window only when DOM is ready
  });

  mainWindow.on('closed', () => {
    app.quit();
  });

  ipcMain.on('show-notification', (event, title, body) => {
    showNotification(title, body);
  });

  ipcMain.on('open-dev-tools', () => {
    if (mainWindow) {
      mainWindow.webContents.openDevTools();
    }
  });

  tray = new Tray(path.join(__dirname, 'assets/icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Check for Updates', click: () => {
        console.log("Check for Updates menu item clicked");
        if (mainWindow) {
          mainWindow.webContents.send('check-for-updates'); // Send to renderer
        }
      }
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('Iota\'s Notepad');
  tray.setContextMenu(contextMenu);
});

function createThemeEditorWindow() {
  if (themeEditorWindow) {
    themeEditorWindow.focus();
    return;
  }

  themeEditorWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: "Theme Editor",
    autoHideMenuBar: true,
  });

  themeEditorWindow.maximize();

  themeEditorWindow.loadURL('https://vorlie.pages.dev/theme-editor');

  themeEditorWindow.on('closed', () => {
    themeEditorWindow = null;
  });
}

// IPC listener to open the theme editor
ipcMain.on('open-theme-editor', () => {
  createThemeEditorWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function showNotification(title, body) {
  if (Notification.isSupported()) {
    let iconPath;
    iconPath = path.join(__dirname, 'assets', 'icon.png');

    const notification = new Notification({
      title: title,
      body: body,
      icon: iconPath,
    });

    notification.on('click', () => {
      console.log('Notification clicked');
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
    });

    notification.show();
  } else {
    console.log('Notifications are not supported on this system.');
  }
}