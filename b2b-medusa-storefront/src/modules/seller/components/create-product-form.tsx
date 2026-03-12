"use client"

import { useActionState, useState, useRef, useCallback } from "react"
import { createProductAction } from "@lib/data/seller-actions"
import { HttpTypes } from "@medusajs/types"

type ImageEntry = {
  id: string
  url: string
  preview: string
  source: "upload" | "url"
  uploading?: boolean
  error?: string
}

let entryCounter = 0
function nextId() {
  return `img-${++entryCounter}-${Date.now()}`
}

export default function CreateProductForm({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[]
}) {
  const [state, formAction, isPending] = useActionState(
    createProductAction,
    null
  )
  const [images, setImages] = useState<ImageEntry[]>([])
  const [urlInput, setUrlInput] = useState("")
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload")
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validImageUrls = images
    .filter((img) => img.url && !img.uploading && !img.error)
    .map((img) => img.url)

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    )
    if (!fileArray.length) return

    const newEntries: ImageEntry[] = fileArray.map((file) => ({
      id: nextId(),
      url: "",
      preview: URL.createObjectURL(file),
      source: "upload" as const,
      uploading: true,
    }))

    setImages((prev) => [...prev, ...newEntries])

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      const entry = newEntries[i]

      const formData = new FormData()
      formData.append("files", file)

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const data = await res.json()

        if (!res.ok) {
          setImages((prev) =>
            prev.map((img) =>
              img.id === entry.id
                ? { ...img, uploading: false, error: data.error || "Upload failed" }
                : img
            )
          )
          continue
        }

        const uploadedUrl = data.urls[0]
        setImages((prev) =>
          prev.map((img) =>
            img.id === entry.id
              ? { ...img, url: uploadedUrl, uploading: false }
              : img
          )
        )
      } catch {
        setImages((prev) =>
          prev.map((img) =>
            img.id === entry.id
              ? { ...img, uploading: false, error: "Upload failed" }
              : img
          )
        )
      }
    }
  }, [])

  function addUrl() {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    setImages((prev) => [
      ...prev,
      { id: nextId(), url: trimmed, preview: trimmed, source: "url" },
    ])
    setUrlInput("")
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const entry = prev.find((img) => img.id === id)
      if (entry?.source === "upload" && entry.preview.startsWith("blob:")) {
        URL.revokeObjectURL(entry.preview)
      }
      return prev.filter((img) => img.id !== id)
    })
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files?.length) {
      uploadFiles(e.dataTransfer.files)
    }
  }

  if (state?.product) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-emerald-600 text-xl">&#10003;</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Product Created!
        </h2>
        <p className="text-slate-600 mb-4">
          &ldquo;{state.product.title}&rdquo; is now live on the marketplace.
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href=""
            onClick={(e) => {
              e.preventDefault()
              window.location.reload()
            }}
            className="inline-block bg-[#0B3D2E] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-900 transition-colors"
          >
            Add Another
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Add New Product</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <form action={formAction} className="space-y-5">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Product Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g. Shredded HDPE Plastic"
            />
          </div>

          <div>
            <label
              htmlFor="handle"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Handle (URL slug)
            </label>
            <input
              id="handle"
              name="handle"
              type="text"
              pattern="[a-z0-9-]*"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="auto-generated from title if blank"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              placeholder="Describe the material, grade, quantity..."
            />
          </div>

          {/* Image upload section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Product Images
            </label>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-3">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "upload"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Upload Files
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("url")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "url"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Paste URL
              </button>
            </div>

            {/* Upload tab */}
            {activeTab === "upload" && (
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-slate-300 hover:border-emerald-400 hover:bg-slate-50"
                }`}
              >
                <div className="text-slate-400 mb-2">
                  <svg
                    className="w-8 h-8 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-slate-600 font-medium">
                  Drag &amp; drop images here, or click to browse
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  JPEG, PNG, WebP, GIF up to 5 MB each
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      uploadFiles(e.target.files)
                      e.target.value = ""
                    }
                  }}
                />
              </div>
            )}

            {/* URL tab */}
            {activeTab === "url" && (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addUrl()
                    }
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  onClick={addUrl}
                  className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shrink-0"
                >
                  Add
                </button>
              </div>
            )}

            {/* Image previews */}
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {images.map((img, index) => (
                  <div key={img.id} className="relative group">
                    <div className="aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                      {img.uploading ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : img.error ? (
                        <div className="w-full h-full flex items-center justify-center p-2">
                          <span className="text-xs text-red-500 text-center">
                            {img.error}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={img.preview || img.url}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = ""
                            ;(e.target as HTMLImageElement).alt = "Failed"
                          }}
                        />
                      )}
                    </div>
                    {index === 0 && !img.uploading && !img.error && (
                      <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                        Thumbnail
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length > 0 && (
              <p className="text-xs text-slate-400 mt-2">
                {validImageUrls.length} image{validImageUrls.length !== 1 ? "s" : ""} ready.
                The first image will be the product thumbnail.
              </p>
            )}

            <input
              type="hidden"
              name="image_urls"
              value={validImageUrls.join("\n")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Price (AED) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label
                htmlFor="sku"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                SKU
              </label>
              <input
                id="sku"
                name="sku"
                type="text"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="e.g. HDPE-SHRED-001"
              />
            </div>
          </div>

          {categories.length > 0 && (
            <div>
              <label
                htmlFor="category_id"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Category
              </label>
              <select
                id="category_id"
                name="category_id"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              >
                <option value="">— Select category —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {state?.error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending || images.some((img) => img.uploading)}
            className="w-full bg-[#0B3D2E] text-white py-3 rounded-xl text-sm font-semibold hover:bg-slate-900 transition-colors disabled:opacity-50"
          >
            {isPending ? "Creating Product..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  )
}
