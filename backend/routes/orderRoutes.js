const { ipcMain } = require("electron");
const controller = require("../controllers/orderController");

function orderRoutes() {
  ipcMain.handle("get-orders", (event, search = "") => {
    return controller.getOrders(search);
  });
}

module.exports = orderRoutes;