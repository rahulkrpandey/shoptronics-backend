const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    customerId: { type: String, required: true },
    productId: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    date: { type: Date, default: Date.now },
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;