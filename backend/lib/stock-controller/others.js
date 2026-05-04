require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../../models/Product");

// const base = 'https://api-m.sandbox.paypal.com';

// Create separate MongoDB connection only if MONGO_URI is available
// Note: This connection is not currently used in this file, but kept for potential future use
let mongo_connection = null;
if (process.env.MONGO_URI) {
  try {
    mongo_connection = mongoose.createConnection(process.env.MONGO_URI, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      keepAlive: 1,
      poolSize: 100,
      bufferMaxEntries: 0,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    });
  } catch (err) {
    console.warn("Warning: Could not create separate MongoDB connection:", err.message);
  }
} else {
  console.warn("Warning: MONGO_URI not set in environment variables. Separate connection not created.");
}

// decrease product quantity after a order created
const handleProductQuantity = async (cart) => {
  try {
    for (const p of cart) {
      if (p?.isCombination) {
        // Handle variant quantity updates
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: p._id,
            "variants.productId": p?.variant?.productId || "",
            stock: { $gte: p.quantity },
            "variants.quantity": { $gte: p.quantity },
          },
          {
            $inc: {
              stock: -p.quantity,
              "variants.$.quantity": -p.quantity,
              sales: p.quantity,
            },
          },
          {
            new: true,
          }
        );
        if (!updatedProduct) {
          console.error(`Failed to decrease stock for combination product ${p._id}. Insufficient stock.`);
        }
      } else {
        // Handle regular product quantity updates
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: p._id,
            stock: { $gte: p.quantity },
          },
          {
            $inc: {
              stock: -p.quantity,
              sales: p.quantity,
            },
          },
          {
            new: true,
          }
        );
        if (!updatedProduct) {
          console.error(`Failed to decrease stock for product ${p._id}. Insufficient stock.`);
        }
      }
    }
  } catch (err) {
    console.log("err on handleProductQuantity", err.message);
  }
};

const checkStock = async (cart) => {
  try {
    if (!cart || !Array.isArray(cart)) {
      console.log("checkStock: cart is not an array", cart);
      return [];
    }
    const outOfStockItems = [];
    for (const item of cart) {
      const itemId = item._id || item.id;
      if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
        console.log("checkStock: invalid itemId", itemId);
        continue;
      }

      const product = await Product.findById(itemId);
      if (!product) {
        console.log("checkStock: product not found for itemId:", itemId);
        console.log("checkStock: full item object:", JSON.stringify(item));
        outOfStockItems.push({
          _id: itemId,
          id: item.id,
          title: item.title || "Unknown Product",
          reason: "Product not found in database",
        });
        continue;
      }

      if (item.isCombination) {
        const variantId = item.variant?.productId || item.variant?._id || item.variant?.id;
        if (!variantId) {
          console.log("checkStock: variantId missing for combination product", itemId);
          outOfStockItems.push({
            _id: itemId,
            id: item.id,
            title: item.title,
            reason: "Variant information missing",
          });
          continue;
        }

        const variant = product.variants?.find(
          (v) => (v.productId || v._id || v.id)?.toString() === variantId?.toString()
        );

        if (!variant) {
          console.log("checkStock: variant not found", variantId, "in product", itemId);
          outOfStockItems.push({
            _id: itemId,
            id: item.id,
            title: item.title,
            reason: "Variant not found",
          });
          continue;
        }

        if (variant.quantity < item.quantity) {
          console.log("checkStock: variant out of stock", variantId, "available:", variant.quantity, "requested:", item.quantity);
          outOfStockItems.push({
            _id: itemId,
            id: item.id,
            title: item.title,
            variantId: variantId,
            available: variant.quantity,
            requested: item.quantity,
          });
        }
      } else {
        if (product.stock < item.quantity) {
          console.log("checkStock: product out of stock", itemId, "available:", product.stock, "requested:", item.quantity);
          outOfStockItems.push({
            _id: itemId,
            id: item.id,
            title: item.title,
            available: product.stock,
            requested: item.quantity,
          });
        }
      }
    }
    return outOfStockItems;
  } catch (err) {
    console.error("err on checkStock:", err.message);
    return [];
  }
};

const handleProductAttribute = async (key, value, multi) => {
  try {
    // const products = await Product.find({ 'variants.1': { $exists: true } });
    const products = await Product.find({ isCombination: true });

    // console.log('products', products);

    if (multi) {
      for (const p of products) {
        await Product.updateOne(
          { _id: p._id },
          {
            $pull: {
              variants: { [key]: { $in: value } },
            },
          }
        );
      }
    } else {
      for (const p of products) {
        // console.log('p', p._id);
        await Product.updateOne(
          { _id: p._id },
          {
            $pull: {
              variants: { [key]: value },
            },
          }
        );
      }
    }
  } catch (err) {
    console.log("err, when delete product variants", err.message);
  }
};

module.exports = {
  handleProductQuantity,
  handleProductAttribute,
  checkStock,
};