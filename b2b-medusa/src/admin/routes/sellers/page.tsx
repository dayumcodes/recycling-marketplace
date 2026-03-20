import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BuildingStorefront, SquareTwoStack } from "@medusajs/icons"
import { useLoaderData } from "react-router-dom"
import {
  Container,
  Heading,
  Table,
  Badge,
  toast,
} from "@medusajs/ui"
import { LoaderFunctionArgs } from "react-router-dom"
import { useState, useTransition } from "react"

type Seller = {
  id: string
  name: string
  handle: string
  user_id: string | null
  description: string | null
  is_verified: boolean
}

type SellersResponse = {
  sellers: Seller[]
}

const SellersPage = () => {
  const { sellers: initialSellers } = useLoaderData() as SellersResponse
  const [sellers, setSellers] = useState(initialSellers)
  const [pending, startTransition] = useTransition()
  const [actionId, setActionId] = useState<string | null>(null)

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success("Seller ID copied")
  }

  function handleAction(
    sellerId: string,
    action: "verify" | "reject" | "revoke"
  ) {
    setActionId(sellerId)

    const isVerified = action === "verify"

    startTransition(async () => {
      try {
        const res = await fetch(`/admin/sellers/${sellerId}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_verified: isVerified }),
        })

        if (!res.ok) {
          const text = await res.text().catch(() => "")
          toast.error(
            text || `Failed to ${action} seller (HTTP ${res.status})`
          )
          return
        }

        const data = (await res.json()) as { seller?: Seller }
        if (!data.seller) {
          toast.error("Seller update failed")
          return
        }

        setSellers((prev) =>
          prev.map((s) => (s.id === sellerId ? { ...s, ...data.seller } : s))
        )

        toast.success(
          action === "verify"
            ? `${data.seller.name} has been verified.`
            : action === "revoke"
              ? `${data.seller.name} verification has been revoked.`
              : `${data.seller.name} has been rejected.`
        )
      } catch (e: any) {
        toast.error(e?.message || `Failed to ${action} seller`)
      } finally {
        setActionId(null)
      }
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h1">Sellers</Heading>
      </div>
      <div className="px-6 py-4">
        {!sellers?.length ? (
          <p className="text-ui-fg-muted">No sellers yet.</p>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Handle</Table.HeaderCell>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>User ID</Table.HeaderCell>
                <Table.HeaderCell>Verified</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell className="text-right">
                  Actions
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sellers.map((s) => (
                <Table.Row key={s.id}>
                  <Table.Cell className="font-medium">{s.name}</Table.Cell>
                  <Table.Cell>{s.handle}</Table.Cell>
                  <Table.Cell>
                    <button
                      type="button"
                      onClick={() => copyId(s.id)}
                      className="flex items-center gap-1 text-ui-fg-muted hover:text-ui-fg-base"
                    >
                      <SquareTwoStack className="size-3" />
                      {s.id.slice(0, 8)}…
                    </button>
                  </Table.Cell>
                  <Table.Cell className="text-ui-fg-muted">
                    {s.user_id ?? "—"}
                  </Table.Cell>
                  <Table.Cell>
                    {s.is_verified ? (
                      <Badge color="green">Verified</Badge>
                    ) : (
                      <Badge color="grey">No</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell className="max-w-[200px] truncate text-ui-fg-muted">
                    {s.description ?? "—"}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    {s.is_verified ? (
                      <button
                        type="button"
                        onClick={() => handleAction(s.id, "revoke")}
                        disabled={pending && actionId === s.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {pending && actionId === s.id
                          ? "Revoking..."
                          : "Revoke"}
                      </button>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleAction(s.id, "verify")}
                          disabled={pending && actionId === s.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {pending && actionId === s.id
                            ? "Verifying..."
                            : "Verify"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(s.id, "reject")}
                          disabled={pending && actionId === s.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    </Container>
  )
}

export default SellersPage

export async function loader(_args: LoaderFunctionArgs) {
  const base =
    typeof window !== "undefined"
      ? ""
      : process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"
  const res = await fetch(`${base}/admin/sellers`, {
    credentials: "include",
    headers: process.env.MEDUSA_ADMIN_ONBOARDING_NEXTJS
      ? undefined
      : { "Content-Type": "application/json" },
  })
  if (!res.ok) {
    throw new Response(res.statusText, { status: res.status })
  }
  const data = (await res.json()) as SellersResponse
  return { sellers: data.sellers ?? [] }
}

export const config = defineRouteConfig({
  label: "Sellers",
  icon: BuildingStorefront,
  rank: 10,
})

export const handle = {
  breadcrumb: () => "Sellers",
}
