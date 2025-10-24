const db = require("../services/db");
const Store = new (require("electron-store"))();

// ✅ Get All Customers

function getCustomers1(search = '') {
  return new Promise((resolve, reject) => {
    try {
      let query = `
        SELECT c.*, 
               COUNT(o.id) AS total_orders
        FROM customers c
        LEFT JOIN orders o ON o.customer_id = c.id
        WHERE 1=1
      `;
      const params = [];

      if (search && search.trim() !== '') {
        query += ` AND (c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?) `;
        const likeSearch = `%${search}%`;
        params.push(likeSearch, likeSearch, likeSearch);
      }

      query += `
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `;

      const stmt = db.prepare(query);
      const rows = stmt.all(...params);
      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
}
function getCustomers11(search = '') {
  return new Promise((resolve, reject) => {
    try {
      let query = `
        SELECT 
          c.*, 
          COUNT(o.id) AS total_orders,
          IFNULL(SUM(o.amount_paid), 0) AS total_amount
        FROM customers c
        LEFT JOIN orders o ON o.customer_id = c.id
        WHERE 1=1
      `;
      const params = [];

      if (search && search.trim() !== '') {
        query += ` AND (c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?) `;
        const likeSearch = `%${search}%`;
        params.push(likeSearch, likeSearch, likeSearch);
      }

      query += `
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `;

      const stmt = db.prepare(query);
      const rows = stmt.all(...params);
      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
}

function getCustomers(search = '') { 
  return new Promise((resolve, reject) => {
    try {
      const restaurantId = Store.get("restaurantId") || null;
       console.log(restaurantId,"restaurantId")
      let query = `
        SELECT 
          c.*, 
          COUNT(o.id) AS total_orders,
          IFNULL(SUM(o.amount_paid), 0) AS total_amount
        FROM customers c
        LEFT JOIN orders o ON o.customer_id = c.id
        WHERE 1=1
      `;
      const params = [];

      // ✅ filter by restaurant_id
      if (restaurantId) {
        query += ` AND c.restaurant_id = ? `;
        params.push(restaurantId);
      }

      // ✅ search filter
      if (search && search.trim() !== '') {
        query += ` AND (c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?) `;
        const likeSearch = `%${search}%`;
        params.push(likeSearch, likeSearch, likeSearch);
      }

      query += `
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `;

      const stmt = db.prepare(query);
      const rows = stmt.all(...params);
      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
}


// ✅ Get Customer by ID
function getCustomerById(id) {
  return new Promise((resolve, reject) => {
    try {
      const query = `
        SELECT * FROM customers
        WHERE id = ?
      `;
      const stmt = db.prepare(query);
      const row = stmt.get(id);
      resolve(row);
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Add Customer
function addCustomer(customer) {
  return new Promise((resolve, reject) => {
    try {
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;
      const restaurantId = Store.get("restaurantId") || null;

      const stmt = db.prepare(`
        INSERT INTO customers (
          restaurant_id,name, phone, email, email_otp, 
          created_at, updated_at, delivery_address,
          newfield1, newfield2, newfield3, isSync
        ) 
        VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        restaurantId,
        customer.name || null,
        customer.phone || null,
        customer.email || null,
        customer.email_otp || null,
        createdAt,
        updatedAt,
        customer.delivery_address || null,
        customer.newfield1 || null,
        customer.newfield2 || null,
        customer.newfield3 || null,
        customer.isSync ? 1 : 0
      );

      resolve({ success: true, id: result.lastInsertRowid });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Update Customer
function updateCustomer(id, customer) {
  return new Promise((resolve, reject) => {
    try {
      const updatedAt = new Date().toISOString();
      
      const stmt = db.prepare(`
        UPDATE customers
        SET 
          name = ?, 
          phone = ?, 
          email = ?, 
          email_otp = ?, 
          updated_at = ?, 
          delivery_address = ?,
          newfield1 = ?,
          newfield2 = ?,
          newfield3 = ?,
          isSync = ?
        WHERE id = ?
      `);

      const result = stmt.run(
        customer.name || null,
        customer.phone || null,
        customer.email || null,
        customer.email_otp || null,
        updatedAt,
        customer.delivery_address || null,
        customer.newfield1 || null,
        customer.newfield2 || null,
        customer.newfield3 || null,
        customer.isSync ? 1 : 0,
        id
      );

      resolve({ updated: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Delete Customer
function deleteCustomer(id) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(`DELETE FROM customers WHERE id = ?`);
      const result = stmt.run(id);
      resolve({ deleted: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  getCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer,
};