const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
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

module.exports = mongoose.model("order", orderSchema);