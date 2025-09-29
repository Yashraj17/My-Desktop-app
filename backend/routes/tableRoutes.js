const { ipcMain } = require("electron");
const controller = require("../controllers/tableController");

function tableRoutes() {
  ipcMain.handle("get-table", (event, areaId = null) => {
    return controller.getTable(areaId);
  });

  ipcMain.handle("add-table", (event, data) => {
    return controller.addTable(data);
  });


 ipcMain.handle("update-table", (event,id,payload) => {
  return controller.updateTable(id,payload);
});

  ipcMain.handle("delete-table", (event, id) => {
    return controller.deleteTable(id);
  });
  //updateTablePosition
  ipcMain.handle("update-table-position", (event,id,payload) => {
  return controller.updateTablePosition(id,payload);
});
}

module.exports = tableRoutes;