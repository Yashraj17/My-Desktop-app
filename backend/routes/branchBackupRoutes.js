const { ipcMain } = require("electron");
const controller = require("../controllers/branchBackupController");

function branchCountryRoutes() {
  ipcMain.handle("add-branch-backup", (event, data) => {
    return controller.addBranchBackup(data);
  });
}

module.exports = branchCountryRoutes;
