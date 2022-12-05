const appConfig = require('../config/app.config');

module.exports = function configMiddleware(req, res, next) {
  appConfig.config();
  next();
};
