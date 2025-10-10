const db = require("../services/db");
const Store = new (require("electron-store"))();

// ✅ Get All Roles (with optional search, filtered by restaurant)
function getRoles(search = "") {
  return new Promise((resolve, reject) => {
    try {
      const restaurantId = Store.get("restaurantId") || null;
      let query = `
        SELECT * FROM roles
        WHERE restaurant_id = ?
      `;
      const params = [restaurantId];

      if (search && search.trim() !== "") {
        query += ` AND (name LIKE ? OR display_name LIKE ? OR guard_name LIKE ?) `;
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

// ✅ Get Role by ID
function getRoleById(id) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(`SELECT * FROM roles WHERE id = ?`);
      const row = stmt.get(id);
      resolve(row);
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Add Role
function addRole(role) {
  return new Promise((resolve, reject) => {
    try {
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;
      const restaurantId = Store.get("restaurantId") || null;

      const stmt = db.prepare(`
        INSERT INTO roles (
          name, display_name, guard_name,
          created_at, updated_at,
          restaurant_id,
          newfield1, newfield2, newfield3, isSync
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        role.name,
        role.display_name || null,
        role.guard_name || "web", // default guard_name
        createdAt,
        updatedAt,
        restaurantId,
        role.newfield1 || null,
        role.newfield2 || null,
        role.newfield3 || null,
        role.isSync ? 1 : 0
      );

      resolve({ success: true, id: result.lastInsertRowid });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Update Role
function updateRole(id, role) {
  return new Promise((resolve, reject) => {
    try {
      const updatedAt = new Date().toISOString();

      const stmt = db.prepare(`
        UPDATE roles
        SET 
          name = ?, 
          display_name = ?, 
          guard_name = ?, 
          updated_at = ?,
          newfield1 = ?,
          newfield2 = ?,
          newfield3 = ?,
          isSync = ?
        WHERE id = ?
      `);

      const result = stmt.run(
        role.name,
        role.display_name || null,
        role.guard_name || "web",
        updatedAt,
        role.newfield1 || null,
        role.newfield2 || null,
        role.newfield3 || null,
        role.isSync ? 1 : 0,
        id
      );

      resolve({ updated: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Delete Role
function deleteRole(id) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(`DELETE FROM roles WHERE id = ?`);
      const result = stmt.run(id);
      resolve({ deleted: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  getRoles,
  getRoleById,
  addRole,
  updateRole,
  deleteRole,
};
