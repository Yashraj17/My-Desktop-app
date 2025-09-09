const db = require("../services/db");
const Store = new (require("electron-store"))();
function addBranchBackup(b) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO branches
        (id, restaurant_id, name, address, created_at, updated_at, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        b.id,
        b.restaurant_id,
        b.name,
        b.address,
        b.created_at,
        b.updated_at,
        b.isSync||1
      );

      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { addBranchBackup };
