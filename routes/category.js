const router = require("express").Router();
const jwt = require('jsonwebtoken');
const Category = require('../models/category');
const Customer = require('../models/customer');

const { verifyAdmin, verifyToken } = require('../middlewares/auth');
const { findCategory } = require('../utils/utils');

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

router.get('/', verifyToken, async (req, res) => {
    try {
        const data = req.body.data;
        if (!data || !data.categoryId) {
            const err = new Error("Category's id is not specified");
            err.status = 400;
            throw err;
        }

        const category = await findCategory(data.categoryId);
        res.status(200).json(category);
    } catch (err) {
        res.status(err.status || 500).send(err.message || "Internal server error");
    }
});

router.patch('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const data = req.body.data;
        if (!data || !data.categoryId || !data.name) {
            const err = new Error("category's id or name is not specified");
            err.status = 400;
            throw err;
        }

        const category = await findCategory(data.categoryId);
        category.name = data.name;
        await category.save();
        res.status(200).json(category);
    } catch (err) {
        res.status(err.status || 500).send(err.message || "Internal server error");
    }
});

router.delete('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const data = req.body.data;
        if (!data || !data.categoryId) {
            const err = new Error("category's id is not specified");
            err.status = 400;
            throw err;
        }

        const category = await findCategory(data.categoryId);

        await Category.deleteOne({
            _id: data.categoryId
        });

        res.status(200).json(category);
    } catch (err) {
        res.status(err.status || 500).send(err.message || "Internal server error");
    }
})

module.exports = router;