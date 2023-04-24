const router = require('express').Router();
const Order = require('../models/order');
const Customer = require('../models/customer');
const jwt = require('jsonwebtoken');

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
};

const findUser = async (id) => {
    try {
        const user = await Customer.findOne({
            _id: id
        })

        return user;
    } catch (err) {
        throw err;
    }
};

router.post('/', async (req, res) => {
    try {
        const data = await authorizeTokenUtil(req);
        const customer = await findUser(data.id);

        const body = req.body;

        const order = new Order({
            customerId: body.customerId,
            productIds: [...body.productIds],
        });

        // customer.order = [...customer.order, ...body.order];

        await order.save();
        // await customer.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;