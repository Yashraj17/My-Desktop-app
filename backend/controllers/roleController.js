const model = require("../models/roleModel");

function getRoles(search) {
  return model.getRoles(search);
}

function getRoleById(search) {
  return model.getRoleById(search);
}

function addRole(search) {
  return model.addRole(search);
}
function updateRole(id, data) {
  return model.updateRole(id, data);
}

function deleteRole(id) {
  return model.deleteRole(id);
}

module.exports = {
  getRoles,
  getRoleById,
  addRole,
  updateRole,
  deleteRole,
};