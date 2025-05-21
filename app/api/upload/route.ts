// 1. First, create a directory for uploads
// In your project root, create a "public/uploads" directory
// Next.js automatically serves files from the public directory

// 2. Create an API route to handle file uploads
// Create a file at: app/api/upload/route.ts (or .js if not using TypeScript)

import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

export async function POST(request: { formData: () => any; }) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public/uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.log('Directory already exists or cannot be created');
    }
    
    // Generate unique filename to prevent overwriting
    const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = join(uploadDir, uniqueFilename);
    
    // Write the file to the uploads directory
    await writeFile(filePath, buffer);
    
    // Return the public URL path (not the server file path)
    const fileUrl = `/uploads/${uniqueFilename}`;
    
    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}