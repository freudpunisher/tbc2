import { NextResponse } from "next/server"
import { db } from "@/db"
import { milestones } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const result = await db.select().from(milestones).orderBy(milestones.order)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching milestones:", error)
    return NextResponse.json({ error: "Failed to fetch milestones" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await db.insert(milestones).values(body)
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    console.error("Error creating milestone:", error)
    return NextResponse.json({ error: "Failed to create milestone" }, { status: 500 })
  }
}