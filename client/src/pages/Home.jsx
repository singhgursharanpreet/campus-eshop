import React, { useEffect, useState } from "react";
import API from "../api/api";
import ProductCard from "../components/ProductCard";
import { Search } from "lucide-react";

const CATEGORIES = [
  "all",
  "electronics",
  "fashion",
  "books",
  "home",
  "sports",
  "toys",
  "other",
];

export default function Home() {
  const [products, setProducts] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (error) {
        console.log(error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const filtered = (products || []).filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4">
      <div className="text-center py-10">
        <h1 className="text-4xl md:text-5xl font-bold">
          Buy & sell, beautifully simple.
        </h1>

        <p className="text-gray-500 mt-3 max-w-md mx-auto">
          A marketplace by students, for students. Find a deal or list your own
          stuff in seconds.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
        <div className="relative w-full md:max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            className="pl-9 border rounded-full px-4 py-2 w-full"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap justify-center">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm capitalize transition-colors ${
                category === c
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {products === null ? (
        <p className="text-center text-gray-500 py-20">Loading products...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-20">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}