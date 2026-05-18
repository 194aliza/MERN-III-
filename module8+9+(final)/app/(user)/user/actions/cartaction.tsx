"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { CartItemSchema } from "@/lib/schemas/auth";
import { ApiResponse, CartItem } from "@/app/(user)/user/types";

export async function addToCartAction(productId: number, qty: number): Promise<ApiResponse<string>> {
  const cookieStore = await cookies();
  
 
  const session = cookieStore.get("session");
  if (!session) {
    return { success: false, error: "AUTH_REQUIRED" };
  }

  
  const result = CartItemSchema.safeParse({ productId, qty });
  if (!result.success) return { success: false, error: "Invalid Data" };


  const cart = cookieStore.get("cart");
  const items: CartItem[] = cart ? JSON.parse(cart.value) : [];

  const existing = items.find(i => i.productId === productId);
  if (existing) { 
    existing.qty += qty; 
  } else { 
    items.push({ productId, qty }); 
  }

  cookieStore.set("cart", JSON.stringify(items), { path: "/" });
  revalidatePath("/cart");
  
  return { success: true, data: "Added!" };
}

export async function removeFromcartaction(productId: number) {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get("cart");

  if (cartCookie) {
    let items: CartItem[] = JSON.parse(cartCookie.value);
    items = items.filter((item) => item.productId !== productId);
    cookieStore.set("cart", JSON.stringify(items), { path: "/" });
  }
  revalidatePath("/cart");
}