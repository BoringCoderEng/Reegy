import { useState } from "react";
import axios from "axios";

// Why this map: defines the only valid next step from each status, so the
// UI never shows a nonsensical button like "Mark delivered" on an
// unaccepted order.
const NEXT_STATUS = { placed: "accepted", accepted: "preparing", preparing: "out_for_delivery", out_for_delivery: "delivered" };
const LABELS = { placed: "New", accepted: "Accepted", preparing: "Preparing", out_for_delivery: "Out for delivery", delivered: "Delivered", cancelled: "Cancelled" };

function OrderCard({ order, onUpdate }) {
  const [updating, setUpdating] = useState(false);

  async function changeStatus(newStatus) {
    setUpdating(true);
    try {
      await axios.patch(`/api/partner/orders/${order._id}/status`, { status: newStatus }, { withCredentials: true });
      // Why update local state here too: the socket event broadcasts to
      // the *customer's* room, not back to this dashboard.
      onUpdate(order._id, { status: newStatus });
    } finally {
      setUpdating(false);
    }
  }

  const nextStatus = NEXT_STATUS[order.status];

  return (
    <div className="order-card">
      <div>Order #{order._id.slice(-5)} — {LABELS[order.status]}</div>
      <ul>{order.items.map((item, i) => <li key={i}>{item.quantity} × {item.name}</li>)}</ul>
      <div>Total: ₹{order.total}</div>

      {order.status === "placed" && (
        <>
          <button disabled={updating} onClick={() => changeStatus("accepted")}>Accept</button>
          <button disabled={updating} onClick={() => changeStatus("cancelled")}>Reject</button>
        </>
      )}
      {nextStatus && order.status !== "placed" && (
        <button disabled={updating} onClick={() => changeStatus(nextStatus)}>Mark as {LABELS[nextStatus]}</button>
      )}
    </div>
  );
}

export default OrderCard;