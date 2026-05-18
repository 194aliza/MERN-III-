/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

function CheckoutContent() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const total = searchParams.get("total") || "0.00";

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      // Get cart from localStorage
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      
      if (!cart || cart.length === 0) {
        alert(" Cart is empty!");
        setLoading(false);
        return;
      }

      // Format items for API
      const items = cart.map((item: any) => ({
        product: item._id || item.id,
        quantity: item.quantity || item.qty,
      }));

      // Create order
      await api.createOrder(items);
      
      alert("✅ Order placed successfully!");
      
      // Clear cart
      localStorage.removeItem("cart");
      
      // Redirect to orders page
      router.push("/user/orders");
      router.refresh();
    } catch (error: any) {
      console.error("Checkout Error:", error);
      alert(`❌ ${error.message || "Order failed. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border dark:border-slate-800 p-10 rounded-[2.5rem] shadow-xl text-center space-y-6">
        <h1 className="text-3xl font-bold dark:text-white">Secure Checkout</h1>
        <p className="text-slate-500 dark:text-slate-400">Review your final amount and confirm.</p>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl text-left border border-blue-100 dark:border-blue-900/30">
          <p className="flex justify-between font-bold text-lg text-blue-900 dark:text-blue-300">
            <span>Total Payable:</span> 
            <span>${total}</span>
          </p>
        </div>

        <button 
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 disabled:bg-slate-400 shadow-lg shadow-blue-200 dark:shadow-none"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Processing...</span>
            </div>
          ) : "Confirm & Place Order"}
        </button>
        
        <button 
          onClick={() => router.back()}
          className="text-slate-400 text-sm hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}


export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}