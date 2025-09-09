const model = require("../models/restaurantModel");
function addRestaurantBackup(data) {
  return model.addRestaurantBackup(data);
}

module.exports = { addRestaurantBackup };
