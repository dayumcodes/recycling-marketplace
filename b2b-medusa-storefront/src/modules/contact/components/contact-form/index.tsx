"use client"

import { useActionState } from "react"
import { submitContactForm } from "@lib/actions/contact"

const CITIES = [
  "Gurugram",
  "Delhi",
  "Noida",
  "Jaipur",
  "Chandigarh",
  "Mohali",
  "Other",
]

const CUSTOMER_TYPES = [
  "Residential Customer",
  "Manufacturer / Workshop Owner / Recycler",
  "Business / Institution",
  "Other",
]

const TIMELINES = ["Immediately", "Within 7 days", "Within 10 days"]

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, null)

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-small-semi text-slate-800">
            Full Name<span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lime-400"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-small-semi text-slate-800">
            Phone Number<span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            required
            type="tel"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lime-400"
            placeholder="10 digit mobile"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="city" className="text-small-semi text-slate-800">
            City of Pickup
          </label>
          <select
            id="city"
            name="city"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lime-400"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="customerType"
            className="text-small-semi text-slate-800"
          >
            How shall we address you?
          </label>
          <select
            id="customerType"
            name="customerType"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lime-400"
          >
            {CUSTOMER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="timeline" className="text-small-semi text-slate-800">
            How soon do you want to sell?
          </label>
          <select
            id="timeline"
            name="timeline"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lime-400"
          >
            {TIMELINES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-small-semi text-slate-800">
          Your Message / Requirement
        </label>
        <textarea
          id="message"
          name="message"
          className="w-full min-h-[140px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lime-400"
          placeholder="Share material type, approximate quantity, preferred pickup times, and any other details."
        />
      </div>

      {state && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            state.success
              ? "bg-emerald-50 text-emerald-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {state.message}
        </div>
      )}

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-lime-400 px-6 py-2.5 text-sm font-medium text-slate-950 hover:bg-lime-300 transition-colors"
      >
        Submit
      </button>
    </form>
  )
}
