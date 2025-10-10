const model = require("../models/orderModel");

function getOrders(search) {
  return model.getOrders(search);
}


module.exports = {
  getOrders,
};