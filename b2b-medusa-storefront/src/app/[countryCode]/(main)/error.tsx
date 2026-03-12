"use client"

import { useEffect } from "react"

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[MainError]", {
      message: error.message,
      name: error.name,
      digest: error.digest,
    })
  }, [error])

  const isChunkError =
    error?.name === "ChunkLoadError" ||
    (typeof error?.message === "string" &&
      error.message.includes("Loading chunk"))

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <h1 className="text-xl font-bold text-slate-900 mb-2">
        Something went wrong
      </h1>
      <p className="text-slate-600 mb-4 text-center max-w-md">
        {isChunkError
          ? "A required resource failed to load. This can happen after a deployment. Try refreshing the page."
          : "An unexpected error occurred."}
      </p>
      <p className="text-xs text-slate-400 mb-4 font-mono break-all">
        {error?.name}: {error?.message}
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-[#0B3D2E] text-white rounded-lg font-medium hover:bg-slate-800"
      >
        Try again
      </button>
      <button
        onClick={() => window.location.reload()}
        className="mt-3 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
      >
        Refresh page
      </button>
    </div>
  )
}
