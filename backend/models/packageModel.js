const db = require("../services/db");
const Store = new (require("electron-store"))();
function addPackageBackup(pkg) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO packages
        (id, package_name, price, created_at, updated_at, currency_id, description, billing_cycle, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        pkg.id,
        pkg.package_name,
        pkg.price,
        pkg.created_at,
        pkg.updated_at,
        pkg.currency_id,
        pkg.description,
        pkg.billing_cycle,
        pkg.isSync || 1
      );

      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { addPackageBackup };
