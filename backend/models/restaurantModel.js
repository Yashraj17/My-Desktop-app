const db = require("../services/db");
const Store = new (require("electron-store"))();
function addRestaurantBackup(r) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO restaurants
        (id, sub_domain, name, hash, email, timezone, theme_hex, theme_rgb, logo, 
         country_id, currency_id, package_id, status, created_at, updated_at, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        r.id,
        r.sub_domain,
        r.name,
        r.hash,
        r.email,
        r.timezone,
        r.theme_hex,
        r.theme_rgb,
        r.logo,
        r.country_id,
        r.currency_id,
        r.package_id,
        r.status,
        r.created_at,
        r.updated_at,
        r.isSync || 1
      );

      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}


function getRestaurants(search = "") {
  return new Promise((resolve, reject) => {
    try {
      const restaurantId = Store.get("restaurantId") || null;

      let query = `
        SELECT * FROM restaurants
        WHERE id = ?
      `;
      const params = [restaurantId];

      if (search && search.trim() !== "") {
        query += ` AND (
          name LIKE ? OR
          email LIKE ? OR
          address LIKE ? OR
          phone_number LIKE ?
        )`;
        const likeSearch = `%${search}%`;
        params.push(likeSearch, likeSearch, likeSearch, likeSearch);
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


module.exports = { addRestaurantBackup,getRestaurants };
