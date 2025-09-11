const { ipcMain } = require("electron");
const controller = require("../controllers/areaController");

function areaRoutes() {
  ipcMain.handle("get-areas", (event, search = "") => {
    return controller.getAreas(search);
  });

  ipcMain.handle("add-areas", (event, data) => {
    return controller.addAreas(data);
  });


 ipcMain.handle("update-areas", (event, id,payload) => {
  return controller.updateAreas(id, payload);
});

  ipcMain.handle("delete-areas", (event, id) => {
    return controller.deleteAreas(id);
  });
}

module.exports = areaRoutes;