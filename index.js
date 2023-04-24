require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(express.json());

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Invalid JSON:', err.message);
        res.status(400).send('Invalid JSON');
    } else {
        next();
    }
});

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

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(process.env.PORT, () => {
    console.log(`server started ${process.env.PORT}`);
});