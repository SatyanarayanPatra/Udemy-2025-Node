// 1 - IMPORTS
const express = require('express');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./routes/tour.Routes');
const userRouter = require('./routes/user.routes');
require('dotenv').config();

const port = process.env.PORT || 3000;

// 2 - MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/api/v1/tours', (req, res) => {
  console.log(req.query);
  res.send('Hello!');
});

// 3 - ROUTES
// app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 5 - SERVER STARTED
module.exports = { app, port };
