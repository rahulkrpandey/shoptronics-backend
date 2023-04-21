const router = require("express").Router();
const jwt = require('jsonwebtoken');
const Category = require('../models/category');
const Customer = require('../models/customer');
const mongoose = require('mongoose');

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
        if (!data.id) {
            throw new Error("user id is not specified");
        }

        const admin = await findUser(data.id);
        if (admin.isAdmin === false) {
            throw new Error("You are not authorized");
        }

        return data;
    } catch (err) {
        throw err;
    }
};

router.post('/', async (req, res) => {
    try {
        await authorizationUtil(req);

        const body = req.body;
        if (!body.category) {
            throw new Error("Category is not specified");
        }

        const category = new Category({
            name: body.category
        });

        await category.save();

        res.status(201).json(category);
    } catch (err) {
        res.status(400).send(err.message);
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