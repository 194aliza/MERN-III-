import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
   
    let filePath = path.join(process.cwd(), "app", "data", "users.json");

    
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), "data", "users.json");
    }

    console.log(" System is trying to read:", filePath);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ 
        error: 'File not found', 
        attemptedPath: filePath 
      }, { status: 404 });
    }

    const data = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(data || "[]");
    return NextResponse.json(users);

  } catch (error) {
    console.error(" API Error:", error);
    return NextResponse.json([]);
  }
}