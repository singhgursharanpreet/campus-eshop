const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    buyerName: String,
    shippingAddress: String,

    items: [
      {
        productId: String,
        title: String,
        price: Number,
        quantity: Number,
        image_url: String,
        seller_name: String,
      },
    ],

    total: Number,

    status: {
      type: String,
      default: "placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);