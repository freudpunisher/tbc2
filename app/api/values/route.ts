import { NextResponse } from "next/server"
import { db } from "@/db"
import { companyValues } from "@/db/schema"

export async function GET() {
  try {
    const values = await db.select().from(companyValues).orderBy(companyValues.order)
    return NextResponse.json(values)
  } catch (error) {
    console.error("Error fetching company values:", error)
    return NextResponse.json({ error: "Failed to fetch company values" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await db.insert(companyValues).values(body)
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    console.error("Error creating company value:", error)
    return NextResponse.json({ error: "Failed to create company value" }, { status: 500 })
  }
}
