import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, Lock, Loader2, CheckCircle } from "lucide-react";
import API from "../api/api";
function formatCard(v) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(v) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}

export default function Checkout() {
  const [items, setItems] = useState([]);
  const [step, setStep] = useState("shipping");
  const [placing, setPlacing] = useState(false);
  const [cardError, setCardError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const [shipping, setShipping] = useState({
    name: user?.name || "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });

  const [payment, setPayment] = useState({
    card: "",
    expiry: "",
    cvv: "",
    holder: "",
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setItems(cart);
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  const shippingFee = subtotal > 0 ? 4.99 : 0;
  const total = subtotal + shippingFee;

  const setS = (key, value) => {
    setShipping((old) => ({ ...old, [key]: value }));
  };

  const setP = (key, value) => {
    setPayment((old) => ({ ...old, [key]: value }));
  };

  const validateCard = () => {
    const raw = payment.card.replace(/\s/g, "");

    if (raw.length < 16) return "Enter a valid 16-digit card number.";
    if (!payment.expiry.match(/^\d{2}\/\d{2}$/)) return "Enter expiry as MM/YY.";
    if (payment.cvv.length < 3) return "Enter a valid CVV.";
    if (!payment.holder.trim()) return "Enter the cardholder name.";

    return "";
  };

 const placeOrder = async () => {
  const err = validateCard();

  if (err) {
    setCardError(err);
    return;
  }

  setCardError("");
  setPlacing(true);

  try {
    const newOrder = {
      items: items.map((item) => ({
        productId: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1,
        image_url: item.image_url || item.image || item.imageUrl,
        seller_name: item.seller_name,
      })),
      total,
      shippingAddress: `${shipping.name}, ${shipping.address}, ${shipping.city} ${shipping.zip}, ${shipping.country}`,
      buyerName: shipping.name,
      status: "placed",
    };

    await API.post("/orders", newOrder);

    localStorage.removeItem("cart");

    setStep("success");
  } catch (error) {
    console.log(error);
    setCardError(
      error.response?.data?.message || "Could not place order. Please try again."
    );
  } finally {
    setPlacing(false);
  }
};
  if (step === "success") {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <CheckCircle className="w-16 h-16 text-[#b6532a] mx-auto mb-4" />

        <h1 className="font-display text-3xl font-semibold mb-2">
          Order placed!
        </h1>

        <p className="text-[#7b6b61] mb-8">
          Thanks for your purchase. You'll find your order in the Orders page.
        </p>

        <div className="flex gap-3 justify-center">
          <Link to="/orders">
            <button className="rounded-full bg-[#b6532a] text-white px-6 py-3">
              View orders
            </button>
          </Link>

          <Link to="/">
            <button className="rounded-full border px-6 py-3">
              Keep shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="font-display text-3xl font-semibold">Your cart is empty</h1>
        <Link to="/">
          <button className="mt-6 rounded-full bg-[#b6532a] text-white px-6 py-3">
            Go shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-10">
      <div className="lg:col-span-3 space-y-6">
        <h1 className="font-display text-3xl font-semibold">Checkout</h1>

        <div className="flex gap-2">
          {["shipping", "payment"].map((s, i) => (
            <button
              key={s}
              onClick={() => step === "payment" && s === "shipping" && setStep("shipping")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                step === s
                  ? "bg-[#b6532a] text-white"
                  : "bg-[#eee4dc] text-[#7b6b61]"
              }`}
            >
              <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">
                {i + 1}
              </span>
              <span className="capitalize">{s}</span>
            </button>
          ))}
        </div>

        {step === "shipping" && (
          <div className="bg-white border border-[#e8ded6] rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold">Shipping address</h2>

            <input className="border rounded-lg px-4 py-3 w-full" placeholder="Full name" value={shipping.name} onChange={(e) => setS("name", e.target.value)} />
            <input className="border rounded-lg px-4 py-3 w-full" placeholder="Street address" value={shipping.address} onChange={(e) => setS("address", e.target.value)} />

            <div className="grid grid-cols-2 gap-4">
              <input className="border rounded-lg px-4 py-3 w-full" placeholder="City" value={shipping.city} onChange={(e) => setS("city", e.target.value)} />
              <input className="border rounded-lg px-4 py-3 w-full" placeholder="ZIP / Postal code" value={shipping.zip} onChange={(e) => setS("zip", e.target.value)} />
            </div>

            <input className="border rounded-lg px-4 py-3 w-full" placeholder="Country" value={shipping.country} onChange={(e) => setS("country", e.target.value)} />

            <button
              className="w-full rounded-full bg-[#b6532a] text-white py-3"
              disabled={!shipping.name || !shipping.address || !shipping.city || !shipping.zip || !shipping.country}
              onClick={() => setStep("payment")}
            >
              Continue to payment
            </button>
          </div>
        )}

        {step === "payment" && (
          <div className="bg-white border border-[#e8ded6] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-5 h-5 text-[#b6532a]" />
              <h2 className="font-semibold">Payment details</h2>
              <Lock className="w-4 h-4 text-[#7b6b61] ml-auto" />
              <span className="text-xs text-[#7b6b61]">Simulated — no real charge</span>
            </div>

            {cardError && (
              <p className="text-sm text-red-700 bg-red-100 rounded-lg px-3 py-2">
                {cardError}
              </p>
            )}

            <input className="border rounded-lg px-4 py-3 w-full" value={payment.card} onChange={(e) => setP("card", formatCard(e.target.value))} placeholder="4242 4242 4242 4242" maxLength={19} />
            <input className="border rounded-lg px-4 py-3 w-full" value={payment.holder} onChange={(e) => setP("holder", e.target.value)} placeholder="Cardholder name" />

            <div className="grid grid-cols-2 gap-4">
              <input className="border rounded-lg px-4 py-3 w-full" value={payment.expiry} onChange={(e) => setP("expiry", formatExpiry(e.target.value))} placeholder="08/27" maxLength={5} />
              <input className="border rounded-lg px-4 py-3 w-full" value={payment.cvv} onChange={(e) => setP("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="CVV" maxLength={4} />
            </div>

            <div className="flex gap-3 pt-2">
              <button className="rounded-full border flex-1 py-3" onClick={() => setStep("shipping")}>
                Back
              </button>

              <button className="rounded-full flex-1 py-3 bg-[#b6532a] text-white flex items-center justify-center" onClick={placeOrder} disabled={placing}>
                {placing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                Pay ${total.toFixed(2)}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white border border-[#e8ded6] rounded-2xl p-5 sticky top-24">
          <h2 className="font-semibold mb-4">Order summary</h2>

          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item._id} className="flex items-center gap-3">
                <img
                  src={
                    item.image_url ||
                    item.image ||
                    item.imageUrl ||
                    "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600"
                  }
                  alt={item.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-[#7b6b61]">Qty: {item.quantity || 1}</p>
                </div>

                <p className="text-sm font-semibold">
                  ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-[#e8ded6] my-3" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#7b6b61]">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#7b6b61]">Shipping</span>
              <span>${shippingFee.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-[#e8ded6] my-3" />

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-[#b6532a]">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}