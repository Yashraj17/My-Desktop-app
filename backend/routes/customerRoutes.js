const { ipcMain } = require("electron");
const controller = require("../controllers/customerController");

function customerRoutes() {
  ipcMain.handle("get-customer", (event, search = "") => {
    return controller.getCustomers(search);
  });

  ipcMain.handle("add-customer", (event, data) => {
    return controller.addCustomer(data);
  });


 ipcMain.handle("update-customer", (event, id,payload) => {
  return controller.updateCustomer(id, payload);
});

  ipcMain.handle("delete-customer", (event, id) => {
    return controller.deleteCustomer(id);
  });
}

module.exports = customerRoutes;