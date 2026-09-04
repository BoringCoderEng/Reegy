import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderHistory.css';

const ORDER_URL = 'http://localhost:3000/api/orders';

const STATUS_LABELS = {
  placed: 'Placed',
  accepted: 'Accepted',
  preparing: 'Preparing',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${ORDER_URL}/my`, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
      .then(({ data }) => setOrders(data))
      .catch((err) => console.error('Error loading orders:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="orders-page">
      <header className="orders-header">
        <button className="orders-back" onClick={() => navigate(-1)} aria-label="Go back">
          <ChevronLeft size={22} />
        </button>
        <h1>Your Orders</h1>
      </header>

      {loading && <p>Loading orders…</p>}

      {!loading && orders.length === 0 && (
        <div className="orders-empty">
          <Package size={30} />
          <h2>No orders yet</h2>
          <p>Once you place an order, it'll show up here.</p>
          <Link className="orders-empty__cta" to="/">Browse food</Link>
        </div>
      )}

      <ul className="orders-list">
        {orders.map((order) => (
          <li key={order._id}>
            <Link className="order-card-link" to={`/orders/${order._id}`}>
              <div className="order-card-link__info">
                <strong>Order #{order._id.slice(-6)}</strong>
                <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''} · ₹{order.total}</span>
              </div>
              <span className={`order-status-badge order-status-badge--${order.status}`}>
                {STATUS_LABELS[order.status]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default OrderHistory;
