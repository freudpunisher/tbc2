// Utility functions for API calls

// Products
export async function getProducts(options?: {
  category?: string
  isBestseller?: boolean
  isNew?: boolean
}) {
  const params = new URLSearchParams()

  if (options?.category) {
    params.append("category", options.category)
  }

  if (options?.isBestseller) {
    params.append("bestseller", "true")
  }

  if (options?.isNew) {
    params.append("new", "true")
  }

  const queryString = params.toString() ? `?${params.toString()}` : ""
  const response = await fetch(`/api/products${queryString}`)

  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }

  return response.json()
}

export async function getProductById(id: number) {
  const response = await fetch(`/api/products/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch product")
  }

  return response.json()
}

// Carousel Images
export async function getCarouselImages() {
  const response = await fetch("/api/carousel")

  if (!response.ok) {
    throw new Error("Failed to fetch carousel images")
  }

  return response.json()
}

// Team Members
export async function getTeamMembers() {
  const response = await fetch("/api/team")

  if (!response.ok) {
    throw new Error("Failed to fetch team members")
  }

  return response.json()
}

// Milestones
export async function getMilestones() {
  const response = await fetch("/api/milestones")

  if (!response.ok) {
    throw new Error("Failed to fetch milestones")
  }

  return response.json()
}

// Company Values
export async function getCompanyValues() {
  const response = await fetch("/api/values")

  if (!response.ok) {
    throw new Error("Failed to fetch company values")
  }

  return response.json()
}

// Contact Info
export async function getContactInfo(type?: string) {
  const params = new URLSearchParams()

  if (type) {
    params.append("type", type)
  }

  const queryString = params.toString() ? `?${params.toString()}` : ""
  const response = await fetch(`/api/contact${queryString}`)

  if (!response.ok) {
    throw new Error("Failed to fetch contact info")
  }

  return response.json()
}

// FAQ Items
export async function getFaqItems(category?: string) {
  const params = new URLSearchParams()

  if (category) {
    params.append("category", category)
  }

  const queryString = params.toString() ? `?${params.toString()}` : ""
  const response = await fetch(`/api/faq${queryString}`)

  if (!response.ok) {
    throw new Error("Failed to fetch FAQ items")
  }

  return response.json()
}

// About Content
export async function getAboutContent(section?: string) {
  const params = new URLSearchParams()

  if (section) {
    params.append("section", section)
  }

  const queryString = params.toString() ? `?${params.toString()}` : ""
  const response = await fetch(`/api/about${queryString}`)

  if (!response.ok) {
    throw new Error("Failed to fetch about content")
  }

  return response.json()
}
