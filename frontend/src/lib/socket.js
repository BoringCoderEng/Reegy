import { io } from "socket.io-client";

let socket;
// Why a singleton: creating a new connection per component would open
// dozens of redundant sockets for one user.
export function getSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      auth: { token: localStorage.getItem("token") },
      autoConnect: false,
    });
  }
  return socket;
}