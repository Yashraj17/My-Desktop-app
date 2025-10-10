const model = require("../models/ordersModel");

function getOrdersInfo() {
  return model.getOrdersInfo();
}


module.exports = {
  getOrdersInfo
};