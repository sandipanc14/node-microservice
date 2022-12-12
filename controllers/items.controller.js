const itemsService = require('../services/items.service');
const kafkaProducerService = require('../services/kafka/producer.service');

function findItem(req, res, next, id) {
  const item = itemsService.findItem(id);
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
  const newItem = itemsService.createItem();
  const kafkaPayload = {
    method: 'createItem',
    data: {
      item: newItem,
    },
  };
  kafkaProducerService.produce(
    process.env['KAFKA_TOPICS.SET_ITEM'],
    kafkaPayload
  );
  return res.json({ item: newItem });
}

function getAllItems(req, res, next) {
  const kafkaPayload = {
    method: 'getAllItems',
    data: { items: itemsService.getAllItems() },
  };
  kafkaProducerService.produce(
    process.env['KAFKA_TOPICS.GET_ITEM'],
    kafkaPayload
  );
  return res.json({ items: itemsService.getAllItems() });
}

function getOneItem(req, res, next) {
  const kafkaPayload = {
    method: 'getOneItem',
    data: {
      item: req.item,
    },
  };
  kafkaProducerService.produce(
    process.env['KAFKA_TOPICS.GET_ITEM'],
    kafkaPayload
  );
  return res.json({ item: req.item });
}

function updateItem(req, res, next) {
  if (!req.body.item) {
    return res.status(400).json({
      message: 'invalid item data',
      errors: { item: 'is missing' },
    });
  }
  const updatedData = itemsService.updateItem(req.item, req.body.item || {});
  const kafkaPayload = {
    method: 'updateItem',
    data: updatedData,
  };
  kafkaProducerService.produce(
    process.env['KAFKA_TOPICS.SET_ITEM'],
    kafkaPayload
  );
  return res.json({
    item: updatedData,
  });
}

function deleteItem(req, res, next) {
  itemsService.deleteItem(req.item);
  const kafkaPayload = {
    method: 'deleteItem',
    data: {
      item: req.item,
    },
  };
  kafkaProducerService.produce(
    process.env['KAFKA_TOPICS.SET_ITEM'],
    kafkaPayload
  );
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
