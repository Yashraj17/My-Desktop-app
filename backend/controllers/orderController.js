const model = require("../models/ordersModel");

function getOrders() {
  return model.getOrders();
}


module.exports = {
  getOrders
};