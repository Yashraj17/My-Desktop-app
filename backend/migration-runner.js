const db = require("./database");

async function init() {
  const exists = await db.schema.hasTable("item_categories");
  if (!exists) {
    await db.schema.createTable("item_categories", (table) => {
      table.increments("id").primary();
      table.string("category_name");
      table.integer("items_count").defaultTo(0);
    });
    console.log("✅ item_categories table created.");
  }
}

init();
