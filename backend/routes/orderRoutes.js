const { ipcMain } = require("electron");
const controller = require("../controllers/orderController");

// function orderInfoRoutes() {
//   ipcMain.handle("get-orders-info", (event, search = "") => {
//     return controller.getOrdersInfo(search);
//   });
// }

function orderRoutes() {
  ipcMain.handle("get-order", (event, search = "") => {
    return controller.getOrders(search);
  });

  ipcMain.handle("get-orders-info", (event, search = "") => {
    return controller.getOrdersInfo(search);
  });

   ipcMain.handle("get-today-payment-method-earnings", (event, search = "") => {
    return controller.getTodayPaymentMethodEarnings(search);
  });
  //getTodayMenuItemEarnings

  ipcMain.handle("get-today-menu-item-earnings", (event, search = "") => {
    return controller.getTodayMenuItemEarnings(search);
  });
}

module.exports = orderRoutes;
