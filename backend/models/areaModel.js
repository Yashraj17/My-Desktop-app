const db = require("../services/db");
const Store = new (require("electron-store"))();

// ✅ Get Areas for current branch
function getAreas() {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;
      const query = `
        SELECT * FROM areas
        WHERE branch_id = ?
        ORDER BY created_at DESC
      `;
      const stmt = db.prepare(query);
      const rows = stmt.all(currentBranchId);
      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Add Areas
function addAreas(area) {
    return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;
      const createdAt = new Date().toISOString();

      db.prepare(`
        INSERT INTO areas (branch_id, area_name, created_at, updated_at, isSink) 
        VALUES (?, ?, ?, ?, ?)
      `).run(
        currentBranchId,
        area.area_name,
        createdAt,
        createdAt,
        area.isSink ? 1 : 0
      );

      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Update Area
function updateAreas(id, area) {
  console.log("hello this is update areas", { id, ...area });
  return new Promise((resolve, reject) => {
    try {
      const updatedAt = new Date().toISOString();
      const stmt = db.prepare(`
        UPDATE areas
        SET area_name = ?, updated_at = ?, isSink = ?
        WHERE id = ?
      `);

      const result = stmt.run(
        area.area_name,
        updatedAt,
        area.isSink ? 1 : 0,
        id
      );

      resolve({ updated: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Delete Area
function deleteAreas(id) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(`DELETE FROM areas WHERE id = ?`);
      const result = stmt.run(id);
      resolve({ deleted: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  getAreas,
  addAreas,
  updateAreas,
  deleteAreas
};