require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
// const http = require("http");
// const { Server } = require("socket.io");

const { connectDB } = require("../config/db");
const productRoutes = require("../routes/productRoutes");
const customerRoutes = require("../routes/customerRoutes");
const adminRoutes = require("../routes/adminRoutes");
const orderRoutes = require("../routes/orderRoutes");
const customerOrderRoutes = require("../routes/customerOrderRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const brandRoutes = require("../routes/brandRoutes");
const couponRoutes = require("../routes/couponRoutes");
const attributeRoutes = require("../routes/attributeRoutes");
const settingRoutes = require("../routes/settingRoutes");
const currencyRoutes = require("../routes/currencyRoutes");
const languageRoutes = require("../routes/languageRoutes");
const notificationRoutes = require("../routes/notificationRoutes");
const shiprocketRoutes = require("../routes/shiprocketRoutes");
const taxRoutes = require("../routes/taxRoutes");
const reviewRoutes = require("../routes/reviewRoutes");
const faqRoutes = require("../routes/faqRoutes");
const newsletterRoutes = require("../routes/newsletterRoutes");
const prescriptionRoutes = require("../routes/prescriptionRoutes");
const testimonialRoutes = require("../routes/testimonialRoutes");
const locationRoutes = require("../routes/locationRoutes");
const { isAuth, isAdmin } = require("../config/auth");
// const {
//   getGlobalSetting,
//   getStoreCustomizationSetting,
// } = require("../lib/notification/setting");

connectDB();
const app = express();

// We are using this for the express-rate-limit middleware
// See: https://github.com/nfriedly/express-rate-limit
// app.enable('trust proxy');
app.set("trust proxy", 1);

// CORS configuration - allow all origins
app.options("*", cors()); // include before other routes
app.use(cors());

app.use(express.json({ limit: "10mb" })); // Increased for review images
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
}));

//root route
app.get("/", (req, res) => {
  res.send("App works properly!");
});

//this for route will need for store front, also for admin dashboard
app.use("/api/products", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/order", customerOrderRoutes);
app.use("/api/attributes", attributeRoutes);
app.use("/api/setting", settingRoutes);
app.use("/api/currency", currencyRoutes);
app.use("/api/language", languageRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/shiprocket", shiprocketRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/location", locationRoutes);

//if you not use admin dashboard then these two route will not needed.
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);

// Use express's default error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});

// Serve static files from the "public" directory
app.use("/static", express.static(path.join(__dirname, "../public")));

// 404 Handler for undefined routes
app.use((req, res) => {
  console.log(`404 - Route Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
  });
});

const PORT = process.env.PORT || 5000;

// const server = http.createServer(app);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

// app.listen(PORT, () => console.log(`server running on port ${PORT}`));

// set up socket
// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:4100",
//       "https://admin-E-HealthandHerbs.vercel.app",
//       "https://dashtar-admin.vercel.app",
//       "https://E-HealthandHerbs-store.vercel.app",
//       "https://E-HealthandHerbs-admin.netlify.app",
//       "https://dashtar-admin.netlify.app",
//       "https://E-HealthandHerbs-store-nine.vercel.app",
//     ], //add your origin here instead of this
//     methods: ["PUT", "GET", "POST", "DELETE", "PATCH", "OPTIONS"],
//     credentials: false,
//     transports: ["websocket"],
//   },
// });

// io.on("connection", (socket) => {
//   // console.log(`Socket ${socket.id} connected!`);

//   socket.on("notification", async (data) => {
//     console.log("data", data);
//     try {
//       let updatedData = data;

//       if (data?.option === "storeCustomizationSetting") {
//         const storeCustomizationSetting = await getStoreCustomizationSetting(
//           data
//         );
//         updatedData = {
//           ...data,
//           storeCustomizationSetting: storeCustomizationSetting,
//         };
//       }
//       if (data?.option === "globalSetting") {
//         const globalSetting = await getGlobalSetting(data);
//         updatedData = {
//           ...data,
//           globalSetting: globalSetting,
//         };
//       }
//       io.emit("notification", updatedData);
//     } catch (error) {
//       console.error("Error handling notification:", error);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log(`Socket ${socket.id} disconnected!`);
//   });
// });
// server.listen(PORT, () => console.log(`server running on port ${PORT}`));
