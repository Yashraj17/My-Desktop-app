const { ipcMain } = require("electron");
const controller = require("../controllers/countryController");

function registerCountryRoutes() {
  ipcMain.handle("add-country-backup", (event, data) => {
    return controller.addCountryBackup(data);
  });
}

module.exports = registerCountryRoutes;
