const modifierModel = require("../models/modifierModel");

function getModifiers() {
  return modifierModel.getModifiers();
}

function addModifier(modifier) {
  return modifierModel.addModifier(modifier);
}

function updateModifier(id, modifier) {
  return modifierModel.updateModifier(id, modifier);
}

function deleteModifier(id) {
  return modifierModel.deleteModifier(id);
}

module.exports = {
  getModifiers,
  addModifier,
  updateModifier,
  deleteModifier
};
