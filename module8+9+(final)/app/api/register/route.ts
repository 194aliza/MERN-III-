import { NextResponse, NextRequest } from "next/server";
import { RegisterSchema } from "@/lib/schemas/auth";
import { addUser, userExists } from "@/lib/userstorage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    
    const result = RegisterSchema.safeParse(body);
    
    if (!result.success) {
     
      console.log("ZOD ERROR:", result.error.flatten());
      return NextResponse.json({ 
        error: "Validation failed. Passwords must match and be at least 6 characters." 
      }, { status: 400 });
    }

    
    const { email, password } = result.data;

    
    if (userExists(email)) {
      return NextResponse.json({ error: "User already registered with this email." }, { status: 400 });
    }

   
    const role = email.toLowerCase() === "admin@store.com" ? "admin" : "user";
    
    
    addUser(email, password, role);

    
    const response = NextResponse.json({ 
      success: true, 
      message: "Registered!",
      role: role,
      redirectTo: role === "admin" ? "/admin/dashboard" : "/user/home" 
    }, { status: 201 });
    
    
    response.cookies.set("session", email, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 });
    response.cookies.set("role", role, { 
      httpOnly: false, 
      path: "/", 
      maxAge: 60 * 60 * 24 
    });

    return response;

  } catch (error) {
    console.error("REGISTER_ERROR:", error);
    return NextResponse.json({ error: "Something went wrong on the server." }, { status: 500 });
  }
}