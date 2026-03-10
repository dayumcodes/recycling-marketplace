import { Text } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  return (
    <footer className="border-t border-ui-border-base w-full bg-slate-950 text-slate-100">
      <div className="content-container flex flex-col w-full py-12 gap-y-10">
        <div className="flex flex-col gap-y-8 xsmall:flex-row items-start justify-between">
          <div>
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus text-lime-400 hover:text-lime-300 uppercase tracking-wide"
            >
              ScrapCircle
            </LocalizedClientLink>
            <p className="mt-4 max-w-md text-sm text-slate-300">
              Turning post-consumer scrap into valuable resources through tech,
              transparent pricing, and a circular economy mindset.
            </p>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-4">
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus text-slate-50">Company</span>
              <ul className="space-y-1 text-slate-300">
                <li>
                  <LocalizedClientLink href="/about" className="hover:text-lime-300">
                    About Us
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/impact" className="hover:text-lime-300">
                    Impact
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/blog" className="hover:text-lime-300">
                    Blogs
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/contact" className="hover:text-lime-300">
                    Contact Us
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus text-slate-50">Our Services</span>
              <ul className="space-y-1 text-slate-300">
                <li>Turn Trash to Treasure</li>
                <li>Zero-Waste Society</li>
                <li>Commercial Scrap Removal</li>
                <li>Large-Scale Scrap Generators</li>
                <li>Recycling Marketplace</li>
              </ul>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus text-slate-50">Site Info</span>
              <ul className="space-y-1 text-slate-300">
                <li>Disclaimer</li>
                <li>Privacy Policy</li>
                <li>Terms of Use</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus text-slate-50">Contact</span>
              <ul className="space-y-1 text-slate-300">
                <li>support@scrapcircle.com</li>
                <li>+91-00000-00000</li>
                <li>Serving NCR & beyond</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-full pb-4 justify-between items-center text-ui-fg-muted border-t border-slate-800 pt-6">
          <Text className="txt-compact-small text-slate-400">
            © {new Date().getFullYear()} ScrapCircle. All rights reserved.
          </Text>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Instagram</span>
            <span>LinkedIn</span>
            <span>Facebook</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
