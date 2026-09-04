import { useState } from "react";
import axios from "axios";

function ReviewModal({ order, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  async function submit() {
    await axios.post("/api/reviews", { orderId: order._id, rating, comment }, { withCredentials: true });
    onClose();
  }

  return (
    <div className="modal">
      <input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
      <textarea placeholder="How was it?" value={comment} onChange={(e) => setComment(e.target.value)} />
      <button onClick={submit}>Submit Review</button>
    </div>
  );
}

export default ReviewModal;