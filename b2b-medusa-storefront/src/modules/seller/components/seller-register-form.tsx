"use client"

import { useActionState } from "react"
import { registerSellerAction } from "@lib/data/seller-actions"

export default function SellerRegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerSellerAction,
    null
  )

  if (state?.seller) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-emerald-600 text-xl">✓</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Welcome, {state.seller.name}!
        </h2>
        <p className="text-slate-600 mb-4">
          Your seller account has been created. Refresh the page to access your
          dashboard.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-lg">
      <h2 className="text-xl font-bold text-slate-900 mb-2">
        Become a Seller
      </h2>
      <p className="text-slate-600 mb-6">
        Register as a seller to list your products on the ScrapCircle
        marketplace.
      </p>

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Business Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="e.g. Green Metals Co"
          />
        </div>

        <div>
          <label
            htmlFor="handle"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Handle (URL slug) *
          </label>
          <input
            id="handle"
            name="handle"
            type="text"
            required
            pattern="[a-z0-9-]+"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="e.g. green-metals-co"
          />
          <p className="text-xs text-slate-400 mt-1">
            Lowercase letters, numbers, and hyphens only
          </p>
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
            placeholder="Tell buyers about your business..."
          />
        </div>

        {state?.error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#0B3D2E] text-white py-3 rounded-xl text-sm font-semibold hover:bg-slate-900 transition-colors disabled:opacity-50"
        >
          {isPending ? "Registering..." : "Register as Seller"}
        </button>
      </form>
    </div>
  )
}
