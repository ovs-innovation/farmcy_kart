require("dotenv").config();
const { connectDB } = require("../config/db");
const Setting = require("../models/Setting");
const settingData = require("../utils/settings");

const seedSettings = async () => {
  try {
    await connectDB();
    
    for (const data of settingData) {
      await Setting.findOneAndUpdate(
        { name: data.name },
        { $set: { setting: data.setting } },
        { upsert: true, new: true }
      );
      console.log(`✅ Seeded setting: ${data.name}`);
    }
    
    console.log("🚀 Settings seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding settings:", error.message);
    process.exit(1);
  }
};

seedSettings();
