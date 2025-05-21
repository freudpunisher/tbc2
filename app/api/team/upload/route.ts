import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid" // You'll need to install this: npm install uuid @types/uuid

// Handle image upload for team members
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }
    
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Only JPG, PNG, WebP and GIF are allowed" 
      }, { status: 400 })
    }
    
    // Create a unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Get file extension from the MIME type
    const extension = file.type.split("/")[1]
    const filename = `${uuidv4()}.${extension}`
    
    // Define path where the image will be saved
    // This assumes you have a public/uploads directory in your project
    const uploadDir = join(process.cwd(), "public", "uploads", "team")
    const path = join(uploadDir, filename)
    
    // Write the file to the server
    await writeFile(path, buffer)
    
    // Return the URL path to the saved image
    const imageUrl = `/uploads/team/${filename}`
    
    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "File upload failed" }, { status: 500 })
  }
}