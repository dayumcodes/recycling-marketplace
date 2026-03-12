import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { isCurrentUserAdmin } from "@lib/data/admin-check"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale, isAdmin] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    isCurrentUserAdmin(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-14 mx-auto border-b duration-200 bg-slate-950/95 border-ui-border-base backdrop-blur">
        <nav className="content-container txt-xsmall-plus flex items-center justify-between w-full h-full text-small-regular gap-4 text-white">
          {/* Left: logo only */}
          <div className="flex items-center h-full shrink-0">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus text-lime-400 hover:text-white uppercase tracking-wide whitespace-nowrap transition-colors"
              data-testid="nav-store-link"
            >
              ScrapCircle
            </LocalizedClientLink>
          </div>

          {/* Right: nav links + CTA + cart + menu */}
          <div className="flex items-center gap-x-4 small:gap-x-5 h-full">
            <div className="hidden small:flex items-center gap-x-4 small:gap-x-5 h-full">
              <LocalizedClientLink
                className="text-white hover:text-white"
                href="/"
              >
                Home
              </LocalizedClientLink>
              <LocalizedClientLink
                className="text-white hover:text-white"
                href="/about"
              >
                About
              </LocalizedClientLink>
              <LocalizedClientLink
                className="text-white hover:text-white"
                href="/services"
              >
                Services
              </LocalizedClientLink>
              <LocalizedClientLink
                className="text-white hover:text-white"
                href="/impact"
              >
                Impact
              </LocalizedClientLink>
              <LocalizedClientLink
                className="text-white hover:text-white"
                href="/marketplace"
              >
                Marketplace
              </LocalizedClientLink>
              <LocalizedClientLink
                className="text-white hover:text-white"
                href="/blog"
              >
                Blog
              </LocalizedClientLink>
              <LocalizedClientLink
                className="text-white hover:text-white"
                href="/contact"
              >
                Contact
              </LocalizedClientLink>
              <LocalizedClientLink
                className="text-white hover:text-white"
                href="/seller"
              >
                Sell
              </LocalizedClientLink>
              <LocalizedClientLink
                className="ml-1 px-3 py-1.5 rounded-lg bg-lime-400 text-slate-950 text-sm font-medium hover:bg-lime-300 transition-colors whitespace-nowrap"
                href="/contact"
              >
                Schedule Pickup
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="text-white hover:text-white flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
            <div className="h-full flex items-center">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} isAdmin={isAdmin} />
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
