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

const findOrder = async (id) => {
    try {
        const order = await Order.findOne({
            _id: id
        });

        return order;
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

        customer.orders = [...customer.orders, ...body.productIds];

        await Promise.all([order.save(), customer.save()]);
        res.status(201).json(order);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get('/', async (req, res) => {
    try {
        const data = await authorizeTokenUtil(req);
        const admin = await findUser(data.id);
        if (!admin || !admin.isAdmin) {
            throw new Error("You are not authorized");
        }

        const order = await findOrder(req.body.orderId);

        if (order === null) {
            throw new Error("Order not found");
        }

        res.status(200).json(order);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.patch('/', async (req, res) => {
    try {
        const data = await authorizeTokenUtil(req);
        const admin = await findUser(data.id);
        if (!admin || !admin.isAdmin) {
            throw new Error("You are not authorized");
        }

        const body = req.body;
        await Order.updateOne({ _id: body._id }, body);
        res.status(201).json(await findOrder(body._id));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.delete('/', async (req, res) => {
    try {
        const data = await authorizeTokenUtil(req);
        const admin = await findUser(data.id);
        if (!admin || !admin.isAdmin) {
            throw new Error("You are not authorized");
        }

        const order = await findOrder(req.body.orderId);
        if (order === null) {
            throw new Error("Order not found");
        }

        await Order.deleteOne({ _id: req.body.orderId });

        res.status(201).json(order);
    } catch (err) {
        res.status(400).send(err.message);
    }
})

module.exports = router;