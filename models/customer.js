const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    likes: [String],
    orders: [{ id: String, quantity: Number }],
    contact: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
