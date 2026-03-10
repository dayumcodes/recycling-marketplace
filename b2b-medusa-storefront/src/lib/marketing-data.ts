/**
 * Centralized marketing content for ScrapCircle.
 * Edit here to update copy across the site without touching layout code.
 */

export const PILLARS = [
  {
    title: "Zero Waste",
    description:
      "Advancing the vision of a Zero Waste Society by transforming household scrap into valuable resources, ensuring nothing goes to waste and everything contributes to a sustainable future.",
  },
  {
    title: "Sustainability",
    description:
      "Championing sustainability through tech-driven scrap management solutions that reduce environmental impact, support economic growth, and empower communities to thrive.",
  },
  {
    title: "Circular Economy",
    description:
      "Driving the Circular Economy by turning post-consumer scrap into valuable commodities, fostering a system where waste becomes an opportunity for continuous reuse and renewal.",
  },
] as const

export const SERVICES = [
  {
    title: "Commercial Scrap Removal",
    description:
      "Is accumulated scrap disrupting your business operations? Our tailored commercial scrap removal service offers a quick and efficient solution, ensuring a cleaner workspace and streamlined waste management.",
    href: "/contact",
    linkLabel: "Get a quote",
  },
  {
    title: "Large-Scale Scrap Generators",
    description:
      "Are you a Large-Scale Scrap Generator looking for a seamless way to manage and dispose of scrap? Our solution simplifies collection and recycling for residential spaces, hotels, malls, and more.",
    href: "/contact",
    linkLabel: "Learn more",
  },
  {
    title: "Recycling Marketplace for Businesses",
    description:
      "Looking to turn your company's scrap into someone else's resource? Our online marketplace connects buyers and sellers in the scrap industry, maximizing the value of materials while driving efficiency and sustainability.",
    href: "/marketplace",
    linkLabel: "Explore marketplace",
  },
] as const

export const CITIES = {
  live: ["Gurugram", "Delhi", "Noida", "Jaipur", "Chandigarh", "Mohali"],
  comingSoon: [
    "Mumbai",
    "Bangalore",
    "Pune",
    "Ahmedabad",
    "Hyderabad",
  ],
} as const

export const SCRAP_CATEGORIES = [
  { name: "Paper", slug: "paper" },
  { name: "Plastic", slug: "plastic" },
  { name: "Aluminium", slug: "aluminium" },
  { name: "Steel", slug: "steel" },
  { name: "Copper", slug: "copper" },
  { name: "Iron", slug: "iron" },
  { name: "Tin", slug: "tin" },
  { name: "Brass", slug: "brass" },
  { name: "E-waste", slug: "e-waste" },
  { name: "Glass Bottles", slug: "glass-bottles" },
] as const

export const IMPACT_STATS = [
  { label: "Scrap Diverted from Landfill", value: "0", unit: "kg" },
  { label: "Water Saved", value: "0", unit: "L" },
  { label: "Trees Saved", value: "0", unit: "" },
] as const

export const TESTIMONIALS = [
  {
    name: "Amit Tandon",
    role: "",
    quote:
      "The fact that I can actually redeem my scrap earnings for gold or silver is a game-changer. ScrapCircle is more than just a scrap app—it's a way to invest in something valuable while making a positive environmental impact.",
    tagline: "Turn Scrap Into Treasure",
  },
  {
    name: "Rita Mathur",
    role: "",
    quote:
      "I used to think of scrap as just clutter, but ScrapCircle has completely changed my view. Turning scrap into actual value is an amazing way to contribute to the environment and earn something back.",
    tagline: "Turn Scrap Into Treasure",
  },
  {
    name: "Vikram Desai",
    role: "",
    quote:
      "As a manufacturing unit, managing scrap was always challenging, but ScrapCircle's service has been a game-changer. They're consistent, punctual, and their digital platform makes it easy to track and manage our pickups.",
    tagline: "Circular Economy",
  },
  {
    name: "Kavita Shah",
    role: "",
    quote:
      "I earn coins on top of my scrap's value, which I can redeem for vouchers from brands I already use. This makes recycling feel impactful and rewarding.",
    tagline: "Scrap Dealer Near Me",
  },
] as const

export const ABOUT_TEASER = {
  heading: "Turning Scrap into Treasure: The ScrapCircle Revolution",
  body: "In the developing world, scrap recovery is driven by a vibrant but informal ecosystem. ScrapCircle bridges the gap—connecting households, businesses, and recyclers through technology. We tag and analyze scrap, turning it into a valuable resource and integrating eco-warriors into a formal, low-carbon system.",
  ctaLabel: "Know More",
  ctaHref: "/about",
} as const

export const IMPACT_NARRATIVE = [
  {
    title: "Uplifting Lives of Eco-Warriors",
    body: "We elevate grassroots collectors by integrating them into formal scrap management systems, enriching their livelihoods and ensuring their vital contributions are celebrated and rewarded.",
  },
  {
    title: "Stimulating Economic Prosperity",
    body: "Transforming household scrap into valuable resources, we unlock new economic avenues, cut scrap disposal costs, and spark growth, linking sustainability with economic vitality.",
  },
  {
    title: "Championing Environmental Excellence",
    body: "Our tech slashes the carbon footprint of scrap management, driving the creation of greener cities and pristine environments through optimized processes.",
  },
  {
    title: "Driving the Circular Economy",
    body: "We ensure that materials are perpetually repurposed, turning scrap into an opportunity for a resource-efficient future.",
  },
] as const

export const BOTTOM_CTA = {
  heading: "Put your SCRAP to Work",
  subheading: "Convert it into TREASURE",
  ctaLabel: "Explore Now",
  ctaHref: "/marketplace",
} as const
