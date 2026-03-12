import { redirect } from "next/navigation"

export default function AdminPage({
  params,
}: {
  params: { countryCode: string }
}) {
  redirect(`/${params.countryCode}/admin/sellers`)
}
