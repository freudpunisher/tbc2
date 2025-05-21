import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { teamMembers } from "@/db/schema"
import { eq } from "drizzle-orm"

interface Params {
  params: {
    id: string
  }
}

// Get a specific team member
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }
    
    const member = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1)
    
    if (!member || member.length === 0) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }
    
    return NextResponse.json(member[0])
  } catch (error) {
    console.error("Error fetching team member:", error)
    return NextResponse.json({ error: "Failed to fetch team member" }, { status: 500 })
  }
}

// Update a team member (completely replace)
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.position) {
      return NextResponse.json(
        { error: "Name and position are required" },
        { status: 400 }
      )
    }
    
    // Check if member exists
    const existingMember = await db.select({ id: teamMembers.id })
      .from(teamMembers)
      .where(eq(teamMembers.id, id))
      .limit(1)
    
    if (!existingMember || existingMember.length === 0) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }
    
    // Update the member
    const result = await db.update(teamMembers)
      .set(body)
      .where(eq(teamMembers.id, id))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating team member:", error)
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 })
  }
}

// Partially update a team member
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }
    
    const body = await request.json()
    
    // Check if member exists
    const existingMember = await db.select({ id: teamMembers.id })
      .from(teamMembers)
      .where(eq(teamMembers.id, id))
      .limit(1)
    
    if (!existingMember || existingMember.length === 0) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }
    
    // Update only the provided fields
    const result = await db.update(teamMembers)
      .set(body)
      .where(eq(teamMembers.id, id))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating team member:", error)
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 })
  }
}

// Delete a team member
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }
    
    // Check if member exists
    const existingMember = await db.select({ id: teamMembers.id })
      .from(teamMembers)
      .where(eq(teamMembers.id, id))
      .limit(1)
    
    if (!existingMember || existingMember.length === 0) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }
    
    // Delete the member
    await db.delete(teamMembers).where(eq(teamMembers.id, id))
    
    // Optional: Reorder the remaining members to ensure continuous ordering
    const remainingMembers = await db.select().from(teamMembers).orderBy(teamMembers.order)
    
    // Update order for remaining members if needed
    for (let i = 0; i < remainingMembers.length; i++) {
      if (remainingMembers[i].order !== i + 1) {
        await db.update(teamMembers)
          .set({ order: i + 1 })
          .where(eq(teamMembers.id, remainingMembers[i].id))
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting team member:", error)
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 })
  }
}