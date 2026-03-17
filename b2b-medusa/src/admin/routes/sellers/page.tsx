import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BuildingStorefront, SquareTwoStack } from "@medusajs/icons"
import {
  Container,
  Heading,
  Table,
  Badge,
  toast,
} from "@medusajs/ui"
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom"

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
  const { sellers } = useLoaderData() as SellersResponse

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success("Seller ID copied")
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
