const model = require("../models/branchModel");

function addBranchBackup(data) {
  return model.addBranchBackup(data);
}

function getBranches(data) {
  return model.getBranches(data);
}

function getActiveBranch(data) {
  return model.getActiveBranch(data);
}
module.exports = { addBranchBackup,getBranches,getActiveBranch };
