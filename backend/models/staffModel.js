const db = require("../services/db");
const Store = new (require("electron-store"))();

// ✅ Get Delivery Executives for current branch
function getStaffs(search) {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;
      const query = `
        SELECT * FROM users
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

module.exports = {
  getStaffs,
  
};