const db = require("../services/db");
const Store = new (require("electron-store"))();

// ✅ Get Table for current branch
function getTable(areaId = null) {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;
      let query = `
        SELECT * FROM tables
        WHERE branch_id = ?
      `;
      const params = [currentBranchId];

      // If areaId is passed, add filter
      if (areaId) {
        query += " AND area_id = ?";
        params.push(Number(areaId));
      }

      query += " ORDER BY created_at DESC";

      const stmt = db.prepare(query);
      const rows = stmt.all(...params);
      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Add Areas
function addTable(table) {
    return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;
      const createdAt = new Date().toISOString();

      db.prepare(`
        INSERT INTO areas (branch_id, table_code ,status,available_status,area_id,seating_capacity ,created_at, updated_at, isSink) 
        VALUES (?, ?, ?, ?, ?)
      `).run(
        currentBranchId,
        table.table_code,
        table.status,
        table.available_status,
        table.area_id,
        table.seating_capacity,
        createdAt,
        createdAt,
        table.isSink ? 1 : 0
      );

      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Update Area
function updateTable(id, table) {
  return new Promise((resolve, reject) => {
    try {
      const updatedAt = new Date().toISOString();
      const stmt = db.prepare(`
        UPDATE tables
        SET table_code = ?, updated_at = ?, isSink = ?
        WHERE id = ?
      `);

      const result = stmt.run(
        table.table_code,
        updatedAt,
        table.isSink ? 1 : 0,
        id
      );

      resolve({ updated: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Delete Area
function deleteTable(id) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(`DELETE FROM tables WHERE id = ?`);
      const result = stmt.run(id);
      resolve({ deleted: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  getTable,
  addTable,
  updateTable,
  deleteTable
};