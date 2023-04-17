const router = require('express').Router();
const Customer = require('../models/customer');
const Order = require('../models/order');
const Category = require('../models/category');
const Product = require('../models/product');

router.get('/create', async (req, res) => {
    console.log(Customer);
    try {
        // const customer = new Customer({
        //     name: "rahul",
        //     email: "rahulkrpandey@xyz.com",
        //     password: "123344343",
        //     address: "sldkjfoweojfw",
        //     isAdmin: false,
        //     likes: ["sldkjf", "oweiur"],
        //     orders: ["sldkjf", "oweiur"],
        //     customerId: "dofuiwoiesdlkfj",
        //     contact: 2923892384
        // });

        // const customer = new Order({
        //     customerId: "sldkjfsdlfjsdfj",
        //     productId: "lsdjflsdjfskldjf",
        //     quantity: 3489,
        // });

        // const customer = new Category({ name: "ldskdf"});
        const customer = new Product({
            categoryId: "sldjflj",
            name: "osldkjfsfj",
            description: "sldkjfsdlkfj",
            likes: 2394,
            price: 2938
        });

        await customer.save();
        res.status = 201;
        res.send(customer);
        console.log(customer);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

module.exports = router;