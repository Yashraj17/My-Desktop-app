const ModifierGroup = require("../models/modifierGroupModel");

function getModifierGroups(search, branchId) {
  return ModifierGroup.getModifierGroups(search, branchId);
}

function addModifierGroup(data, branchId) {
  return ModifierGroup.addModifierGroup(data, branchId);
}

function updateModifierGroup(id, name, data) {
  return ModifierGroup.updateModifierGroup(id, name, data);
}

function deleteModifierGroup(id) {
  return ModifierGroup.deleteModifierGroup(id);
}

module.exports = {
  getModifierGroups,
  addModifierGroup,
  updateModifierGroup,
  deleteModifierGroup
};
