const { ipcMain } = require("electron");
const controller = require("../controllers/staffController");

function staffRoutes() {
  ipcMain.handle("get-staff", (event, search = "") => {
    return controller.getStaffs(search);
  });
}

module.exports = staffRoutes;