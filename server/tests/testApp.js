const express = require('express');

const app = express();
app.use(express.json());
app.use('/api/v1', require('../Routes/user'));
app.use('/api/v1', require('../Routes/book'));
app.use('/api/v1', require('../Routes/chapter'));
app.use('/api/v1', require('../Routes/reading'));
app.use('/api/v1', require('../Routes/wallet'));
app.use('/api/v1', require('../Routes/review'));

module.exports = app;
