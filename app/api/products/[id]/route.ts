import { NextResponse } from "next/server"
import { db } from "@/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const idNum = Number.parseInt(id, 10)

    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, idNum))

    if (result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. await the params
    const { id } = await context.params
    const idNum = Number.parseInt(id, 10)

    // 2. parse the JSON
    const body = await request.json()

    // 3. if you have any date fields, convert them back to Date:
    //    e.g. if your schema has a `released_at` column:
    if (body.released_at) {
      body.released_at = new Date(body.released_at)
    }

    // 4. perform the update
    await db
      .update(products)
      .set(body)
      .where(eq(products.id, idNum))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const idNum = Number.parseInt(id, 10)

    await db
      .delete(products)
      .where(eq(products.id, idNum))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
