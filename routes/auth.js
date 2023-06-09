const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Customer = require('../models/customer');

const { verifyCustomerLogin } = require('../middlewares/auth');

router.post('/signup', async (req, res) => {
    try {
        if (!req.body.password) {
            const err = new Error("Password is required");
            err.status = 400;
            throw err;
        }

        const salt = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const customer = new Customer({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            address: req.body.address,
            isAdmin: false,
            likes: [],
            orders: [],
            contact: req.body.contact,
        });

        await customer.save();
        res.status(201).json(customer);
    } catch (err) {
        res.status(err.status || 500).json({
            error: {
                message: err.message || "Internal server error"
            }
        });
    }
});

// Login route 
router.post('/login', verifyCustomerLogin, async (req, res) => {
    const customer = req.body.customer;
    try {
        jwt.sign({
            email: customer.email,
            id: customer._id,
            isAdmin: customer.isAdmin
        }, process.env.JWT_KEY, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                throw err;
            }

            return res.status(200).set('Authorization', `Bearer ${token}`).json(customer);
        });
    } catch (err) {
        res.status(err.status || 500).json({
            error: {
                message: err.message || "Internal server error"
            }
        });
    }

});

module.exports = router;