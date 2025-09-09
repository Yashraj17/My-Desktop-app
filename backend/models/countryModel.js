const db = require("../services/db");
const Store = new (require("electron-store"))();

function addCountryBackup(country) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO countries 
        (id, countries_code, countries_name, phonecode, isSync)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        country.id,
        country.countries_code,
        country.countries_name,
        country.phonecode,
        country.isSync || 1
      );

      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { addCountryBackup };
