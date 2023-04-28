require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(express.json());

mongoose.connect(process.env.MONGODB_CONNECT).then(() => {
    console.log("db connected");
}).catch(error => console.log(error));

const authRouter = require('./routes/auth');
const customerRouter = require('./routes/customer');
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');

app.use('/api/authentication', authRouter);
app.use('/api/customer', customerRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);

app.get('/api/', (req, res) => {
    res.status(200).send('Shoptronics api');
});

app.use((req, res, next) => {
    const err = new Error('Not found!');
    err.status = 400;
    next(err);
});

app.use((err, req, res, next) => {
    return res.status(err.status).send(err.message);
})

app.listen(process.env.PORT, () => {
    console.log(`server started ${process.env.PORT}`);
});