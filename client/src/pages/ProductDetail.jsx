import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.log(error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = () => {
  setAdding(true);
  setError("");

  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item._id === product._id);

    let updatedCart;

    if (existing) {
      updatedCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    navigate("/cart");
  } catch (err) {
    setError("Could not add to cart");
  } finally {
    setAdding(false);
  }
};
  if (loading) {
    return <p className="text-center text-gray-500 py-20">Loading...</p>;
  }

  if (!product) {
    return <p className="text-center text-gray-500 py-20">Product not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to marketplace
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 border">
          <img
            src={
              product.image ||
              product.imageUrl ||
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
            }
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <span className="w-fit capitalize mb-3 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            {product.category}
          </span>

          <h1 className="text-3xl font-semibold">{product.title}</h1>

          <p className="text-sm text-gray-500 mt-1">
            Sold by {product.sellerName || "a seller"}
          </p>

          <p className="text-3xl font-semibold mt-4">
            ${Number(product.price).toFixed(2)}
          </p>

          <p className="text-gray-700 mt-6 leading-relaxed whitespace-pre-wrap">
            {product.description || "No description provided."}
          </p>

          <p className="text-sm text-gray-500 mt-4">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={addToCart}
            disabled={adding || product.stock <= 0}
            className="mt-6 rounded-full h-12 text-base bg-black text-white flex items-center justify-center disabled:bg-gray-400"
          >
            {adding ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <ShoppingCart className="w-4 h-4 mr-2" />
            )}

            {product.stock > 0 ? "Add to cart" : "Sold out"}
          </button>
        </div>
      </div>
    </div>
  );
}