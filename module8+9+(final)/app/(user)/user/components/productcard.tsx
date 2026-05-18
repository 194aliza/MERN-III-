"use client";

import { useState } from "react";
import { useCart } from "@/app/(user)/user/context/CartContext";
import { addToCartAction } from "@/app/(user)/user/actions/cartaction";
import { useRouter } from "next/navigation";
import { Product } from "@/app/(user)/user/types";
import { useWishlistStore } from "@/app/store/useWishliststore";
import { Heart, ShoppingCart, Star, Zap } from "lucide-react";

export default function ProductCard({ id, name, price, image, rating }: Product) {
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const { items, toggleWishlist } = useWishlistStore();
  const isWishlisted = items.includes(id);

 
  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await addToCartAction(id, 1);
    
    if (!response.success) {
      if (response.error === "AUTH_REQUIRED") {
        alert("Please login first!");
        router.push("/auth/login");
      }
      setLoading(false);
      return;
    }
    
    addToCart(id, 1);
    alert(`${name} added to cart!`);
    setLoading(false);
  };

  
  const handleDirectOrder = async (e: React.MouseEvent) => {
    e.preventDefault();
    setOrderLoading(true);

    const userSession = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session="))
      ?.split("=")[1];

    if (!userSession) {
      alert("Please login to place an order!");
      router.push("/auth/login");
      setOrderLoading(false);
      return;
    }

    const userEmail = decodeURIComponent(userSession);

    try {
      
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          amount: price.toString(),
        }),
      });

      if (res.ok) {
        alert(`Success! Order placed for ${name}. `);
        
        router.refresh(); 
      } else {
        alert("Something went wrong with the order.");
      }
    } catch (error) {
      console.error("Direct Order Error:", error);
      alert("Failed to connect to server.");
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl p-4 w-64 shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col">
      
      {/*  Wishlist Button */}
      <button 
        onClick={() => toggleWishlist(id)} 
        className="absolute top-4 right-4 z-20 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-md hover:scale-110 active:scale-90 transition-all"
      >
        <Heart 
          size={18} 
          fill={isWishlisted ? "#ef4444" : "none"} 
          color={isWishlisted ? "#ef4444" : "#64748b"} 
        />
      </button>

      {/* 🖼️ Product Image */}
      <div className="relative w-full h-40 mb-4 overflow-hidden rounded-2xl bg-slate-100">
        <img 
          src={image || "/placeholder.png"} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
      </div>
      
      {/*  Product Info */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h2 className="text-md font-bold text-slate-800 dark:text-white truncate pr-2">{name}</h2>
          <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-lg">
             <Star size={10} className="fill-yellow-400 text-yellow-400" />
             <span className="text-[10px] font-bold text-yellow-700 dark:text-yellow-500">{rating}</span>
          </div>
        </div>
        <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">${price}</p>
      </div>
      
      {/*  Action Buttons */}
      <div className="flex flex-col gap-2 mt-4">
        {/* Fast Order Button */}
        <button
          onClick={handleDirectOrder}
          disabled={orderLoading}
          className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-green-100 dark:shadow-none"
        >
          {orderLoading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <><Zap size={16} /> Buy Now</>
          )}
        </button>

        {/* Add to Cart Button */}
        <button
          onClick={handleAdd}
          disabled={loading}
          className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <><ShoppingCart size={16} /> + Cart</>
          )}
        </button>
      </div>
    </div>
  );
}