import React, { useEffect, useState } from "react";
import API from "../api/api";
import {
  Package,
  DollarSign,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-white border border-[#e8ded6] rounded-2xl p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-[#eee4dc] flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#b6532a]" />
      </div>

      <div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-sm text-[#7b6b61]">{label}</p>
        {sub && <p className="text-xs text-[#7b6b61]">{sub}</p>}
      </div>
    </div>
  );
}

export default function SellerDashboard() {
  const [listings, setListings] = useState([]);
  const [soldItems, setSoldItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const productRes = await API.get("/products");
        setListings(productRes.data);

        const orderRes = await API.get("/orders");
        const allOrders = orderRes.data;

        const items = allOrders.flatMap((order) =>
          (order.items || []).map((item) => ({
            ...item,
            orderId: order._id,
            status: order.status,
            createdAt: order.createdAt,
          }))
        );

        setSoldItems(items);
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, []);

  const totalRevenue = soldItems.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  const totalUnits = soldItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const activeListings = listings.filter((p) => Number(p.stock) > 0).length;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-2">
        Seller Dashboard
      </h1>

      <p className="text-[#7b6b61] mb-8">
        Track your sales, revenue, and listings.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={DollarSign}
          label="Total revenue"
          value={`$${totalRevenue.toFixed(2)}`}
        />

        <StatCard icon={ShoppingBag} label="Units sold" value={totalUnits} />

        <StatCard
          icon={Package}
          label="Active listings"
          value={activeListings}
          sub={`${listings.length} total`}
        />

        <StatCard icon={TrendingUp} label="Products" value={listings.length} />
      </div>

      <div className="bg-white border border-[#e8ded6] rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">My listings</h2>

        {listings.length === 0 ? (
          <p className="text-sm text-[#7b6b61]">No listings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8ded6] text-[#7b6b61] text-left">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e8ded6]">
                {listings.map((p) => (
                  <tr key={p._id}>
                    <td className="py-3 flex items-center gap-3">
                      <img
                        src={
                          p.image_url ||
                          p.image ||
                          p.imageUrl ||
                          "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600"
                        }
                        alt={p.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />

                      <span className="font-medium truncate max-w-[180px]">
                        {p.title}
                      </span>
                    </td>

                    <td className="py-3 font-semibold">
                      ${Number(p.price).toFixed(2)}
                    </td>

                    <td className="py-3">{p.stock}</td>

                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          Number(p.stock) > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {Number(p.stock) > 0 ? "active" : "sold out"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}