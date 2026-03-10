"use server"

export type ContactFormState = {
  success: boolean
  message: string
}

export async function submitContactForm(
  _prevState: ContactFormState | null,
  formData: FormData
): Promise<ContactFormState> {
  try {
    const fullName = formData.get("fullName") as string
    const phone = formData.get("phone") as string
    const city = formData.get("city") as string
    const customerType = formData.get("customerType") as string
    const timeline = formData.get("timeline") as string
    const message = formData.get("message") as string

    if (!fullName?.trim() || !phone?.trim()) {
      return {
        success: false,
        message: "Please provide your name and phone number.",
      }
    }

    // Log for now; later wire to email or DB
    console.info("[Contact form submission]", {
      fullName: fullName.trim(),
      phone: phone.trim(),
      city: city?.trim(),
      customerType: customerType?.trim(),
      timeline: timeline?.trim(),
      message: message?.trim(),
    })

    return {
      success: true,
      message:
        "Thank you! We've received your message and will get back to you soon.",
    }
  } catch (e) {
    console.error("[Contact form error]", e)
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    }
  }
}
