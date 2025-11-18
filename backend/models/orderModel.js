const db = require("../services/db");
const Store = new (require("electron-store"))();
const { v4: uuidv4 } = require("uuid");

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

/**
 * Initiate and save a new order with order items to the database
 * @param {Object} orderData - Order data object containing order details and items
 * @returns {Promise<Object>} - Returns { success: true, orderId: ..., orderNumber: ... } on success
 */
function initiateOrder(orderData) {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;
      const orderUuid = uuidv4();
      const nowDateTime = new Date().toISOString();

      // Extract order properties from the orderData parameter
      const {
        order_number,
        table_id,
        customer_id,
        number_of_pax,
        waiter_id,
        status,
        sub_total,
        tip_amount,
        tip_note,
        total,
        amount_paid,
        order_type,
        discount_type,
        discount_value,
        discount_amount,
        order_status,
        delivery_fee,
        delivery_executive_id,
        delivery_address,
        delivery_time,
        estimated_delivery_time,
        estimated_eta_min,
        estimated_eta_max,
        customer_lat,
        customer_lng,
        is_within_radius,
        orderItems = [],
      } = orderData;

      // Begin transaction to ensure atomicity
      const transaction = db.transaction(() => {
        // Insert order into the orders table
        const orderInsertQuery = `
          INSERT INTO orders (
            uuid,
            branch_id,
            order_number,
            date_time,
            table_id,
            customer_id,
            number_of_pax,
            waiter_id,
            status,
            sub_total,
            tip_amount,
            tip_note,
            total,
            amount_paid,
            created_at,
            updated_at,
            order_type,
            delivery_executive_id,
            delivery_address,
            delivery_time,
            estimated_delivery_time,
            discount_type,
            discount_value,
            discount_amount,
            order_status,
            delivery_fee,
            customer_lat,
            customer_lng,
            is_within_radius,
            estimated_eta_min,
            estimated_eta_max,
            isSync
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const orderStmt = db.prepare(orderInsertQuery);
        const orderResult = orderStmt.run(
          orderUuid,                           // uuid
          currentBranchId,                     // branch_id
          order_number,                        // order_number
          nowDateTime,                         // date_time
          table_id || null,                    // table_id
          customer_id || null,                 // customer_id
          number_of_pax || 1,                  // number_of_pax
          waiter_id || null,                   // waiter_id
          status || 'kot',                     // status
          Number(sub_total) || 0,              // sub_total
          Number(tip_amount) || 0,             // tip_amount
          tip_note || null,                    // tip_note
          Number(total) || 0,                  // total
          Number(amount_paid) || 0,            // amount_paid
          nowDateTime,                         // created_at
          nowDateTime,                         // updated_at
          order_type || 'dine_in',             // order_type
          delivery_executive_id || null,       // delivery_executive_id
          delivery_address || null,            // delivery_address
          delivery_time || null,               // delivery_time
          estimated_delivery_time || null,     // estimated_delivery_time
          discount_type || null,               // discount_type
          discount_value || null,              // discount_value
          discount_amount || null,             // discount_amount
          order_status || 'placed',            // order_status
          Number(delivery_fee) || 0,           // delivery_fee
          customer_lat || null,                // customer_lat
          customer_lng || null,                // customer_lng
          is_within_radius || 0,               // is_within_radius
          estimated_eta_min || null,           // estimated_eta_min
          estimated_eta_max || null,           // estimated_eta_max
          0                                    // isSync
        );

        const orderId = orderResult.lastInsertRowid;

        // Insert order items into the order_items table
        const itemInsertQuery = `
          INSERT INTO order_items (
            branch_id,
            order_id,
            menu_item_id,
            menu_item_variation_id,
            quantity,
            price,
            amount,
            created_at,
            updated_at,
            isSync
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const itemStmt = db.prepare(itemInsertQuery);

        // Insert each order item
        orderItems.forEach((item) => {
          itemStmt.run(
            currentBranchId,                        // branch_id
            orderId,                                // order_id
            item.menu_item_id,                      // menu_item_id
            item.menu_item_variation_id || null,    // menu_item_variation_id
            Number(item.quantity) || 0,             // quantity
            Number(item.price) || 0,                // price
            Number(item.amount) || 0,               // amount
            nowDateTime,                            // created_at
            nowDateTime,                            // updated_at
            0                                       // isSync
          );
        });

        return { orderId, orderUuid };
      });

      // Execute the transaction
      const result = transaction();

      resolve({
        success: true,
        orderId: result.orderId,
        orderUuid: result.orderUuid,
        orderNumber: order_number,
        message: `Order ${order_number} created successfully with ${orderItems.length} item(s)`,
      });
    } catch (err) {
      console.error("Error in initiateOrder:", err);
      reject({
        success: false,
        error: err.message,
        message: "Failed to create order",
      });
    }
  });
}

