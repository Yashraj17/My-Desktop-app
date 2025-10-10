const db = require("../services/db");
const Store = new (require("electron-store"))();

function getOrders(search = "") {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;

      let query = `
        SELECT *
        FROM orders
        WHERE branch_id = ?
      `;

      const params = [currentBranchId];

      // Optional search in order_number or order_status
      if (search && search.trim() !== "") {
        query += ` AND (order_number LIKE ? OR order_status LIKE ?)`;
        const likeSearch = `%${search}%`;
        params.push(likeSearch, likeSearch);
      }

      query += ` ORDER BY date_time DESC`;

      const stmt = db.prepare(query);
      const rows = stmt.all(...params);

      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
}
function getOrdersInfo() {
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
  getOrdersInfo
  
};