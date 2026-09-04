const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

function initSocket(httpServer) {
  io = new Server(httpServer, { cors: { origin: process.env.FRONTEND_URL, credentials: true } });

  // Why authenticate sockets: without this, anyone could connect and
  // listen in on someone else's order updates — the same reason your
  // HTTP routes need auth.middleware.js.
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded._id;
      socket.role = decoded.role;
      next();
    } catch {
      next(new Error("Unauthorized socket connection"));
    }
  });

  io.on("connection", (socket) => {
    // Why rooms: a private channel per user/partner so events target
    // exactly who needs them instead of broadcasting to everyone connected.
    socket.join(socket.role === "food-partner" ? `partner:${socket.userId}` : `user:${socket.userId}`);
  });

  return io;
}

function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

module.exports = { initSocket, getIO };