const mongoose = require("mongoose");
require("dotenv").config();
const Category = require("../models/Category");
const Product = require("../models/Product");

const seedLiveDemo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB for Live Demo...");

    // 1. Create Category
    const categoryName = { en: "Live Demo Category" };
    const categorySlug = "live-demo-category";
    
    let category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      category = new Category({
        name: categoryName,
        slug: categorySlug,
        status: "show",
        id: "LIVE_DEMO",
        icon: "https://res.cloudinary.com/ahossain/image/upload/v1636729752/placeholder_pjt8p2.png"
      });
      await category.save();
      console.log("Category created: Live Demo Category");
    }

    // 2. Create Sub-category
    const subName = { en: "Live Demo Sub" };
    const subSlug = "live-demo-sub";
    let subCategory = await Category.findOne({ slug: subSlug });
    if (!subCategory) {
      subCategory = new Category({
        name: subName,
        slug: subSlug,
        parentId: category._id,
        parentName: "Live Demo Category",
        status: "show",
        id: "LIVE_DEMO_SUB",
      });
      await subCategory.save();
      console.log("Sub-category created: Live Demo Sub");
    }

    // 3. Create Product
    const productTitle = { en: "Live Demo Medicine" };
    const productSlug = "live-demo-medicine";
    
    let product = await Product.findOne({ slug: productSlug });
    if (product) {
        await Product.deleteOne({ _id: product._id });
    }

    product = new Product({
      title: productTitle,
      slug: productSlug,
      description: { en: "This is a live test medicine added by AI for demonstration." },
      category: category._id,
      categories: [category._id],
      isCombination: false,
      prices: {
        price: 150,
        originalPrice: 200,
        discount: 50
      },
      stock: 100,
      status: "show",
      image: ["https://res.cloudinary.com/ahossain/image/upload/v1636729752/placeholder_pjt8p2.png"],
      sku: "LIVE-TEST-001",
      barcode: "123456789"
    });

    await product.save();
    console.log("Product created: Live Demo Medicine");

    console.log("\n✅ LIVE DEMO DATA ADDED SUCCESSFULLY!");
    console.log("Category: Live Demo Category");
    console.log("Sub-category: Live Demo Sub");
    console.log("Product: Live Demo Medicine");
    
    process.exit(0);
  } catch (error) {
    console.error("Live demo error:", error);
    process.exit(1);
  }
};

seedLiveDemo();
