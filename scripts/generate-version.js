// scripts/generate-version.js
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

// Workaround for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Create hash from timestamp
const timestamp = Date.now();
const hash = crypto
  .createHash("md5")
  .update(String(timestamp))
  .digest("hex")
  .substring(0, 8);

// 2. File content
const versionData = {
  version: hash,
  timestamp,
};

// 3. Write into public/version.json
const filePath = path.join(__dirname, "..", "public", "version.json");
fs.writeFileSync(filePath, JSON.stringify(versionData, null, 2));

console.log(`✅ version.json generated: ${JSON.stringify(versionData)}`);
