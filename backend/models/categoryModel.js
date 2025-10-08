// src/main/models/categoryModel.js
const db = require("../services/db");
const Store = new (require("electron-store"))();
const currentBranchId = Store.get("branchId") || 1; // get active branch ID

function setBranchId(branchId) {
  currentBranchId = branchId;
}

// ✅ Get all categories
function getCategories() {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(`
        SELECT ic.*, COUNT(mi.id) as items_count
        FROM item_categories ic
        LEFT JOIN menu_items mi ON ic.id = mi.item_category_id
        WHERE ic.branch_id = ?
        GROUP BY ic.id
        ORDER BY ic.id DESC
      `);

      const rows = stmt.all(currentBranchId);

      const categories = rows.map(row => ({
        id: row.id,
        category_name: JSON.parse(row.category_name)?.en || "",
        sort_order: row.sort_order,
        created_at: row.created_at,
        updated_at: row.updated_at,
        items_count: row.items_count
      }));

      resolve(categories);
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Add category
function addCategory(categoryName, sortOrder = 0) {
  return new Promise((resolve, reject) => {
    try {
      const nameJson = JSON.stringify({ en: categoryName });
      const now = new Date().toISOString();

      const stmt = db.prepare(`
        INSERT INTO item_categories (branch_id, category_name, sort_order, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?)
      `);

      const result = stmt.run(currentBranchId, nameJson, sortOrder, now, now);

      resolve({ id: result.lastInsertRowid, category_name: categoryName });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Update category
function updateCategory(id, categoryName, sortOrder = 0) {
  return new Promise((resolve, reject) => {
    try {
      const nameJson = JSON.stringify({ en: categoryName });
      const now = new Date().toISOString();

      const stmt = db.prepare(`
        UPDATE item_categories 
        SET category_name = ?, sort_order = ?, updated_at = ?
        WHERE id = ?
      `);

      const result = stmt.run(nameJson, sortOrder, now, id);

      resolve({ updated: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Delete category
function deleteCategory(id) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(`DELETE FROM item_categories WHERE id = ?`);
      const result = stmt.run(id);
      resolve({ deleted: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  setBranchId,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
};
