import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`}>
      <div className="bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition">
        <img
  src={
    product.image_url ||
    product.image ||
    product.imageUrl ||
    "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600"
  }
  alt={product.title}
  className="w-full h-48 object-cover"
/>

        <div className="p-4">
          <h3 className="font-semibold text-lg truncate">
            {product.title}
          </h3>

          <p className="text-gray-500 text-sm line-clamp-2 mt-1">
            {product.description}
          </p>

          <div className="flex justify-between items-center mt-3">
            <span className="font-bold text-lg">
              ${Number(product.price).toFixed(2)}
            </span>

            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full capitalize">
              {product.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}