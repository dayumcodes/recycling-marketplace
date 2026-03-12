/**
 * Custom server for Azure App Service.
 *
 * Fixes a known Next.js 15 + Azure issue where chunk files under dynamic routes
 * (e.g. [countryCode]) and parallel routes (e.g. @dashboard) return 404.
 * Azure's Nginx partially decodes URL-encoded chars (%5B, %5D, %40) causing
 * a path mismatch in Next.js's static file handler.
 *
 * Solution: Use Next.js programmatic API and intercept /_next/static/ requests,
 * serving them directly from disk with proper URL decoding.
 *
 * Set Azure Startup Command to: node server.js
 */

const path = require("path")
const fs = require("fs")
const http = require("http")
const url = require("url")

const appDir = __dirname
const nextDir = path.join(appDir, ".next")
const staticDir = path.join(nextDir, "static")
const port = process.env.PORT || 3000

console.log("=== ScrapCircle Storefront Startup ===")
console.log("Time:", new Date().toISOString())
console.log("CWD:", process.cwd())
console.log("NODE_ENV:", process.env.NODE_ENV)
console.log("PORT:", port)

// Remove .env.local if present — must not override production config
const envLocalPath = path.join(appDir, ".env.local")
if (fs.existsSync(envLocalPath)) {
  console.warn("WARNING: .env.local found! Removing to prevent overriding production env vars.")
  try {
    fs.unlinkSync(envLocalPath)
    console.log(".env.local removed successfully.")
  } catch (err) {
    console.error("Could not remove .env.local:", err.message)
  }
}

// Read BUILD_ID
let buildId = null
try {
  const buildIdPath = path.join(nextDir, "BUILD_ID")
  if (fs.existsSync(buildIdPath)) {
    buildId = fs.readFileSync(buildIdPath, "utf-8").trim()
    console.log("BUILD_ID:", buildId)
  } else {
    console.warn("WARNING: .next/BUILD_ID not found!")
  }
} catch (err) {
  console.warn("WARNING: Could not read BUILD_ID:", err.message)
}


// Clean stale build-id directories from .next/static
if (fs.existsSync(staticDir) && buildId) {
  const contents = fs.readdirSync(staticDir)
  const knownDirs = ["chunks", "css", "media", "development", buildId]
  let cleaned = 0
  for (const entry of contents) {
    const fullPath = path.join(staticDir, entry)
    if (
      !knownDirs.includes(entry) &&
      fs.statSync(fullPath).isDirectory() &&
      /^[a-zA-Z0-9_-]{10,}$/.test(entry)
    ) {
      console.log(`Removing stale build dir: .next/static/${entry}`)
      try {
        fs.rmSync(fullPath, { recursive: true, force: true })
        cleaned++
      } catch (err) {
        console.warn(`Could not remove .next/static/${entry}:`, err.message)
      }
    }
  }
  if (cleaned > 0) console.log(`Cleaned ${cleaned} stale build dir(s).`)
  console.log(".next/static contents:", fs.readdirSync(staticDir))
}

// Log env vars
console.log("MEDUSA_BACKEND_URL:", process.env.MEDUSA_BACKEND_URL ? "set" : "NOT SET")
console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL || "NOT SET")

// MIME types for static file serving
const MIME_TYPES = {
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".txt": "text/plain",
}

/**
 * Try to serve a file from .next/static/ with proper URL decoding.
 * Returns true if the file was served, false otherwise.
 */
function tryServeStaticFile(pathname, res) {
  // Strip /_next/static/ prefix and decode the URL
  const relativePath = decodeURIComponent(pathname.replace("/_next/static/", ""))

  // Prevent directory traversal
  if (relativePath.includes("..")) return false

  const filePath = path.join(staticDir, relativePath)

  try {
    const stat = fs.statSync(filePath)
    if (stat.isFile()) {
      const ext = path.extname(filePath).toLowerCase()
      const contentType = MIME_TYPES[ext] || "application/octet-stream"

      res.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": stat.size,
        "Cache-Control": "public, max-age=31536000, immutable",
      })
      fs.createReadStream(filePath).pipe(res)
      return true
    }
  } catch {
    // File not found — fall through
  }
  return false
}

console.log("=== Initializing Next.js (programmatic API) on port", port, "===")

const next = require("next")
const app = next({ dev: false, dir: appDir })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true)
    const pathname = parsedUrl.pathname

    // Intercept /_next/static/ requests and serve directly from disk.
    // This fixes Azure's Nginx URL-decoding issue with brackets and @ in paths.
    if (pathname.startsWith("/_next/static/")) {
      if (tryServeStaticFile(pathname, res)) return
    }

    // Let Next.js handle everything else (pages, API routes, images, etc.)
    handle(req, res, parsedUrl)
  })

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })

  server.on("error", (err) => {
    console.error("Server error:", err)
    process.exit(1)
  })
}).catch((err) => {
  console.error("Failed to initialize Next.js:", err)
  process.exit(1)
})
