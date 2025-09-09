/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function(knex) {
  return knex('items').del().then(function () {
    return knex('items').insert([
      { name: 'Item A', price: 99.99, quantity: 10 },
      { name: 'Item B', price: 49.50, quantity: 5 }
    ]);
  });
};

