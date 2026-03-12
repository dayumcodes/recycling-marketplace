import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import crypto from "crypto"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files.length) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      )
    }

    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    const urls: string[] = []

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File type "${file.type}" is not allowed. Use JPEG, PNG, WebP, GIF, or SVG.` },
          { status: 400 }
        )
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the 5 MB limit.` },
          { status: 400 }
        )
      }

      const ext = path.extname(file.name) || ".jpg"
      const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`
      const filePath = path.join(UPLOAD_DIR, uniqueName)

      const arrayBuffer = await file.arrayBuffer()
      await writeFile(filePath, new Uint8Array(arrayBuffer))

      urls.push(`/uploads/${uniqueName}`)
    }

    return NextResponse.json({ urls })
  } catch (err: any) {
    console.error("Upload error:", err)
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    )
  }
}
