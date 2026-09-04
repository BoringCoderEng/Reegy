import { createContext, useContext, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);

  async function addToCart({ foodId, quantity, instructions }) {
    try {
      const { data } = await axios.post("/api/cart/add", { foodId, quantity, instructions }, { withCredentials: true });
      setCart(data);
    } catch (err) {
      // Why handle 409 specifically: this is the "different partner"
      // conflict from Phase 2.1 — surface it as a clear choice, not a
      // silent failure or a generic error toast.
      if (err.response?.status === 409) {
        const confirmSwitch = window.confirm("Cart has items from another restaurant. Clear cart and add this instead?");
        if (confirmSwitch) {
          await axios.post("/api/cart/clear", {}, { withCredentials: true });
          return addToCart({ foodId, quantity, instructions });
        }
      }
    }
  }

  return <CartContext.Provider value={{ cart, addToCart }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);