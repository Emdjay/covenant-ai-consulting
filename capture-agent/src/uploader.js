const fs = require("fs");
const path = require("path");
const { app } = require("electron");
const { execSync } = require("child_process");

async function zipDirectory(sourceDir, outPath) {
  const archiver = require("archiver");
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outPath);
    const archive = archiver("zip", { zlib: { level: 6 } });
    output.on("close", () => resolve(outPath));
    archive.on("error", reject);
    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

async function uploadBundle(bundleDir, { portalUrl, apiKey, sessionId, auditId }) {
  const zipPath = bundleDir + ".zip";

  try {
    await zipDirectory(bundleDir, zipPath);
  } catch {
    const platform = process.platform;
    if (platform === "darwin" || platform === "linux") {
      execSync(`cd "${path.dirname(bundleDir)}" && zip -r "${zipPath}" "${path.basename(bundleDir)}"`);
    } else {
      throw new Error("Could not create zip archive");
    }
  }

  const formData = new FormData();
  const fileBuffer = fs.readFileSync(zipPath);
  const blob = new Blob([fileBuffer], { type: "application/zip" });
  formData.append("bundle", blob, path.basename(zipPath));
  formData.append("sessionId", sessionId || "unknown");
  if (auditId) formData.append("auditId", auditId);

  const response = await fetch(`${portalUrl}/api/upload`, {
    method: "POST",
    headers: { "x-api-key": apiKey },
    body: formData,
  });

  fs.unlinkSync(zipPath);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Upload failed (${response.status}): ${error}`);
  }

  return response.json();
}

module.exports = { uploadBundle };
