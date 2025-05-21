import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { publiciteVideos } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    let query = db.select().from(publiciteVideos)

    if (type) {
      query = query.where(eq(publiciteVideos.type, type))
    }

    const videos = await query

    return NextResponse.json(videos)
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const [video] = await db.insert(publiciteVideos).values(body).$returningId()

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error("Error creating video:", error)
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 })
  }
}
