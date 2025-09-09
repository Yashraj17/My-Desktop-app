const { ipcMain } = require("electron");
const controller = require("../controllers/menuItemController");

function registerMenuItemRoutes() {
  ipcMain.handle("get-menu-items", (event, search = "") => {
    return controller.getMenuItems(search);
  });

  ipcMain.handle("add-menu-item", (event, data) => {
    return controller.addMenuItem(data);
  });

 ipcMain.handle("update-menu-item", (event, payload) => {
  const { id, ...data } = payload; // extract id and keep rest
  return controller.updateMenuItem(id, data);
});


  ipcMain.handle("delete-menu-item", (event, id) => {
    return controller.deleteMenuItem(id);
  });
}

module.exports = registerMenuItemRoutes;
