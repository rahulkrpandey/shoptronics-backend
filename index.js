require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_CONNECT).then(() => {
    console.log("db connected");
}).catch(error => console.log(error));

const customerRouter = require('./routes/customer');

app.use('/api/customer', customerRouter);

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(process.env.PORT, () => {
    console.log(`server started ${process.env.PORT}`);
});