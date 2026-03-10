import type { Metadata } from "next"
import ContactForm from "@modules/contact/components/contact-form"

export const metadata: Metadata = {
  title: "Contact | ScrapCircle",
  description:
    "Tell us about your scrap management needs and we will help you put your scrap to work.",
}

export default async function ContactPage() {
  return (
    <div className="content-container py-16 max-w-3xl">
      <section className="space-y-4 mb-8">
        <p className="uppercase text-xs tracking-[0.3em] text-lime-400">
          Contact Us
        </p>
        <h1 className="text-3xl-semi text-slate-900">
          Whatever your scrap needs are, we&apos;d love to hear from you
        </h1>
        <p className="text-base-regular text-slate-700">
          Share a few details about your materials, location, and timelines so
          our team can suggest the right pickup or marketplace flow.
        </p>
      </section>

      <ContactForm />
    </div>
  )
}

