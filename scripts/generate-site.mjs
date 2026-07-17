import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { faq, founders, navigation, projects, requiredRoutes, services, site } from "../data/site-data.mjs";

const verificationTag = '<meta name="google-site-verification" content="HNCdgm31ssvA4WBS6L759a7R0ITaOOqglFpAqv-i3Z0">';
const ogImage = `${site.domain}/assets/og-lucente.svg`;

const htmlEscape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const attr = htmlEscape;
const pathFor = (route) => (route === "/" ? "index.html" : `${route.replace(/^\/|\/$/g, "")}/index.html`);
const absolute = (route) => `${site.domain}${route}`;
const founderBySlug = (slug) => founders.find((founder) => founder.slug === slug);
const orgId = `${site.domain}/#organization`;
const websiteId = `${site.domain}/#website`;
const founderId = (founder) => `${absolute(`/founders/${founder.slug}/`)}#person`;

function writePage(route, html) {
  const file = pathFor(route);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

function meta({ title, description, route, type = "website", jsonLd = [] }) {
  const url = absolute(route);
  const scripts = jsonLd
    .filter(Boolean)
    .map((data) => `  <script type="application/ld+json">${JSON.stringify(data)}</script>`)
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${route === "/" ? `${verificationTag}\n  ` : ""}<title>${htmlEscape(title)}</title>
  <meta name="description" content="${attr(description)}">
  <link rel="canonical" href="${attr(url)}">
  <meta property="og:title" content="${attr(title)}">
  <meta property="og:description" content="${attr(description)}">
  <meta property="og:url" content="${attr(url)}">
  <meta property="og:type" content="${attr(type)}">
  <meta property="og:image" content="${attr(ogImage)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${attr(title)}">
  <meta name="twitter:description" content="${attr(description)}">
  <meta name="twitter:image" content="${attr(ogImage)}">
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="stylesheet" href="/assets/styles.css">
${scripts}
</head>`;
}

function nav(current) {
  const links = navigation
    .map((item) => `<a href="${item.href}"${current === item.href ? ' aria-current="page"' : ""}>${item.label}</a>`)
    .join("");

  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <nav class="nav" aria-label="Main navigation">
      <a class="wordmark" href="/" aria-label="Lucente Corporate home"><span class="mark">LC</span><span>Lucente Corporate</span></a>
      <div class="nav-links" id="nav-links">${links}</div>
      <div class="nav-actions"><a class="button gold" href="/contact/">Contact Lucente</a><button class="menu-toggle" data-menu-toggle aria-controls="nav-links" aria-expanded="false" aria-label="Open navigation"><span></span><span></span><span></span></button></div>
    </nav>
  </header>`;
}

function footer() {
  const coreLinks = navigation.map((item) => `<a href="${item.href}">${item.label}</a>`).join("");
  const projectLinks = projects.map((project) => `<a href="/projects/${project.slug}/">${project.name}</a>`).join("");

  return `<footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <a class="wordmark" href="/"><span class="mark">LC</span><span>Lucente Corporate</span></a>
        <p>${site.slogan}</p>
        <p>Lucente Corporate was founded in 2025 by <a href="/founders/sahaan-kesavan/">Sahaan Kesavan</a> and <a href="/founders/farris-zaman/">Farris Zaman</a>.</p>
        <p class="transparency">${site.transparency}</p>
      </div>
      <div><p class="footer-heading">Navigation</p><div class="footer-links">${coreLinks}<a href="/privacy/">Privacy Policy</a></div></div>
      <div><p class="footer-heading">Projects</p><div class="footer-links">${projectLinks}</div></div>
      <div><p class="footer-heading">Contact</p><div class="footer-links"><span>${site.location}</span><a href="mailto:${site.email}">${site.email}</a></div></div>
    </div>
    <div class="container copyright">© 2026 Lucente Corporate. All original content and project materials remain the property of their respective creators.</div>
  </footer>
  <script src="/assets/script.js" defer></script>`;
}

function layout({ route, title, description, current = route, jsonLd, children, pageClass = "" }) {
  return `${meta({ title, description, route, jsonLd })}
<body class="${pageClass}">
  ${nav(current)}
  <main id="main">
${children}
  </main>
  ${footer()}
</body>
</html>`;
}

function pageTitle({ eyebrow, h1, lead, actions = "" }) {
  return `<section class="page-title"><div class="container"><p class="eyebrow">${eyebrow}</p><h1>${h1}</h1><p class="lead">${lead}</p>${actions}</div></section>`;
}

function status(project) {
  const label = project.status === "live" ? "Live" : "In Development";
  return `<span class="status status-${project.status}"><span class="status-dot" aria-hidden="true"></span><span>${label}</span></span>`;
}

function launch(project) {
  return `<a class="button primary launch-link" href="${project.url}" target="_blank" rel="noopener noreferrer">Launch Project ↗</a>`;
}

function breadcrumbs(items) {
  const trail = items
    .map((item, index) =>
      item.href && index < items.length - 1
        ? `<a href="${item.href}">${item.label}</a><span>/</span>`
        : `<span>${item.label}</span>`
    )
    .join("");
  return `<nav class="breadcrumb" aria-label="Breadcrumb">${trail}</nav>`;
}

function monogram(kind) {
  const isSahaan = kind === "sahaan";
  const title = isSahaan ? "Sahaan Lucente L monogram" : "Farris Lucente L monogram";
  const extra = isSahaan
    ? `<path d="M30 18v54h36" stroke="#A88C52" stroke-width="7" stroke-linecap="square"/><path d="M20 28h52M20 42h52M20 56h52" stroke="#F3F0E8" stroke-opacity=".12"/><path d="M44 18v54" stroke="#F3F0E8" stroke-opacity=".12"/>`
    : `<path d="M31 18v53h36" stroke="#A88C52" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 28c20 0 35 8 45 22M25 45c18 0 31 6 42 18" stroke="#F3F0E8" stroke-opacity=".14" fill="none"/><circle cx="73" cy="50" r="3" fill="#A88C52"/>`;
  return `<svg class="founder-monogram" viewBox="0 0 96 96" role="img" aria-labelledby="${kind}-monogram-title"><title id="${kind}-monogram-title">${title}</title><rect width="96" height="96" fill="#111311"/><rect x="8" y="8" width="80" height="80" fill="none" stroke="#A88C52" stroke-opacity=".5"/>${extra}</svg>`;
}

function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: site.brandName,
    url: site.domain,
    email: site.email,
    foundingDate: site.founded,
    description: site.shortDescription,
    logo: `${site.domain}/assets/favicon.svg`,
    location: { "@type": "Place", name: site.location },
    founder: founders.map((founder) => ({ "@type": "Person", "@id": founderId(founder), name: founder.name, url: absolute(`/founders/${founder.slug}/`) }))
  };
}

