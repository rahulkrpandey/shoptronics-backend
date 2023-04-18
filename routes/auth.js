const router = require('express').Router();
const Customer = require('../models/customer');

const authMiddleware = (req, res, next) => {
    // console.log("here");
    if (req.method === 'POST') {
        // checking if every field is valid and present or not

        const body = req.body;

        if (body.name === undefined || body.name.length === 0) {
            res.status(400).send("name is not valid");
            return;
        }

        if (body.email === undefined || body.email.length === 0) {
            res.status(400).send("email is not valid");
            return;
        }

        if (body.password === undefined || body.password.length === 0) {
            res.status(400).send("password is not valid");
            return;
        }

        if (body.address === undefined || body.address.length === 0) {
            res.status(400).send("address is not valid");
            return;
        }

        if (body.contact === undefined || body.contact.toString().length === 0) {
            res.status(400).send("contact is not valid");
            return;
        }

    }

    next();
};

router.use(authMiddleware);

router.post('/signup', async (req, res) => {
    try {
        const customer = new Customer({
            name: req.body?.name,
            email: req.body?.email,
            password: req.body?.password,
            address: req.body?.address,
            isAdmin: false,
            likes: [],
            orders: [],
            contact: req.body?.contact,
        });

        await customer.save();
        res.status(201).json(customer);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/login', async (req, res) => {
    const body = req.body;
});

module.exports = router;