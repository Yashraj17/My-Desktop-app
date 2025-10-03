const db = require("../services/db");
const Store = new (require("electron-store"))();

// ✅ Get All Reservations

function getReservations(search = "") {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;

      let query = `
        SELECT r.*, 
               c.name AS customer_name,
               c.email as email,
               c.phone AS customer_phone,
               t.table_code AS table_code
        FROM reservations r
        LEFT JOIN customers c ON r.customer_id = c.id
        LEFT JOIN tables t ON r.table_id = t.id
        WHERE r.branch_id = ?
      `;
      const params = [currentBranchId];

      if (search && search.trim() !== "") {
        query += ` AND (c.name LIKE ? OR c.phone LIKE ? OR t.table_code LIKE ? OR r.reservation_status LIKE ?) `;
        const likeSearch = `%${search}%`;
        params.push(likeSearch, likeSearch, likeSearch, likeSearch);
      }

      query += ` ORDER BY r.reservation_date_time DESC`;

      const stmt = db.prepare(query);
      const rows = stmt.all(...params);
      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Get Reservation by ID
function getReservationById(id) {
  return new Promise((resolve, reject) => {
    try {
      const query = `
        SELECT r.*, c.name AS customer_name, t.code AS table_code
        FROM reservations r
        LEFT JOIN customers c ON r.customer_id = c.id
        LEFT JOIN tables t ON r.table_id = t.id
        WHERE r.id = ?
      `;
      const stmt = db.prepare(query);
      const row = stmt.get(id);
      resolve(row);
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Add Reservation
function addReservation(reservation) {
  return new Promise((resolve, reject) => {
    try {
      const now = new Date().toISOString();
      const currentBranchId = Store.get("branchId") || 1;

      const stmt = db.prepare(`
        INSERT INTO reservations (
          branch_id, table_id, customer_id, reservation_date_time,
          party_size, special_requests, reservation_status,
          reservation_slot_type, created_at, updated_at,
          newfield1, newfield2, newfield3, isSync
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `);

      const result = stmt.run(
        currentBranchId,
        reservation.table_id || null,
        reservation.customer_id || null,
        reservation.reservation_date_time,
        reservation.party_size,
        reservation.special_requests || null,
        reservation.reservation_status || "Confirmed",
        reservation.reservation_slot_type || "Lunch",
        now,
        now,
        reservation.newfield1 || null,
        reservation.newfield2 || null,
        reservation.newfield3 || null,
        reservation.isSync ? 1 : 0
      );

      resolve({ success: true, id: result.lastInsertRowid });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Update Reservation
function updateReservation(id, reservation) {
  return new Promise((resolve, reject) => {
    try {
      const now = new Date().toISOString();
      const currentBranchId = Store.get("branchId") || 1;

      const stmt = db.prepare(`
        UPDATE reservations
        SET branch_id = ?,
            table_id = ?,
            customer_id = ?,
            reservation_date_time = ?,
            party_size = ?,
            special_requests = ?,
            reservation_status = ?,
            reservation_slot_type = ?,
            updated_at = ?,
            newfield1 = ?,
            newfield2 = ?,
            newfield3 = ?,
            isSync = ?
        WHERE id = ?
      `);

      const result = stmt.run(
        currentBranchId,
        reservation.table_id || null,
        reservation.customer_id || null,
        reservation.reservation_date_time,
        reservation.party_size,
        reservation.special_requests || null,
        reservation.reservation_status || "Confirmed",
        reservation.reservation_slot_type || "Lunch",
        now,
        reservation.newfield1 || null,
        reservation.newfield2 || null,
        reservation.newfield3 || null,
        reservation.isSync ? 1 : 0,
        id
      );

      resolve({ updated: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Delete Reservation
function deleteReservation(id) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(`DELETE FROM reservations WHERE id = ?`);
      const result = stmt.run(id);
      resolve({ deleted: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Get Reservations by DateTime
function getReservationsByDateTime(dateTime) {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;

      const query = `
        SELECT r.*, 
               c.name AS customer_name,
               c.phone AS customer_phone,
               c.email AS customer_email,
               t.table_code AS table_code
        FROM reservations r
        LEFT JOIN customers c ON r.customer_id = c.id
        LEFT JOIN tables t ON r.table_id = t.id
        WHERE r.branch_id = ?
          AND r.reservation_date_time = ?
          AND r.reservation_status = 'Confirmed'
      `;

      const stmt = db.prepare(query);
      const rows = stmt.all(currentBranchId, dateTime);
      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  getReservations,
  getReservationById,
  addReservation,
  updateReservation,
  deleteReservation,
  getReservationsByDateTime,
};
