const categoryModel = require("../models/categoryModel");

function setBranchId(branchId) {
  categoryModel.setBranchId(branchId);
}

function getCategories() {
  return categoryModel.getCategories();
}

function addCategory(name, sortOrder = 0) {
  return categoryModel.addCategory(name, sortOrder);
}

function updateCategory(id, name, sortOrder = 0) {
  return categoryModel.updateCategory(id, name, sortOrder);
}

function deleteCategory(id) {
  return categoryModel.deleteCategory(id);
}

module.exports = {
  setBranchId,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
};
