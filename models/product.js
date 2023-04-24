const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    categories: { type: [ String ], required: true, default: [] },
    name: { type: String, required: true },
    description: { type: String, required: true },
    likes: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;