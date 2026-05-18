import { NextResponse } from "next/server";
import { products } from "@/app/(user)/user/data/product";

export async function GET() {
  return NextResponse.json(products);
}