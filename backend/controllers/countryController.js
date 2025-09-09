const model = require("../models/countryModel");

function addCountryBackup(data) {
  return model.addCountryBackup(data);
}

module.exports = { addCountryBackup };
