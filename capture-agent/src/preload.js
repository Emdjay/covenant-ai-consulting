const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("captureAgent", {
  getStatus: () => ipcRenderer.invoke("get-status"),
  acceptConsent: () => ipcRenderer.invoke("accept-consent"),
  togglePause: () => ipcRenderer.invoke("toggle-pause"),
  setSessionId: (id) => ipcRenderer.invoke("set-session-id", id),
  setExcludedApps: (apps) => ipcRenderer.invoke("set-excluded-apps", apps),
  getStats: () => ipcRenderer.invoke("get-stats"),
  onStatusUpdate: (callback) => ipcRenderer.on("status-update", (_, data) => callback(data)),
});
