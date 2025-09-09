// backend/routes/modifierRoutes.js
const { ipcMain } = require("electron");
const modifierController = require("../controllers/modifierController");

function registerModifierRoutes() {
  ipcMain.handle("get-modifiers", async () => {
    return modifierController.getModifiers();
  });

  ipcMain.handle("add-modifier", async (event, modifier) => {
    return modifierController.addModifier(modifier);
  });

  ipcMain.handle("update-modifier", async (event, { id, modifier }) => {
    return modifierController.updateModifier(id, modifier);
  });

  ipcMain.handle("delete-modifier", async (event, id) => {
    return modifierController.deleteModifier(id);
  });
}

module.exports = registerModifierRoutes;