function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: site.brandName,
    url: site.domain,
    description: site.shortDescription,
    publisher: { "@id": orgId }
  };
}

function breadcrumbSchema(route, items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? absolute(item.href) : absolute(route)
    }))
  };
}

function projectSchema(project) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: project.name,
    url: project.url,
    description: project.description,
    applicationCategory: "ProductivityApplication",
    creator: { "@id": orgId, "@type": "Organization", name: site.brandName, url: site.domain },
    isPartOf: { "@id": orgId }
  };
}

function projectProblem(project) {
  const problems = {
    "lucente-qr": "Lucente QR addresses the everyday need to create practical QR codes for links, materials and simple digital sharing without turning the task into a larger project.",
    "lucente-calendar": "Lucente Calendar addresses the everyday challenge of keeping events, reminders, schedules and collaborative plans organised in one shared digital place.",
    "lucente-admin": "Lucente Admin addresses the everyday need for clearer task, project, role and workflow organisation across personal or team operations."
  };
  return problems[project.slug] || `${project.name} focuses on making a practical digital workflow clearer and easier to manage.`;
}

function projectConnection(project) {
  const connections = {
    "lucente-qr": "Lucente QR is a live project developed under Lucente Corporate, the independent technology brand founded by <a href=\"/founders/sahaan-kesavan/\">Sahaan Kesavan</a> and <a href=\"/founders/farris-zaman/\">Farris Zaman</a>.",
    "lucente-calendar": "Lucente Calendar is a live Lucente Corporate project from the independent technology brand founded by <a href=\"/founders/sahaan-kesavan/\">Sahaan Kesavan</a> and <a href=\"/founders/farris-zaman/\">Farris Zaman</a>.",
    "lucente-admin": "Lucente Admin is an in-development project from Lucente Corporate, the independent technology brand founded by <a href=\"/founders/sahaan-kesavan/\">Sahaan Kesavan</a> and <a href=\"/founders/farris-zaman/\">Farris Zaman</a>."
  };
  return connections[project.slug] || `${project.name} is a project developed under Lucente Corporate, the independent technology brand founded by <a href="/founders/sahaan-kesavan/">Sahaan Kesavan</a> and <a href="/founders/farris-zaman/">Farris Zaman</a>.`;
}

