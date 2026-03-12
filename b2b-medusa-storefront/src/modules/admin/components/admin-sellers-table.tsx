"use client"

import { useState, useTransition } from "react"
import type { AdminSeller } from "@lib/data/platform-admin"
import { verifySellerAction, rejectSellerAction } from "@lib/data/admin-actions"

export default function AdminSellersTable({
  sellers: initialSellers,
}: {
  sellers: AdminSeller[]
}) {
  const [sellers, setSellers] = useState(initialSellers)
  const [pending, startTransition] = useTransition()
  const [actionId, setActionId] = useState<string | null>(null)
  const [toast, setToast] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const verified = sellers.filter((s) => s.is_verified)
  const unverified = sellers.filter((s) => !s.is_verified)

  function handleAction(sellerId: string, action: "verify" | "reject") {
    setActionId(sellerId)
    setToast(null)

    startTransition(async () => {
      const result =
        action === "verify"
          ? await verifySellerAction(sellerId)
          : await rejectSellerAction(sellerId)

      if (result.error) {
        setToast({ type: "error", message: result.error })
      } else if (result.seller) {
        setSellers((prev) =>
          prev.map((s) =>
            s.id === sellerId ? { ...s, is_verified: result.seller!.is_verified } : s
          )
        )
        setToast({
          type: "success",
          message:
            action === "verify"
              ? `${result.seller.name} has been verified.`
              : `${result.seller.name} verification has been revoked.`,
        })
      }

      setActionId(null)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">
          Manage Sellers ({sellers.length})
        </h1>
        <div className="flex gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {verified.length} Verified
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {unverified.length} Pending
          </span>
        </div>
      </div>

      {toast && (
        <div
          className={`px-4 py-3 rounded-xl text-sm font-medium ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {toast.message}
        </div>
      )}

      {sellers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">
            No sellers have registered yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-6 py-3 font-medium text-slate-500">
                  Seller
                </th>
                <th className="px-6 py-3 font-medium text-slate-500">
                  Handle
                </th>
                <th className="px-6 py-3 font-medium text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 font-medium text-slate-500">
                  Registered
                </th>
                <th className="px-6 py-3 font-medium text-slate-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => {
                const isActing = pending && actionId === seller.id
                return (
                  <tr
                    key={seller.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-medium text-slate-900">
                          {seller.name}
                        </span>
                        {seller.description && (
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-[200px]">
                            {seller.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      @{seller.handle}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          seller.is_verified
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            seller.is_verified
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        />
                        {seller.is_verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {seller.created_at
                        ? new Date(seller.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {seller.is_verified ? (
                          <button
                            onClick={() =>
                              handleAction(seller.id, "reject")
                            }
                            disabled={isActing}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isActing ? "Revoking..." : "Revoke"}
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                handleAction(seller.id, "verify")
                              }
                              disabled={isActing}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isActing ? "Verifying..." : "Verify"}
                            </button>
                            <button
                              onClick={() =>
                                handleAction(seller.id, "reject")
                              }
                              disabled={isActing}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
