const { ipcMain } = require("electron");
const controller = require("../controllers/reservationsController");

function reservationsRoutes() {
  ipcMain.handle("get-reservation", (event, search = "") => {
    return controller.getReservations(search);
  });

  ipcMain.handle("add-reservation", (event, data) => {
    return controller.addReservations(data);
  });


 ipcMain.handle("update-reservation", (event, id,payload) => {
  return controller.updateReservations(id, payload);
});

  ipcMain.handle("delete-reservation", (event, id) => {
    return controller.deleteReservations(id);
  });

  

  ipcMain.handle("get-reservations-by-date-time", (event, data) => {
    return controller.getReservationsByDateTime(data);
  });

  
  ipcMain.handle("get-reservation-settings", (event, dayOfWeek, slotType) => {
    return controller.getReservationSettings(dayOfWeek, slotType);
  });
}

module.exports = reservationsRoutes;