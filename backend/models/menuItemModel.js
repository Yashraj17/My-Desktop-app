const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const store = require("electron-store");
const Store = new store();
const db = require("../services/db");

function safeJSONParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function getMenuItems(searchTerm = "") {
  return new Promise((resolve, reject) => {
    try {
      const currentBranchId = Store.get("branchId");

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
          ic.category_name,
          m.menu_name
        FROM menu_items mi
        LEFT JOIN item_categories ic ON mi.item_category_id = ic.id
        LEFT JOIN menus m ON mi.menu_id = m.id
        WHERE mi.branch_id = ?
      `;

      const params = [currentBranchId];

      if (searchTerm) {
        query += `
          AND (
            json_extract(mi.item_name, '$.en') LIKE ?
            OR mi.description LIKE ?
            OR ic.category_name LIKE ?
            OR m.menu_name LIKE ?
          )
        `;
        const likeSearch = `%${searchTerm}%`;
        params.push(likeSearch, likeSearch, likeSearch, likeSearch);
      }

      query += ` ORDER BY mi.id DESC`;

      const rows = db.prepare(query).all(...params);

      const items = rows.map(row => ({
        id: row.id,
        menu_id: row.menu_id,
        item_category_id: row.item_category_id,
        item_name: safeJSONParse(row.item_name)?.en || row.item_name,
        image: row.image,
        description: safeJSONParse(row.description)?.en || row.description,
        type: row.type,
        price: row.price,
        category_name: safeJSONParse(row.category_name)?.en || row.category_name,
        menu_name: safeJSONParse(row.menu_name)?.en || row.menu_name,
        preparation_time: row.preparation_time,
        is_available: row.is_available,
        show_on_customer_site: row.show_on_customer_site,
        in_stock: row.in_stock,
        sort_order: row.sort_order,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));

      resolve(items);
    } catch (err) {
      reject(err);
    }
  });
}

function generateFileName(originalName = "image.jpg") {
  let ext = path.extname(originalName) || ".jpg";
  const hash = crypto.randomBytes(16).toString("hex");
  return `${hash}${ext}`;
}

function addMenuItem(item) {
  return new Promise((resolve, reject) => {
    try {
      const createdAt = new Date().toISOString();
      const currentBranchId = Store.get("branchId") || 1;

      // Handle image saving
      let imageFileName = "";
      if (item.image && item.image.data) {
        const uploadsDir = path.join(__dirname, "../../public/upload/menu");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        imageFileName = generateFileName(item.image.name);
        const base64Data = item.image.data.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(path.join(uploadsDir, imageFileName), base64Data, "base64");
      } else if (typeof item.image === "string") {
        imageFileName = item.image;
      }

      db.prepare(`
        INSERT INTO menu_items (
          branch_id, kot_place_id, item_name, image, description, type, price, 
          menu_id, item_category_id, preparation_time, is_available, 
          show_on_customer_site, in_stock, sort_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        currentBranchId,
        item.kot_place_id ?? null,
        JSON.stringify({ en: item.item_name || "" }),
        imageFileName,
        JSON.stringify({ en: item.description || "" }),
        item.type || "",
        parseFloat(item.price) || 0,
        item.menu_id || 1,
        parseInt(item.item_category_id) || 1,
        item.preparation_time || null,
        item.is_available ? 1 : 0,
        item.show_on_customer_site ? 1 : 0,
        item.in_stock ? 1 : 0,
        item.sort_order || 0,
        createdAt,
        createdAt
      );

      resolve({ success: true, file: imageFileName });
    } catch (err) {
      reject(err);
    }
  });
}

function updateMenuItem(id, item) {
  return new Promise((resolve, reject) => {
    try {
      const updatedAt = new Date().toISOString();
      let imageFileName = "";

      const uploadsDir = path.join(__dirname, "../../public/upload/menu");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      if (item.image && item.image.data) {
        imageFileName = generateFileName(item.image.name);
        const base64Data = item.image.data.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(path.join(uploadsDir, imageFileName), base64Data, "base64");
      } else if (typeof item.image === "string" && item.image.trim() !== "") {
        imageFileName = path.basename(item.image);
      } else {
        const row = db.prepare("SELECT image FROM menu_items WHERE id = ?").get(id);
        imageFileName = row ? row.image : "";
      }

      db.prepare(`
        UPDATE menu_items SET 
          kot_place_id = ?, 
          item_name = ?, 
          image = ?, 
          description = ?, 
          type = ?, 
          price = ?, 
          menu_id = ?, 
          item_category_id = ?, 
          preparation_time = ?, 
          is_available = ?, 
          show_on_customer_site = ?, 
          in_stock = ?, 
          sort_order = ?, 
          updated_at = ?
        WHERE id = ?
      `).run(
        item.kot_place_id ?? null,
        JSON.stringify({ en: item.item_name || "" }),
        imageFileName,
        JSON.stringify({ en: item.description || "" }),
        item.type || "",
        parseFloat(item.price) || 0,
        item.menu_id || 1,
        parseInt(item.item_category_id) || 1,
        item.preparation_time || null,
        item.is_available ? 1 : 0,
        item.show_on_customer_site ? 1 : 0,
        item.in_stock ? 1 : 0,
        item.sort_order || 0,
        updatedAt,
        parseInt(id)
      );

      resolve({ updated: true, file: imageFileName });
    } catch (err) {
      reject(err);
    }
  });
}

function deleteMenuItem(id) {
  return new Promise((resolve, reject) => {
    try {
      const result = db.prepare(`DELETE FROM menu_items WHERE id = ?`).run(id);
      resolve({ deleted: result.changes > 0 });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
