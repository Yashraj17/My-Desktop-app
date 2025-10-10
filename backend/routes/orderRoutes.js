const { ipcMain } = require("electron");
const controller = require("../controllers/orderController");

function orderInfoRoutes() {
  ipcMain.handle("get-orders-info", (event, search = "") => {
    return controller.getOrdersInfo(search);
  });
}

module.exports = orderInfoRoutes;