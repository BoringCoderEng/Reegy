import { useEffect, useState } from "react";
import axios from "axios";
import { getSocket } from "../../lib/socket";
import OrderCard from "./OrderCard";
import { playNewOrderSound, showBrowserNotification, requestNotificationPermission } from "../../lib/notify";

function OrderQueue() {
  const [orders, setOrders] = useState([]);

  // Why fetch on load at all, not rely only on sockets: a refreshed page
  // has no history — sockets only deliver events that happen *while
  // connected*. Fetch current state first, then let sockets keep it live.
  useEffect(() => {
    requestNotificationPermission();
    axios.get("/api/partner/orders", { withCredentials: true }).then((res) => setOrders(res.data));
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.connect();
    function handleNewOrder(order) {
      setOrders((prev) => [order, ...prev]); // newest first
      playNewOrderSound();
      showBrowserNotification("New order!", `Order #${order._id.slice(-5)} just came in`);
    }
    socket.on("new-order", handleNewOrder);
    // Why cleanup matters: without it, a re-render attaches a second
    // listener and one order triggers the sound twice, then three times.
    return () => socket.off("new-order", handleNewOrder);
  }, []);

  function updateLocalOrder(orderId, updates) {
    setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, ...updates } : o)));
  }

  return (
    <div>
      <h1>Incoming Orders</h1>
      {orders.map((order) => <OrderCard key={order._id} order={order} onUpdate={updateLocalOrder} />)}
    </div>
  );
}

export default OrderQueue;