"use client";
import { useSocket } from "@/app/hooks/useSocket";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveOrderFeed() {
  const orders = useSocket();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        Live Order Feed (Real-Time)
      </h3>
      <div className="relative min-h-[150px]">
        <AnimatePresence mode="popLayout">
          {orders.length > 0 ? (
            orders.map((order) => (
              <motion.div
               key={order._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm mb-3"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm text-blue-600 italic">Order #{order._id}</p>
                    <p className="text-[10px] text-slate-500">{order.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-bold">${order.totalPrice.toFixed(2)}</p>
                    <p className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">No orders found. Waiting for sales...</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}