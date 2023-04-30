const Customer = require('../models/customer');
const mongoose = require('mongoose');
const Category = require('../models/category');
const Order = require('../models/order');

// related to user
const findCustomerWithId = async (id) => {
    try {
        const customer = await Customer.findOne({
            _id: id
        });

        if (customer === null) {
            const err = Error("Customer not found");
            err.status = 400;
            throw err;
        }

        return customer;
    } catch (err) {
        throw err;
    }
};

const findCustomerWithEmail = async (email) => {
    try {
        const customer = await Customer.findOne({
            email: email
        });

        if (customer === null) {
            const err = Error("Customer not found");
            err.status = 400;
            throw err;
        }

        return customer;
    } catch (err) {
        throw err;
    }
}

// related to category
const findCategory = async (_id) => {
    try {
        // const id = new mongoose.Types.ObjectId(_id);
        const id = _id;
        const category = await Category.findOne({
            _id: id
        });

        if (category === null) {
            const err = new Error("Given category is not found");
            err.status = 400;
            throw err;
        }

        return category;
    } catch (err) {
        throw err;
    }
};

// related to order
const findOrder = async (id) => {
    try {
        const order = await Order.findOne({
            _id: id
        });

        if (order === null) {
            const err = new Error("Given order is not found");
            err.status = 400;
            throw err;
        }

        return order;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    findCustomerWithEmail,
    findCustomerWithId,
    findCategory,
    findOrder
}