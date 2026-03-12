"use server"

import { revalidateTag } from "next/cache"
import { getCacheTag } from "./cookies"
import { registerAsSeller, createSellerProduct } from "./seller-dashboard"

export async function registerSellerAction(
  _currentState: unknown,
  formData: FormData
) {
  const name = formData.get("name") as string
  const handle = formData.get("handle") as string
  const description = formData.get("description") as string

  if (!name || !handle) {
    return { error: "Name and handle are required" }
  }

  const result = await registerAsSeller({ name, handle, description })

  if (result.seller) {
    const tag = await getCacheTag("seller-profile")
    if (tag) revalidateTag(tag)
  }

  return result
}

export async function createProductAction(
  _currentState: unknown,
  formData: FormData
) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const handle = formData.get("handle") as string
  const priceStr = formData.get("price") as string
  const sku = formData.get("sku") as string
  const categoryId = formData.get("category_id") as string
  const imageUrlsRaw = formData.get("image_urls") as string

  if (!title) {
    return { error: "Title is required" }
  }

  const price = priceStr ? parseFloat(priceStr) : 0

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"

  const imageUrls = imageUrlsRaw
    ? imageUrlsRaw
        .split("\n")
        .map((u) => u.trim())
        .filter((u) => u.length > 0)
        .map((u) => (u.startsWith("/") ? `${baseUrl}${u}` : u))
    : []

  const data: Parameters<typeof createSellerProduct>[0] = {
    title,
    description: description || undefined,
    handle: handle || undefined,
    status: "published",
    thumbnail: imageUrls[0] || undefined,
    images: imageUrls.length ? imageUrls : undefined,
    variants: [
      {
        title: "Default",
        prices: [{ amount: price, currency_code: "aed" }],
        sku: sku || undefined,
      },
    ],
  }

  if (categoryId) {
    data.category_ids = [categoryId]
  }

  const result = await createSellerProduct(data)

  if (result.product) {
    const tag = await getCacheTag("seller-products")
    if (tag) revalidateTag(tag)
    const productsTag = await getCacheTag("products")
    if (productsTag) revalidateTag(productsTag)
  }

  return result
}
