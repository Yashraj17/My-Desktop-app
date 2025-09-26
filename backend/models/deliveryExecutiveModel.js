const db = require("../services/db");
const Store = new (require("electron-store"))();

// ✅ Get Delivery Executives for current branch

function getDeliveryExecutives() {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;
      const query = `
        SELECT 
          de.*,
          COUNT(o.id) AS total_orders
        FROM delivery_executives de
        LEFT JOIN orders o 
          ON CAST(o.delivery_executive_id AS INTEGER) = de.id
          AND o.branch_id = ?
        WHERE de.branch_id = ?
        GROUP BY de.id
        ORDER BY total_orders DESC
      `;
      const stmt = db.prepare(query);
      const rows = stmt.all(currentBranchId, currentBranchId);
      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
}



// ✅ Get Delivery Executive by ID
function getDeliveryExecutiveById(id) {
  return new Promise((resolve, reject) => {
    try {
      const query = `
        SELECT * FROM delivery_executives
        WHERE id = ?
      `;
      const stmt = db.prepare(query);
      const row = stmt.get(id);
      resolve(row);
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Add Delivery Executive
function addDeliveryExecutive(executive) {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;

      const stmt = db.prepare(`
        INSERT INTO delivery_executives (
          branch_id, name, phone, photo, status,
          created_at, updated_at,
          newfield1, newfield2, newfield3, isSync
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        currentBranchId,
        executive.name,
        executive.phone || null,
        executive.photo || null,
        executive.status || 'available',
        createdAt,
        updatedAt,
        executive.newfield1 || null,
        executive.newfield2 || null,
        executive.newfield3 || null,
        executive.isSync ? 1 : 0
      );

      resolve({ success: true, id: result.lastInsertRowid });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Update Delivery Executive
function updateDeliveryExecutive(id, executive) {
  return new Promise((resolve, reject) => {
    try {
      const updatedAt = new Date().toISOString();
      
      const stmt = db.prepare(`
        UPDATE delivery_executives
        SET 
          name = ?, 
          phone = ?, 
          photo = ?, 
          status = ?, 
          updated_at = ?,
          newfield1 = ?,
          newfield2 = ?,
          newfield3 = ?,
          isSync = ?
        WHERE id = ?
      `);

      const result = stmt.run(
        executive.name,
        executive.phone || null,
        executive.photo || null,
        executive.status || 'available',
        updatedAt,
        executive.newfield1 || null,
        executive.newfield2 || null,
        executive.newfield3 || null,
        executive.isSync ? 1 : 0,
        id
      );

      resolve({ updated: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Delete Delivery Executive
function deleteDeliveryExecutive(id) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(`DELETE FROM delivery_executives WHERE id = ?`);
      const result = stmt.run(id);
      resolve({ deleted: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}


module.exports = {
  getDeliveryExecutives,
  getDeliveryExecutiveById,
  addDeliveryExecutive,
  updateDeliveryExecutive,
  deleteDeliveryExecutive
};