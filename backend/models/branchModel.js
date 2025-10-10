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

function getBranches(restaurantId, search = "") {
  return new Promise((resolve, reject) => {
    console.log("restaurantId", restaurantId);
    try {
      let query = `SELECT * FROM branches WHERE restaurant_id = ?`;
      const params = [restaurantId];

      if (search && search.trim() !== "") {
        query += ` AND (name LIKE ? OR address LIKE ?)`;
        const likeSearch = `%${search}%`;
        params.push(likeSearch, likeSearch);
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

function getActiveBranch() {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1; // get active branch ID
      const query = `SELECT * FROM branches WHERE id = ? LIMIT 1`;
      const stmt = db.prepare(query);
      const branch = stmt.get(currentBranchId);

      if (branch) {
        resolve(branch);
      } else {
        resolve(null); // no active branch found
      }
    } catch (err) {
      console.error("Error fetching active branch:", err);
      reject(err);
    }
  });
}



module.exports = { addBranchBackup,getBranches,getActiveBranch };
