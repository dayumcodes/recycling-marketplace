import { useState } from "react"
import {
  Button,
  Input,
  Label,
  Text,
  toast,
} from "@medusajs/ui"

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""
  return process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"
}

type SellerSignupFormProps = {
  /** Called after successful signup (e.g. to close the drawer). */
  onSuccess?: () => void
}

export default function SellerSignupForm({ onSuccess }: SellerSignupFormProps) {
  const [loading, setLoading] = useState(false)
  const [publishableKey, setPublishableKey] = useState<string | null>(null)
  const [storefrontUrl, setStorefrontUrl] = useState<string>("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [name, setName] = useState("")
  const [handle, setHandle] = useState("")
  const [description, setDescription] = useState("")

  const ensureConfig = async (): Promise<{ key: string; storefrontUrl: string }> => {
    if (publishableKey) return { key: publishableKey, storefrontUrl: storefrontUrl || "http://localhost:8000" }
    const base = getBaseUrl()
    const configRes = await fetch(`${base}/sellers-signup-config`)
    const config = await configRes.json().catch(() => ({}))
    const key = (config?.publishable_key ?? "").trim()
    const url = (config?.storefront_url ?? "http://localhost:8000").trim()
    if (key) setPublishableKey(key)
    if (url) setStorefrontUrl(url)
    return { key, storefrontUrl: url }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email?.trim() || !password || !name?.trim() || !handle?.trim()) {
      toast.error("Please fill in email, password, store name, and handle.")
      return
    }
    setLoading(true)
    try {
      const base = getBaseUrl()
      const { key } = await ensureConfig()
      if (!key) {
        toast.error(
          "Backend is missing PUBLISHABLE_API_KEY. Add it to the backend .env (same value as storefront publishable key) and restart."
        )
        setLoading(false)
        return
      }
      const headers: Record<string, string> = { "Content-Type": "application/json" }
      headers["x-publishable-api-key"] = key

      const res = await fetch(`${base}/store/sellers/signup`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          email: email.trim(),
          password,
          first_name: firstName.trim() || undefined,
          last_name: lastName.trim() || undefined,
          name: name.trim(),
          handle: handle.trim(),
          description: description.trim() || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(data?.message || "Sign up failed")
        return
      }
      toast.success("Account created successfully", {
        description:
          "Sign in on the storefront with your email and password.",
      })
      onSuccess?.()
      setEmail("")
      setPassword("")
      setFirstName("")
      setLastName("")
      setName("")
      setHandle("")
      setDescription("")
    } catch (err) {
      console.error("Seller signup error", err)
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="seller-email">Email</Label>
        <Input
          id="seller-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <Label htmlFor="seller-password">Password</Label>
        <Input
          id="seller-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="seller-first">First name</Label>
          <Input
            id="seller-first"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First"
          />
        </div>
        <div>
          <Label htmlFor="seller-last">Last name</Label>
          <Input
            id="seller-last"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="seller-name">Store / business name</Label>
        <Input
          id="seller-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Store"
          required
        />
      </div>
      <div>
        <Label htmlFor="seller-handle">Handle (unique URL slug)</Label>
        <Input
          id="seller-handle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="my-store"
          required
        />
        <Text className="text-ui-fg-muted text-xs mt-1">Letters, numbers, hyphens only.</Text>
      </div>
      <div>
        <Label htmlFor="seller-desc">Description (optional)</Label>
        <Input
          id="seller-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description"
        />
      </div>
      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? "Creating…" : "Create seller account"}
      </Button>
    </form>
  )
}
