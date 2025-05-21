import { NextResponse } from "next/server"
import { db } from "@/db"
import { milestones } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const body = await request.json()
    if (!body.order || typeof body.order !== "number") {
      return NextResponse.json({ error: "Order is required and must be a number" }, { status: 400 })
    }

    await db.update(milestones)
      .set({ order: body.order })
      .where(eq(milestones.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error reordering milestone:", error)
    return NextResponse.json({ error: "Failed to reorder milestone" }, { status: 500 })
  }
}