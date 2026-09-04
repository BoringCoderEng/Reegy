import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft as BackIcon, Plus } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import AddressForm from '../../components/AddressForm';
import './Checkout.css';

const ADDRESS_URL = 'http://localhost:3000/api/address';
const ORDER_URL = 'http://localhost:3000/api/orders';
const PAYMENT_URL = 'http://localhost:3000/api/payments';

// Why loaded dynamically, not a static <script> tag in index.html: keeps
// the Razorpay SDK out of the initial bundle for users who never reach
// checkout.
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  function authHeaders() {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };
  }

  // Why fetch addresses on mount: the user needs a saved address to pick
  // from before they can place an order — this is the first thing the
  // page needs, before anything else can happen.
  useEffect(() => {
    axios.get(ADDRESS_URL, authHeaders()).then(({ data }) => {
      setAddresses(data);
      const defaultAddr = data.find((a) => a.isDefault) || data[0];
      if (defaultAddr) setSelectedAddressId(defaultAddr._id);
    }).catch((err) => console.error('Error loading addresses:', err));
  }, []);

  function handleAddressSaved(newAddress) {
    setAddresses((prev) => [newAddress, ...prev]);
    setSelectedAddressId(newAddress._id);
    setShowAddressForm(false);
  }

  async function handlePlaceOrder() {
    if (!selectedAddressId) {
      setError('Please select or add a delivery address.');
      return;
    }
    setError('');
    setPlacing(true);

    try {
      if (paymentMethod === 'cod') {
        const { data: order } = await axios.post(
          ORDER_URL,
          { addressId: selectedAddressId, paymentMethod: 'cod' },
          authHeaders()
        );
        await clearCart();
        navigate(`/orders/${order._id}`);
        return;
      }

      // Online payment path
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError('Payment SDK failed to load. Check your connection and try again.');
        setPlacing(false);
        return;
      }

      const { data } = await axios.post(`${PAYMENT_URL}/create`, {}, authHeaders());

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'Reegy',
        description: 'Food order payment',
        handler: async (response) => {
          try {
            const { data: order } = await axios.post(
              `${PAYMENT_URL}/verify`,
              { ...response, addressId: selectedAddressId },
              authHeaders()
            );
            await clearCart();
            navigate(`/orders/${order._id}`);
          } catch (err) {
            setError('Payment succeeded but order creation failed. Contact support.');
          }
        },
        modal: {
          // Why we reset `placing` here: if the user closes the Razorpay
          // popup without paying, nothing else will fire — without this,
          // the "Place order" button would stay stuck showing "Placing…"
          // forever.
          ondismiss: () => setPlacing(false),
        },
        theme: { color: '#FF5A00' },
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order. Please try again.');
      setPlacing(false);
    }
  }

  const items = cart?.items || [];
  const deliveryFee = items.length > 0 ? 30 : 0;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + deliveryFee + tax;

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <p>Your cart is empty. <a href="/">Go back and add something.</a></p>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <button className="checkout-back" onClick={() => navigate(-1)} aria-label="Go back">
          <BackIcon size={22} />
        </button>
        <h1>Checkout</h1>
      </header>

      <section className="checkout-section">
        <h2>Delivery address</h2>
        {addresses.map((addr) => (
          <label className={`address-option ${selectedAddressId === addr._id ? 'address-option--selected' : ''}`} key={addr._id}>
            <input
              type="radio"
              name="address"
              checked={selectedAddressId === addr._id}
              onChange={() => setSelectedAddressId(addr._id)}
            />
            <span>
              <strong>{addr.label}</strong>
              <small>{addr.line1}, {addr.city}, {addr.state} {addr.pincode}</small>
            </span>
          </label>
        ))}

        {!showAddressForm && (
          <button className="checkout-add-address" onClick={() => setShowAddressForm(true)}>
            <Plus size={16} /> Add new address
          </button>
        )}
        {showAddressForm && (
          <AddressForm onSaved={handleAddressSaved} onCancel={() => setShowAddressForm(false)} />
        )}
      </section>

      <section className="checkout-section">
        <h2>Payment method</h2>
        <label className={`payment-option ${paymentMethod === 'cod' ? 'payment-option--selected' : ''}`}>
          <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
          Cash on delivery
        </label>
        <label className={`payment-option ${paymentMethod === 'online' ? 'payment-option--selected' : ''}`}>
          <input type="radio" name="payment" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
          Pay online (UPI / card)
        </label>
      </section>

      <section className="checkout-summary">
        <div className="checkout-summary__row"><span>Subtotal</span><span>₹{cartTotal}</span></div>
        <div className="checkout-summary__row"><span>Delivery fee</span><span>₹{deliveryFee}</span></div>
        <div className="checkout-summary__row"><span>Tax</span><span>₹{tax}</span></div>
        <div className="checkout-summary__row checkout-summary__row--total"><span>Total</span><span>₹{total}</span></div>
      </section>

      {error && <p className="checkout-error" role="alert">{error}</p>}

      <button className="checkout-place-order" onClick={handlePlaceOrder} disabled={placing}>
        {placing ? 'Placing order…' : `Place Order — ₹${total}`}
      </button>
    </main>
  );
}

export default Checkout;
