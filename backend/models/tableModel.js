const db = require("../services/db");
const Store = new (require("electron-store"))();
const crypto = require("crypto");

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

// ✅ Add Table
function addTable(table) {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;
      const createdAt = new Date().toISOString();
      const hash = crypto.randomBytes(16).toString("hex"); // generate unique hash

      db.prepare(`
        INSERT INTO tables (
          branch_id, table_code, status, available_status, area_id, seating_capacity,
          created_at, updated_at, isSync, hash,x,y
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
      `).run(
        currentBranchId,
        table.table_code,
        table.status,
        table.available_status || "available",  // default if missing
        table.area_id,
        table.seating_capacity,
        createdAt,
        createdAt,
        table.isSync ? 1 : 0,
        hash,
        table.x||0,
        table.y||0
      );

      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}
// ✅ Update Table
function updateTable(id, table) {
  return new Promise((resolve, reject) => {
    try {
      const updatedAt = new Date().toISOString();
      const stmt = db.prepare(`
        UPDATE tables
        SET table_code = ?, status = ?, available_status = ?, area_id = ?, seating_capacity = ?, updated_at = ?, isSync = ?,x=?,y=?
        WHERE id = ?
      `);

      const result = stmt.run(
        table.table_code,
        table.status,
        table.available_status,
        table.area_id,
        table.seating_capacity,
        updatedAt,
        table.isSync ? 1 : 0,
        table.x||0,
        table.y||0,
        id
      );

      resolve({ updated: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

function updateTablePosition(id, data) {
  return new Promise((resolve, reject) => {
    try {
      const { x, y } = data;
      const stmt = db.prepare(`UPDATE tables SET x = ?, y = ?, updated_at = ? WHERE id = ?`);
      const updatedAt = new Date().toISOString();
      const result = stmt.run(x || 0, y || 0, updatedAt, id);
      resolve({ updated: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}



// ✅ Delete Table
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
  deleteTable,
  updateTablePosition
};