import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState(null);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setItems(cart);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = (id, delta) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const updated = cart.map((item) =>
      item._id === id
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
        : item
    );

    localStorage.setItem("cart", JSON.stringify(updated));
    setItems(updated);
  };

  const removeItem = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updated = cart.filter((item) => item._id !== id);

    localStorage.setItem("cart", JSON.stringify(updated));
    setItems(updated);
  };

  const total = (items || []).reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  if (items === null) {
    return <p className="text-center text-[#7b6b61] py-20">Loading cart...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <ShoppingBag className="w-12 h-12 mx-auto text-[#7b6b61] mb-4" />
        <h1 className="font-display text-2xl font-semibold">
          Your cart is empty
        </h1>

        <Link to="/">
          <button className="mt-6 rounded-full bg-[#b6532a] text-white px-6 py-3">
            Browse the marketplace
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-3xl font-semibold tracking-tight mb-8">
        Your cart
      </h1>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 bg-white border border-[#e8ded6] rounded-xl p-3"
          >
            <img
              src={
                item.image_url ||
                item.image ||
                item.imageUrl ||
                "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600"
              }
              alt={item.title}
              className="w-16 h-16 rounded-lg object-cover"
            />

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.title}</p>
              <p className="text-sm text-[#b6532a] font-semibold">
                ${Number(item.price).toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="h-8 w-8 rounded-full border flex items-center justify-center"
                onClick={() => updateQty(item._id, -1)}
              >
                <Minus className="w-3 h-3" />
              </button>

              <span className="w-6 text-center text-sm">
                {item.quantity || 1}
              </span>

              <button
                className="h-8 w-8 rounded-full border flex items-center justify-center"
                onClick={() => updateQty(item._id, 1)}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <button
              className="p-2 rounded-full hover:bg-[#eee4dc]"
              onClick={() => removeItem(item._id)}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#e8ded6] rounded-2xl p-6 mt-8">
        <div className="flex justify-between font-semibold text-lg mb-4">
          <span>Subtotal</span>
          <span className="text-[#b6532a]">${total.toFixed(2)}</span>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="w-full rounded-full h-12 bg-[#b6532a] text-white font-medium"
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}