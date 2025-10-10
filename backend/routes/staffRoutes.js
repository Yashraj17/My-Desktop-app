const { ipcMain } = require("electron");
const controller = require("../controllers/staffController");

function staffRoutes() {
  ipcMain.handle("get-staff", (event, search = "") => {
    return controller.getStaffs(search);
  });


  ipcMain.handle("get-staff-by-id", (event, search = "") => {
    return controller.getStaffById(search);
  });
  ipcMain.handle("add-staff", (event, search = "") => {
    return controller.addStaff(search);
  });
 ipcMain.handle("update-staff", (event, id,payload) => {
   return controller.updateStaff(id, payload);
 });
 
   ipcMain.handle("delete-staff", (event, id) => {
     return controller.deleteStaff(id);
   });
}


module.exports = staffRoutes;