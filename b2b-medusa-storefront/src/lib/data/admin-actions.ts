"use server"

import { revalidateTag } from "next/cache"
import { getCacheTag } from "./cookies"
import { updateSellerVerification } from "./platform-admin"

export async function verifySellerAction(sellerId: string) {
  const result = await updateSellerVerification(sellerId, true)

  if (result.seller) {
    const tag = await getCacheTag("admin-sellers")
    if (tag) revalidateTag(tag)
  }

  return result
}

export async function rejectSellerAction(sellerId: string) {
  const result = await updateSellerVerification(sellerId, false)

  if (result.seller) {
    const tag = await getCacheTag("admin-sellers")
    if (tag) revalidateTag(tag)
  }

  return result
}
