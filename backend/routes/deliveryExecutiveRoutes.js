const { ipcMain } = require("electron");
const controller = require("../controllers/deliveryExecutiveController");

function deliveryExecutiveRoutes() {
  ipcMain.handle("get-delivery-executive", (event, search = "") => {
    return controller.getDeliveryExecutives(search);
  });

  ipcMain.handle("add-delivery-executive", (event, data) => {
    return controller.addDeliveryExecutive(data);
  });


 ipcMain.handle("update-delivery-executive", (event, id,payload) => {
  return controller.updateDeliveryExecutive(id, payload);
});

  ipcMain.handle("delete-delivery-executive", (event, id) => {
    return controller.deleteDeliveryExecutive(id);
  });
}

module.exports = deliveryExecutiveRoutes;