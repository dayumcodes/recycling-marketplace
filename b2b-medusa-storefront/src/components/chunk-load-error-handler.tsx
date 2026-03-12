"use client"

import { useEffect, useState } from "react"

export default function ChunkLoadErrorHandler() {
  const [chunkError, setChunkError] = useState<Error | null>(null)

  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      const err = e.error ?? e.message
      const msg = typeof err === "string" ? err : (err as Error)?.message
      if (msg && String(msg).includes("Loading chunk")) {
        console.error("[ChunkLoadErrorHandler] ChunkLoadError:", err)
        setChunkError(err instanceof Error ? err : new Error(String(msg)))
      }
    }

    const onRejection = (e: PromiseRejectionEvent) => {
      const err = e.reason
      const msg = err?.message ?? String(err)
      if (msg.includes("Loading chunk") || err?.name === "ChunkLoadError") {
        console.error(
          "[ChunkLoadErrorHandler] ChunkLoadError (unhandledrejection):",
          err
        )
        setChunkError(err instanceof Error ? err : new Error(msg))
      }
    }

    window.addEventListener("error", onError)
    window.addEventListener("unhandledrejection", onRejection)
    return () => {
      window.removeEventListener("error", onError)
      window.removeEventListener("unhandledrejection", onRejection)
    }
  }, [])

  if (!chunkError) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      role="alert"
    >
      <div className="bg-white rounded-xl shadow-lg max-w-md p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          Failed to load
        </h2>
        <p className="text-slate-600 mb-4">
          A required script could not be loaded (often after a new deployment).
          Please refresh the page.
        </p>
        <p className="text-xs text-slate-400 mb-4 font-mono break-all">
          {chunkError.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-2 bg-[#0B3D2E] text-white rounded-lg font-medium"
        >
          Refresh page
        </button>
      </div>
    </div>
  )
}
