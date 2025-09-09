exports.up = function(knex) {
  return knex.schema.createTable('items', function(table) {
    table.increments('id').primary();
    table.string('name');
    table.float('price');
    table.integer('quantity');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('items');
};
