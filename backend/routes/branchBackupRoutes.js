const { ipcMain } = require("electron");
const controller = require("../controllers/branchBackupController");

function branchCountryRoutes() {
  ipcMain.handle("add-branch-backup", (event, data) => {
    return controller.addBranchBackup(data);
  });

  ipcMain.handle("get-branches", (event, data) => {
    return controller.getBranches(data);
  });

  
  ipcMain.handle("get-active-branches", (event, data) => {
    return controller.getActiveBranch(data);
  });
}

module.exports = branchCountryRoutes;
