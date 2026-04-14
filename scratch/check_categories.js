const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require('mongoose');
require('dotenv').config({ path: '../backend/.env' });

const categorySchema = new mongoose.Schema({
    name: Object,
    parentId: String,
    status: String,
    id: String
});

const Category = mongoose.model('Category', categorySchema);

async function checkCategories() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        const categories = await Category.find({});
        console.log(`Total categories found: ${categories.length}`);

        const shownCategories = categories.filter(c => c.status === 'show');
        console.log(`Shown categories: ${shownCategories.length}`);

        const roots = categories.filter(c => !c.parentId);
        console.log(`Roots (no parentId): ${roots.length}`);
        roots.forEach(r => console.log(` - ${r.name?.en || r.name} (id: ${r.id}, _id: ${r._id}, status: ${r.status})`));

        if (roots.length > 0) {
            const firstRoot = roots[0];
            const childrenOfFirstRoot = categories.filter(c => c.parentId === firstRoot._id.toString() || c.parentId === firstRoot.id);
            console.log(`Children of first root (${firstRoot.name?.en}): ${childrenOfFirstRoot.length}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkCategories();
