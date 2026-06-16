import React, { useState } from "react";

export default function ProductForm({
  initial = {},
  onSubmit,
  submitting,
}) {
  const [form, setForm] = useState({
    title: initial.title || "",
    description: initial.description || "",
    price: initial.price || "",
    stock: initial.stock || "",
    category: initial.category || "electronics",
    image: initial.image || "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        name="title"
        placeholder="Product title"
        value={form.title}
        onChange={handleChange}
        className="border rounded-lg px-4 py-3 w-full"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border rounded-lg px-4 py-3 w-full"
        rows={4}
      />

      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        className="border rounded-lg px-4 py-3 w-full"
        required
      />

      <input
        name="stock"
        type="number"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
        className="border rounded-lg px-4 py-3 w-full"
        required
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="border rounded-lg px-4 py-3 w-full"
      >
        <option value="electronics">Electronics</option>
        <option value="fashion">Fashion</option>
        <option value="books">Books</option>
        <option value="home">Home</option>
        <option value="sports">Sports</option>
        <option value="toys">Toys</option>
        <option value="other">Other</option>
      </select>

      <input
        name="image"
        placeholder="Image URL"
        value={form.image}
        onChange={handleChange}
        className="border rounded-lg px-4 py-3 w-full"
      />

      <button
        type="submit"
        disabled={submitting}
        className="bg-black text-white rounded-lg px-6 py-3 w-full"
      >
        {submitting ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}