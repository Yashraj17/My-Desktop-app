const model = require("../models/reservationsModel");

function getReservations(search) {
  return model.getReservations(search);
}

function addReservations(data) {
  return model.addReservation(data);
}

function updateReservations(id, data) {
  return model.updateReservation(id, data);
}

function deleteReservations(id) {
  return model.deleteReservation(id);
}
function getReservationsByDateTime(data) {
  return model.getReservationsByDateTime(data);
}
module.exports = {
  getReservations,
  addReservations,
  updateReservations,
  deleteReservations,
  getReservationsByDateTime,
};