function founderSchema(founder) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": founderId(founder),
    name: founder.name,
    jobTitle: founder.role,
    homeLocation: { "@type": "Place", name: founder.location },
    worksFor: { "@id": orgId, "@type": "Organization", name: site.brandName, url: site.domain },
    url: absolute(`/founders/${founder.slug}/`)
  };
}

function personSchemas() {
  return founders.map((founder) => founderSchema(founder));
}

function homePage() {
  const projectStages = [
    { name: "Lucente Corporate", statusText: site.slogan, href: "/about/", cta: "Explore Lucente" },
    ...projects.map((project) => ({
      name: project.name,
      statusText: project.status === "live" ? "Live" : "In Development",
      href: project.url,
      cta: "Launch Project ↗",
      external: true,
      statusClass: project.status
    }))
  ];
  const stageHtml = projectStages
    .map((stage, index) => `<article class="globe-stage-card${index === 0 ? " is-active" : ""}" data-globe-stage="${index}"><p class="eyebrow">${index === 0 ? "Brand Introduction" : "Project Stage"}</p><h2>${stage.name}</h2><p>${stage.statusClass ? `<span class="status status-${stage.statusClass}"><span class="status-dot" aria-hidden="true"></span><span>${stage.statusText}</span></span>` : stage.statusText}</p><a class="text-link" href="${stage.href}"${stage.external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${stage.cta}</a></article>`)
    .join("");
  const previewProjects = projects
    .map((project) => `<article class="project-card"><div><h3>${project.name}</h3>${status(project)}<p>${project.description}</p></div><div class="card-actions"><a class="text-link" href="/projects/${project.slug}/">View details</a>${launch(project)}</div></article>`)
    .join("");

  return layout({
    route: "/",
    current: "/",
    title: "Lucente Corporate | Sahaan Kesavan and Farris Zaman",
    description:
      "Lucente Corporate is a Sydney-based technology brand founded by Sahaan Kesavan and Farris Zaman, creating Lucente QR, Lucente Calendar and Lucente Admin.",
    jsonLd: [organizationSchema(), websiteSchema(), ...personSchemas()],
    pageClass: "home-page",
    children: `
    <section class="globe-hero" data-globe-hero>
      <div class="grain"></div>
      <div class="container globe-layout">
        <div class="globe-copy">
          <p class="eyebrow">Sydney Technology Brand</p>
          <h1>Digital products for everyday ideas.</h1>
          <p class="lead">Lucente Corporate is an independent technology brand founded in 2025 by <a href="/founders/sahaan-kesavan/">Sahaan Kesavan</a> and <a href="/founders/farris-zaman/">Farris Zaman</a>. Based in Sydney, Australia, Lucente creates practical applications, digital products and flexible technology and design services.</p>
          <div class="hero-actions"><a class="button primary" href="/projects/">View Projects</a><a class="button secondary" href="/services/">Explore Services</a></div>
        </div>
        <div class="globe-panel" aria-label="Lucente project globe sequence">
          <div class="lucente-globe" data-globe-visual aria-hidden="true"><span class="globe-brand">Lucente</span><span class="orbit orbit-one"></span><span class="orbit orbit-two"></span><span class="orbit orbit-three"></span></div>
          <div class="globe-stages" aria-label="Globe stages">${stageHtml}</div>
        </div>
      </div>
      <div class="container globe-html-fallback" aria-label="Accessible project status summary">${stageHtml}</div>
    </section>
    <section class="section light reveal"><div class="container split"><div><p class="eyebrow">Who We Are</p><h2>A practical technology brand for modern online tools.</h2></div><div><p class="lead">${site.shortDescription}</p><p>${site.purpose}</p><p>Its official projects are <a href="/projects/lucente-qr/">Lucente QR</a>, <a href="/projects/lucente-calendar/">Lucente Calendar</a> and <a href="/projects/lucente-admin/">Lucente Admin</a>.</p><div class="cta-row"><a class="button gold" href="/about/">Learn about Lucente Corporate</a><a class="button secondary dark" href="/faq/">Read FAQ</a></div></div></div></section>
    <section class="section reveal"><div class="container split"><div><p class="eyebrow">Services</p><h2>Flexible technology and design services.</h2><p class="body-copy">Lucente supports digital ideas across product planning, interface design, web and app development, and online presence.</p><a class="text-link" href="/services/">View all services</a></div><div class="service-grid compact">${services.slice(0, 3).map((service) => `<article class="service-card"><h3>${service.name}</h3><p>${service.description}</p></article>`).join("")}</div></div></section>
    <section class="section light reveal"><div class="container"><p class="eyebrow">Projects</p><h2>Live and developing Lucente products.</h2><div class="project-grid">${previewProjects}</div></div></section>
    <section class="section reveal"><div class="container founder-grid">${founders.map((founder) => `<article class="founder-card">${monogram(founder.monogram)}<p class="eyebrow">${founder.role}</p><h2>${founder.name}</h2><p>${founder.description}</p><a class="text-link" href="/founders/${founder.slug}/">View Profile ↗</a></article>`).join("")}</div></section>
    <section class="section olive reveal"><div class="container split"><div><p class="eyebrow">Contact</p><h2>Start a conversation with Lucente.</h2></div><div><p class="lead">For projects, product ideas, collaborations or questions, contact Lucente Corporate through the direct email link.</p><div class="cta-row"><a class="button primary" href="/contact/">Contact Lucente</a><a class="button secondary" href="/faq/">Open FAQ</a></div></div></div></section>`
  });
}

