const model = require("../models/areaModel");

function getAreas() {
  return model.getAreas();
}

function addAreas(data) {
  return model.addAreas(data);
}

function updateAreas(id, data) {
  return model.updateAreas(id, data);
}

function deleteAreas(id) {
  return model.deleteAreas(id);
}

module.exports = {
  getAreas,
  addAreas,
  updateAreas,
  deleteAreas,
};