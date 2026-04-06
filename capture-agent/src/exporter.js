const fs = require("fs");
const path = require("path");
const { app } = require("electron");
const { getUnexportedActivities, getUnexportedScreenshots, markExported } = require("./db");

async function exportBundle(sessionId) {
  const exportDir = path.join(app.getPath("userData"), "exports");
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const bundleName = `${sessionId || "unknown"}_${ts}`;
  const bundleDir = path.join(exportDir, bundleName);
  fs.mkdirSync(bundleDir, { recursive: true });
  fs.mkdirSync(path.join(bundleDir, "screenshots"), { recursive: true });

  const activities = getUnexportedActivities(5000);
  const screenshots = getUnexportedScreenshots(500);

  fs.writeFileSync(
    path.join(bundleDir, "activities.json"),
    JSON.stringify(activities, null, 2),
  );

  const screenshotManifest = [];
  for (const ss of screenshots) {
    if (fs.existsSync(ss.file_path)) {
      const dest = path.join(bundleDir, "screenshots", path.basename(ss.file_path));
      fs.copyFileSync(ss.file_path, dest);
      screenshotManifest.push({
        id: ss.id,
        ts: ss.ts,
        displayId: ss.display_id,
        file: path.basename(ss.file_path),
      });
    }
  }

  fs.writeFileSync(
    path.join(bundleDir, "screenshots.json"),
    JSON.stringify(screenshotManifest, null, 2),
  );

  const manifest = {
    sessionId,
    exportedAt: new Date().toISOString(),
    activityCount: activities.length,
    screenshotCount: screenshotManifest.length,
  };
  fs.writeFileSync(
    path.join(bundleDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );

  markExported("activity_log", activities.map((a) => a.id));
  markExported("screenshots", screenshots.map((s) => s.id));

  return { bundleDir, manifest };
}

module.exports = { exportBundle };
