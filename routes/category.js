const router = require("express").Router();
const jwt = require('jsonwebtoken');
const Category = require('../models/category');
const Customer = require('../models/customer');
const mongoose = require('mongoose');

const { verifyAdmin, verifyToken } = require('../middlewares/auth');

const findUser = async (id) => {
    try {
        const admin = await Customer.findOne({
            _id: id
        });

        return admin;
    } catch (err) {
        throw err;
    }
};

const findCategory = async (_id) => {
    try {
        const id = new mongoose.Types.ObjectId(_id);
        const category = await Category.findOne({
            _id: id
        });

        if (category === null) {
            throw new Error("Given category is not found");
        }

        return category;
    } catch (err) {
        throw err;
    }
};

const authorizationUtil = async (req) => {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    if (token == null) {
        throw new Error("You are not authorized, token not found");
    }

    try {
        const data = await jwt.verify(token, process.env.JWT_KEY);

        const admin = await findUser(data.id);
        if (admin.isAdmin === false) {
            throw new Error("You are not authorized");
        }

        return data;
    } catch (err) {
        throw err;
    }
};

router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const data = req.body.data;
        if (!data || !data.category) {
            const err = new Error("Category is not specified");
            err.status = 400;
            throw err;
        }

        const category = new Category({
            name: data.category
        });

        await category.save();

        res.status(201).json(category);
    } catch (err) {
        res.status(err.status || 500).send(err.message || "Internal server error");
    }
});

router.get('/', async (req, res) => {
    try {
        await authorizationUtil(req);

        const body = req.body;
        if (!body.categoryId) {
            throw new Error("category's id is not specified");
        }

        const category = await findCategory(body.categoryId);
        res.status(200).json(category);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.patch('/', async (req, res) => {
    try {
        await authorizationUtil(req);

        const body = req.body;
        if (!body.categoryId || !body.name) {
            throw new Error("category's id is not specified");
        }

        const category = await findCategory(body.categoryId);
        category.name = body.name;
        await category.save();
        res.status(200).json(category);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.delete('/', async (req, res) => {
    try {
        await authorizationUtil(req);

        const body = req.body;
        if (!body.categoryId) {
            throw new Error("category's id is not specified");
        }

        const category = await findCategory(body.categoryId);

        await Category.deleteOne({
            _id: body.categoryId
        });

        res.status(200).json(category);
    } catch (err) {
        res.status(400).send(err.message);
    }
})

module.exports = router;