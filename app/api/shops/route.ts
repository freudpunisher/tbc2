import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { shops } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location")

    let query = db.select().from(shops)

    if (location) {
      query = query.where(eq(shops.location, location))
    }

    const allShops = await query.orderBy(shops.name)

    return NextResponse.json(allShops)
  } catch (error) {
    console.error("Error fetching shops:", error)
    return NextResponse.json({ error: "Failed to fetch shops" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const [shop] = await db.insert(shops).values(body).$returningId()

    return NextResponse.json(shop, { status: 201 })
  } catch (error) {
    console.error("Error creating shop:", error)
    return NextResponse.json({ error: "Failed to create shop" }, { status: 500 })
  }
}
