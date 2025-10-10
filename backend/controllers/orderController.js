const model = require("../models/ordersModel");

function getOrdersInfo() {
  return model.getOrdersInfo();
const model = require("../models/orderModel");

function getOrders(search) {
  return model.getOrders(search);
}


module.exports = {
  getOrdersInfo
  getOrders,
};