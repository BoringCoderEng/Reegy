import { useRef, useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import OrderSheet from "./OrderSheet";

function ReelItem({ reel }) {
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [showOrderSheet, setShowOrderSheet] = useState(false);
  const { addToCart } = useCart();

  // Why IntersectionObserver: this is how we know which reel is on-screen
  // right now, so we auto-play only that one and pause the rest — without
  // it every video in the feed would play at once.
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.6 });
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    inView ? videoRef.current.play() : videoRef.current.pause();
  }, [inView]);

  return (
    <div className="reel-item">
      <video ref={videoRef} src={reel.videoUrl} loop muted playsInline />
      <div className="reel-item__overlay">
        <div className="reel-item__food-name">{reel.food.name}</div>
        <div className="reel-item__price">₹{reel.food.price}</div>
        <div className="reel-item__actions">
          {/* Why "quick add" as a one-tap default: reduces friction to
              order — most reel-shopping apps let a default variant/qty go
              straight to cart, and only open a detail sheet on request. */}
          <button onClick={() => addToCart({ foodId: reel.food._id, quantity: 1 })}>Add to Cart</button>
          <button onClick={() => setShowOrderSheet(true)}>View & Order</button>
        </div>
      </div>
      {showOrderSheet && <OrderSheet food={reel.food} onClose={() => setShowOrderSheet(false)} />}
    </div>
  );
}

export default ReelItem;