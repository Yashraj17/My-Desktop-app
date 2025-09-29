const model = require("../models/tableModel");

function getTable(areaId = null) {
  return model.getTable(areaId);
}

function addTable(data) {
  return model.addTable(data);
}

function updateTable(id, data) {
  return model.updateTable(id, data);
}

function deleteTable(id) {
  return model.deleteTable(id);
}
//updateTablePosition
function updateTablePosition(id, data) {
  return model.updateTablePosition(id, data);
}
module.exports = {
  getTable,
  addTable,
  updateTable,
  deleteTable,
  updateTablePosition,
};