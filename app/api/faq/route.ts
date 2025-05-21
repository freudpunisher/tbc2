import { NextResponse } from "next/server"
import { db } from "@/db"
import { faqItems } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let query = db.select().from(faqItems)

    if (category) {
      query = query.where(eq(faqItems.category, category))
    }

    const result = await query.orderBy(faqItems.order)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching FAQ items:", error)
    return NextResponse.json({ error: "Failed to fetch FAQ items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await db.insert(faqItems).values(body)
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    console.error("Error creating FAQ item:", error)
    return NextResponse.json({ error: "Failed to create FAQ item" }, { status: 500 })
  }
}
