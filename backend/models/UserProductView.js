const mongoose = require("mongoose");

const userProductViewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // We store category explicitly to quickly find "related" categories without joining Product every time
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false, 
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes are crucial for performance in a recommendation system
// 1. To quickly retrieve a user's recently viewed products:
userProductViewSchema.index({ userId: 1, viewedAt: -1 });

// 2. To avoid duplicates efficiently (we can use upsert operations):
userProductViewSchema.index({ userId: 1, productId: 1 }, { unique: false });

// 3. TTL Index: Automatically expire old views after 30 days to keep the collection small and relevant
userProductViewSchema.index({ viewedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const UserProductView = mongoose.model("UserProductView", userProductViewSchema);

module.exports = UserProductView;
