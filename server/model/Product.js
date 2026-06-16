const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    image_url: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      default: 0,
    },

    seller_name: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "sold_out"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);