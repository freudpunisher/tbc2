import { NextResponse } from "next/server"
import { db } from "@/db"
import { milestones } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const body = await request.json()
    await db.update(milestones)
      .set(body)
      .where(eq(milestones.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating milestone:", error)
    return NextResponse.json({ error: "Failed to update milestone" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    await db.delete(milestones).where(eq(milestones.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting milestone:", error)
    return NextResponse.json({ error: "Failed to delete milestone" }, { status: 500 })
  }
}