const model = require("../models/packageModel");

function addPackageBackup(data) {
  return model.addPackageBackup(data);
}

module.exports = { addPackageBackup };
