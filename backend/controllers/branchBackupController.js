const model = require("../models/branchModel");

function addBranchBackup(data) {
  return model.addBranchBackup(data);
}

module.exports = { addBranchBackup };
