import { Server } from "socket.io";
let io = null;
export const initSocket = (server) => {
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
//# sourceMappingURL=socket.js.map