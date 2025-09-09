// routes/loginRoute.js
const { ipcMain } = require("electron");
const loginController = require("../controllers/loginController");

function loginRoute() {
  ipcMain.handle("login", async (event, credentials) => {
    return loginController.login(credentials);
  });
   ipcMain.handle("save-user", async (event, data) => {
    return loginController.saveUser(data);
  });
}

module.exports = loginRoute; // ✅ direct export
