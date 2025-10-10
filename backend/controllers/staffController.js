const model = require("../models/staffModel");

function getStaffs(search) {
  return model.getStaffs(search);
}

function getStaffById(search) {
  return model.getStaffById(search);
}

function addStaff(search) {
  return model.addStaff(search);
}
function updateStaff(id, data) {
  return model.updateStaff(id, data);
}

function deleteStaff(id) {
  return model.deleteStaff(id);
}

module.exports = {
  getStaffs,
  getStaffById,
  addStaff,
  updateStaff,
  deleteStaff,
};