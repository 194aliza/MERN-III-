/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

interface Order {
  _id: string;
  totalPrice: number;
  items: Array<{
    product: string;
    quantity: number;
  }>;
  createdAt: string;
  status?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await api.getMyOrders();
        setOrders(data);
      } catch (err: any) {
        console.error("Failed to fetch orders:", err);
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 p-6 rounded-2xl">
            <p className="text-red-700 dark:text-red-300 font-medium">❌ {error}</p>
            <Link href="/user/home" className="text-blue-600 font-bold hover:underline mt-4 inline-block">
              ← Back to Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">My Orders</h1>
          <Link href="/user/home" className="text-blue-600 font-bold hover:underline">
            Continue Shopping →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border dark:border-slate-800">
            <p className="text-slate-500 mb-4 font-medium">📦 No orders yet</p>
            <Link href="/user/home" className="text-blue-600 font-bold hover:underline">
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border dark:border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Order ID */}
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Order ID</p>
                    <p className="font-bold dark:text-white text-sm break-all">{order._id}</p>
                  </div>

                  {/* Total Price */}
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-600">${order.totalPrice?.toFixed(2) || "0.00"}</p>
                  </div>

                  {/* Items Count */}
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Items</p>
                    <p className="font-bold dark:text-white">{order.items?.length || 0} product(s)</p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Date</p>
                    <p className="font-bold dark:text-white text-sm">
                      {order.createdAt 
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Items Details */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t dark:border-slate-800">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Items:</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, idx) => (
                        <span key={idx} className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                          Qty: {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
