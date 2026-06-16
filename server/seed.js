const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Product = require("./model/Product"); // change to ./models/Product if needed

const products = [
  {
    title: "iPhone",
    description: "Good condition",
    price: 1600,
    category: "electronics",
    image_url:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
    stock: 6,
    seller_name: "Gurrasanpreet Singh",
    status: "active",
  },
  {
    title: "Wireless Headphones",
    description:
      "Barely used over-ear headphones with great sound and long battery life.",
    price: 45,
    category: "electronics",
    image_url:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    stock: 2,
    seller_name: "Demo Seller",
    status: "active",
  },
  {
    title: "Calculus Textbook",
    description:
      "Calculus: Early Transcendentals, 8th edition. Light highlighting inside.",
    price: 25,
    category: "books",
    image_url:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600",
    stock: 0,
    seller_name: "Demo Seller",
    status: "sold_out",
  },
  {
    title: "Skateboard",
    description:
      '7.75" deck, smooth wheels, perfect for getting around campus.',
    price: 60,
    category: "sports",
    image_url:
      "https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=600",
    stock: 1,
    seller_name: "Demo Seller",
    status: "active",
  },
  {
    title: "Desk Lamp",
    description:
      "Minimal LED desk lamp with three brightness levels.",
    price: 18,
    category: "home",
    image_url:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600",
    stock: 3,
    seller_name: "Demo Seller",
    status: "active",
  },
  {
    title: "Denim Jacket",
    description:
      "Classic blue denim jacket, size M, excellent condition.",
    price: 30,
    category: "fashion",
    image_url:
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600",
    stock: 1,
    seller_name: "Demo Seller",
    status: "active",
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("✅ Products Seeded Successfully");

    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });