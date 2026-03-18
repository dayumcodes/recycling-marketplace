import { Button, Drawer } from "@medusajs/ui"

type DrawerComponentProps = {
  title: string
  trigger: React.ReactNode
  children: React.ReactNode
  /** When both are set, the drawer is controlled (e.g. close from child after submit). */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function DrawerComponent({
  title,
  trigger,
  children,
  open,
  onOpenChange,
}: DrawerComponentProps) {
  const controlled =
    open !== undefined && typeof onOpenChange === "function"
      ? { open, onOpenChange }
      : {}
  return (
    <Drawer {...controlled}>
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>{title}</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-4">{children}</Drawer.Body>
      </Drawer.Content>
    </Drawer>
  )
}
