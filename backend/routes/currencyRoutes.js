const { ipcMain } = require("electron");
const controller = require("../controllers/currencyBackupController");

function registerCurrencyRoutes() {
  ipcMain.handle("add-currency-backup", (event, data) => {
    return controller.addCurrencyBackup(data);
  });
}

module.exports = registerCurrencyRoutes;
