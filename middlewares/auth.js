const bcrypt = require('bcrypt');
const { findCustomerWithEmail } = require('../utils/utils');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.body.authorization ? req.body.authorization.split(' ')[1] : null;
        const data = jwt.verify(token, process.env.JWT_KEY);
        req.header.userId = data.id;
        next();
    } catch (err) {
        res.status(err).send(err.message);
    }
};

const verifyCustomer = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            const err = new Error("Email or password is missing");
            err.status = 400;
            throw err;
        }

        const user = await findCustomerWithEmail(req.body.email);
        if (user === null) {
            const err = new Error("User not found");
            err.status = 400;
            throw err;
        }

        const comparePass = await bcrypt.compare(req.body.password, user.password);
        if (comparePass === false) {
            const err = new Error("Authentication failed");
            err.status = 400;
            throw err;
        }

        const customer = JSON.parse(JSON.stringify(user));
        delete customer.password;
        delete customer.__v
        req.body.customer = customer;
        next();
    } catch (err) {
        return res.status(err.status).send(err.message);
    }
}

module.exports = {
    verifyCustomer,
    verifyToken
}