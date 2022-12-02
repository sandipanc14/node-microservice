const express = require('express');
const cors = require('cors');
const fs = require('fs');
const helmet = require('helmet');
const logger = require('morgan');

const indexRouter = require('./routers/index.router');
const itemsRouter = require('./routers/items.router');

const app = express();

// create a write stream (in append mode)
// var accessLogStream = fs.createWriteStream(
//   '/node-microservice-output/access.log',
//   {
//     flags: 'a',
//   }
// );

// app.use(logger('combined', { stream: accessLogStream }));

app.use(logger('combined'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.use(cors());
// app.use(helmet());

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
