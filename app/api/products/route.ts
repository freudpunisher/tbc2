import { NextResponse } from "next/server"
import { db } from "@/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const category = searchParams.get("category")
    const isBestseller = searchParams.get("bestseller") === "true"
    const isNew = searchParams.get("new") === "true"

    let query = db.select().from(products)

    if (id) {
      query = query.where(eq(products.id, Number.parseInt(id)))
    }

    if (category) {
      query = query.where(eq(products.category, category))
    }

    if (isBestseller) {
      query = query.where(eq(products.isBestseller, true))
    }

    if (isNew) {
      query = query.where(eq(products.isNew, true))
    }

    const result = await query
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await db.insert(products).values(body)
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