function aboutPage() {
  return layout({
    route: "/about/",
    current: "/about/",
    title: "About Lucente Corporate | Sahaan Kesavan and Farris Zaman",
    description:
      "Learn about Lucente Corporate, a Sydney-based technology brand founded in 2025 by Sahaan Kesavan and Farris Zaman.",
    jsonLd: [organizationSchema(), ...personSchemas()],
    children: `${pageTitle({ eyebrow: "About Lucente Corporate", h1: "A Sydney-based technology brand for practical digital products.", lead: `${site.shortDescription} ${site.purpose}` })}
    <section class="section light"><div class="container stack"><article class="info-block"><h2>What Lucente Corporate is</h2><p>Lucente Corporate is an independent technology brand founded in 2025 by <a href="/founders/sahaan-kesavan/">Sahaan Kesavan</a> and <a href="/founders/farris-zaman/">Farris Zaman</a>. It is based in Sydney, Australia.</p></article><article class="info-block"><h2>Purpose and approach</h2><p>${site.purpose}</p><p>Lucente focuses on clear planning, careful interface design, accessible implementation and practical online experiences for individuals, teams and organisations.</p></article><article class="info-block"><h2>Official Lucente projects</h2><p>Lucente Corporate currently lists <a href="/projects/lucente-qr/">Lucente QR</a>, <a href="/projects/lucente-calendar/">Lucente Calendar</a> and <a href="/projects/lucente-admin/">Lucente Admin</a> as its real projects.</p></article><article class="info-block"><h2>Explore Lucente</h2><div class="cta-row"><a class="button gold" href="/founders/">Meet the founders</a><a class="button secondary dark" href="/projects/">View projects</a><a class="button secondary dark" href="/services/">View services</a></div></article></div></section>`
  });
}

