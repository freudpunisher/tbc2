import { NextResponse } from "next/server"
import { db } from "@/db"
import { contactInfo } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    
    let query = db.select().from(contactInfo)
    
    if (type) {
      query = query.where(eq(contactInfo.type, type))
    }
    
    const result = await query.orderBy(contactInfo.order)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching contact info:", error)
    return NextResponse.json({ error: "Failed to fetch contact info" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await db.insert(contactInfo).values(body)
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    console.error("Error creating contact info:", error)
    return NextResponse.json({ error: "Failed to create contact info" }, { status: 500 })
  }
}