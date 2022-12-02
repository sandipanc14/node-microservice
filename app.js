const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const logger = require('morgan');

const indexRouter = require('./routers/index.router');
const itemsRouter = require('./routers/items.router');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(helmet());

app.use('/', indexRouter);
app.use('/items', itemsRouter);

// Handle body-parser errors
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'invalid data',
      errors: { body: 'is malformed' },
    });
  }
  next(err);
});

// Handle unexpected errors
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    message: 'something went wrong',
  });
});

module.exports = app;
