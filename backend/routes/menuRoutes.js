const { ipcMain } = require("electron");
const controller = require("../controllers/menuController");

function registerMenuRoutes() {
  ipcMain.handle("get-menus-with-items", (event, search = "") => {
    return controller.getMenusWithItems(search);
  });

  ipcMain.handle("add-menu", (event, data) => {
    return controller.addMenu(data);
  });

ipcMain.handle("add-menu-backup", (event, data) => {
    return controller.addMenuBackup(data);
  });
 ipcMain.handle("update-menu", (event, payload) => {
  const { id, ...data } = payload; // extract id and keep rest
  return controller.updateMenu(id, data);
});

  ipcMain.handle("delete-menu", (event, id) => {
    return controller.deleteMenu(id);
  });
}

module.exports = registerMenuRoutes;
