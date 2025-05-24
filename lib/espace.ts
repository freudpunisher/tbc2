// lib/espaces.ts
export async function getAllEspaceSlugs(): Promise<string[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/espaces`)
    const data: { slug: string }[] = await res.json()
    return data.map((e) => e.slug)
  }
  
  export async function getEspaceBySlug(slug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/espaces/${slug}`)
    if (!res.ok) return null
    return res.json()
  }
  