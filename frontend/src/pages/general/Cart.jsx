import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './Cart.css';

function Cart() {
  const { cart, loading, cartTotal, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const deliveryFee = items.length > 0 ? 30 : 0;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + deliveryFee + tax;

  return (
    <main className="cart-page">
      <header className="cart-header">
        <button className="cart-back" onClick={() => navigate(-1)} aria-label="Go back">
          <ChevronLeft size={22} />
        </button>
        <h1>Your Cart</h1>
      </header>

      {loading && <p className="cart-loading">Loading your cart…</p>}

      {!loading && items.length === 0 && (
        <div className="cart-empty">
          <ShoppingBag size={32} />
          <h2>Your cart is empty</h2>
          <p>Add something delicious from the feed to get started.</p>
          <Link className="cart-empty__cta" to="/">Browse food</Link>
        </div>
      )}

      {items.length > 0 && (
        <>
          <ul className="cart-items">
            {items.map((item) => (
              <li className="cart-item" key={item._id}>
                <div className="cart-item__info">
                  <span className="cart-item__name">{item.food?.name || 'Item'}</span>
                  <span className="cart-item__price">₹{item.price} each</span>
                  {item.instructions && <span className="cart-item__note">Note: {item.instructions}</span>}
                </div>
                <div className="cart-item__controls">
                  <div className="quantity-stepper">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} aria-label="Decrease quantity">
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} aria-label="Increase quantity">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button className="cart-item__remove" onClick={() => removeItem(item._id)} aria-label="Remove item">
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <section className="cart-summary">
            <div className="cart-summary__row">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="cart-summary__row">
              <span>Delivery fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="cart-summary__row">
              <span>Tax</span>
              <span>₹{tax}</span>
            </div>
            <div className="cart-summary__row cart-summary__row--total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </section>

          <button className="cart-checkout-btn" onClick={() => navigate('/checkout')}>
            Proceed to Checkout — ₹{total}
          </button>
        </>
      )}
    </main>
  );
}

export default Cart;
