import { NextResponse } from "next/server"
import { db } from "@/db"
import { aboutContent } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get("section")

    let query = db.select().from(aboutContent)

    if (section) {
      query = query.where(eq(aboutContent.section, section))
    }

    const result = await query
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching about content:", error)
    return NextResponse.json({ error: "Failed to fetch about content" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await db.insert(aboutContent).values(body)
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    console.error("Error creating about content:", error)
    return NextResponse.json({ error: "Failed to create about content" }, { status: 500 })
  }
}
