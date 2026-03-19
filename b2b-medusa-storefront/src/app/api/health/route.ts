import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export const dynamic = "force-dynamic"

export async function GET() {
  let buildId = "unknown"
  try {
    const buildIdPath = path.join(process.cwd(), ".next", "BUILD_ID")
    if (fs.existsSync(buildIdPath)) {
      buildId = fs.readFileSync(buildIdPath, "utf-8").trim()
    }
  } catch {}

  const nextDir = path.join(process.cwd(), ".next")
  const hasNextDir = fs.existsSync(nextDir)

  let chunkCount = 0
  const appChunksDir = path.join(nextDir, "static", "chunks", "app")
  try {
    if (fs.existsSync(appChunksDir)) {
      chunkCount = countFiles(appChunksDir)
    }
  } catch {}

  const staticDir = path.join(nextDir, "static")
  let staticDirs: string[] = []
  try {
    if (fs.existsSync(staticDir)) {
      staticDirs = fs.readdirSync(staticDir)
    }
  } catch {}

  const envLocalExists = fs.existsSync(path.join(process.cwd(), ".env.local"))

  // List account/@dashboard chunks to verify the failing chunk exists
  let dashboardChunks: string[] = []
  try {
    const dashDir = path.join(appChunksDir, "[countryCode]", "(main)", "account", "@dashboard")
    if (fs.existsSync(dashDir)) {
      dashboardChunks = fs.readdirSync(dashDir)
    }
  } catch {}

  return NextResponse.json({
    status: "ok",
    buildId,
    hasNextDir,
    appChunkCount: chunkCount,
    staticDirContents: staticDirs,
    envLocalExists,
    dashboardChunks,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      MEDUSA_BACKEND_URL: process.env.MEDUSA_BACKEND_URL ? "set" : "not set",
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "not set",
      MEDUSA_STORE_PRODUCTS_CACHE:
        process.env.MEDUSA_STORE_PRODUCTS_CACHE || "revalidate (default)",
      MEDUSA_STORE_PRODUCTS_REVALIDATE_SECONDS:
        process.env.MEDUSA_STORE_PRODUCTS_REVALIDATE_SECONDS || "60 (default)",
      MARKETPLACE_DEBUG_SECRET: process.env.MARKETPLACE_DEBUG_SECRET
        ? "set"
        : "not set",
    },
    cwd: process.cwd(),
    timestamp: new Date().toISOString(),
  })
}

function countFiles(dir: string): number {
  let count = 0
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isFile()) count++
      else if (entry.isDirectory())
        count += countFiles(path.join(dir, entry.name))
    }
  } catch {}
  return count
}
