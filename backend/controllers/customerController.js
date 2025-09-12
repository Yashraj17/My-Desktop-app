const model = require("../models/customerModel");

function getCustomers(search) {
  return model.getCustomers(search);
}

function addCustomer(data) {
  return model.addCustomer(data);
}

function updateCustomer(id, data) {
  return model.updateCustomer(id, data);
}

function deleteCustomer(id) {
  return model.deleteCustomer(id);
}

module.exports = {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
};