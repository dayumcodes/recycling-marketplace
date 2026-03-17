import { Button, Drawer } from "@medusajs/ui"

type DrawerComponentProps = {
  title: string
  trigger: React.ReactNode
  children: React.ReactNode
}

export default function DrawerComponent({
  title,
  trigger,
  children,
}: DrawerComponentProps) {
  return (
    <Drawer>
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
