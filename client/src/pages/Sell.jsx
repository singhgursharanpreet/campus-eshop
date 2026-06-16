import React, { useEffect, useState } from "react";
import API from "../api/api";
import ProductForm from "../components/ProductForm";
import { Trash2, Pencil } from "lucide-react";

export default function Sell() {
  const [listings, setListings] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const res = await API.get("/products");
      setListings(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createListing = async (data) => {
    setSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await API.post("/products", {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        image_url: data.image_url || data.image || "",
        seller_name: user?.name || user?.email || "Demo Seller",
        status: Number(data.stock) > 0 ? "active" : "sold_out",
      });

      await load();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Could not create product");
    } finally {
      setSubmitting(false);
    }
  };

  const saveEdit = async (data) => {
    setSubmitting(true);

    try {
      await API.put(`/products/${editing._id}`, {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        image_url: data.image_url || data.image || "",
        seller_name: editing.seller_name || "Demo Seller",
        status: Number(data.stock) > 0 ? "active" : "sold_out",
      });

      setEditing(null);
      await load();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Could not update product");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (product) => {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    try {
      await API.delete(`/products/${product._id}`);
      await load();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Could not delete product");
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto p-4">
      <div>
        <h1 className="text-3xl font-semibold mb-1">Sell an item</h1>

        <p className="text-gray-500 text-sm mb-6">
          List your item — it will instantly appear on the marketplace.
        </p>

        <div className="bg-white border rounded-2xl p-6">
          <ProductForm onSubmit={createListing} submitting={submitting} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">My listings</h2>

        {listings.length === 0 ? (
          <p className="text-gray-500 text-sm">
            You haven't listed anything yet.
          </p>
        ) : (
          <div className="space-y-3">
            {listings.map((p) => (
              <div
                key={p._id}
                className="flex items-center gap-4 bg-white border rounded-xl p-3"
              >
                <img
                  src={
                    p.image_url ||
                    p.image ||
                    p.imageUrl ||
                    "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600"
                  }
                  alt={p.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{p.title}</p>

                  <p className="text-sm text-gray-500">
                    ${Number(p.price).toFixed(2)} ·{" "}
                    {Number(p.stock) > 0 ? `${p.stock} in stock` : "Sold out"}
                  </p>
                </div>

                <button
                  onClick={() => setEditing(p)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  onClick={() => remove(p)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit listing</h2>

            <ProductForm
              initial={editing}
              onSubmit={saveEdit}
              submitting={submitting}
            />

            <button
              onClick={() => setEditing(null)}
              className="mt-4 w-full border rounded-lg py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}