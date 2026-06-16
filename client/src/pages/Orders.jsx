import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import { Package } from "lucide-react";

const STATUS_STYLES = {
  placed: "bg-gray-200 text-gray-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
};

export default function Orders() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/my-orders");
        setOrders(res.data);
      } catch (error) {
        console.log(error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  if (orders === null) {
    return <p className="text-center text-gray-500 py-20">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-24">
        <Package className="w-12 h-12 mx-auto text-gray-500 mb-4" />
        <h1 className="text-2xl font-semibold">No orders yet</h1>

        <Link to="/">
          <button className="mt-6 rounded-full bg-black text-white px-6 py-2">
            Start shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-8">My orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">
                Order #{order._id.slice(-6).toUpperCase()} ·{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <span
                className={`px-3 py-1 rounded-full text-xs capitalize ${
                  STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="space-y-1">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <span className="text-gray-500">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-semibold border-t mt-3 pt-3">
              <span>Total</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </div>

            {order.shippingAddress && (
              <p className="text-xs text-gray-500 mt-2">
                Ship to: {order.shippingAddress}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}