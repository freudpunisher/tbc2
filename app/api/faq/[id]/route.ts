// app/api/faq/[id]/route.ts
import { NextResponse } from "next/server"
import { db } from "@/db"
import { faqItems } from "@/db/schema"
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

    const result = await db.select().from(faqItems).where(eq(faqItems.id, id))
    
    if (result.length === 0) {
      return NextResponse.json({ error: "FAQ item not found" }, { status: 404 })
    }
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Error fetching FAQ item ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch FAQ item" }, { status: 500 })
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
    
    // Make sure the ID in the path matches the body ID
    if (body.id !== id) {
      return NextResponse.json(
        { error: "ID in path does not match ID in body" },
        { status: 400 }
      )
    }
    
    await db.update(faqItems)
      .set({
        question: body.question,
        answer: body.answer,
        category: body.category,
        order: body.order
      })
      .where(eq(faqItems.id, id))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error updating FAQ item ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update FAQ item" }, { status: 500 })
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

    await db.delete(faqItems).where(eq(faqItems.id, id))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting FAQ item ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete FAQ item" }, { status: 500 })
  }
}