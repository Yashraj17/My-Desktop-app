const db = require("../services/db");
const Store = new (require("electron-store"))();


function getOrders() {
  return new Promise((resolve, reject) => {
     try {
      const currentBranchId = Store.get("branchId") || 3;
      const query = `
        SELECT * FROM orders
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
  getOrders,
};