function servicesPage() {
  const cards = services.map((service) => `<article class="service-card"><h2>${service.name}</h2><p>${service.description}</p><p><strong>Example:</strong> ${service.example}</p><a class="text-link" href="/contact/">Enquire about this service</a></article>`).join("");
  return layout({
    route: "/services/",
    current: "/services/",
    title: "Technology and Digital Services | Lucente Corporate",
    description: "Explore Lucente Corporate services including web and app development, digital product development, UI and UX design, technology planning and digital branding.",
    children: `${pageTitle({ eyebrow: "Services", h1: "Technology and digital services for practical ideas.", lead: "Lucente offers flexible development, product, design and planning services without fixed packages, pricing claims or exaggerated guarantees." })}
    <section class="section"><div class="container service-grid">${cards}</div></section>`
  });
}

function projectsPage() {
  const cards = projects.map((project) => `<article class="project-card"><div><h2>${project.name}</h2>${status(project)}<p>${project.description}</p></div><div class="card-actions"><a class="text-link" href="/projects/${project.slug}/">Project details</a>${launch(project)}</div></article>`).join("");
  return layout({
    route: "/projects/",
    current: "/projects/",
    title: "Lucente Corporate Projects | Calendar, Admin and QR",
    description: "Explore Lucente Admin, Lucente Calendar and Lucente QR, the real projects currently listed under Lucente Corporate.",
    children: `${pageTitle({ eyebrow: "Projects", h1: "Lucente Corporate projects.", lead: "Only real Lucente projects are listed here: Lucente QR, Lucente Calendar and Lucente Admin." })}
    <section class="section"><div class="container project-grid">${cards}</div></section>`
  });
}

function projectPage(project) {
  const route = `/projects/${project.slug}/`;
  const crumbItems = [{ label: "Home", href: "/" }, { label: "Projects", href: "/projects/" }, { label: project.name }];
  const body = `${pageTitle({ eyebrow: "Project", h1: project.name, lead: project.description, actions: `<div class="cta-row">${status(project)}${launch(project)}</div>` })}
    <section class="section light"><div class="container two-col"><div class="stack">${breadcrumbs(crumbItems)}${project.notice ? `<article class="notice"><h2>Development notice</h2><p>${project.notice}</p></article>` : ""}<article class="info-block"><h2>Why it was created</h2><p>${project.purpose}</p></article><article class="info-block"><h2>Everyday problem it addresses</h2><p>${projectProblem(project)}</p></article><article class="info-block"><h2>What users can do</h2><ul>${project.features.map((feature) => `<li>${feature}</li>`).join("")}</ul></article></div><div class="stack"><article class="info-block"><h2>Current status</h2><p>${project.availability}</p>${status(project)}</article><article class="info-block"><h2>How it fits within Lucente Corporate</h2><p>${projectConnection(project)}</p><p>Learn more about <a href="/founders/sahaan-kesavan/">Sahaan Kesavan</a>, <a href="/founders/farris-zaman/">Farris Zaman</a> and the <a href="/projects/">Lucente Corporate project list</a>.</p></article><article class="info-block"><h2>Project links</h2><div class="cta-row">${launch(project)}<a class="button secondary dark" href="/projects/">Back to all projects</a></div></article></div></div></section>`;
  return layout({
    route,
    current: "/projects/",
    title: `${project.name} | Project by Lucente Corporate`,
    description: project.description,
    jsonLd: [organizationSchema(), projectSchema(project), breadcrumbSchema(route, crumbItems)],
    children: body
  });
}

