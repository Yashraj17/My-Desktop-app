const model = require("../models/orderModel");

function getOrdersInfo() {
  return model.getOrdersInfo();
}
function getOrders(search) {
  return model.getOrders(search);
}
function getTodayPaymentMethodEarnings(search) {
  return model.getTodayPaymentMethodEarnings(search);
}
//getTodayMenuItemEarnings
function getTodayMenuItemEarnings(search) {
  return model.getTodayMenuItemEarnings(search);
}

//getTodayTableEarnings
function getTodayTableEarnings(search) {
  return model.getTodayTableEarnings(search);
}
module.exports = {
  getOrdersInfo,
  getOrders,
  getTodayPaymentMethodEarnings,
  getTodayMenuItemEarnings,
  getTodayTableEarnings
};