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
          c.name AS customer_name,
          GROUP_CONCAT(k.kot_number, ', ') AS kot_numbers,
          COUNT(k.id) AS total_kots
        FROM orders o
        LEFT JOIN users u 
          ON CAST(o.waiter_id AS INTEGER) = u.id
        LEFT JOIN customers c
          ON CAST(o.customer_id AS INTEGER) = c.id
        LEFT JOIN kots k 
          ON CAST(k.order_id AS INTEGER) = o.id
        WHERE o.branch_id = ?
      `;

      const params = [currentBranchId];

      // Optional search (order no, status, waiter, customer, KOT)
      if (search && search.trim() !== "") {
        query += `
          AND (
            o.order_number LIKE ? OR 
            o.order_status LIKE ? OR 
            u.name LIKE ? OR 
            c.name LIKE ? OR
            k.kot_number LIKE ?
          )
        `;
        const likeSearch = `%${search}%`;
        params.push(likeSearch, likeSearch, likeSearch, likeSearch, likeSearch);
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


 function getTodayPaymentMethodEarnings() {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;

      // Get today's date (YYYY-MM-DD)
const today = new Date().toISOString().split("T")[0];

      // Query: sum total per payment method (excluding 'due')
      const query = `
        SELECT 
          payment_method, 
          SUM(amount) AS total_amount
        FROM payments
        WHERE 
          payment_method <> 'due'
          AND branch_id = ?
          AND DATE(created_at) = ?
        GROUP BY payment_method
        ORDER BY total_amount DESC
      `;

      const stmt = db.prepare(query);
      const rows = stmt.all(currentBranchId, today);

      // Format: ensure consistent float conversion and sorting
      const formatted = rows.map(row => ({
        payment_method: row.payment_method,
        total_amount: parseFloat(row.total_amount || 0).toFixed(2),
      }));

      resolve(formatted);
    } catch (error) {
      reject(error);
    }
  });
}


function getTodayMenuItemEarnings() {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;

      // Today's start and end timestamps
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      // SQLite query: sum total amount AND quantity
      const query = `
        SELECT 
          mi.id,
          mi.item_name,
          mi.price,
          SUM(oi.amount) AS total_earning,
          SUM(oi.quantity) AS total_quantity,
          mi.image AS item_photo_url
        FROM menu_items mi
        JOIN order_items oi ON oi.menu_item_id = mi.id
        JOIN orders o ON o.id = oi.order_id
        WHERE 
          o.status = 'paid'
          AND o.branch_id = ?
          AND o.date_time >= ?
          AND o.date_time <= ?
        GROUP BY mi.id
        HAVING total_earning > 0
        ORDER BY total_earning DESC
        LIMIT 5
      `;

      const stmt = db.prepare(query);
      const rows = stmt.all(currentBranchId, startOfDay, endOfDay);

      // Format results
      const formatted = rows.map(row => ({
        id: row.id,
        item_name: row.item_name,
        price: parseFloat(row.price || 0).toFixed(2),
        total_earning: parseFloat(row.total_earning || 0).toFixed(2),
        total_quantity: parseInt(row.total_quantity || 0),
        item_photo_url: row.item_photo_url || "/images/placeholder.png"
      }));

      resolve(formatted);
    } catch (error) {
      reject(error);
    }
  });
}


function getTodayTableEarnings() {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;

      // Get today's start and end timestamps (ISO format)
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      const query = `
        SELECT 
          t.id as table_id,
          t.table_code,
          SUM(o.total) AS total_earning
        FROM tables t
        JOIN orders o ON o.table_id = t.id
        WHERE 
          o.status = 'paid'
          AND o.branch_id = ?
          AND o.date_time >= ?
          AND o.date_time <= ?
        GROUP BY t.id
        HAVING total_earning > 0
        ORDER BY total_earning DESC
        LIMIT 5
      `;

      const stmt = db.prepare(query);
      const rows = stmt.all(currentBranchId, startOfDay, endOfDay);

      // Format results
      const formatted = rows.map(row => ({
        table_id: row.table_id,
        table_code: row.table_code || `Table ${row.table_id}`,
        total_earning: parseFloat(row.total_earning || 0).toFixed(2),
      }));

      resolve(formatted);
    } catch (error) {
      reject(error);
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
  getTodayPaymentMethodEarnings,
  getTodayMenuItemEarnings,
  getTodayTableEarnings
};