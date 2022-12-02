const router = require('express').Router();

const controller = require('../controllers/items.controller');

router.param('id', controller.findItem);

router.route('/').post(controller.createItem).get(controller.getAllItems);

router
  .route('/:id')
  .get(controller.getOneItem)
  .put(controller.updateItem)
  .delete(controller.deleteItem);

module.exports = router;
