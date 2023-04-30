const router = require('express').Router();
const Order = require('../models/order');
const Customer = require('../models/customer');

const { verifyAdmin, verifyToken } = require('../middlewares/auth');
const { findCustomerWithId, findOrder } = require('../utils/utils');

router.post('/', verifyToken, async (req, res) => {
    try {
        const customer = await findCustomerWithId(req.headers.userId);

        const _order = req.body.order;
        if (customer._id.toString() !== _order.customerId) {
            const err = new Error("Customer id does not match");
            err.status = 400;
            throw err;
        }

        const order = new Order({
            customerId: customer._id,
            productIds: [..._order.productIds],
        });

        customer.orders = [...customer.orders, ..._order.productIds];

        await Promise.all([order.save(), customer.save()]);
        res.status(201).json(order);
    } catch (err) {
        res.status(err.status || 500).send(err.message || "Internal server error");
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const _order = req.body.order;
        const order = await findOrder(_order.id);

        res.status(200).json(order);
    } catch (err) {
        res.status(err.status || 500).send(err.message || "Internal server error");
    }
});

router.delete('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const _order = req.body.order;
        console.log(_order);
        const order = await findOrder(_order.id);

        await Order.deleteOne({ _id: _order.id });

        res.status(201).json(order);
    } catch (err) {
        res.status(err.status || 500).send(err.message || "Internal server error");
    }
})

module.exports = router;