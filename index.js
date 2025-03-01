const { app, Tray, BrowserWindow, Menu, ipcMain, Notification } = require('electron');
const path = require('path');

let mainWindow;
let tray = null;

if (require('electron-squirrel-startup')) app.quit();

app.on('ready', () => {
  mainWindow = new BrowserWindow({
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

  mainWindow.setTitleBarOverlay({
    color: 'rgba(0, 0, 0, 0)', // Transparent background
    symbolColor: 'rgba(205, 214, 244, 1)', // Symbol color
    height: 48
  });
  mainWindow.setMinimumSize(1000, 600);

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
        console.log("Check for Updates menu item clicked"); // Add this line
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

