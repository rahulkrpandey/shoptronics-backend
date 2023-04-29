const Customer = require('../models/customer');

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

module.exports = {
    findCustomerWithEmail,
    findCustomerWithId
}