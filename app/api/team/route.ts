import { NextResponse } from "next/server"
import { db } from "@/db"
import { teamMembers } from "@/db/schema"
import { eq } from "drizzle-orm"

// Get all team members
export async function GET() {
  try {
    const team = await db.select().from(teamMembers).orderBy(teamMembers.order)
    return NextResponse.json(team)
  } catch (error) {
    console.error("Error fetching team members:", error)
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 })
  }
}

// Create a new team member
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.position) {
      return NextResponse.json(
        { error: "Name and position are required" },
        { status: 400 }
      )
    }
    
    const result = await db.insert(teamMembers).values(body)
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    console.error("Error creating team member:", error)
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 })
  }
}