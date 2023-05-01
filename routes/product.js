const router = require('express').Router();
const Product = require('../models/product');

const { verifyAdmin, verifyToken } = require('../middlewares/auth');
const { findCustomerWithId, findProduct, findProductsByCategory } = require('../utils/utils');

router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const _product = req.body.product;
        const product = new Product({
            name: _product.name,
            categories: _product.categories,
            description: _product.description,
            likes: _product.likes,
            price: _product.price,
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(err.status || 500).send(err.message || "Internal server error");
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const query = req.query;

        if (query.id) {
            const product = await findProduct(query.id);
            return res.status(200).json(product);
        }

        const category = query.category ? query.category : 'default';
        const count = query.count ? +query.count : 10;

        const products = await findProductsByCategory(category, count);
        res.status(200).json(products);
    } catch (err) {
        res.status(err.status || 500).send(err.message || "Internal server error");
    }
});

router.patch('/likes', verifyToken, async (req, res) => {
    try {
        const user = await findCustomerWithId(req.headers.userId);

        const productId = req.query.id;
        const product = await findProduct(productId);

        user.likes.push(productId);

        product.likes++;
        await Promise.all([product.save(), user.save()]);

        res.status(200).json(product);
    } catch (err) {
        res.status(err.status || 500).send(err.message || "Internal server error");
    }
});

router.patch('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const productId = req.query.id;
        const product = await findProduct(productId);

        const _product = req.body.product;
        await Product.updateOne({
            _id: productId
        }, { ..._product });

        res.status(200).json(await findProduct(product._id));
    } catch (err) {
        res.status(err.status || 500).send(err.message || "Internal server error");
    }
});

router.delete('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const product = await findProduct(req.query.id);

        await Product.deleteOne({
            _id: req.query.id,
        });

        res.status(200).json(product);
    } catch (err) {
        res.status(err.status || 500).send(err.message || "Internal server error");
    }
});

module.exports = router;