const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const appRoot = require('app-root-path');
const logger = require('./config/logger.config');
const httpLogger = require('morgan');
const configMiddleware = require('./middlewares/config.middleware');

const indexRouter = require('./routers/index.router');
const itemsRouter = require('./routers/items.router');

const app = express();

app.use(httpLogger('combined', { stream: logger.stream }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${appRoot}/views`));
app.set('view engine', 'ejs');

app.use(cors());
app.use(helmet());

app.use('/', configMiddleware, indexRouter);
app.use('/items', configMiddleware, itemsRouter);

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
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );

  res.status(500).json({
    message: 'something went wrong',
  });
});

module.exports = app;
