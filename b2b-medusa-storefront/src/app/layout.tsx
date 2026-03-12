import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import ChunkLoadErrorHandler from "../components/chunk-load-error-handler"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className="bg-[#F3FDF6]">
        <main className="relative">{props.children}</main>
        <ChunkLoadErrorHandler />
      </body>
    </html>
  )
}
