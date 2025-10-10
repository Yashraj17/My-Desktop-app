const { ipcMain } = require("electron");
const controller = require("../controllers/roleController");

function roleRoutes() {
  ipcMain.handle("get-role", (event, search = "") => {
    return controller.getRoles(search);
  });


  ipcMain.handle("get-role-by-id", (event, search = "") => {
    return controller.getRoleById(search);
  });
  ipcMain.handle("add-role", (event, search = "") => {
    return controller.addRole(search);
  });
 ipcMain.handle("update-role", (event, id,payload) => {
   return controller.updateRole(id, payload);
 });
 
   ipcMain.handle("delete-role", (event, id) => {
     return controller.deleteRole(id);
   });
}


module.exports = roleRoutes;