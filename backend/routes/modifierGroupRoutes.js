const { ipcMain } = require("electron");
const controller = require("../controllers/modifierGroupController");

function registerModifierGroupRoutes() {
// ✅ Get all modifier groups
ipcMain.handle("get-modifier-groups", (event, search = "") => {
  return controller.getModifierGroups(search);
});

// ✅ Add modifier group
ipcMain.handle("add-modifier-group", (event, data, branchId) => {
  return controller.addModifierGroup(data, branchId);
});

// ✅ Update modifier group
ipcMain.handle("update-modifier-group", (event, { id, name, description, options }) => {
  return controller.updateModifierGroup(id, { name, description, options });
});


// ✅ Delete modifier group
ipcMain.handle("delete-modifier-group", (event, id) => {
  return controller.deleteModifierGroup(id);
});
}
module.exports = registerModifierGroupRoutes;
