import { useEffect, useState } from "react";
import axios from "axios";
import ReelItem from "./ReelItem";

function ReelFeed() {
  const [reels, setReels] = useState([]);

  useEffect(() => {
    axios.get("/api/food/feed").then((res) => setReels(res.data));
  }, []);

  // Why CSS scroll-snap instead of a JS carousel library: native browser
  // scrolling gives smooth momentum for free — hand-rolled JS "swipe"
  // logic is what makes most clone apps feel janky.
  return (
    <div className="reel-feed">
      {reels.map((reel) => <ReelItem key={reel._id} reel={reel} />)}
    </div>
  );
}

export default ReelFeed;