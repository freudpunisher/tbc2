import { NextResponse } from "next/server"
import { db } from "@/db"
import { contactInfo } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const result = await db
      .select()
      .from(contactInfo)
      .where(eq(contactInfo.id, id))
      .limit(1)

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Contact info not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching contact info:", error)
    return NextResponse.json({ error: "Failed to fetch contact info" }, { status: 500 })
  }
}

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
    
    // Check if item exists
    const existing = await db
      .select({ id: contactInfo.id })
      .from(contactInfo)
      .where(eq(contactInfo.id, id))
      .limit(1)

    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: "Contact info not found" }, { status: 404 })
    }

    await db
      .update(contactInfo)
      .set(body)
      .where(eq(contactInfo.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating contact info:", error)
    return NextResponse.json({ error: "Failed to update contact info" }, { status: 500 })
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

    // Check if item exists
    const existing = await db
      .select({ id: contactInfo.id })
      .from(contactInfo)
      .where(eq(contactInfo.id, id))
      .limit(1)

    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: "Contact info not found" }, { status: 404 })
    }

    await db
      .delete(contactInfo)
      .where(eq(contactInfo.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting contact info:", error)
    return NextResponse.json({ error: "Failed to delete contact info" }, { status: 500 })
  }
}