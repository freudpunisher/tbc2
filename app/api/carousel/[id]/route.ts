import { NextResponse } from "next/server"
import { db } from "@/db"
import { carouselImages } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await the entire params object
    const resolvedParams = params instanceof Promise ? await params : params
    const id = parseInt(resolvedParams.id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }
    
    const [image] = await db
      .select()
      .from(carouselImages)
      .where(eq(carouselImages.id, id))
    
    if (!image) {
      return NextResponse.json({ error: "Carousel image not found" }, { status: 404 })
    }
    
    return NextResponse.json(image)
  } catch (error) {
    console.error("Error fetching carousel image:", error)
    return NextResponse.json({ error: "Failed to fetch carousel image" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await the entire params object
    const resolvedParams = params instanceof Promise ? await params : params
    const id = parseInt(resolvedParams.id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }
    
    const body = await request.json()
    
    await db
      .update(carouselImages)
      .set(body)
      .where(eq(carouselImages.id, id))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating carousel image:", error)
    return NextResponse.json({ error: "Failed to update carousel image" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await the entire params object
    const resolvedParams = params instanceof Promise ? await params : params
    const id = parseInt(resolvedParams.id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }
    
    await db
      .delete(carouselImages)
      .where(eq(carouselImages.id, id))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting carousel image:", error)
    return NextResponse.json({ error: "Failed to delete carousel image" }, { status: 500 })
  }
}