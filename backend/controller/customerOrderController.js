require("dotenv").config();
const stripe = require("stripe");
const Razorpay = require("razorpay");
const MailChecker = require("mailchecker");
// const stripe = require("stripe")(`${process.env.STRIPE_KEY}` || null); /// use hardcoded key if env not work

const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");
const Setting = require("../models/Setting");
const Brand = require("../models/Brand");
const { sendEmail } = require("../lib/email-sender/sender");
const { formatAmountForStripe } = require("../lib/stripe/stripe");
const { handleCreateInvoice } = require("../lib/email-sender/create");
const {
  handleProductQuantity,
  checkStock,
} = require("../lib/stock-controller/others");
const customerInvoiceEmailBody = require("../lib/email-sender/templates/order-to-customer");

// Helper function to populate brand names in order cart items
const populateBrandNames = async (order) => {
  if (order && order.cart && order.cart.length > 0) {
    // Get all unique brand IDs from cart items
    const brandIds = [...new Set(
      order.cart
        .filter(item => item.brand && mongoose.Types.ObjectId.isValid(item.brand))
        .map(item => item.brand)
    )];
    
    // Fetch brand names if there are brand IDs
    if (brandIds.length > 0) {
      const brands = await Brand.find({ _id: { $in: brandIds } }).select('_id name');
      const brandMap = {};
      brands.forEach(brand => {
        // Handle multilingual name object - get English name or first available
        const nameObj = brand.name || {};
        brandMap[brand._id.toString()] = nameObj.en || nameObj[Object.keys(nameObj)[0]] || '-';
      });
      
      // Replace brand IDs with brand names in cart items
      order.cart = order.cart.map(item => {
        if (item.brand && brandMap[item.brand]) {
          return { ...item, brand: brandMap[item.brand] };
        }
        return item;
      });
    }
  }
  return order;
};

// Helper function to populate taxRate and HSN in cart items from Product collection
const populateCartTaxFields = async (cart) => {
  if (!cart || cart.length === 0) return cart;
  
  // Get all unique product IDs from cart items
  const productIds = [...new Set(
    cart
      .filter(item => item.productId || item.id || item._id)
      .map(item => item.productId || item.id || item._id)
      .filter(id => mongoose.Types.ObjectId.isValid(id))
  )];
  
  // Fetch product tax fields if there are product IDs
  if (productIds.length > 0) {
    const products = await Product.find({ _id: { $in: productIds } }).select('_id taxRate hsnCode');
    const productMap = {};
    products.forEach(product => {
      productMap[product._id.toString()] = {
        taxRate: product.taxRate || 0,
        hsnCode: product.hsnCode || ''
      };
    });
    
    // Add taxRate and hsnCode to cart items
    cart = cart.map(item => {
      const productId = item.productId || item.id || item._id;
      if (productId && productMap[productId]) {
        return { 
          ...item, 
          taxRate: item.taxRate || productMap[productId].taxRate,
          hsn: item.hsn || item.hsnCode || productMap[productId].hsnCode
        };
      }
      return item;
    });
  }
  
  return cart;
};

