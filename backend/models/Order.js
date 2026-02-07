const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },
    invoice: {
      type: Number,
      required: false,
    },
    cart: [{}],
    user_info: {
      name: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },
      contact: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
      zipCode: {
        type: String,
        required: false,
      },
    },
    subTotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    taxSummary: {
      inclusiveTax: { type: Number, default: 0 },
      exclusiveTax: { type: Number, default: 0 },
      totalTax: { type: Number, default: 0 },
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    coupon: {
      couponCode: { type: String, default: null },
      discountAmount: { type: Number, default: 0 },
    },

    total: {
      type: Number,
      required: true,
    },
    shippingOption: {
      type: String,
      required: false,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    cardInfo: {
      type: Object,
      required: false,
    },
    shiprocket: {
      order_id: { type: String },
      shipment_id: { type: Number },
      status: { type: String },
      awb_code: { type: String },
      courier_name: { type: String },
      courier_id: { type: Number },
      label_url: { type: String },
      invoice_url: { type: String },
      pickup_status: { type: String },
      last_synced: { type: Date },
      tracking_data: { type: Object },
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancel"],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model(
  "Order",
  orderSchema.plugin(AutoIncrement, {
    inc_field: "invoice",
    start_seq: 10000,
  })
);
module.exports = Order;
