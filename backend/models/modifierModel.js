const db = require("../services/db");

// ✅ Get modifiers
function getModifiers() {
  return new Promise((resolve, reject) => {
    try {
      const query = `
        SELECT im.*, mi.item_name, mg.name AS modifier_group_name
        FROM item_modifiers im
        LEFT JOIN menu_items mi ON mi.id = im.menu_item_id
        LEFT JOIN modifier_groups mg ON mg.id = im.modifier_group_id
        ORDER BY im.created_at DESC
      `;
      const stmt = db.prepare(query);
      const rows = stmt.all();
      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Add modifier
function addModifier(modifier) {
  return new Promise((resolve, reject) => {
    try {
      const now = new Date().toISOString();
      const stmt = db.prepare(`
        INSERT INTO item_modifiers 
        (menu_item_id, modifier_group_id, is_required, allow_multiple_selection, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        modifier.menu_item_id,
        modifier.modifier_group_id,
        modifier.is_required ? 1 : 0,
        modifier.allow_multiple_selection ? 1 : 0,
        now,
        now
      );

      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Update modifier
function updateModifier(id, modifier) {
  return new Promise((resolve, reject) => {
    try {
      const updatedAt = new Date().toISOString();
      const stmt = db.prepare(`
        UPDATE item_modifiers
        SET menu_item_id = ?, modifier_group_id = ?, is_required = ?, allow_multiple_selection = ?, updated_at = ?
        WHERE id = ?
      `);

      const result = stmt.run(
        modifier.menu_item_id,
        modifier.modifier_group_id,
        modifier.is_required ? 1 : 0,
        modifier.allow_multiple_selection ? 1 : 0,
        updatedAt,
        id
      );

      resolve({ updated: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Delete modifier
function deleteModifier(id) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(`DELETE FROM item_modifiers WHERE id = ?`);
      const result = stmt.run(id);
      resolve({ deleted: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  getModifiers,
  addModifier,
  updateModifier,
  deleteModifier
};
