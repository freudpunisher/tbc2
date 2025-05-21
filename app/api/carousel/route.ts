import { NextResponse } from "next/server"
import { db } from "@/db"
import { carouselImages } from "@/db/schema"

export async function GET() {
  try {
    const images = await db.select().from(carouselImages).orderBy(carouselImages.order)
    return NextResponse.json(images)
  } catch (error) {
    console.error("Error fetching carousel images:", error)
    return NextResponse.json({ error: "Failed to fetch carousel images" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await db.insert(carouselImages).values(body)
    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    console.error("Error creating carousel image:", error)
    return NextResponse.json({ error: "Failed to create carousel image" }, { status: 500 })
  }
}
