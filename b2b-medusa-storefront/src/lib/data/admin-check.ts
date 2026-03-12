"use server"

import { retrieveCustomer } from "./customer"

const ADMIN_EMAILS = (process.env.ADMIN_CUSTOMER_EMAILS || "admin@medusa-test.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())

export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const customer = await retrieveCustomer()
    if (!customer?.email) return false
    return ADMIN_EMAILS.includes(customer.email.toLowerCase())
  } catch {
    return false
  }
}