const addOrder = async (req, res) => {
  // console.log("addOrder", req.body);
  try {
    const outOfStockItems = await checkStock(req.body.cart);
    if (outOfStockItems.length > 0) {
      return res.status(400).send({
        message: "Some items are out of stock",
        outOfStockItems,
      });
    }

    // console.log("addOrder: Creating order for user:", req.user ? req.user._id : "Guest (null)");

    const newOrder = new Order({
      ...req.body,
      user: req.user?._id || null,
    });
    const order = await newOrder.save();
    res.status(201).send(order);
    handleProductQuantity(order.cart);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

//create payment intent for stripe
const createPaymentIntent = async (req, res) => {
  const { total: amount, cardInfo: payment_intent, email } = req.body;
  // console.log("req.body", req.body);
  // Validate the amount that was passed from the client.
  if (!(amount >= process.env.MIN_AMOUNT && amount <= process.env.MAX_AMOUNT)) {
    return res.status(500).json({ message: "Invalid amount." });
  }
  const storeSetting = await Setting.findOne({ name: "storeSetting" });
  const stripeSecret = storeSetting?.setting?.stripe_secret;
  const stripeInstance = stripe(stripeSecret);
  if (payment_intent.id) {
    try {
      const current_intent = await stripeInstance.paymentIntents.retrieve(
        payment_intent.id
      );
      // If PaymentIntent has been created, just update the amount.
      if (current_intent) {
        const updated_intent = await stripeInstance.paymentIntents.update(
          payment_intent.id,
          {
            amount: formatAmountForStripe(amount, "usd"),
          }
        );
        // console.log("updated_intent", updated_intent);
        return res.send(updated_intent);
      }
    } catch (err) {
      // console.log("error", err);

      if (err.code !== "resource_missing") {
        const errorMessage =
          err instanceof Error ? err.message : "Internal server error";
        return res.status(500).send({ message: errorMessage });
      }
    }
  }
  try {
    // Create PaymentIntent from body params.
    const params = {
      amount: formatAmountForStripe(amount, "usd"),
      currency: "usd",
      description: process.env.STRIPE_PAYMENT_DESCRIPTION || "",
      automatic_payment_methods: {
        enabled: true,
      },
    };
    const payment_intent = await stripeInstance.paymentIntents.create(params);
    // console.log("payment_intent", payment_intent);

    res.send(payment_intent);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).send({ message: errorMessage });
  }
};

const createOrderByRazorPay = async (req, res) => {
  console.log("--- createOrderByRazorPay Start ---");
  console.log("Request Body:", JSON.stringify(req.body, null, 2));
  try {
    if (req.body.cart) {
      console.log("Checking stock for cart items...");
      const outOfStockItems = await checkStock(req.body.cart);
      if (outOfStockItems.length > 0) {
        console.log("Stock check failed:", JSON.stringify(outOfStockItems));
        return res.status(400).send({
          message: "Some items in your cart are out of stock.",
          outOfStockItems,
        });
      }
      console.log("Stock check passed.");
    }

    // If this is just a stock check request, return success early
    if (req.body.checkOnly) {
      return res.send({ message: "Stock check passed" });
    }

    console.log("Fetching store settings...");
    const storeSetting = await Setting.findOne({ name: "storeSetting" });

    if (!storeSetting || !storeSetting.setting) {
      console.log("Store settings not found in database.");
      return res.status(400).send({
        message: "Store settings (storeSetting) not found in database. Please configure them in the admin panel.",
      });
    }

    const razorpayId = storeSetting?.setting?.razorpay_id;
    const razorpaySecret = storeSetting?.setting?.razorpay_secret;
    const razorpayStatus = storeSetting?.setting?.razorpay_status;

    console.log("Razorpay Status:", razorpayStatus);
    console.log("Razorpay ID:", razorpayId ? "Present" : "Missing");
    console.log("Razorpay Secret:", razorpaySecret ? "Present" : "Missing");

    if (!razorpayStatus) {
      console.log("Razorpay is disabled in settings.");
      return res.status(400).send({
        message: "Razorpay payment gateway is not enabled in store settings.",
      });
    }

    if (!razorpayId || !razorpaySecret) {
      console.log("Razorpay credentials missing.");
      return res.status(400).send({
        message: "Razorpay Key ID or Secret Key is missing in store settings.",
      });
    }

    const amount = parseFloat(req.body.amount);
    console.log("Parsed Amount:", amount);

    if (isNaN(amount) || amount <= 0) {
      console.log("Invalid amount detected.");
      return res.status(400).send({
        message: `Invalid amount: ${req.body.amount}. Amount must be a number greater than 0.`,
      });
    }

    console.log("Initializing Razorpay instance...");
    const instance = new Razorpay({
      key_id: razorpayId,
      key_secret: razorpaySecret,
    });

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    console.log("Creating Razorpay order with options:", JSON.stringify(options));
    const order = await instance.orders.create(options);

    if (!order || !order.id) {
      console.log("Razorpay order creation returned no ID.");
      return res.status(500).send({
        message: "Error occurred when creating Razorpay order!",
      });
    }

    console.log("Razorpay order created successfully:", order.id);
    res.send(order);
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    res.status(500).send({
      message: err.message || "Failed to create Razorpay order. Please check your credentials.",
    });
  } finally {
    console.log("--- createOrderByRazorPay End ---");
  }
};

const addRazorpayOrder = async (req, res) => {
  try {
    const outOfStockItems = await checkStock(req.body.cart);
    if (outOfStockItems.length > 0) {
      return res.status(400).send({
        message: "Some items in your cart are out of stock.",
        outOfStockItems,
      });
    }

    const newOrder = new Order({
      ...req.body,
      user: req.user?._id || null,
    });
    const order = await newOrder.save();
    res.status(201).send(order);
    handleProductQuantity(order.cart);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get all orders user
const getOrderCustomer = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      console.log("getOrderCustomer: No req.user or req.user._id", req.user);
      return res.status(401).send({
        message: "User not authenticated",
      });
    }
    console.log("getOrderCustomer for user:", req.user._id);
    const { page, limit } = req.query;

    const pages = Number(page) || 1;
    const limits = Number(limit) || 8;
    const skip = (pages - 1) * limits;

    const totalDoc = await Order.countDocuments({ user: req.user._id });

    // total padding order count
    const totalPendingOrder = await Order.aggregate([
      {
        $match: {
          status: "Pending",
          user: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // total padding order count
    const totalProcessingOrder = await Order.aggregate([
      {
        $match: {
          status: "Processing",
          user: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const totalDeliveredOrder = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
          user: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // today order amount

    // query for orders
    const orders = await Order.find({ user: req.user._id })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limits);

    // Populate brand names in all orders
    const ordersWithBrandNames = await Promise.all(
      orders.map(order => populateBrandNames(order.toObject()))
    );

    res.send({
      orders: ordersWithBrandNames,
      limits,
      pages,
      pending: totalPendingOrder.length === 0 ? 0 : totalPendingOrder[0].count,
      processing:
        totalProcessingOrder.length === 0 ? 0 : totalProcessingOrder[0].count,
      delivered:
        totalDeliveredOrder.length === 0 ? 0 : totalDeliveredOrder[0].count,

      totalDoc,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const getOrderById = async (req, res) => {
  try {
    // console.log("getOrderById");
    const order = await Order.findById(req.params.id);
    
    // Populate brand names in cart items
    let orderWithBrandNames = await populateBrandNames(order.toObject());
    
    // Populate taxRate and HSN from Product collection
    orderWithBrandNames.cart = await populateCartTaxFields(orderWithBrandNames.cart);
    
    res.send(orderWithBrandNames);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const sendEmailInvoiceToCustomer = async (req, res) => {
  try {
    const user = req.body.user_info;
    // Validate email using MailChecker
    // Validate email using MailChecker
    if (!MailChecker.isValid(user?.email)) {
      // Return a response indicating invalid email instead of using process.exit
      return res.status(400).send({
        message:
          "Invalid or disposable email address. Please provide a valid email.",
      });
    }
    // console.log("sendEmailInvoiceToCustomer");
    const pdf = await handleCreateInvoice(req.body, `${req.body.invoice}.pdf`);
    const globalSetting = await Setting.findOne({ name: "globalSetting" });

    const option = {
      date: req.body.date,
      invoice: req.body.invoice,
      status: req.body.status,
      method: req.body.paymentMethod,
      subTotal: req.body.subTotal,
      total: req.body.total,
      discount: req.body.discount,
      shipping: req.body.shippingCost,
      currency: req.body.company_info.currency,
      company_name: req.body.company_info.company,
      company_address: req.body.company_info.address,
      company_phone: req.body.company_info.phone,
      company_email: req.body.company_info.email,
      company_website: req.body.company_info.website,
      vat_number: req.body?.company_info?.vat_number,
      name: user?.name,
      email: user?.email,
      contact_email: globalSetting?.setting?.email || "support@Farmacykart.com",
      shop_name: globalSetting?.setting?.shop_name || "Farmacykart",
      phone: user?.phone,
      address: user?.address,
      cart: req.body.cart,
    };

    const body = {
      from: globalSetting?.setting?.email || req.body.company_info?.from_email || "sales@dummy.com",
      to: user.email,
      subject: `Your Order - ${req.body.invoice} at ${globalSetting?.setting?.shop_name || req.body.company_info.company}`,
      html: customerInvoiceEmailBody(option),
      attachments: [
        {
          filename: `${req.body.invoice}.pdf`,
          content: pdf,
        },
      ],
    };
    const message = `Invoice successfully sent to the customer ${user.name}`;
    try {
      await sendEmail(body);
      res.send({ message });
    } catch (emailErr) {
      console.error("Email send failed (non-blocking):", emailErr.message || emailErr);
      res.status(200).send({ message, emailError: emailErr.message || String(emailErr) });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addOrder,
  getOrderById,
  getOrderCustomer,
  createPaymentIntent,
  createOrderByRazorPay,
  addRazorpayOrder,
  sendEmailInvoiceToCustomer,
};
