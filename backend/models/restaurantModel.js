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

module.exports = { addRestaurantBackup };
