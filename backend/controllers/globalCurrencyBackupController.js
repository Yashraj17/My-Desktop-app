const model = require("../models/globalCurrencyModel");

function addGlobalCurrencyBackup(data) {
  return model.addGlobalCurrencyBackup(data);
}

module.exports = { addGlobalCurrencyBackup };
