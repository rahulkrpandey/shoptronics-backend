const Customer = require('../models/customer');
const Category = require('../models/category');
const Order = require('../models/order');
const Product = require('../models/product');

// related to user
const findCustomerWithId = async (id) => {
    try {
        const customer = await Customer.findOne({
            _id: id
        });

        if (customer === null) {
            const err = Error("Customer not found");
            err.status = 404;
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
            err.status = 404;
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
            err.status = 404;
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
            err.status = 404;
            throw err;
        }

        return order;
    } catch (err) {
        throw err;
    }
};

// related to product
const findProduct = async (id) => {
    try {
        const product = await Product.findOne({
            _id: id
        })

        if (product === null) {
            const err = new Error("Given product is not found");
            err.status = 404;
            throw err;
        }

        return product;
    } catch (err) {
        throw err;
    }
};

const findProductsByCategory = async (category, count) => {
    try {
        const products = await Product.find({
            categories: {
                $in: [category]
            }
        }).limit(count);

        return products;
    } catch (err) {
        throw err;
    }
};


module.exports = {
    findCustomerWithEmail,
    findCustomerWithId,
    findCategory,
    findOrder,
    findProduct,
    findProductsByCategory
}