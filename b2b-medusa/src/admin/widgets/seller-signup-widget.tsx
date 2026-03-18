import { useState } from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, Text } from "@medusajs/ui"
import DrawerComponent from "../components/drawer"
import SellerSignupForm from "../components/seller-signup-form"

const SellerSignupWidget = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <Text className="text-ui-fg-muted">Want to sell on this marketplace?</Text>
      <DrawerComponent
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Sign up as seller"
        trigger={<Button variant="secondary">Sign up as seller</Button>}
      >
        <SellerSignupForm onSuccess={() => setDrawerOpen(false)} />
      </DrawerComponent>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "login.after",
})

export default SellerSignupWidget
