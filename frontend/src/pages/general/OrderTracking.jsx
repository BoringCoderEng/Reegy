import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import axios from 'axios';
import './OrderTracking.css';

const ORDER_URL = 'http://localhost:3000/api/orders';

// Why this order specifically: it's the sequence a normal (non-cancelled)
// order moves through — used to render the stepper and to figure out how
// far along the current status is.
const STEPS = ['placed', 'accepted', 'preparing', 'out_for_delivery', 'delivered'];
const LABELS = {
  placed: 'Order placed',
  accepted: 'Accepted by restaurant',
  preparing: 'Preparing your food',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  function authHeaders() {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };
  }

  // Why fetch once, then poll: a socket connection is the ideal way to
  // get live updates, but if Socket.io isn't wired up on your server yet,
  // a simple 5-second poll still gives a "live enough" tracking page
  // without depending on that infrastructure being ready.
  useEffect(() => {
    async function fetchOrder() {
      try {
        const { data } = await axios.get(`${ORDER_URL}/${id}`, authHeaders());
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load this order.');
      }
    }

    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    // Why cleanup: without this, navigating away from the tracking page
    // leaves the interval running forever in the background, still
    // hitting your API every 5 seconds for a page nobody's looking at.
    return () => clearInterval(interval);
  }, [id]);

  if (error) {
    return (
      <main className="tracking-page">
        <p className="tracking-error">{error}</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="tracking-page">
        <p>Loading order…</p>
      </main>
    );
  }

  const isCancelled = order.status === 'cancelled';
  const currentStepIndex = STEPS.indexOf(order.status);

  return (
    <main className="tracking-page">
      <header className="tracking-header">
        <button className="tracking-back" onClick={() => navigate('/orders')} aria-label="Back to orders">
          <ChevronLeft size={22} />
        </button>
        <h1>Order #{order._id.slice(-6)}</h1>
      </header>

      {isCancelled ? (
        <div className="tracking-cancelled">
          <p>This order was cancelled{order.cancelledReason ? ` — ${order.cancelledReason.replace(/_/g, ' ')}` : ''}.</p>
        </div>
      ) : (
        <ol className="tracking-stepper">
          {STEPS.map((step, i) => (
            <li
              key={step}
              className={`tracking-step ${i <= currentStepIndex ? 'tracking-step--done' : ''} ${i === currentStepIndex ? 'tracking-step--current' : ''}`}
            >
              <span className="tracking-step__dot" />
              <span className="tracking-step__label">{LABELS[step]}</span>
            </li>
          ))}
        </ol>
      )}

      <section className="tracking-items">
        <h2>Items</h2>
        <ul>
          {order.items.map((item, i) => (
            <li key={i}>{item.quantity} × {item.name} — ₹{item.price * item.quantity}</li>
          ))}
        </ul>
      </section>

      <section className="tracking-total">
        <span>Total paid</span>
        <span>₹{order.total}</span>
      </section>
    </main>
  );
}

export default OrderTracking;
