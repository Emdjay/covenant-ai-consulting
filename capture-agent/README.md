# Capture Agent

Lightweight Electron desktop app that employees install (with explicit consent)
to passively capture workflow data during the audit period.

## Stack

- Electron + Node.js
- Local SQLite for activity logs
- Encrypted upload to cloud storage

## Captures

- Screen recordings at low FPS (1-2 fps)
- Active window / app focus tracking
- Browser tab and URL activity
- Copy-paste event detection (signals manual data transfer)
- Idle / active state detection

## Privacy Controls

- Pause/resume button always visible
- Excludable apps (personal email, banking, etc.)
- Auto-redact password fields
- All data encrypted in transit and at rest
- Transparent data usage policy shown at install