function foundersPage() {
  const cards = founders.map((founder) => `<article class="founder-card">${monogram(founder.monogram)}<h2>${founder.name}</h2><p class="eyebrow">${founder.role}</p><p>${founder.location}</p><p>${founder.description}</p><div class="card-actions"><a class="button primary" href="/founders/${founder.slug}/">View Profile ↗</a><a class="button secondary" href="mailto:${site.email}">Contact Lucente ↗</a></div></article>`).join("");
  return layout({
    route: "/founders/",
    current: "/founders/",
    title: "Founders of Lucente Corporate | Sahaan Kesavan and Farris Zaman",
    description: "Meet Sahaan Kesavan and Farris Zaman, the co-founders of Lucente Corporate.",
    jsonLd: [organizationSchema(), ...personSchemas()],
    children: `${pageTitle({ eyebrow: "Founders", h1: "Founded by Sahaan Kesavan and Farris Zaman.", lead: "Lucente Corporate is jointly founded by Sahaan Kesavan and Farris Zaman, with clear responsibilities across product development, strategy, planning and marketing." })}
    <section class="section light"><div class="container founder-grid">${cards}</div></section>`
  });
}

function founderPage(founder) {
  const route = `/founders/${founder.slug}/`;
  const crumbItems = [{ label: "Home", href: "/" }, { label: "Founders", href: "/founders/" }, { label: founder.name }];
  const otherFounder = founders.find((item) => item.slug !== founder.slug);
  const description = founder.slug === "sahaan-kesavan"
    ? "Sahaan Kesavan is the Co-Founder and Product Development Lead of Lucente Corporate, leading application development, technical delivery and product planning."
    : "Farris Zaman is the Co-Founder and Strategy and Marketing Lead of Lucente Corporate, leading marketing, planning, brand direction and product strategy.";
  return layout({
    route,
    current: "/founders/",
    title: `${founder.name} | Co-Founder of Lucente Corporate`,
    description,
    jsonLd: [organizationSchema(), founderSchema(founder), breadcrumbSchema(route, crumbItems)],
    children: `${pageTitle({ eyebrow: "Founder Profile", h1: founder.name, lead: founder.description })}
    <section class="section light"><div class="container two-col"><div class="stack">${breadcrumbs(crumbItems)}${monogram(founder.monogram)}<a class="button primary" href="mailto:${site.email}">Contact Lucente ↗</a><a class="text-link" href="/founders/">Back to Founders</a></div><div class="stack"><article class="info-block"><h2>Professional role</h2><p>${founder.role}</p><p>${founder.location}</p></article><article class="info-block"><h2>Role at Lucente</h2><ul>${founder.responsibilities.map((item) => `<li>${item}</li>`).join("")}</ul></article><article class="info-block"><h2>Connection to Lucente Corporate</h2><p>${founder.name} is a co-founder of Lucente Corporate, the independent technology brand founded in 2025 by Sahaan Kesavan and Farris Zaman.</p></article><article class="info-block"><h2>Related Lucente links</h2><div class="cta-row"><a class="button secondary dark" href="/founders/${otherFounder.slug}/">About ${otherFounder.name}</a><a class="button secondary dark" href="/projects/">View Projects</a></div></article></div></div></section>`
  });
}

function faqPage() {
  const visibleFaq = faq.map((item) => `<details class="faq-item"><summary>${item.question}</summary><p>${item.answer}</p></details>`).join("");
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } }))
  };
  return layout({
    route: "/faq/",
    current: "/faq/",
    title: "Lucente Corporate FAQ",
    description: "Answers about Lucente Corporate, its founders, location, services, projects and contact details.",
    jsonLd: [schema],
    children: `${pageTitle({ eyebrow: "FAQ", h1: "Questions about Lucente Corporate.", lead: "Clear answers about Lucente Corporate, its founders, services, projects and current status." })}
    <section class="section light"><div class="container faq-list">${visibleFaq}</div></section>`
  });
}

