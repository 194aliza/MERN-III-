/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse, NextRequest } from "next/server";
import { LoginSchema } from "@/lib/schemas/auth";
import { getUsers } from "@/lib/userstorage"; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = LoginSchema.safeParse(body);

    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten().fieldErrors }, 
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    
    const users = getUsers();
    const user = users.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (u: any) => u.email === email.toLowerCase() && u.password === password
    );

   
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password. Please check your credentials." }, 
        { status: 401 }
      );
    }

   
    const response = NextResponse.json({ 
      success: true, 
      role: user.role, 
      redirectTo: user.role === "admin" ? "/admin/dashboard" : "/user/home"
    });

   
    response.cookies.set("session", user.email, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, 
      path: "/" 
    });

    
    response.cookies.set("role", user.role, { 
      httpOnly: false, 
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong on the server" }, 
      { status: 500 }
    );
  }
}