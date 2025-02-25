import { Server } from "https://deno.land/x/socket_io@0.2.1/mod.ts";
import { handleSendMessage } from "../controllers/socketMessageController.ts";
import { Application } from "https://deno.land/x/oak@v17.1.4/mod.ts";

/**
 * Sets up Socket.IO on the server
 * @author Sriram Sundar
 *
 * @param {Application} app - The Oak application
 * @returns {Server} The Socket.IO server instance
 */
const setupSocket = (app: Application) => {
  // Create new Socket.IO server
  const io = new Server({
    cors: {
      origin: Deno.env.get("FRONT_ORIGIN") || "*",
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
      credentials: true,
    },
  });

  console.log("Socket.IO initialized");

  // Map to store user socket connections
  const userSocketMap = new Map<string, string>();

  // Socket.IO connection handler
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.get("userId") as string | undefined;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection.");
    }

    console.log(userSocketMap);

    // Handle message events
    socket.on("send-message", (message) => {
      handleSendMessage(io, userSocketMap, message);
    });

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      console.log(`Socket ${socket.id} disconnected due to ${reason}`);
      for (const [userID, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userID);
          break;
        }
      }
    });
  });

  // Create a unified request handler that uses Oak for HTTP and Socket.IO for WebSocket connections
  const handler = io.handler(async (req) => {
    return (await app.handle(req)) || new Response(null, { status: 404 });
  });

  return { io, handler };
};

export default setupSocket;
