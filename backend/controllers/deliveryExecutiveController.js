const model = require("../models/deliveryExecutiveModel");

function getDeliveryExecutives(search) {
  return model.getDeliveryExecutives(search);
}

function addDeliveryExecutive(data) {
  return model.addDeliveryExecutive(data);
}

function updateDeliveryExecutive(id, data) {
  return model.updateDeliveryExecutive(id, data);
}

function deleteDeliveryExecutive(id) {
  return model.deleteDeliveryExecutive(id);
}

module.exports = {
  getDeliveryExecutives,
  addDeliveryExecutive,
  updateDeliveryExecutive,
  deleteDeliveryExecutive
};