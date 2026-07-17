/**
 * @typedef {"live" | "in-development"} ProjectStatus
 * @typedef {"sahaan-kesavan" | "farris-zaman"} FounderSlug
 * @typedef {{label: string, href: string}} NavigationItem
 * @typedef {{slug: FounderSlug, name: string, role: string, location: string, description: string, responsibilities: string[], monogram: "sahaan" | "farris"}} Founder
 * @typedef {{slug: string, name: string, url: string, status: ProjectStatus, description: string, purpose: string, features: string[], availability: string, notice?: string}} Project
 * @typedef {{name: string, description: string, example: string}} Service
 * @typedef {{question: string, answer: string}} FaqItem
 * @typedef {{brandName: string, domain: string, email: string, founded: string, location: string, slogan: string, shortDescription: string, purpose: string, transparency: string}} SiteConfig
 */

/** @type {SiteConfig} */
export const site = {
  brandName: "Lucente Corporate",
  domain: "https://lucente-corporate-portfolio.vercel.app",
  email: "lucentecorporate@gmail.com",
  founded: "2025",
  location: "Sydney, Australia",
  slogan: "Digital products for everyday ideas.",
  shortDescription:
    "Lucente Corporate is a Sydney-based technology brand founded in 2025 by Sahaan Kesavan and Farris Zaman. It creates practical applications, digital products and flexible technology and design services.",
  purpose:
    "Lucente Corporate creates practical digital products and offers flexible technology and design services that turn ideas into useful, modern online experiences.",
  audience:
    "Lucente Corporate builds digital products and services for individuals, teams and organisations looking to simplify everyday tasks, organise work and turn ideas into practical online tools.",
  transparency:
    "Lucente Corporate is an independent technology brand founded in 2025 and is not currently a registered company."
};

/** @type {NavigationItem[]} */
export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Services", href: "/services/" },
  { label: "Projects", href: "/projects/" },
  { label: "Founders", href: "/founders/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Contact", href: "/contact/" }
];

/** @type {Founder[]} */
export const founders = [
  {
    slug: "sahaan-kesavan",
    name: "Sahaan Kesavan",
    role: "Co-Founder & Product Development Lead",
    location: "Sydney, Australia",
    monogram: "sahaan",
    description:
      "Sahaan Kesavan leads the design, development and technical delivery of Lucente Corporate’s websites and applications. He also contributes to product strategy, feature planning and the development of new digital concepts.",
    responsibilities: [
      "Primary application building and development",
      "Website and product delivery",
      "Feature planning and technical direction",
      "Product ideas, planning and strategy"
    ]
  },
  {
    slug: "farris-zaman",
    name: "Farris Zaman",
    role: "Co-Founder & Strategy and Marketing Lead",
    location: "Newcastle, Australia",
    monogram: "farris",
    description:
      "Farris Zaman leads Lucente Corporate’s marketing, strategic planning and creative direction. He contributes to project ideas, brand positioning, audience growth and the planning of new digital products.",
    responsibilities: [
      "Marketing and audience growth",
      "Strategic planning and creative direction",
      "Brand positioning",
      "Ideas and planning for new digital products"
    ]
  }
];

/** @type {Project[]} */
export const projects = [
  {
    slug: "lucente-qr",
    name: "Lucente QR",
    url: "https://lucente-qr.vercel.app",
    status: "live",
    description:
      "Lucente QR is a live QR-code creation tool designed to help users generate and customise QR codes for practical personal and business uses.",
    purpose:
      "Lucente QR makes practical QR creation easier for people who need simple, flexible ways to connect offline materials with online destinations.",
    features: [
      "QR-code generation",
      "Customisation for practical use cases",
      "Personal and business utility",
      "Simple digital sharing workflows"
    ],
    availability: "Live"
  },
  {
    slug: "lucente-calendar",
    name: "Lucente Calendar",
    url: "https://lucente-calendar.vercel.app",
    status: "live",
    description:
      "Lucente Calendar is a shared digital calendar application designed to help users organise events, reminders, schedules and collaborative plans in one place.",
    purpose:
      "Lucente Calendar supports shared planning by giving events, reminders and schedules a clearer digital home.",
    features: [
      "Shared event organisation",
      "Reminder and schedule planning",
      "Collaborative calendar workflows",
      "Practical everyday planning"
    ],
    availability: "Live"
  },
  {
    slug: "lucente-admin",
    name: "Lucente Admin",
    url: "https://lucente-admin-five.vercel.app",
    status: "in-development",
    description:
      "Lucente Admin is a flexible management platform currently in development, designed to help individuals and teams organise tasks, projects, roles, workflows and everyday operations.",
    purpose:
      "Lucente Admin is being shaped around everyday operational clarity: planning work, assigning responsibilities, tracking project movement and keeping team workflows easier to understand.",
    features: [
      "Task and project organisation",
      "Role and workflow planning",
      "Team operation views",
      "Flexible everyday management structure"
    ],
    availability: "In development",
    notice:
      "Lucente Admin is currently being developed, and its features, design and availability may change over time."
  }
];

