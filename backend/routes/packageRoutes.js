const { ipcMain } = require("electron");
const controller = require("../controllers/packageBackupController");

function registerPackageRoutes() {
  ipcMain.handle("add-package-backup", (event, data) => {
    return controller.addPackageBackup(data);
  });
}

module.exports = registerPackageRoutes;
