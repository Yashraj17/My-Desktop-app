const model = require("../models/orderModel");

function getOrdersInfo() {
  return model.getOrdersInfo();
}
function getOrders(search) {
  return model.getOrders(search);
}

function getOrdersWithItems(search) {
  return model.getOrdersWithItems(search);
}

function initiateOrder(orderData) {
  return model.initiateOrder(orderData);
}

module.exports = {
  getOrdersInfo,
  getOrders,
  initiateOrder,
  getOrdersWithItems,
};