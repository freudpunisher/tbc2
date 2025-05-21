import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { shops, shopStaff } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const [shop] = await db.select().from(shops).where(eq(shops.id, id))

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 })
    }

    // Get staff for this shop
    const staff = await db.select().from(shopStaff).where(eq(shopStaff.shopId, id))

    return NextResponse.json({ ...shop, staff })
  } catch (error) {
    console.error("Error fetching shop:", error)
    return NextResponse.json({ error: "Failed to fetch shop" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    await db.update(shops).set(body).where(eq(shops.id, id))
    const [shop] = await db.select().from(shops).where(eq(shops.id, id))

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 })
    }

    return NextResponse.json(shop)
  } catch (error) {
    console.error("Error updating shop:", error)
    return NextResponse.json({ error: "Failed to update shop" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    await db.delete(shops).where(eq(shops.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting shop:", error)
    return NextResponse.json({ error: "Failed to delete shop" }, { status: 500 })
  }
}
