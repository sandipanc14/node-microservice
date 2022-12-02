let items = [];

function createItem(itemData = {}) {
  console.log(itemData);
  const newItem = { ...itemData, id: items.length + 1, lastUpdate: new Date() };
  items = [...items, newItem];
  return newItem;
}

function getAllItems() {
  return items;
}

function findItem(id) {
  return items.find((i) => +i.id === +id);
}

function updateItem(item, itemData = {}) {
  const updatedItem = { ...item, ...itemData, lastUpdate: new Date() };
  items = [...items.filter((i) => i.id !== item.id), updatedItem];
  return updatedItem;
}

function deleteItem(item) {
  items = items.filter((i) => i.id !== item.id);
}

module.exports = { createItem, getAllItems, findItem, updateItem, deleteItem };
