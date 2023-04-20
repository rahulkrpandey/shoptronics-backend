const router = require('express').Router(); const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Customer = require('../models/customer');

router.post('/signup', async (req, res) => {
    const dataValidatorUtil = (req, res) => {
        // checking if every field is valid and present or not
        const body = req.body;

        if (body.name === undefined || body.name.length === 0) {
            throw new Error("Name is required");
        }

        if (body.email === undefined || body.email.length === 0) {
            throw new Error("Email is required");
        }

        if (body.password === undefined || body.password.length === 0) {
            throw new Error("Password is required");
        }

        if (body.address === undefined || body.address.length === 0) {
            throw new Error("Address is required");
        }

        if (body.contact === undefined || body.contact.toString().length === 0) {
            throw new Error("Contact is required");
        }
    };

    try {
        dataValidatorUtil(req, res);
    } catch (err) {
        res.status(400).send(err.toString());
        return;
    }

    const salt = 10;
    bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
        }

        const customer = new Customer({
            name: req.body?.name,
            email: req.body?.email,
            // password: req.body?.password,
            password: hashedPassword,
            address: req.body?.address,
            isAdmin: false,
            likes: [],
            orders: [],
            contact: req.body?.contact,
        });

        await customer.save();
        res.status(201).json(customer);
    });
});

// Login route 
router.post('/login', async (req, res) => {
    const dataValidatorUtil = (req, res) => {
        // checking if every field is valid and present or not
        const body = req.body;

        if (body.email === undefined || body.email.length === 0) {
            throw new Error("Email is required");
        }

        if (body.password === undefined || body.password.length === 0) {
            throw new Error("Password is required");
        }
    };

    try {
        dataValidatorUtil(req, res);
    } catch (err) {
        return res.status(400).send(err.toString());
    }

    // function to find customer with given email
    const findCustomer = async (email) => {
        try {
            const customer = await Customer.findOne({
                email: email
            });

            return customer;
        } catch (err) {
            throw err;
        }
    };

    // function to compare password
    const passwordChecker = async (hashedPassword) => {
        try {
            const result = await bcrypt.compare(req.body.password, hashedPassword);
            return result;
        } catch (err) {
            throw err;
        }
    };

    try {
        const customer = await findCustomer(req.body.email);

        if (customer === null) {
            return res.status(401).send("Wrong email");
        }

        const result = await passwordChecker(customer.password);

        if (result === false) {
            return res.status(400).send("Wrong password");
        }

        jwt.sign({
            email: customer.email,
            id: customer._id
        }, process.env.JWT_KEY, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                return res.status(500).send("Internal server error, password could not generated");
            }

            const copiedCustomer = JSON.parse(JSON.stringify(customer));
            delete copiedCustomer.password;
            delete copiedCustomer.__v;
            return res.status(200).set('Authorization', `Bearer ${token}`).json(copiedCustomer);
        });
    } catch (err) {
        res.status(500).send("Internal server error");
    }

});

module.exports = router;