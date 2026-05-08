const mongoose = require('mongoose');
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const Customer = mongoose.model('Customer', new mongoose.Schema({
      phone: String,
      email: String,
      name: String
    }));
    
    const users = await Customer.find({ phone: { $exists: true } }).limit(5);
    console.log('Sample Users with Phone:');
    users.forEach(u => {
      console.log(`- Name: ${u.name}, Phone: "${u.phone}"`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUsers();