module.exports = {
  getOrders,
  getOrdersInfo,
  initiateOrder,
};

/**
 * Get orders with their order items for the current branch.
 * Returns an array where each order object includes an `items` array and the `created_at` field.
 * @param {string} search optional search string to match order_number or order_status
 */
function getOrdersWithItems(search = "") {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;

      // Build query for orders in current branch with optional search
      let orderQuery = `SELECT * FROM orders WHERE branch_id = ?`;
      const params = [currentBranchId];
      console.log("Current Branch ID:", currentBranchId);
      if (search && search.trim() !== "") {
        orderQuery += ` AND (order_number LIKE ? OR order_status LIKE ?)`;
        const likeSearch = `%${search}%`;
        params.push(likeSearch, likeSearch);
      }

      orderQuery += ` ORDER BY created_at DESC`;

      const orderStmt = db.prepare(orderQuery);
      const orders = orderStmt.all(...params);

      // Prepare item query once (order_items.order_id stores the orders.id integer)
      const itemStmt = db.prepare(`SELECT * FROM order_items WHERE order_id = ?`);

      const result = orders.map((order) => {
        // use numeric PK id when available
        const orderPk = order.id || order.order_id || order.uuid;
        const rawItems = itemStmt.all(orderPk);

        // map items to desired shape
        const orderItems = rawItems.map((it) => ({
          menu_item_id: it.menu_item_id ? Number(it.menu_item_id) : null,
          menu_item_variation_id: it.menu_item_variation_id || null,
          quantity: it.quantity != null ? Number(it.quantity) : 0,
          price: it.price != null ? Number(Number(it.price).toFixed(2)) : 0,
          amount: it.amount != null ? Number(Number(it.amount).toFixed(2)) : 0,
        }));

        // map order row to desired output fields
        return {
          order_number: order.order_number,
          table_id: order.table_id || null,
          customer_id: order.customer_id || null,
          number_of_pax: order.number_of_pax != null ? Number(order.number_of_pax) : 1,
          waiter_id: order.waiter_id || null,
          status: order.status || 'kot',
          sub_total: order.sub_total != null ? Number(Number(order.sub_total).toFixed(2)) : 0,
          tip_amount: order.tip_amount != null ? Number(Number(order.tip_amount).toFixed(2)) : 0,
          tip_note: order.tip_note || null,
          total: order.total != null ? Number(Number(order.total).toFixed(2)) : 0,
          amount_paid: order.amount_paid != null ? Number(Number(order.amount_paid).toFixed(2)) : 0,
          order_type: order.order_type || 'dine_in',
          discount_type: order.discount_type || null,
          discount_value: order.discount_value != null ? Number(order.discount_value) : null,
          discount_amount: order.discount_amount != null ? Number(order.discount_amount) : null,
          order_status: order.order_status || 'placed',
          delivery_fee: order.delivery_fee != null ? Number(Number(order.delivery_fee).toFixed(2)) : 0,
          created_at: order.created_at || order.date_time || null,
          orderItems,
        };
      });
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

// export the new function
module.exports.getOrdersWithItems = getOrdersWithItems;