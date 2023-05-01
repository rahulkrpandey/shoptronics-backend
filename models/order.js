const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    customerId: { type: String, required: true },
    productIds: {
        type: [{ id: String, quantity: Number }], required: true
    },
    date: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;