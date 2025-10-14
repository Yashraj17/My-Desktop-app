const db = require("../services/db");
const Store = new (require("electron-store"))();

function getOrdersOLD(search = "") {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;
      console.log("currentBranchId",currentBranchId)
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

function getOrders(search = "") {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;

      let query = `
        SELECT 
          o.*, 
          u.name AS waiter_name,
          GROUP_CONCAT(k.kot_number, ', ') AS kot_numbers,
          COUNT(k.id) AS total_kots
        FROM orders o
        LEFT JOIN users u 
          ON CAST(o.waiter_id AS INTEGER) = u.id
        LEFT JOIN kots k 
          ON CAST(k.order_id AS INTEGER) = o.id
        WHERE o.branch_id = ?
      `;

      const params = [currentBranchId];

      // Optional search (order no, status, waiter, KOT)
      if (search && search.trim() !== "") {
        query += `
          AND (
            o.order_number LIKE ? OR 
            o.order_status LIKE ? OR 
            u.name LIKE ? OR 
            k.kot_number LIKE ?
          )
        `;
        const likeSearch = `%${search}%`;
        params.push(likeSearch, likeSearch, likeSearch, likeSearch);
      }

      // Group by order for aggregation
      query += `
        GROUP BY o.id
        ORDER BY o.date_time DESC
      `;

      const stmt = db.prepare(query);
      const rows = stmt.all(...params);

      // Format results
      const formatted = rows.map(row => ({
        ...row,
        kot_numbers: row.kot_numbers ? row.kot_numbers.split(", ") : [],
        total_kots: Number(row.total_kots) || 0,
      }));

      resolve(formatted);
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
  getOrdersInfo,
};