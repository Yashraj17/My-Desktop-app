const { ipcMain } = require("electron");
const controller = require("../controllers/orderController");

function orderInfoRoutes() {
  ipcMain.handle("get-orders-info", (event, search = "") => {
    return controller.getOrdersInfo(search);
  });
}

function orderRoutes() {
  ipcMain.handle("get-order", (event, search = "") => {
    return controller.getOrders(search);
  });

}

  module.exports = {orderRoutes,orderInfoRoutes};
