const db = require("../services/db");
const Store = new (require("electron-store"))();
function addCurrencyBackup(currency) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO currencies
        (id, restaurant_id, currency_name, currency_code, currency_symbol, 
         currency_position, no_of_decimal, thousand_separator, decimal_separator, 
         exchange_rate, usd_price, is_cryptocurrency, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        currency.id,
        currency.restaurant_id,
        currency.currency_name,
        currency.currency_code,
        currency.currency_symbol,
        currency.currency_position,
        currency.no_of_decimal,
        currency.thousand_separator,
        currency.decimal_separator,
        currency.exchange_rate,
        currency.usd_price,
        currency.is_cryptocurrency,
        currency.isSync || 1
      );

      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { addCurrencyBackup };
