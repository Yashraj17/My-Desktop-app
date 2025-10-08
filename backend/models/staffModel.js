const db = require("../services/db");
const Store = new (require("electron-store"))();

// ✅ Get All Staff for current branch (with optional search)
function getStaffs(search = "") {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;
      // let query = `
      //   SELECT * FROM users
      //   WHERE branch_id = ?
      // `;

      
      // 🧩 Include both branch-specific and null-branch users
      let query = `
        SELECT * FROM users
        WHERE (branch_id = ? OR branch_id IS NULL)
      `;

      const params = [currentBranchId];

      if (search && search.trim() !== "") {
        query += ` AND (name LIKE ? OR email LIKE ? OR phone_number LIKE ?) `;
        const likeSearch = `%${search}%`;
        params.push(likeSearch, likeSearch, likeSearch);
      }

      query += ` ORDER BY created_at DESC`;

      const stmt = db.prepare(query);
      const rows = stmt.all(...params);
      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Get Staff by ID
function getStaffById(id) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
      const row = stmt.get(id);
      resolve(row);
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Add Staff
function addStaff(staff) {
  return new Promise((resolve, reject) => {
    try {
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;
      const currentBranchId = Store.get("branchId") || 1;
      const restaurantId = Store.get("restaurantId") || null;

      const stmt = db.prepare(`
        INSERT INTO users (
          restaurant_id, branch_id, name, email, phone_number, phone_code,
          password, created_at, updated_at,
          newfield1, newfield2, newfield3, isSync
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        restaurantId,
        currentBranchId,
        staff.name || null,
        staff.email || null,
        staff.phone_number || null,
        staff.phone_code || null,
        staff.password || "123456", // default password if not provided
        createdAt,
        updatedAt,
        staff.newfield1 || null,
        staff.newfield2 || null,
        staff.newfield3 || null,
        staff.isSync ? 1 : 0
      );

      resolve({ success: true, id: result.lastInsertRowid });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Update Staff
function updateStaff(id, staff) {
  return new Promise((resolve, reject) => {
    try {
      const updatedAt = new Date().toISOString();

      const stmt = db.prepare(`
        UPDATE users
        SET 
          name = ?, 
          email = ?, 
          phone_number = ?, 
          phone_code = ?, 
          password = ?, 
          updated_at = ?,
          newfield1 = ?,
          newfield2 = ?,
          newfield3 = ?,
          isSync = ?
        WHERE id = ?
      `);

      const result = stmt.run(
        staff.name || null,
        staff.email || null,
        staff.phone_number || null,
        staff.phone_code || null,
        staff.password || "123456",
        updatedAt,
        staff.newfield1 || null,
        staff.newfield2 || null,
        staff.newfield3 || null,
        staff.isSync ? 1 : 0,
        id
      );

      resolve({ updated: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Delete Staff
function deleteStaff(id) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(`DELETE FROM users WHERE id = ?`);
      const result = stmt.run(id);
      resolve({ deleted: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  getStaffs,
  getStaffById,
  addStaff,
  updateStaff,
  deleteStaff,
};
