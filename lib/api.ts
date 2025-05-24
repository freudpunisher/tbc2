// lib/api.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!BASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_API_BASE_URL in your .env.local')
}

async function handleFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, init)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error (${res.status}): ${text}`)
  }
  return res.json()
}

// Products
export function getProducts(options?: {
  category?: string
  isBestseller?: boolean
  isNew?: boolean
}) {
  const params = new URLSearchParams()
  if (options?.category)    params.append("category", options.category)
  if (options?.isBestseller) params.append("bestseller", "true")
  if (options?.isNew)        params.append("new",        "true")
  const qs = params.toString() ? `?${params}` : ""
  return handleFetch(`/api/products${qs}`)
}

export function getProductById(id: number) {
  return handleFetch(`/api/products/${id}`)
}

// Carousel Images
export function getCarouselImages() {
  return handleFetch("/api/carousel/active")
}

// Team Members
export function getTeamMembers() {
  return handleFetch("/api/team")
}

// Milestones
export function getMilestones() {
  return handleFetch("/api/milestones")
}

// Company Values
export function getCompanyValues() {
  return handleFetch("/api/values")
}

// Contact Info
export function getContactInfo(type?: string) {
  const params = new URLSearchParams()
  if (type) params.append("type", type)
  const qs = params.toString() ? `?${params}` : ""
  return handleFetch(`/api/contact${qs}`)
}

// FAQ Items
export function getFaqItems(category?: string) {
  const params = new URLSearchParams()
  if (category) params.append("category", category)
  const qs = params.toString() ? `?${params}` : ""
  return handleFetch(`/api/faq${qs}`)
}

// About Content
export function getAboutContent(section?: string) {
  const params = new URLSearchParams()
  if (section) params.append("section", section)
  const qs = params.toString() ? `?${params}` : ""
  return handleFetch(`/api/about${qs}`)
}
