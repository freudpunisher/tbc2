// Place this in /app/api/about/[id]/route.ts
import { NextResponse } from "next/server"
import { db } from "@/db"
import { aboutContent } from "@/db/schema"
import { eq } from "drizzle-orm"

// Get a specific about content item by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }
    
    const result = await db.select().from(aboutContent).where(eq(aboutContent.id, id))
    
    if (!result.length) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching about content:", error)
    return NextResponse.json({ error: "Failed to fetch about content" }, { status: 500 })
  }
}

// Update a specific about content item by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }
    
    const body = await request.json()
    
    // Check if content exists
    const existing = await db.select().from(aboutContent).where(eq(aboutContent.id, id))
    
    if (!existing.length) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }
    
    // Update the content
    await db.update(aboutContent)
      .set({
        title: body.title || null,
        content: body.content || null,
        imageUrl: body.imageUrl || null
        // section is not updated as it's the identifier for the content type
      })
      .where(eq(aboutContent.id, id))
    
    // Return the updated content
    return NextResponse.json({ 
      id, 
      section: existing[0].section,
      title: body.title || null,
      content: body.content || null,
      imageUrl: body.imageUrl || null
    })
  } catch (error) {
    console.error("Error updating about content:", error)
    return NextResponse.json({ error: "Failed to update about content" }, { status: 500 })
  }
}

// Delete a specific about content item by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }
    
    // Check if content exists
    const existing = await db.select().from(aboutContent).where(eq(aboutContent.id, id))
    
    if (!existing.length) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }
    
    // Delete the content
    await db.delete(aboutContent).where(eq(aboutContent.id, id))
    
    return NextResponse.json({ 
      success: true,
      message: `Content with ID ${id} has been deleted`
    })
  } catch (error) {
    console.error("Error deleting about content:", error)
    return NextResponse.json({ error: "Failed to delete about content" }, { status: 500 })
  }
}