/** @type {Service[]} */
export const services = [
  {
    name: "Web and app development",
    description:
      "Practical browser-based tools and application interfaces designed around real workflows and user needs.",
    example: "This can involve dashboards, account tools, internal utilities or structured web applications."
  },
  {
    name: "Digital product development",
    description:
      "Support for turning an idea into a planned, designed and usable online product.",
    example: "This can involve feature planning, product structure, interface direction and implementation steps."
  },
  {
    name: "UI and UX design",
    description:
      "Interface and experience design focused on clarity, accessibility and practical user journeys.",
    example: "This can involve wireframes, screen flows, design systems and interaction planning."
  },
  {
    name: "Website development upon request",
    description:
      "Modern websites can be created when someone needs a clear online presence or dedicated web experience.",
    example: "This can involve responsive pages, content structure, metadata and accessible front-end implementation."
  },
  {
    name: "Technology planning and concepts",
    description:
      "Early-stage planning for digital ideas, application concepts and online systems.",
    example: "This can involve defining users, routes, data needs, workflows and development priorities."
  },
  {
    name: "Digital branding and online presence",
    description:
      "Digital identity direction that helps a product or idea feel clear, consistent and usable online.",
    example: "This can involve visual systems, naming direction, page tone and web-ready brand assets."
  }
];

/** @type {FaqItem[]} */
export const faq = [
  {
    question: "What is Lucente Corporate?",
    answer:
      "Lucente Corporate is a Sydney-based technology brand founded in 2025 by Sahaan Kesavan and Farris Zaman. It creates practical applications, digital products and flexible technology and design services."
  },
  {
    question: "Who founded Lucente Corporate?",
    answer: "Lucente Corporate was founded by Sahaan Kesavan and Farris Zaman."
  },
  {
    question: "When was Lucente Corporate founded?",
    answer: "Lucente Corporate was founded in 2025."
  },
  {
    question: "Where is Lucente Corporate based?",
    answer:
      "Lucente Corporate is based in Sydney, Australia. Sahaan Kesavan is based in Sydney, and Farris Zaman is based in Newcastle."
  },
  {
    question: "What does Lucente Corporate create?",
    answer:
      "Lucente Corporate creates practical applications, digital products and flexible technology and design services."
  },
  {
    question: "What projects belong to Lucente Corporate?",
    answer: "Lucente QR, Lucente Calendar and Lucente Admin are part of Lucente Corporate."
  },
  {
    question: "Who is Sahaan Kesavan?",
    answer:
      "Sahaan Kesavan is the Co-Founder and Product Development Lead of Lucente Corporate. He leads application development, technical delivery and product planning from Sydney, Australia."
  },
  {
    question: "Who is Farris Zaman?",
    answer:
      "Farris Zaman is the Co-Founder and Strategy and Marketing Lead of Lucente Corporate. He leads marketing, strategic planning, creative direction and product strategy from Newcastle, Australia."
  },
  {
    question: "Which Lucente projects are live?",
    answer: "Lucente Calendar and Lucente QR are live. Lucente Admin is in development."
  },
  {
    question: "Is Lucente Admin available?",
    answer:
      "Lucente Admin is currently in development, and its features, design and availability may change over time."
  },
  {
    question: "Is Lucente Corporate a registered company?",
    answer:
      "Lucente Corporate is an independent technology brand founded in 2025 and is not currently a registered company."
  },
  {
    question: "How can someone contact Lucente Corporate?",
    answer: "Lucente Corporate can be contacted at lucentecorporate@gmail.com."
  }
];

export const requiredRoutes = [
  "/",
  "/about/",
  "/services/",
  "/projects/",
  "/projects/lucente-admin/",
  "/projects/lucente-calendar/",
  "/projects/lucente-qr/",
  "/founders/",
  "/founders/sahaan-kesavan/",
  "/founders/farris-zaman/",
  "/faq/",
  "/contact/",
  "/privacy/"
];
