const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
/*
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlkIjoiNjQzZWNhMzJlZWI0ZGU0OWI3ZTRjM2JlIiwiaWF0IjoxNjgxOTI1ODU1LCJleHAiOjE2ODE5Mjk0NTV9.UKzUYGlftvEdIyUqK_LHknzBfsEJNarN0ayFp-myNEs
*/

router.patch('/update', (req, res) => {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    if (token === null) {
        return res.status(400).send("You are not authorized, token not found");
    }

    jwt.verify(token, process.env.JWT_KEY, async (err, data) => {
        if (err) {
            return res.status(400).send("You are not authorized, token is invalid");
        }

        const FindUser = async (id) => {
            try {
                const customer = await Customer.findOne({
                    _id: id
                })

                return customer;
            } catch (err) {
                throw err;
            }
        }

        try {
            const customer = await FindUser(data.id);
            if (customer === null || customer.email !== data.email) {
                return res.status(400).send("You are not authorized, invalid user");
            }

            const body = req.body;
            if (body.password) {
                return res.status(400).send("Password can not be updated");
            }

            await Customer.updateOne({ _id: data.id }, { ...body });
            return res.status(201).json(await Customer.findOne({ _id: data.id }));
        } catch (err) {
            res.status(500).send("Internal server error, could not update user, check given fields");
        }
    });
});

module.exports = router;