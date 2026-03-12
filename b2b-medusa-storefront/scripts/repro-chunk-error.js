/**
 * Reproduce ChunkLoadError locally:
 * 1. Assumes you have already run "npm run build"
 * 2. Finds one page-*.js chunk under .next/static/chunks/app/
 * 3. Deletes it and logs the path
 * 4. Runs "npm start" so you can open /ae/account and trigger the error
 *
 * Usage: node scripts/repro-chunk-error.js
 * Or:    npm run repro-chunk-error
 */

const fs = require("fs")
const path = require("path")
const { spawn } = require("child_process")

const root = path.join(__dirname, "..")
const nextDir = path.join(root, ".next")

function findPageChunks(dir, files = []) {
  if (!fs.existsSync(dir)) return files
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const ent of entries) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      findPageChunks(full, files)
    } else if (ent.isFile() && /^page-[a-f0-9]+\.js$/.test(ent.name)) {
      files.push(full)
    }
  }
  return files
}

const appChunksDir = path.join(nextDir, "static", "chunks", "app")
if (!fs.existsSync(appChunksDir)) {
  console.error("No .next/static/chunks/app found. Run 'npm run build' first.")
  process.exit(1)
}

const pageChunks = findPageChunks(appChunksDir)
if (pageChunks.length === 0) {
  console.error("No page-*.js chunks found under .next/static/chunks/app. Run 'npm run build' first.")
  process.exit(1)
}

const toDelete = pageChunks[0]
const relativePath = path.relative(root, toDelete)
fs.unlinkSync(toDelete)
console.log("[repro-chunk-error] Deleted chunk:", relativePath)
console.log("[repro-chunk-error] Starting server. Open http://localhost:3000/ae/account (or :8000 if using -p 8000) to trigger ChunkLoadError.")
console.log("[repro-chunk-error] Check DevTools Console for [MainError] or [ChunkLoadErrorHandler] logs.")
const child = spawn("npm", ["start"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
})
child.on("exit", (code) => process.exit(code ?? 0))
