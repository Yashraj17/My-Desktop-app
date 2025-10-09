const model = require("../models/menuItemModel");

function getMenuItems(searchTerm) {
  return model.getMenuItems(searchTerm);
}

function getMenuItemByMenuId(menuId) {
  return model.getMenuItemByMenuId(menuId);
}

function addMenuItem(data) {
  return model.addMenuItem(data);
}

function updateMenuItem(id, data) {
  return model.updateMenuItem(id, data);
}

function deleteMenuItem(id) {
  return model.deleteMenuItem(id);
}

module.exports = {
  getMenuItems,
  getMenuItemByMenuId,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
