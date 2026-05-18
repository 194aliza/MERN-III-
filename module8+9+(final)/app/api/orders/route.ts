import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "app/data/orders.json");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let orders = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf8");
      orders = JSON.parse(fileData || "[]");
    }

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-5)}`,
      email: body.email,
      amount: body.amount,
      time: new Date().toLocaleTimeString(),
      status: "Pending"
    };

    orders.unshift(newOrder);
    fs.writeFileSync(filePath, JSON.stringify(orders.slice(0, 20), null, 2));

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET() {
  if (!fs.existsSync(filePath)) return NextResponse.json([]);
  const data = fs.readFileSync(filePath, "utf8");
  return NextResponse.json(JSON.parse(data || "[]"));
}