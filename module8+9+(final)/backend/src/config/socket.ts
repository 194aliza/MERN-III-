import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

let io: Server | null = null;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    },
  });
  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }
  return io;
};
