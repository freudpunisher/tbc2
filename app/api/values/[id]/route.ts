// Single value endpoint handler
import { NextResponse } from "next/server"
import { db } from "@/db"
import { companyValues } from "@/db/schema"
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

    const value = await db
      .select()
      .from(companyValues)
      .where(eq(companyValues.id, id))
      .limit(1)
    
    if (!value.length) {
      return NextResponse.json({ error: "Company value not found" }, { status: 404 })
    }

    return NextResponse.json(value[0])
  } catch (error) {
    console.error("Error fetching company value:", error)
    return NextResponse.json(
      { error: "Failed to fetch company value" },
      { status: 500 }
    )
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
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    await db
      .update(companyValues)
      .set(body)
      .where(eq(companyValues.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating company value:", error)
    return NextResponse.json(
      { error: "Failed to update company value" },
      { status: 500 }
    )
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

    await db
      .delete(companyValues)
      .where(eq(companyValues.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting company value:", error)
    return NextResponse.json(
      { error: "Failed to delete company value" },
      { status: 500 }
    )
  }
}