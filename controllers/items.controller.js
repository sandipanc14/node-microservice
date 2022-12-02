const service = require('../services/items.service');

function findItem(req, res, next, id) {
  const item = service.findItem(id);
  if (!item) {
    return res.status(404).json({
      message: 'invalid item',
      errors: { id: 'is unknown' },
    });
  }
  req.item = item;
  next();
}

function createItem(req, res, next) {
  const newItem = service.createItem();
  return res.json({ item: newItem });
}

function getAllItems(req, res, next) {
  return res.json({ items: service.getAllItems() });
}

function getOneItem(req, res, next) {
  return res.json({ item: req.item });
}

function updateItem(req, res, next) {
  // enable this code, if update data is required in req.body
  /*
	if (!req.body.item) {
		return res.status(400).json({
			message: 'invalid item data',
			errors: { item: 'is missing' },
		});
	}
	*/
  return res.json({ item: service.updateItem(req.item, req.body.item || {}) });
}

function deleteItem(req, res, next) {
  service.deleteItem(req.item);
  return res.json({ item: req.item });
}

module.exports = {
  findItem,
  createItem,
  getAllItems,
  getOneItem,
  updateItem,
  deleteItem,
};
