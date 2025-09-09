const db = require("../services/db");
const Store = new (require("electron-store"))();

function addAreaBackup(area) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
    INSERT OR IGNORE INTO areas 
    (id, branch_id, area_name, created_at, updated_at, isSync) 
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    area.id,
    area.branch_id,
    area.area_name,
    area.created_at || new Date().toISOString(),
    area.updated_at || new Date().toISOString(),
    1
  );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}


function addBranchDeliverySettingBackup(setting) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO branch_delivery_settings 
        (
          id, branch_id, max_radius, unit, fee_type, fixed_fee, per_distance_rate,
          free_delivery_over_amount, free_delivery_within_radius,
          delivery_schedule_start, delivery_schedule_end,
          prep_time_minutes, additional_eta_buffer_time, avg_delivery_speed_kmh,
          is_enabled, created_at, updated_at, isSync
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        setting.id,
        setting.branch_id,
        setting.max_radius,
        setting.unit,
        setting.fee_type,
        setting.fixed_fee,
        setting.per_distance_rate,
        setting.free_delivery_over_amount,
        setting.free_delivery_within_radius,
        setting.delivery_schedule_start,
        setting.delivery_schedule_end,
        setting.prep_time_minutes,
        setting.additional_eta_buffer_time,
        setting.avg_delivery_speed_kmh,
        setting.is_enabled,
        setting.created_at || new Date().toISOString(),
        setting.updated_at || new Date().toISOString(),
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addContactBackup(contact) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO contacts 
        (
          id, language_setting_id, email, contact_company, image, address,
          created_at, updated_at, image_url, isSync
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        contact.id,
        contact.language_setting_id,
        contact.email,
        contact.contact_company,
        contact.image,
        contact.address,
        contact.created_at || new Date().toISOString(),
        contact.updated_at || new Date().toISOString(),
        contact.image_url,
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addCustomerBackup(customer) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO customers 
        (
          id, restaurant_id, name, phone, email, email_otp,
          created_at, updated_at, delivery_address, isSync
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        customer.id,
        customer.restaurant_id,
        customer.name,
        customer.phone,
        customer.email,
        customer.email_otp,
        customer.created_at || new Date().toISOString(),
        customer.updated_at || new Date().toISOString(),
        customer.delivery_address,
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addDeliveryExecutiveBackup(exec) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO delivery_executives
        (id, branch_id, name, phone, photo, status, created_at, updated_at, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        exec.id,
        exec.branch_id,
        exec.name,
        exec.phone,
        exec.photo,
        exec.status,
        exec.created_at || new Date().toISOString(),
        exec.updated_at || new Date().toISOString(),
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addDesktopApplicationBackup(app) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO desktop_applications
        (id, windows_file_path, mac_intel_file_path, linux_file_path, mac_silicon_file_path, created_at, updated_at, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        app.id,
        app.windows_file_path,
        app.mac_intel_file_path,
        app.linux_file_path,
        app.mac_silicon_file_path,
        app.created_at || new Date().toISOString(),
        app.updated_at || new Date().toISOString(),
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}
function addEmailSettingBackup(setting) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO email_settings
        (id, mail_from_name, mail_from_email, enable_queue, mail_driver,
         smtp_host, smtp_port, smtp_encryption, mail_username, mail_password,
         created_at, updated_at, email_verified, verified, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        setting.id,
        setting.mail_from_name,
        setting.mail_from_email,
        setting.enable_queue,
        setting.mail_driver,
        setting.smtp_host,
        setting.smtp_port,
        setting.smtp_encryption,
        setting.mail_username,
        setting.mail_password,
        setting.created_at || new Date().toISOString(),
        setting.updated_at || new Date().toISOString(),
        setting.email_verified,
        setting.verified,
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}
function addExpenseCategoryBackup(category) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO expense_categories
        (id, branch_id, name, description, is_active, created_at, updated_at, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        category.id,
        category.branch_id,
        category.name,
        category.description,
        category.is_active ? 1 : 0,
        category.created_at || new Date().toISOString(),
        category.updated_at || new Date().toISOString(),
        1 // ✅ from API, mark as synced
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addExpenseBackup(expense) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO expenses
        (id, branch_id, expense_category_id, expense_title, description,
         amount, expense_date, payment_status, payment_date, payment_due_date,
         payment_method, receipt_path, expense_receipt_url,
         created_at, updated_at, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        expense.id,
        expense.branch_id,
        expense.expense_category_id,
        expense.expense_title,
        expense.description,
        expense.amount,
        expense.expense_date,
        expense.payment_status,
        expense.payment_date,
        expense.payment_due_date,
        expense.payment_method,
        expense.receipt_path,
        expense.expense_receipt_url,
        expense.created_at || new Date().toISOString(),
        expense.updated_at || new Date().toISOString(),
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}


//✅ Insert or update menu items
function addMenuItemBackup(item) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO menu_items
        (id, branch_id, kot_place_id, item_name, image, description, type, price,
         menu_id, item_category_id, created_at, updated_at, preparation_time,
         is_available, show_on_customer_site, in_stock, sort_order,
         newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        item.id,
        item.branch_id,
        item.kot_place_id,
        item.item_name,
        item.image,
        item.description,
        item.type,
        item.price,
        item.menu_id,
        item.item_category_id,
        item.created_at || new Date().toISOString(),
        item.updated_at || new Date().toISOString(),
        item.preparation_time,
        item.is_available,
        item.show_on_customer_site,
        item.in_stock,
        item.sort_order,
        item.newfield1 || null,
        item.newfield2 || null,
        item.newfield3 || null,
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

// Insert or update translations
function addMenuItemTranslationBackup(translation) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO menu_item_translations
        (id, menu_item_id, locale, item_name, description,
         newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        translation.id,
        translation.menu_item_id,
        translation.locale,
        translation.item_name,
        translation.description,
        translation.newfield1 || null,
        translation.newfield2 || null,
        translation.newfield3 || null,
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addMenuItemVariationBackup(variation) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO menu_item_variations
        (id, menu_item_id, variation, price, created_at, updated_at,
         newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        variation.id,
        variation.menu_item_id,
        variation.variation,
        variation.price,
        variation.created_at || new Date().toISOString(),
        variation.updated_at || new Date().toISOString(),
        variation.newfield1 || null,
        variation.newfield2 || null,
        variation.newfield3 || null,
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addMenuCategoryBackup(category) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO item_categories
        (id, branch_id, category_name, sort_order, created_at, updated_at, newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        category.id,
        category.branch_id,
        JSON.stringify(category.category_name),
        category.sort_order || 0,
        category.created_at || new Date().toISOString(),
        category.updated_at || new Date().toISOString(),
        category.newfield1 || null,
        category.newfield2 || null,
        category.newfield3 || null,
        1
      );

      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Insert / update modifier_groups
function addModifierGroupBackup(group) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO modifier_groups
        (id, name, description, has_max_quantity, max_quantity,
         max_select_option, branch_id, created_at, updated_at,
         newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        group.id,
        group.name || "",
        group.description || "",
        group.has_max_quantity != null ? String(group.has_max_quantity) : "0",
        group.max_quantity != null ? String(group.max_quantity) : null,
        group.max_select_option != null ? String(group.max_select_option) : null,
        group.branch_id,
        group.created_at || new Date().toISOString(),
        group.updated_at || new Date().toISOString(),
        group.newfield1 || null,
        group.newfield2 || null,
        group.newfield3 || null,
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ Insert / update item_modifiers
function addItemModifierBackup(mod) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO item_modifiers
        (id, menu_item_id, modifier_group_id, is_required,
         allow_multiple_selection, max_select_option, has_max_quantity,
         max_quantity, created_at, updated_at,
         newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        mod.id,
        mod.menu_item_id,
        mod.modifier_group_id,
        mod.is_required ? 1 : 0,
        mod.allow_multiple_selection ? 1 : 0,
        mod.max_select_option != null ? String(mod.max_select_option) : null,
        mod.has_max_quantity != null ? String(mod.has_max_quantity) : "0",
        mod.max_quantity != null ? String(mod.max_quantity) : null,
        mod.created_at || new Date().toISOString(),
        mod.updated_at || new Date().toISOString(),
        mod.newfield1 || null,
        mod.newfield2 || null,
        mod.newfield3 || null,
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addFailedJobBackup(job) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO failed_jobs 
        (id, uuid, connection, queue, payload, exception, failed_at, isSync) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        job.id,
        job.uuid,
        job.connection,
        job.queue,
        job.payload,
        job.exception,
        job.failed_at,
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addFileStorageBackup(file) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO file_storage 
        (id, restaurant_id, path, filename, type, size, storage_location, created_at, updated_at, file_url, icon, size_format, isSync) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        file.id,
        file.restaurant_id,
        file.path,
        file.filename,
        file.type,
        file.size,
        file.storage_location,
        file.created_at || new Date().toISOString(),
        file.updated_at || new Date().toISOString(),
        file.file_url,
        file.icon,
        file.size_format,
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addFileStorageSettingBackup(setting) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO file_storage_settings 
        (id, filesystem, auth_keys, status, created_at, updated_at, isSync) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        setting.id,
        setting.filesystem,
        setting.auth_keys,
        setting.status,
        setting.created_at || new Date().toISOString(),
        setting.updated_at || new Date().toISOString(),
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addFlagBackup(flag) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO flags 
        (id, name, code, capital, continent, isSync) 
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        flag.id,
        flag.name,
        flag.code,
        flag.capital,
        flag.continent,
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addTableBackup(table) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO tables 
        (id, branch_id, table_code, hash, status, available_status, area_id, seating_capacity, created_at, updated_at, isSync) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        table.id,
        table.branch_id,
        table.table_code,
        table.hash,
        table.status,
        table.available_status,
        table.area_id,
        table.seating_capacity,
        table.created_at || new Date().toISOString(),
        table.updated_at || new Date().toISOString(),
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addInventorySettingBackup(setting) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO inventory_settings 
        (id, restaurant_id, allow_auto_purchase, created_at, updated_at, isSync) 
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        setting.id,
        setting.restaurant_id,
        setting.allow_auto_purchase,
        setting.created_at || new Date().toISOString(),
        setting.updated_at || new Date().toISOString(),
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addInventoryStockBackup(stock) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO inventory_stocks 
        (id, branch_id, inventory_item_id, quantity, created_at, updated_at, isSync) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        stock.id,
        stock.branch_id,
        stock.inventory_item_id,
        stock.quantity,
        stock.created_at || new Date().toISOString(),
        stock.updated_at || new Date().toISOString(),
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addInventoryMovementBackup(movement) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO inventory_movements 
        (id, branch_id, inventory_item_id, quantity, transaction_type, waste_reason, added_by, supplier_id, transfer_branch_id, unit_purchase_price, expiration_date, created_at, updated_at, isSync) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        movement.id,
        movement.branch_id,
        movement.inventory_item_id,
        movement.quantity,
        movement.transaction_type,
        movement.waste_reason,
        movement.added_by,
        movement.supplier_id,
        movement.transfer_branch_id,
        movement.unit_purchase_price,
        movement.expiration_date,
        movement.created_at || new Date().toISOString(),
        movement.updated_at || new Date().toISOString(),
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addInventoryItemCategoryBackup(category) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO inventory_item_categories 
        (id, branch_id, name, created_at, updated_at, isSync) 
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        category.id,
        category.branch_id,
        category.name,
        category.created_at || new Date().toISOString(),
        category.updated_at || new Date().toISOString(),
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}
function addInventoryItemBackup(item) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO inventory_items 
        (id, branch_id, name, inventory_item_category_id, unit_id, threshold_quantity, 
         preferred_supplier_id, reorder_quantity, unit_purchase_price, created_at, updated_at, isSync) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        item.id,
        item.branch_id,
        item.name,
        item.inventory_item_category_id,
        item.unit_id,
        item.threshold_quantity,
        item.preferred_supplier_id,
        item.reorder_quantity,
        item.unit_purchase_price,
        item.created_at || new Date().toISOString(),
        item.updated_at || new Date().toISOString(),
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addInventoryGlobalSettingBackup(setting) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO inventory_global_settings 
        (id, license_type, purchase_code, purchased_on, supported_until, notify_update, created_at, updated_at, isSync) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        setting.id,
        setting.license_type,
        setting.purchase_code,
        setting.purchased_on,
        setting.supported_until,
        setting.notify_update,
        setting.created_at || new Date().toISOString(),
        setting.updated_at || new Date().toISOString(),
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { 
    addAreaBackup,
    addBranchDeliverySettingBackup,
    addContactBackup,
    addCustomerBackup,
    addDeliveryExecutiveBackup,
    addDesktopApplicationBackup,
    addEmailSettingBackup,
    addExpenseCategoryBackup,
    addExpenseBackup,
    addMenuItemBackup,
    addMenuItemTranslationBackup,
    addMenuItemVariationBackup,
    addMenuCategoryBackup,
    addModifierGroupBackup,
    addItemModifierBackup,
    addFailedJobBackup,
    addFileStorageBackup,
    addFileStorageSettingBackup,
    addFlagBackup,
    addTableBackup,
    addInventorySettingBackup,
    addInventoryStockBackup,
    addInventoryMovementBackup,
    addInventoryItemCategoryBackup,
    addInventoryItemBackup,
    addInventoryGlobalSettingBackup
 };