function contactPage() {
  return layout({
    route: "/contact/",
    current: "/contact/",
    title: "Contact Lucente Corporate",
    description: "Contact Lucente Corporate for general enquiries, project conversations, collaborations and questions about Lucente products.",
    children: `${pageTitle({ eyebrow: "Contact", h1: "Contact Lucente Corporate", lead: "For general enquiries, project ideas, collaborations or questions about Lucente Corporate, contact us by email." })}
    <section class="section"><div class="container contact-simple"><article class="info-block"><h2>Email</h2><p><a class="email-display" href="mailto:${site.email}">${site.email}</a></p><a class="button primary" href="mailto:${site.email}">Email Lucente ↗</a></article></div></section>`
  });
}

function privacyPage() {
  return layout({
    route: "/privacy/",
    current: "/privacy/",
    title: "Privacy Policy | Lucente Corporate",
    description: "Privacy information for Lucente Corporate website visitors.",
    children: `${pageTitle({ eyebrow: "Privacy Policy", h1: "Privacy information for Lucente Corporate.", lead: "Last updated: 17 July 2026." })}
    <section class="section light"><div class="container stack"><article class="info-block"><h2>Direct email contact</h2><p>The website does not currently operate a contact form. Visitors may contact Lucente Corporate directly through the email link provided on this website. Emails are handled through the sender’s and recipient’s email providers and are subject to those providers’ privacy practices.</p></article><article class="info-block"><h2>Information you choose to send</h2><p>If you email Lucente Corporate, your email may include your name, email address and any details you choose to include in the message.</p></article><article class="info-block"><h2>Website hosting</h2><p>The website is hosted on Vercel, which may process technical hosting logs needed to operate, secure and protect the site.</p></article><article class="info-block"><h2>Analytics and cookies</h2><p>No analytics package is present in this repository.</p></article><article class="info-block"><h2>Retention and control</h2><p>Emails may be retained for a reasonable period to respond and keep relevant project context. To request access or deletion, email <a class="text-link" href="mailto:${site.email}">${site.email}</a>.</p></article><article class="info-block"><h2>Important limits</h2><p>Lucente Corporate does not sell personal information. Users should not send sensitive personal information by email unless necessary.</p></article></div></section>`
  });
}

function notFoundPage() {
  return `${meta({ title: "Page Not Found | Lucente Corporate", description: "The requested Lucente Corporate page could not be found.", route: "/404.html" })}
<body>
  ${nav("")}
  <main id="main">${pageTitle({ eyebrow: "404", h1: "Page not found.", lead: "The page you are looking for may have moved or does not exist.", actions: '<div class="cta-row"><a class="button primary" href="/">Return Home</a><a class="button secondary" href="/projects/">View Projects</a></div>' })}</main>
  ${footer()}
</body>
</html>`;
}

function sitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${requiredRoutes.map((route) => `  <url><loc>${absolute(route)}</loc></url>`).join("\n")}
</urlset>
`;
}

function robots() {
  return `User-agent: *
Allow: /

Sitemap: ${site.domain}/sitemap.xml
`;
}

function generate() {
  for (const stale of ["projects/vyntra-connect", "projects/spendly", "projects/study-pilot-ai", "projects/nover-education"]) {
    rmSync(stale, { recursive: true, force: true });
  }

  writePage("/", homePage());
  writePage("/about/", aboutPage());
  writePage("/services/", servicesPage());
  writePage("/projects/", projectsPage());
  for (const project of projects) writePage(`/projects/${project.slug}/`, projectPage(project));
  writePage("/founders/", foundersPage());
  for (const founder of founders) writePage(`/founders/${founder.slug}/`, founderPage(founder));
  writePage("/faq/", faqPage());
  writePage("/contact/", contactPage());
  writePage("/privacy/", privacyPage());
  writeFileSync("404.html", notFoundPage());
  writeFileSync("sitemap.xml", sitemap());
  writeFileSync("robots.txt", robots());
}

generate();
