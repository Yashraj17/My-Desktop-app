const { ipcMain } = require("electron");
const controller = require("../controllers/globalCurrencyBackupController");

function registerGlobalCurrencyRoutes() {
  ipcMain.handle("add-global-currency-backup", (event, data) => {
    return controller.addGlobalCurrencyBackup(data);
  });
}

module.exports = registerGlobalCurrencyRoutes;
