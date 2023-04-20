const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const bcrypt = require('bcrypt');

const authorizeTokenUtil = async (req) => {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    if (token === null) {
        throw new Error("You are not authorized, token not found");
    }

    try {
        const data = await jwt.verify(token, process.env.JWT_KEY);
        return data;
    } catch (err) {
        throw err;
    }
}

const FindUser = async (id) => {
    try {
        const customer = await Customer.findOne({
            _id: id
        })

        return customer;
    } catch (err) {
        throw err;
    }
}

router.patch('/update', async (req, res) => {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    if (token === null) {
        return res.status(400).send("You are not authorized, token not found");
    }

    try {
        const data = await authorizeTokenUtil(req);
        const customer = await FindUser(data.id);
        if (customer === null || customer.email !== data.email) {
            return res.status(400).send("You are not authorized, invalid user");
        }

        const body = req.body;
        if (body.password) {
            return res.status(400).send("Password can not be updated");
        }

        await Customer.updateOne({ _id: data.id }, { ...body });
        return res.status(201).json(await Customer.findOne({ _id: data.id }));
    } catch (err) {
        res.status(500).send("Internal server error, could not update user, check given fields");
    }
});

router.patch('/password', async (req, res) => {
    try {
        if (req.body.newPassword === undefined || req.body.oldPassword === undefined) {
            throw new Error("New password or old password not found");
        }

        const data = await authorizeTokenUtil(req);
        const customer = await FindUser(data.id);
        const compare = await bcrypt.compare(req.body.oldPassword, customer.password);
        if (compare === false) {
            throw new Error("Wrong password");
        }

        const salt = 10;
        customer.password = await bcrypt.hash(req.body.newPassword, salt);
        await customer.save();
        return res.status(200).send("Password is updated");
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

router.delete('/', async (req, res) => {
    try {
        const data = await authorizeTokenUtil(req);
        const customer = await FindUser(data.id);
        if (customer.isAdmin === false) {
            throw new Error("You are not authorized");
        }

        if (req.body.customerId === undefined) {
            throw new Error("User not found");
        }

        await Customer.deleteOne({ _id: req.body.customerId });
        res.status(200).send("User is deleted");
    } catch(err) {
        return res.status(400).send(err.message);
    }
});

module.exports = router;