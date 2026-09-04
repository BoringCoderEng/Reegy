import { useState } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './OrderSheet.css';

function OrderSheet({ food, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();

  async function handleAdd() {
    setAdding(true);
    const result = await addToCart({ foodId: food._id, quantity, instructions });
    setAdding(false);
    // Why only close on success: if the 409 partner-conflict prompt was
    // declined, the sheet should stay open so the user can decide again
    // rather than losing their place.
    if (result.success) onClose();
  }

  const price = food.price ?? 0;

  return (
    <div className="order-sheet">
      <div className="order-sheet__backdrop" onClick={onClose} />
      <div className="order-sheet__content">
        <button className="order-sheet__close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <h2>{food.name}</h2>
        {food.description && <p className="order-sheet__description">{food.description}</p>}
        <p className="order-sheet__price">₹{price}</p>

        <div className="quantity-stepper">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">+</button>
        </div>

        <textarea
          className="order-sheet__instructions"
          placeholder="Any special instructions? (optional)"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />

        <button className="order-sheet__submit" onClick={handleAdd} disabled={adding}>
          {adding ? 'Adding…' : `Add ${quantity} to Cart — ₹${price * quantity}`}
        </button>
      </div>
    </div>
  );
}

export default OrderSheet;