const db = require("../services/db");
const Store = new (require("electron-store"))();
function addGlobalCurrencyBackup(cu) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO global_currencies
        (id, currency_name, currency_symbol, currency_code, 
         exchange_rate, usd_price, status, created_at, updated_at, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        cu.id,
        cu.currency_name,
        cu.currency_symbol,
        cu.currency_code,
        cu.exchange_rate,
        cu.usd_price,
        cu.status || "enable",
        cu.created_at,
        cu.updated_at,
        cu.isSync || 1
      );

      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { addGlobalCurrencyBackup };
