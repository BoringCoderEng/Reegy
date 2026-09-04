import { useState, useEffect } from "react";
import axios from "axios";
import { useDebounce } from "../hooks/useDebounce";

function Search() {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState({ cuisine: "", veg: "", sort: "" });
  const [results, setResults] = useState([]);
  const debouncedQ = useDebounce(q, 400);

  // Why debounce: without it, typing "pizza" fires 5 separate requests —
  // one per keystroke. This waits for a pause before actually searching.
  useEffect(() => {
    axios.get("/api/food/search", { params: { q: debouncedQ, ...filters } }).then((res) => setResults(res.data));
  }, [debouncedQ, filters]);

  return (
    <div>
      <input placeholder="Search dishes, cuisines..." value={q} onChange={(e) => setQ(e.target.value)} />
      <select onChange={(e) => setFilters((f) => ({ ...f, cuisine: e.target.value }))}>
        <option value="">All cuisines</option>
        <option value="north-indian">North Indian</option>
        <option value="chinese">Chinese</option>
      </select>
      <select onChange={(e) => setFilters((f) => ({ ...f, veg: e.target.value }))}>
        <option value="">Veg & Non-veg</option>
        <option value="true">Veg only</option>
      </select>
      <div className="results-grid">{results.map((food) => <FoodCard key={food._id} food={food} />)}</div>
    </div>
  );
}

export default Search;