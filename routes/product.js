const router = require('express').Router();
const Customer = require('../models/customer');
const Product = require('../models/product');
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

const findProduct = async (id) => {
    try {
        const product = await Product.findOne({
            _id: id
        })

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

router.post('/', async (req, res) => {
    try {
        const data = await authorizeTokenUtil(req);
        const admin = await findUser(data.id);

        if (!admin || admin.isAdmin === false) {
            throw new Error("You are not authorized");
        }

        const body = req.body;
        const product = new Product({
            name: body.name,
            categories: body.categories,
            description: body.description,
            likes: body.likes,
            price: body.price,
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/', async (req, res) => {
    try {
        const data = await authorizeTokenUtil(req);
        const user = await findUser(data.id);

        if (!user) {
            throw new Error("You are not authorized");
        }

        const query = req.query;

        if (query.id) {
            const product = await findProduct(query.id);
            return res.status(200).json(product);
        }

        const category = query.category ? query.category : 'default';
        const count = query.count ? +query.count : 10;

        const products = await findProductsByCategory(category, count);
        console.log(category + " " + count);
        console.log(products);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).send("Internal server error");
    }
});

router.patch('/likes', async (req, res) => {
    try {
        const data = await authorizeTokenUtil(req);
        const user = await findUser(data.id);

        const productId = req.query.id;
        const product = await findProduct(productId);
        if (product === null) {
            return res.status(400).send("Product not found");
        }

        console.log(user);
        user.likes.push(productId);
        await user.save();

        product.likes++;
        console.log(product);
        await product.save();

        res.status(201).json(product);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.patch('/', async (req, res) => {
    try {
        const data = await authorizeTokenUtil(req);
        const admin = await findUser(data.id);

        if (!admin.isAdmin) {
            return res.status(400).send("You are not authorized");
        }

        const productId = req.query.id;
        const product = await findProduct(productId);
        if (product === null) {
            return res.status(400).send("Product not found");
        }

        const body = req.body;
        await Product.updateOne({
            _id: productId
        }, { ...body });

        res.status(201).json(await findProduct(product._id));
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/', async (req, res) => {
    try {
        const data = await authorizeTokenUtil(req);
        const admin = await findUser(data.id);

        if (!admin.isAdmin) {
            return res.status(400).send("You are not authorized");
        }

        const product = await findProduct(req.query.id);
        if (product === null) {
            return res.status(400).send("Product not found");
        }

        await Product.deleteOne({
            _id: req.query.id,
        });

        res.status(201).json(product);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;