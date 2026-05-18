
"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { es } from "zod/locales";

interface Order {
  _id: string;
  user: unknown;
  totalPrice: number;
  createdAt: string;
  status: string;
}

export const useSocket = () => {
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);

    // 🔥 listen new orders
    socket.on("newOrder", (order: Order) => {
      setLiveOrders((prev) => [order, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return liveOrders;
};