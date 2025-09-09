const model = require("../models/menuModel");

function getMenusWithItems(search = "") {
  return model.getMenusWithItems(search);
}

function addMenu(data) {
  return model.addMenu(data);
}

function addMenuBackup(data) {
  return model.addMenuBackup(data);
}
function updateMenu(id, data) {
  return model.updateMenu(id, data);
}

function deleteMenu(id) {
  return model.deleteMenu(id);
}

module.exports = {
  getMenusWithItems,
  addMenu,
  updateMenu,
  deleteMenu,
  addMenuBackup,
};
