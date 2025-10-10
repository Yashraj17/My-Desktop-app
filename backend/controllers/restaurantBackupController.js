const model = require("../models/restaurantModel");
function addRestaurantBackup(data) {
  return model.addRestaurantBackup(data);
}


function getRestaurants(data) {
  return model.getRestaurants(data);
}

module.exports = { addRestaurantBackup,getRestaurants };
