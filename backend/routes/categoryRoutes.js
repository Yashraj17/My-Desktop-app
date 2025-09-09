// src/main/routes/categoryRoutes.js
const { ipcMain } = require("electron");
const categoryController = require("../controllers/categoryController");

function registerCategoryRoutes() {
  ipcMain.on("set-branch-id", (event, branchId) => {
    categoryController.setBranchId(branchId);
  });

  ipcMain.handle("get-categories", async () => {
    return categoryController.getCategories();
  });

  ipcMain.handle("add-category", async (event, name) => {
    return categoryController.addCategory(name);
  });

  ipcMain.handle("update-category", async (event, id, name) => {
    return categoryController.updateCategory(id, name);
  });

  ipcMain.handle("delete-category", async (event, id) => {
    return categoryController.deleteCategory(id);
  });
}

module.exports = registerCategoryRoutes;
