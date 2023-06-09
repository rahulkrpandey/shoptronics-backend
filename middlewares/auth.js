const bcrypt = require('bcrypt');
const { findCustomerWithEmail } = require('../utils/utils');
const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
        const data = jwt.verify(token, process.env.JWT_KEY);
        req.headers.userId = data.id;
        req.headers.isAdmin = data.isAdmin;
        next();
    } catch (err) {
        res.status(err.status || 500).send(err.message);
    }
};

const verifyCustomerLogin = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            const err = new Error("Email or password is missing");
            err.status = 400;
            throw err;
        }

        const user = await findCustomerWithEmail(req.body.email);
        if (user === null) {
            const err = new Error("User not found");
            err.status = 404;
            throw err;
        }

        const comparePass = await bcrypt.compare(req.body.password, user.password);
        if (comparePass === false) {
            const err = new Error("Authentication failed");
            err.status = 401;
            throw err;
        }

        const customer = JSON.parse(JSON.stringify(user));
        delete customer.password;
        delete customer.__v
        req.body.customer = customer;
        next();
    } catch (err) {
        return res.status(err.status || 500).send(err.message || "Internal server error");
    }
}

const verifyAdmin = async (req, res, next) => {
    try {
        if (!req.headers.isAdmin) {
            const err = new Error("You are not authorized");
            err.status = 401;
            throw err;
        }

        next();
    } catch (err) {
        return res.status(err.status || 500).send(err.message || "Internal server error");
    }
}

module.exports = {
    verifyCustomerLogin,
    verifyAdmin,
    verifyToken
}