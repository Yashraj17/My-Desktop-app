const model = require("../models/currencyModel");

function addCurrencyBackup(data) {
  return model.addCurrencyBackup(data);
}

module.exports = { addCurrencyBackup };
