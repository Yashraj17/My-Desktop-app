const { ipcMain } = require("electron");
const controller = require("../controllers/restaurantBackupController");

function registerRestaurantRoutes() {
  ipcMain.handle("add-restaurant-backup", (event, data) => {
    return controller.addRestaurantBackup(data);
  });
}

module.exports = registerRestaurantRoutes;
