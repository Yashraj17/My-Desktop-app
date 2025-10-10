const model = require("../models/orderModel");

function getOrdersInfo() {
  return model.getOrdersInfo();
}
function getOrders(search) {
  return model.getOrders(search);
}


module.exports = {
  getOrdersInfo,
  getOrders
};