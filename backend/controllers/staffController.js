const model = require("../models/staffModel");

function getStaffs(search) {
  return model.getStaffs(search);
}


module.exports = {
  getStaffs
};