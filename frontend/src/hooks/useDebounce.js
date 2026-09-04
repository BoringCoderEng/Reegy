import { useState, useEffect } from "react";

export function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // Why clear on every change: otherwise every keystroke schedules its
    // own delayed update and stale searches can resolve after newer ones.
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}