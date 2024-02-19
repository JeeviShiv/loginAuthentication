const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    productName: String,
    description: String,
    price: String,
    dateCreated: { type: String, default: Date}
});
mongoose.model('products',ProductSchema);

module.exports = mongoose.model('products');
