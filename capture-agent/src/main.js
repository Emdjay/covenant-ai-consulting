const { app, BrowserWindow, Tray, Menu, ipcMain, powerMonitor, nativeImage } = require("electron");
const path = require("path");
const Store = require("electron-store").default;
const tracker = require("./tracker");
const { getStats } = require("./db");

const store = new Store({
  defaults: {
    excludedApps: [],
    screenshotIntervalMs: 30000,
    consentAccepted: false,
    sessionId: null,
  },
});

let mainWindow;
let tray;
let intervals = [];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 560,
    resizable: false,
    frame: false,
    transparent: false,
    alwaysOnTop: false,
    skipTaskbar: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, "..", "assets", "icon.png"),
  });

  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
  mainWindow.on("close", (e) => {
    e.preventDefault();
    mainWindow.hide();
  });
}

function createTray() {
  const icon = nativeImage.createFromDataURL(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAIJJREFUOI3tkrENgDAQA+8yASOwEGMwNYswGQuwEQulCF+aBIkCqWz5ZfmL/4F/kWpEd/cCzmKkVk7kfRJvE9MAoAckDdgCDcAn1g+TBlxJR+AGLKQNuJJqnwQcScfAF0bWB9Q2s8C7TNL6CbgBj5lxGiK9nxMDnT2ZJG0/XQb4ABaEMD7ybDAiAAAAAElFTkSuQmCC"
  );
  tray = new Tray(icon);

  const updateMenu = () => {
    const isPaused = tracker.isPaused();
    tray.setContextMenu(
      Menu.buildFromTemplate([
        { label: "Covenant AI Capture Agent", enabled: false },
        { type: "separator" },
        {
          label: isPaused ? "Resume Capture" : "Pause Capture",
          click: () => {
            tracker.setPaused(!isPaused);
            updateMenu();
            if (mainWindow) mainWindow.webContents.send("status-update", getStatus());
          },
        },
        {
          label: "Show Dashboard",
          click: () => {
            if (mainWindow) mainWindow.show();
          },
        },
        { type: "separator" },
        {
          label: "Quit",
          click: () => {
            mainWindow.destroy();
            app.quit();
          },
        },
      ]),
    );
    tray.setToolTip(isPaused ? "Capture Paused" : "Capturing Workflow...");
  };

  updateMenu();
}

function getStatus() {
  return {
    paused: tracker.isPaused(),
    stats: getStats(),
    sessionId: store.get("sessionId"),
    excludedApps: store.get("excludedApps"),
  };
}

function startCapture() {
  tracker.init({
    excludedApps: store.get("excludedApps"),
  });

  intervals.push(setInterval(() => tracker.trackActiveWindow(), 2000));
  intervals.push(setInterval(() => tracker.trackClipboard(), 3000));
  intervals.push(setInterval(() => tracker.trackIdle(powerMonitor), 10000));

  const ssInterval = store.get("screenshotIntervalMs") || 30000;
  intervals.push(setInterval(() => tracker.captureScreenshot(), ssInterval));

  console.log("Capture started — tracking window focus, clipboard, idle, screenshots");
}

function stopCapture() {
  intervals.forEach(clearInterval);
  intervals = [];
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  if (store.get("consentAccepted")) {
    startCapture();
  }

  ipcMain.handle("get-status", () => getStatus());

  ipcMain.handle("accept-consent", () => {
    store.set("consentAccepted", true);
    startCapture();
    return getStatus();
  });

  ipcMain.handle("toggle-pause", () => {
    tracker.setPaused(!tracker.isPaused());
    return getStatus();
  });

  ipcMain.handle("set-session-id", (_, id) => {
    store.set("sessionId", id);
    return getStatus();
  });

  ipcMain.handle("set-excluded-apps", (_, apps) => {
    store.set("excludedApps", apps);
    tracker.init({ excludedApps: apps });
    return getStatus();
  });

  ipcMain.handle("get-stats", () => getStats());
});

app.on("window-all-closed", () => {
  // keep running in tray
});

app.on("before-quit", () => {
  stopCapture();
});
