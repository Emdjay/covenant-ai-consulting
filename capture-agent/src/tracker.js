const { desktopCapturer, clipboard } = require("electron");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { app } = require("electron");
const { logActivity, logScreenshot } = require("./db");

let lastActiveWindow = "";
let lastClipboard = "";
let idleSeconds = 0;
let isIdle = false;
let paused = false;
let excludedApps = new Set();
let screenshotDir;

function init(config = {}) {
  excludedApps = new Set((config.excludedApps || []).map((a) => a.toLowerCase()));
  screenshotDir = path.join(app.getPath("userData"), "screenshots");
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
}

function setPaused(val) {
  paused = val;
  logActivity(val ? "capture_paused" : "capture_resumed");
}

function isPaused() {
  return paused;
}

function getActiveWindow() {
  return new Promise((resolve) => {
    if (process.platform === "darwin") {
      const script = `
        tell application "System Events"
          set frontApp to name of first application process whose frontmost is true
          set frontWindow to ""
          try
            set frontWindow to name of front window of first application process whose frontmost is true
          end try
          return frontApp & "||" & frontWindow
        end tell
      `;
      exec(`osascript -e '${script}'`, (err, stdout) => {
        if (err) return resolve(null);
        const [appName, windowTitle] = stdout.trim().split("||");
        resolve({ appName: appName || "", windowTitle: windowTitle || "" });
      });
    } else if (process.platform === "win32") {
      exec(
        'powershell -Command "Get-Process | Where-Object {$_.MainWindowHandle -ne 0} | Select-Object -First 1 ProcessName, MainWindowTitle | Format-Table -HideTableHeaders"',
        (err, stdout) => {
          if (err) return resolve(null);
          const parts = stdout.trim().split(/\s{2,}/);
          resolve({ appName: parts[0] || "", windowTitle: parts[1] || "" });
        },
      );
    } else {
      resolve(null);
    }
  });
}

async function trackActiveWindow() {
  if (paused) return;

  const win = await getActiveWindow();
  if (!win) return;

  if (excludedApps.has(win.appName.toLowerCase())) return;

  const windowKey = `${win.appName}::${win.windowTitle}`;
  if (windowKey !== lastActiveWindow) {
    lastActiveWindow = windowKey;
    logActivity("window_focus", {
      appName: win.appName,
      windowTitle: win.windowTitle,
    });
  }
}

function trackClipboard() {
  if (paused) return;

  try {
    const current = clipboard.readText();
    if (current && current !== lastClipboard && current.length < 5000) {
      lastClipboard = current;
      logActivity("clipboard_change", {
        meta: { length: current.length, preview: current.substring(0, 100) },
      });
    }
  } catch {
    // clipboard access can fail silently
  }
}

function trackIdle(powerMonitor) {
  if (paused) return;

  const currentIdle = powerMonitor.getSystemIdleTime();
  const wasIdle = isIdle;
  isIdle = currentIdle > 120; // 2 min threshold

  if (isIdle && !wasIdle) {
    logActivity("idle_start", { meta: { idleSeconds: currentIdle } });
  } else if (!isIdle && wasIdle) {
    logActivity("idle_end", { meta: { idleSeconds: idleSeconds } });
  }
  idleSeconds = currentIdle;
}

async function captureScreenshot() {
  if (paused) return;

  try {
    const sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: { width: 1280, height: 720 },
    });

    for (const source of sources) {
      const ts = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `screen_${source.display_id || "0"}_${ts}.jpg`;
      const filePath = path.join(screenshotDir, filename);

      const image = source.thumbnail;
      if (image && !image.isEmpty()) {
        fs.writeFileSync(filePath, image.toJPEG(60));
        logScreenshot(source.display_id || "primary", filePath);
      }
    }
  } catch (err) {
    console.error("Screenshot capture failed:", err.message);
  }
}

module.exports = {
  init,
  setPaused,
  isPaused,
  trackActiveWindow,
  trackClipboard,
  trackIdle,
  captureScreenshot,
};
