const db = require("../services/db");
const Store = require("electron-store");
const store = new Store();

function safeParseGroupName(groupName) {
  try {
    const parsed = JSON.parse(groupName);
    return parsed?.en ?? groupName;
  } catch {
    return groupName;
  }
}

// ✅ Get all modifier groups (with options + search)
function getModifierGroups(searchTerm = "") {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = store.get("branchId", 1); // always read fresh
      if (!currentBranchId) {
        return reject(new Error("Branch ID not set"));
      }

      let query = `
        SELECT 
          mg.id AS group_id,
          mg.name AS group_name,
          mg.branch_id,
          mg.created_at,
          mg.updated_at,
          mg.description,
          mo.id AS option_id,
          mo.name AS option_name,
          mo.price,
          mo.is_available
        FROM modifier_groups mg
        LEFT JOIN modifier_options mo ON mg.id = mo.modifier_group_id
        WHERE mg.branch_id = ?
      `;

      const params = [currentBranchId];

      if (searchTerm) {
        query += `
          AND (
            json_extract(mg.name, '$.en') LIKE ?
            OR mo.name LIKE ?
          )
        `;
        const likeSearch = `%${searchTerm}%`;
        params.push(likeSearch, likeSearch);
      }

      query += ` ORDER BY mg.id DESC, mo.id ASC`;

      const stmt = db.prepare(query);
      const rows = stmt.all(...params);

      const groups = {};

      rows.forEach(row => {
        const id = row.group_id;
        if (!groups[id]) {
          groups[id] = {
            id,
            name: safeParseGroupName(row.group_name),
            branch_id: row.branch_id,
            created_at: row.created_at,
            updated_at: row.updated_at,
            description: row.description,
            options: []
          };
        }

        if (row.option_id) {
          groups[id].options.push({
            id: row.option_id,
            name: row.option_name,
            price: row.price,
            is_available: row.is_available
          });
        }
      });

      resolve(Object.values(groups));
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Add modifier group + options
function addModifierGroup({ name, description, options }) {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = store.get("branchId", 1);
      if (!currentBranchId) {
        return reject(new Error("Branch ID not set"));
      }

      const now = new Date().toISOString();

      const stmt = db.prepare(`
        INSERT INTO modifier_groups (name, description, branch_id, created_at, updated_at, isSync)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(name, description, currentBranchId, now, now, 0);

      const groupId = result.lastInsertRowid;

      const optStmt = db.prepare(`
        INSERT INTO modifier_options (
          modifier_group_id, name, price, is_available, sort_order, is_preselected, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const opt of options || []) {
        optStmt.run(
          groupId,
          opt.name,
          opt.price || 0,
          opt.is_available ? 1 : 0,
          opt.sort_order || 0,
          opt.is_preselected ? 1 : 0,
          now,
          now
        );
      }

      resolve({ success: true, id: groupId });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Update modifier group + replace options
function updateModifierGroup(id, { name, description, options }) {
  return new Promise((resolve, reject) => {
    try {
      const updatedAt = new Date().toISOString();

      db.prepare(`
        UPDATE modifier_groups
        SET name = ?, description = ?, updated_at = ?
        WHERE id = ?
      `).run(name, description, updatedAt, id);

      db.prepare(`DELETE FROM modifier_options WHERE modifier_group_id = ?`).run(id);

      const optStmt = db.prepare(`
        INSERT INTO modifier_options (
          modifier_group_id, name, price, is_available, sort_order, is_preselected, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const opt of options || []) {
        optStmt.run(
          id,
          opt.name,
          opt.price || 0,
          opt.is_available ? 1 : 0,
          opt.sort_order || 0,
          opt.is_preselected ? 1 : 0,
          updatedAt,
          updatedAt
        );
      }

      resolve({ updated: true });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Delete modifier group
function deleteModifierGroup(id) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(`DELETE FROM modifier_groups WHERE id = ?`);
      const result = stmt.run(id);
      resolve({ deleted: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  getModifierGroups,
  addModifierGroup,
  updateModifierGroup,
  deleteModifierGroup
};
