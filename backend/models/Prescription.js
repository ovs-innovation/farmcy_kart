const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },
    files: [
      {
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["image", "pdf"],
          required: true,
        },
        fileName: {
          type: String,
          required: false,
        },
        fileSize: {
          type: Number,
          required: false,
        },
      },
    ],
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "processed", "rejected"],
    },
    medicines: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        title: String,
        price: Number,
        image: String,
        quantity: Number,
        dosage: String,
      },
    ],
    notes: {
      type: String,
      required: false,
    },
    isAddedToCart: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;

