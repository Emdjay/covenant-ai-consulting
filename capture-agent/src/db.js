const Database = require("better-sqlite3");
const path = require("path");
const { app } = require("electron");

let db;

function getDb() {
  if (db) return db;

  const dbPath = path.join(app.getPath("userData"), "capture-agent.db");
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      event_type TEXT NOT NULL,
      app_name TEXT,
      window_title TEXT,
      url TEXT,
      meta TEXT,
      exported INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS screenshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      display_id TEXT,
      file_path TEXT NOT NULL,
      exported INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_activity_ts ON activity_log(ts);
    CREATE INDEX IF NOT EXISTS idx_activity_exported ON activity_log(exported);
    CREATE INDEX IF NOT EXISTS idx_screenshots_exported ON screenshots(exported);
  `);

  return db;
}

function logActivity(eventType, data = {}) {
  const stmt = getDb().prepare(`
    INSERT INTO activity_log (event_type, app_name, window_title, url, meta)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(
    eventType,
    data.appName || null,
    data.windowTitle || null,
    data.url || null,
    data.meta ? JSON.stringify(data.meta) : null,
  );
}

function logScreenshot(displayId, filePath) {
  const stmt = getDb().prepare(`
    INSERT INTO screenshots (display_id, file_path) VALUES (?, ?)
  `);
  stmt.run(displayId, filePath);
}

function getUnexportedActivities(limit = 500) {
  return getDb()
    .prepare("SELECT * FROM activity_log WHERE exported = 0 ORDER BY ts LIMIT ?")
    .all(limit);
}

function getUnexportedScreenshots(limit = 100) {
  return getDb()
    .prepare("SELECT * FROM screenshots WHERE exported = 0 ORDER BY ts LIMIT ?")
    .all(limit);
}

function markExported(table, ids) {
  if (!ids.length) return;
  const placeholders = ids.map(() => "?").join(",");
  getDb()
    .prepare(`UPDATE ${table} SET exported = 1 WHERE id IN (${placeholders})`)
    .run(...ids);
}

function getStats() {
  const d = getDb();
  return {
    totalActivities: d.prepare("SELECT COUNT(*) as c FROM activity_log").get().c,
    totalScreenshots: d.prepare("SELECT COUNT(*) as c FROM screenshots").get().c,
    unexportedActivities: d.prepare("SELECT COUNT(*) as c FROM activity_log WHERE exported = 0").get().c,
    unexportedScreenshots: d.prepare("SELECT COUNT(*) as c FROM screenshots WHERE exported = 0").get().c,
  };
}

module.exports = {
  getDb,
  logActivity,
  logScreenshot,
  getUnexportedActivities,
  getUnexportedScreenshots,
  markExported,
  getStats,
};
