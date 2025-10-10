const { ipcMain } = require("electron");
const controller = require("../controllers/restaurantBackupController");

function registerRestaurantRoutes() {
  ipcMain.handle("add-restaurant-backup", (event, data) => {
    return controller.addRestaurantBackup(data);
  });

  ipcMain.handle("get-restaurant", (event, data) => {
    return controller.getRestaurants(data);
  });
}


module.exports = registerRestaurantRoutes;
