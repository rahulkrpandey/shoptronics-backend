const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const bcrypt = require('bcrypt');

const { verifyAdmin, verifyToken } = require('../middlewares/auth');
const { findCustomerWithId } = require('../utils/utils');

router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const userId = req.query.userId;

        const user = JSON.parse(JSON.stringify(await findCustomerWithId(userId)));
        delete user.password;
        res.status(200).json(user);
    } catch (err) {
        res.status(err.status || 500).send(err.message || "Internal server error");
    }
})

router.patch('/update', verifyToken, async (req, res) => {
    try {
        const customer = await findCustomerWithId(req.headers.userId);

        const body = req.body;
        if (body.data.password) {
            const err = new Error("Password can not be updated");
            err.status = 403;
            throw err;
        }

        await Customer.updateOne({ _id: customer._id }, { ...body.data });
        return res.status(200).json(await findCustomerWithId(customer.id));
    } catch (err) {
        res.status(err.status || 500).send(err.message || "Internal server error");
    }
});

router.patch('/password', verifyToken, async (req, res) => {
    try {
        const data = req.body.data;
        if (!data || !data.newPassword || !data.oldPassword) {
            throw new Error("New password or old password not found");
        }

        const customer = await findCustomerWithId(req.headers.userId);
        const compare = await bcrypt.compare(data.oldPassword, customer.password);
        if (compare === false) {
            throw new Error("Wrong password");
        }

        const salt = 10;
        customer.password = await bcrypt.hash(data.newPassword, salt);
        await customer.save();
        return res.status(200).send("Password is updated");
    } catch (err) {
        res.status(err.status || 500).send(err.message || "Internal server error");
    }
});

router.delete('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const data = req.body.data;
        if (!data || !data.customerId) {
            throw new Error("User not found");
        }

        await Customer.deleteOne({ _id: data.customerId });
        res.status(200).send("User is deleted");
    } catch (err) {
        res.status(err.status || 500).send(err.message || "Internal server error");
    }
});

module.exports = router;