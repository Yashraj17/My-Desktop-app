const db = require("../services/db");
const Store = new (require("electron-store"))();

function safeJSONParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function parseText(value) {
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" ? parsed?.en || "" : parsed;
  } catch {
    return value;
  }
}


function getMenusWithItems(searchTerm = "") {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;

      // Menus (ids are INTEGER here)
      const menus = db.prepare(`
        SELECT id, menu_name
        FROM menus
        WHERE branch_id = ?
        ORDER BY id ASC
      `).all(currentBranchId);

      // Items
      let query = `
        SELECT 
          mi.id,
          mi.menu_id,
          mi.item_category_id,
          mi.item_name,
          mi.image,
          mi.description,
          mi.type,
          mi.price,
          mi.preparation_time,
          mi.is_available,
          mi.show_on_customer_site,
          mi.in_stock,
          mi.sort_order,
          mi.created_at,
          mi.updated_at,

          ic.category_name AS raw_category_name,
          m.menu_name     AS raw_menu_name
        FROM menu_items mi
        LEFT JOIN item_categories ic ON CAST(ic.id AS TEXT) = mi.item_category_id
        LEFT JOIN menus m            ON CAST(m.id  AS TEXT) = mi.menu_id
        WHERE mi.branch_id = ?
      `;

      const params = [currentBranchId];

      if (searchTerm) {
        query += `
          AND (
            COALESCE(json_extract(mi.item_name, '$.en'), mi.item_name) LIKE ?
            OR COALESCE(json_extract(mi.description, '$.en'), mi.description) LIKE ?
            OR COALESCE(json_extract(ic.category_name, '$.en'), ic.category_name) LIKE ?
            OR COALESCE(json_extract(m.menu_name, '$.en'), m.menu_name) LIKE ?
          )
        `;
        const like = `%${searchTerm}%`;
        params.push(like, like, like, like);
      }

      query += ` ORDER BY mi.id DESC`;

      const items = db.prepare(query).all(...params);

      // Group items under menus
      const result = menus.map(menu => {
        const menuItems = items
          // menu.id is INTEGER, item.menu_id is TEXT -> cast to string
          .filter(item => item.menu_id === String(menu.id))
          .map(row => ({
            id: row.id,
            menu_id: row.menu_id,
            item_category_id: row.item_category_id,
            item_name: parseText(row.item_name),
            image: row.image,
            description: parseText(row.description),
            type: row.type,
            price: row.price,
            category_name: parseText(row.raw_category_name),
            menu_name: parseText(row.raw_menu_name),
            preparation_time: row.preparation_time,
            is_available: !!row.is_available,
            show_on_customer_site: !!row.show_on_customer_site,
            in_stock: !!row.in_stock,
            sort_order: row.sort_order,
            created_at: row.created_at,
            updated_at: row.updated_at
          }));

        return {
          id: menu.id,
          name: parseText(menu.menu_name),
          items: menuItems
        };
      });

      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

function getMenusWithCategoryItems() {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;

      const query = `
        SELECT 
          m.id AS menu_id,
          m.menu_name AS menu,
          ic.id AS item_category_id,
          ic.category_name AS itemName,
          COUNT(mi.id) AS itemCount
        FROM menus m
        JOIN menu_items mi ON m.id = mi.menu_id
        JOIN item_categories ic ON ic.id = mi.item_category_id
        WHERE m.branch_id = ?
          AND mi.branch_id = ?
          AND ic.branch_id = ?
        GROUP BY m.id, ic.id
        ORDER BY m.menu_name, ic.category_name;
      `;

      const stmt = db.prepare(query);
      const rows = stmt.all(currentBranchId, currentBranchId, currentBranchId);

      // ✅ Transform raw rows into desired nested structure
      const result = [];
      const menuMap = {};

      rows.forEach(row => {
        if (!menuMap[row.menu_id]) {
          menuMap[row.menu_id] = {
            menu_id: row.menu_id,
            menu: row.menu,
            count: 0,
            itemCategory: []
          };
          result.push(menuMap[row.menu_id]);
        }

        menuMap[row.menu_id].itemCategory.push({
          item_category_id: row.item_category_id,
          itemName: row.itemName,
          itemCount: row.itemCount
        });

        // Add to total menu count
        menuMap[row.menu_id].count += row.itemCount;
      });

      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Add menu
function addMenu(menu) {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId") || 1;
      const menuNameJson = JSON.stringify({ en: menu.menu_name });
      const createdAt = new Date().toISOString();

      db.prepare(`
        INSERT INTO menus (branch_id, menu_name, sort_order, created_at, updated_at, isSync) 
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        currentBranchId,
        menuNameJson,
        menu.sort_order || 0,
        createdAt,
        createdAt,
        //menu.isSync ? 1 : 0
        0
      );

      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addMenuBackup(menu) {
  return new Promise((resolve, reject) => {
    try {
      // ✅ branchId fallback to 1 if missing
      const currentBranchId = menu.branch_id || Store.get("branchId") || 1;

      // ✅ Keep API-provided `menu_name` as JSON (for multi-language)
      const menuNameJson = JSON.stringify({ en: menu.menu_name });

      // ✅ Use API’s created/updated_at if available, otherwise fallback to now
      const createdAt = menu.created_at || new Date().toISOString();
      const updatedAt = menu.updated_at || new Date().toISOString();

      // ✅ Insert with API's id + all fields
      db.prepare(`
        INSERT OR IGNORE INTO menus (id, branch_id, menu_name, sort_order, created_at, updated_at, isSync) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        menu.id, // 👈 keep API id
        menu.branch_id||0,
        menuNameJson,
        menu.sort_order || 0,
        createdAt,
        updatedAt,
        1 // 👈 mapped to isSync
      );

      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Update menu
function updateMenu(id, menu) {
console.log("Incoming menu data:", menu);  // 👈 add this

  return new Promise((resolve, reject) => {
    try {
      const menuNameJson = JSON.stringify({ en: menu.menu_name });
      const updatedAt = new Date().toISOString();

      const result = db.prepare(`
        UPDATE menus 
        SET menu_name = ?, sort_order = ?, updated_at = ?, isSync = ?
        WHERE id = ?
      `).run(
        menuNameJson,
        menu.sort_order || 0,
        updatedAt,
        menu.isSync ? 1 : 0,
        id
      );

      resolve({ updated: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}


// ✅ Delete menu
function deleteMenu(id) {
  return new Promise((resolve, reject) => {
    try {
      const result = db.prepare(`DELETE FROM menus WHERE id = ?`).run(id);
      resolve({ deleted: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  getMenusWithItems,
  addMenu,
  updateMenu,
  deleteMenu,
  addMenuBackup,
  getMenusWithCategoryItems
};
