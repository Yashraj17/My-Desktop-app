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

  ipcMain.handle("get-orders-with-items", (event, search = "") => {
    return controller.getOrdersWithItems(search);
  });

  ipcMain.handle("initiate-order", (event, orderData) => {
    return controller.initiateOrder(orderData);
  });
}

module.exports = orderRoutes;
