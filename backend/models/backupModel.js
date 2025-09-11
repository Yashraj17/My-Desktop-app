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
        INSERT OR IGNORE INTO menu_items
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
        INSERT OR IGNORE INTO menu_item_translations
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
        INSERT OR IGNORE INTO menu_item_variations
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
        INSERT OR IGNORE INTO item_categories
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
        INSERT OR IGNORE INTO modifier_groups
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
        INSERT OR IGNORE INTO item_modifiers
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
        INSERT OR IGNORE INTO file_storage_settings 
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
        INSERT OR IGNORE INTO tables 
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
        INSERT OR IGNORE INTO inventory_settings 
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
        INSERT OR IGNORE INTO inventory_stocks 
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
        INSERT OR IGNORE INTO inventory_movements 
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
        INSERT OR IGNORE INTO inventory_item_categories 
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
        INSERT OR IGNORE INTO inventory_items 
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
        INSERT OR IGNORE INTO inventory_global_settings 
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

function addFrontDetailBackup(detail) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO front_details 
        (id, language_setting_id, header_title, header_description, image, 
         feature_with_image_heading, review_heading, feature_with_icon_heading, 
         comments_heading, price_heading, price_description, faq_heading, 
         faq_description, contact_heading, footer_copyright_text, 
         created_at, updated_at, image_url, isSync) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        detail.id,
        detail.language_setting_id,
        detail.header_title,
        detail.header_description,
        detail.image,
        detail.feature_with_image_heading,
        detail.review_heading,
        detail.feature_with_icon_heading,
        detail.comments_heading,
        detail.price_heading,
        detail.price_description,
        detail.faq_heading,
        detail.faq_description,
        detail.contact_heading,
        detail.footer_copyright_text,
        detail.created_at || new Date().toISOString(),
        detail.updated_at || new Date().toISOString(),
        detail.image_url,
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addFrontFaqSettingBackup(faq) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO front_faq_settings 
        (id, language_setting_id, question, answer, created_at, updated_at, isSync) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        faq.id,
        faq.language_setting_id,
        faq.question,
        faq.answer,
        faq.created_at || new Date().toISOString(),
        faq.updated_at || new Date().toISOString(),
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addFrontFeatureBackup(feature) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO front_features 
        (id, language_setting_id, title, description, image, icon, type, created_at, updated_at, image_url, isSync) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        feature.id,
        feature.language_setting_id,
        feature.title,
        feature.description,
        feature.image,
        feature.icon,
        feature.type,
        feature.created_at || new Date().toISOString(),
        feature.updated_at || new Date().toISOString(),
        feature.image_url,
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}
function addFrontReviewSettingBackup(review) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO front_review_settings 
        (id, language_setting_id, reviews, reviewer_name, reviewer_designation, created_at, updated_at, isSync) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        review.id,
        review.language_setting_id,
        review.reviews,
        review.reviewer_name,
        review.reviewer_designation,
        review.created_at || new Date().toISOString(),
        review.updated_at || new Date().toISOString(),
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addGlobalInvoiceBackup(invoice) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO global_invoices 
        (id, restaurant_id, currency_id, package_id, global_subscription_id, offline_method_id, 
         signature, token, transaction_id, event_id, package_type, sub_total, total, 
         billing_frequency, billing_interval, recurring, plan_id, subscription_id, invoice_id, 
         amount, stripe_invoice_number, pay_date, next_pay_date, gateway_name, status, 
         created_at, updated_at, m_payment_id, pf_payment_id, payfast_plan, isSync) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        invoice.id,
        invoice.restaurant_id,
        invoice.currency_id,
        invoice.package_id,
        invoice.global_subscription_id,
        invoice.offline_method_id,
        invoice.signature,
        invoice.token,
        invoice.transaction_id,
        invoice.event_id,
        invoice.package_type,
        invoice.sub_total,
        invoice.total,
        invoice.billing_frequency,
        invoice.billing_interval,
        invoice.recurring,
        invoice.plan_id,
        invoice.subscription_id,
        invoice.invoice_id,
        invoice.amount,
        invoice.stripe_invoice_number,
        invoice.pay_date,
        invoice.next_pay_date,
        invoice.gateway_name,
        invoice.status,
        invoice.created_at || new Date().toISOString(),
        invoice.updated_at || new Date().toISOString(),
        invoice.m_payment_id,
        invoice.pf_payment_id,
        invoice.payfast_plan,
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addGlobalSettingBackup(setting) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO global_settings (
          id, purchase_code, supported_until, last_license_verified_at, email,
          created_at, updated_at, name, logo, theme_hex, theme_rgb,
          locale, license_type, hide_cron_job, last_cron_run, system_update,
          purchased_on, timezone, disable_landing_site, landing_type,
          landing_site_type, landing_site_url, installed_url, requires_approval_after_signup,
          facebook_link, instagram_link, twitter_link, yelp_link,
          default_currency_id, show_logo_text, meta_title, meta_keyword, meta_description,
          upload_fav_icon_android_chrome_192, upload_fav_icon_android_chrome_512,
          upload_fav_icon_apple_touch_icon, upload_favicon_16, upload_favicon_32,
          favicon, hash, webmanifest, is_pwa_install_alert_show, google_map_api_key,
          session_driver, enable_stripe, enable_razorpay, enable_flutterwave,
          enable_payfast, enable_paypal, enable_paystack, isSync
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `).run(
        setting.id,
        setting.purchase_code,
        setting.supported_until,
        setting.last_license_verified_at,
        setting.email,
        setting.created_at,
        setting.updated_at,
        setting.name,
        setting.logo,
        setting.theme_hex,
        setting.theme_rgb,
        setting.locale,
        setting.license_type,
        setting.hide_cron_job,
        setting.last_cron_run,
        setting.system_update,
        setting.purchased_on,
        setting.timezone,
        setting.disable_landing_site,
        setting.landing_type,
        setting.landing_site_type,
        setting.landing_site_url,
        setting.installed_url,
        setting.requires_approval_after_signup,
        setting.facebook_link,
        setting.instagram_link,
        setting.twitter_link,
        setting.yelp_link,
        setting.default_currency_id,
        setting.show_logo_text,
        setting.meta_title,
        setting.meta_keyword,
        setting.meta_description,
        setting.upload_fav_icon_android_chrome_192,
        setting.upload_fav_icon_android_chrome_512,
        setting.upload_fav_icon_apple_touch_icon,
        setting.upload_favicon_16,
        setting.upload_favicon_32,
        setting.favicon,
        setting.hash,
        setting.webmanifest,
        setting.is_pwa_install_alert_show,
        setting.google_map_api_key,
        setting.session_driver,
        setting.enable_stripe,
        setting.enable_razorpay,
        setting.enable_flutterwave,
        setting.enable_payfast,
        setting.enable_paypal,
        setting.enable_paystack,
        1 // ✅ isSync
      );

      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}
function addGlobalSubscriptionBackup(sub) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO global_subscriptions (
          id, restaurant_id, package_id, currency_id, package_type, plan_type,
          transaction_id, name, user_id, quantity, token, razorpay_id, razorpay_plan,
          stripe_id, stripe_status, stripe_price, gateway_name, trial_ends_at,
          subscription_status, ends_at, subscribed_on_date, created_at, updated_at,
          subscription_id, customer_id, flutterwave_id, flutterwave_payment_ref,
          flutterwave_status, flutterwave_customer_id, payfast_plan, payfast_status, isSync
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `).run(
        sub.id,
        sub.restaurant_id,
        sub.package_id,
        sub.currency_id,
        sub.package_type,
        sub.plan_type,
        sub.transaction_id,
        sub.name,
        sub.user_id,
        sub.quantity,
        sub.token,
        sub.razorpay_id,
        sub.razorpay_plan,
        sub.stripe_id,
        sub.stripe_status,
        sub.stripe_price,
        sub.gateway_name,
        sub.trial_ends_at,
        sub.subscription_status,
        sub.ends_at,
        sub.subscribed_on_date,
        sub.created_at,
        sub.updated_at,
        sub.subscription_id,
        sub.customer_id,
        sub.flutterwave_id,
        sub.flutterwave_payment_ref,
        sub.flutterwave_status,
        sub.flutterwave_customer_id,
        sub.payfast_plan,
        sub.payfast_status,
        1 // ✅ isSync
      );

      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addModifierOptionBackup(option) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO modifier_options
        (id, modifier_group_id, name, price, qty, is_available, sort_order,
         is_preselected, created_at, updated_at, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        option.id,
        option.modifier_group_id,
        option.name || "",
        option.price != null ? String(option.price) : "0.00",
        option.qty != null ? String(option.qty) : "1",
        option.is_available != null ? Number(option.is_available) : 1,
        option.sort_order != null ? Number(option.sort_order) : 0,
        option.is_preselected != null ? Number(option.is_preselected) : 0,
        option.created_at || new Date().toISOString(),
        option.updated_at || new Date().toISOString(),
        1
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}


function addJobBackup(job) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO jobs (
          id,
          queue,
          payload,
          attempts,
          reserved_at,
          available_at,
          created_at,
          isSync
        ) VALUES (?, ?, ?, ?, ?, ?, ?,?)
      `).run(
        job.id,
        job.queue,
        job.payload,
        job.attempts,
        job.reserved_at,
        job.available_at,
        job.created_at,
        1
      );

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

function addJobBatchBackup(batch) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO job_batches (
          id,
          name,
          total_jobs,
          pending_jobs,
          failed_jobs,
          failed_job_ids,
          options,
          cancelled_at,
          created_at,
          finished_at,
          newfield1,
          newfield2,
          newfield3,
          isSync
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        batch.id,
        batch.name,
        batch.total_jobs,
        batch.pending_jobs,
        batch.failed_jobs,
        batch.failed_job_ids || "",
        batch.options || null,
        batch.cancelled_at || null,
        batch.created_at,
        batch.finished_at || null,
        batch.newfield1 || null,
        batch.newfield2 || null,
        batch.newfield3 || null,
        1
      );

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

function addKotBackup(kot) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO kots (
          id,
          branch_id,
          kot_number,
          order_id,
          transaction_id,
          note,
          status,
          cancel_reason_id,
          cancel_reason_text,
          created_at,
          updated_at,
          newfield1,
          newfield2,
          newfield3,
          isSync
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        kot.id,
        kot.branch_id,
        kot.kot_number,
        kot.order_id,
        kot.transaction_id || null,
        kot.note || null,
        kot.status || "",
        kot.cancel_reason_id || null,
        kot.cancel_reason_text || null,
        kot.created_at,
        kot.updated_at,
        kot.newfield1 || null,
        kot.newfield2 || null,
        kot.newfield3 || null,
        1
      );

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

function addKotCancelReasonBackup(reason) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO kot_cancel_reasons (
          id,
          restaurant_id,
          reason,
          cancel_order,
          cancel_kot,
          created_at,
          updated_at,
          newfield1,
          newfield2,
          newfield3,
          isSync
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        reason.id,
        reason.restaurant_id,
        reason.reason || "",
        reason.cancel_order != null ? Number(reason.cancel_order) : 0,
        reason.cancel_kot != null ? Number(reason.cancel_kot) : 0,
        reason.created_at,
        reason.updated_at,
        reason.newfield1 || null,
        reason.newfield2 || null,
        reason.newfield3 || null,
        1
      );

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

function addKotItemBackup(item) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO kot_items (
          id,
          kot_id,
          transaction_id,
          menu_item_id,
          menu_item_variation_id,
          note,
          quantity,
          status,
          created_at,
          updated_at,
          newfield1,
          newfield2,
          newfield3,
          isSync
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        item.id,
        item.kot_id,
        item.transaction_id || null,
        item.menu_item_id,
        item.menu_item_variation_id || null,
        item.note || null,
        item.quantity != null ? Number(item.quantity) : 1,
        item.status || null,
        item.created_at,
        item.updated_at,
        item.newfield1 || null,
        item.newfield2 || null,
        item.newfield3 || null,
        1
      );

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}
function addKotItemModifierOptionBackup(option) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO kot_item_modifier_options (
          id,
          kot_item_id,
          modifier_option_id,
          qty,
          created_at,
          updated_at,
          newfield1,
          newfield2,
          newfield3,
          isSync
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        option.id,
        option.kot_item_id,
        option.modifier_option_id,
        option.qty,
        option.created_at || new Date().toISOString(),
        option.updated_at || new Date().toISOString(),
        option.newfield1 || null,
        option.newfield2 || null,
        option.newfield3 || null,
        1
      );

      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addKotPlaceBackup(place) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO kot_places (
          id,
          printer_id,
          branch_id,
          name,
          type,
          is_active,
          is_default,
          created_at,
          updated_at,
          newfield1,
          newfield2,
          newfield3,
          isSync
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        place.id,
        place.printer_id || null,
        place.branch_id || null,
        place.name || "",
        place.type || "",
        place.is_active != null ? place.is_active : 1,
        place.is_default != null ? place.is_default : 0,
        place.created_at || new Date().toISOString(),
        place.updated_at || new Date().toISOString(),
        place.newfield1 || null,
        place.newfield2 || null,
        place.newfield3 || null,
        1
      );

      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addKotSettingBackup(setting) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO kot_settings (
          id,
          branch_id,
          default_status,
          enable_item_level_status,
          created_at,
          updated_at,
          newfield1,
          newfield2,
          newfield3,
          isSync
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        setting.id,
        setting.branch_id || null,
        setting.default_status || "pending",
        setting.enable_item_level_status != null ? setting.enable_item_level_status : 0,
        setting.created_at || new Date().toISOString(),
        setting.updated_at || new Date().toISOString(),
        setting.newfield1 || null,
        setting.newfield2 || null,
        setting.newfield3 || null,
        1
      );

      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function addLanguageSettingBackup(setting) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO language_settings
        (id, language_code, language_name, flag_code, active, is_rtl, created_at, updated_at, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        setting.id,
        setting.language_code,
        setting.language_name,
        setting.flag_code,
        setting.active,
        setting.is_rtl,
        setting.created_at,
        setting.updated_at,
        1
      );
      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
}

function addLtmTranslationBackup(translation) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO ltm_translations
        (id, status, locale, "group", "key", value, created_at, updated_at, newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        translation.id,
        translation.status,
        translation.locale,
        translation.group,
        translation.key,
        translation.value,
        translation.created_at,
        translation.updated_at,
        translation.newfield1 || null,
        translation.newfield2 || null,
        translation.newfield3 || null,
        1 // Mark as synced
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert LTM Translation:", err);
      reject(err);
    }
  });
}

function addMigrationBackup(migration) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO migrations
        (id, migration, batch, newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        migration.id,
        migration.migration,
        migration.batch,
        migration.newfield1 || null,
        migration.newfield2 || null,
        migration.newfield3 || null,
        1 // Mark as synced
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert Migration:", err);
      reject(err);
    }
  });
}

function addModelHasPermissionBackup(record) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO model_has_permissions
        (permission_id, model_type, model_id, newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        record.permission_id,
        record.model_type,
        record.model_id,
        record.newfield1 || null,
        record.newfield2 || null,
        record.newfield3 || null,
        1 // Mark as synced
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert ModelHasPermission:", err);
      reject(err);
    }
  });
}

function addModelHasRoleBackup(record) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO model_has_roles
        (role_id, model_type, model_id, newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        record.role_id,
        record.model_type,
        record.model_id,
        record.newfield1 || null,
        record.newfield2 || null,
        record.newfield3 || null,
        1 // Mark as synced
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert ModelHasRole:", err);
      reject(err);
    }
  });
}

function addModuleBackup(module) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO modules
        (id, name, created_at, updated_at, newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        module.id,
        module.name,
        module.created_at || null,
        module.updated_at || null,
        module.newfield1 || null,
        module.newfield2 || null,
        module.newfield3 || null,
        1 // Mark as synced
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert Module:", err);
      reject(err);
    }
  });
}

function addNotificationSettingBackup(setting) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO notification_settings
        (id, restaurant_id, type, send_email, created_at, updated_at, newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        setting.id,
        setting.restaurant_id,
        setting.type,
        setting.send_email || 0,
        setting.created_at || null,
        setting.updated_at || null,
        setting.newfield1 || null,
        setting.newfield2 || null,
        setting.newfield3 || null,
        1 // synced
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert Notification Setting:", err);
      reject(err);
    }
  });
}

function addOfflinePaymentMethodBackup(method) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO offline_payment_methods
        (id, restaurant_id, name, description, status, created_at, updated_at, newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        method.id,
        method.restaurant_id || null,
        method.name,
        method.description || null,
        method.status || "inactive",
        method.created_at || null,
        method.updated_at || null,
        method.newfield1 || null,
        method.newfield2 || null,
        method.newfield3 || null,
        1 // synced
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert Offline Payment Method:", err);
      reject(err);
    }
  });
}

function addOfflinePlanChangeBackup(planChange) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO offline_plan_changes
        (id, restaurant_id, package_id, package_type, amount, pay_date, next_pay_date,
         invoice_id, offline_method_id, file_name, status, remark, description,
         created_at, updated_at, newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        planChange.id,
        planChange.restaurant_id || null,
        planChange.package_id,
        planChange.package_type,
        planChange.amount || 0,
        planChange.pay_date || null,
        planChange.next_pay_date || null,
        planChange.invoice_id || null,
        planChange.offline_method_id || null,
        planChange.file_name || null,
        planChange.status || "pending",
        planChange.remark || null,
        planChange.description || "",
        planChange.created_at || null,
        planChange.updated_at || null,
        planChange.newfield1 || null,
        planChange.newfield2 || null,
        planChange.newfield3 || null,
        1 // synced
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert offline_plan_changes:", err);
      reject(err);
    }
  });
}

function addOnboardingStepBackup(step) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO onboarding_steps
        (id, branch_id, add_area_completed, add_table_completed, add_menu_completed, 
         add_menu_items_completed, created_at, updated_at, newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        step.id,
        step.branch_id,
        step.add_area_completed ? 1 : 0,
        step.add_table_completed ? 1 : 0,
        step.add_menu_completed ? 1 : 0,
        step.add_menu_items_completed ? 1 : 0,
        step.created_at || null,
        step.updated_at || null,
        step.newfield1 || null,
        step.newfield2 || null,
        step.newfield3 || null,
        1 // synced
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert onboarding_step:", err);
      reject(err);
    }
  });
}


function saveSyncTime(tableName, toDatetime) {
  try {
    if (!toDatetime) {
      toDatetime = new Date().toISOString().slice(0, 19).replace("T", " ");
    }

    db.prepare(`
      INSERT INTO sync_table (table_name, sync_at)
      VALUES (?, ?)
    `).run(tableName, toDatetime);
  } catch (err) {
    console.error(`❌ Failed to save sync time for ${tableName}:`, err);
  }
}
//last table sinck time
function getSyncTime(tableName) {
  const row = db.prepare("SELECT sync_at FROM sync_table WHERE table_name = ? LIMIT 1").get(tableName);
  return row || null;
}




// ✅ Order Backup
function addOrderBackup(order) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO orders
        (
          id, uuid, branch_id, order_number, date_time, table_id, customer_id, number_of_pax,
          waiter_id, status, sub_total, tip_amount, tip_note, total, amount_paid,
          created_at, updated_at, order_type, delivery_executive_id, delivery_address,
          delivery_time, estimated_delivery_time, split_type, discount_type, discount_value,
          discount_amount, order_status, delivery_fee, customer_lat, customer_lng,
          is_within_radius, delivery_started_at, delivered_at, estimated_eta_min, estimated_eta_max,
          newfield1, newfield2, newfield3, isSync
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        order.id,
        order.uuid || null,
        order.branch_id || null,
        order.order_number || "0",
        order.date_time || new Date().toISOString(),
        order.table_id || null,
        order.customer_id || null,
        order.number_of_pax || 0,
        order.waiter_id || null,
        order.status || "kot",
        order.sub_total != null ? Number(order.sub_total) : 0,
        order.tip_amount != null ? Number(order.tip_amount) : 0,
        order.tip_note || null,
        order.total != null ? Number(order.total) : 0,
        order.amount_paid != null ? Number(order.amount_paid) : 0,
        order.created_at || new Date().toISOString(),
        order.updated_at || new Date().toISOString(),
        order.order_type || "dine_in",
        order.delivery_executive_id || null,
        order.delivery_address || null,
        order.delivery_time || null,
        order.estimated_delivery_time || null,
        order.split_type || null,
        order.discount_type || null,
        order.discount_value != null ? Number(order.discount_value) : 0,
        order.discount_amount != null ? Number(order.discount_amount) : 0,
        order.order_status || "placed",
        order.delivery_fee != null ? Number(order.delivery_fee) : 0,
        order.customer_lat != null ? Number(order.customer_lat) : null,
        order.customer_lng != null ? Number(order.customer_lng) : null,
        order.is_within_radius != null ? Number(order.is_within_radius) : 0,
        order.delivery_started_at || null,
        order.delivered_at || null,
        order.estimated_eta_min != null ? Number(order.estimated_eta_min) : null,
        order.estimated_eta_max != null ? Number(order.estimated_eta_max) : null,
        order.newfield1 || null,
        order.newfield2 || null,
        order.newfield3 || null,
        1 // isSync
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert order:", err);
      reject(err);
    }
  });
}

// ✅ Order Items Backup
function addOrderItemBackup(orderItem) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO order_items
        (
          id, branch_id, order_id, transaction_id, menu_item_id, menu_item_variation_id,
          quantity, price, amount, created_at, updated_at,
          newfield1, newfield2, newfield3, isSync
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        orderItem.id,
        orderItem.branch_id || null,
        orderItem.order_id,
        orderItem.transaction_id || null,
        orderItem.menu_item_id,
        orderItem.menu_item_variation_id || null,
        orderItem.quantity != null ? Number(orderItem.quantity) : 1,
        orderItem.price != null ? Number(orderItem.price) : 0,
        orderItem.amount != null ? Number(orderItem.amount) : 0,
        orderItem.created_at || new Date().toISOString(),
        orderItem.updated_at || new Date().toISOString(),
        orderItem.newfield1 || null,
        orderItem.newfield2 || null,
        orderItem.newfield3 || null,
        1 // isSync
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert order_item:", err);
      reject(err);
    }
  });
}


// ✅ Order Charges Backup (your existing one)
function addOrderChargeBackup(orderCharge) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO order_charges
        (id, order_id, charge_id, newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        orderCharge.id,
        orderCharge.order_id,
        orderCharge.charge_id,
        orderCharge.newfield1 || null,
        orderCharge.newfield2 || null,
        orderCharge.newfield3 || null,
        1
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert order_charge:", err);
      reject(err);
    }
  });
}

function addOrderTaxBackup(orderTax) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO order_taxes
        (id, order_id, tax_id, tax_amount, newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        orderTax.id,
        orderTax.order_id,
        orderTax.tax_id,
        orderTax.tax_amount || 0,
        orderTax.newfield1 || null,
        orderTax.newfield2 || null,
        orderTax.newfield3 || null,
        1 // synced
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert order_tax:", err);
      reject(err);
    }
  });
}

function addOrderItemModifierOptionBackup(modOption) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO order_item_modifier_options
        (id, order_item_id, modifier_option_id, created_at, updated_at, newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        modOption.id,
        modOption.order_item_id,
        modOption.modifier_option_id,
        modOption.created_at || null,
        modOption.updated_at || null,
        modOption.newfield1 || null,
        modOption.newfield2 || null,
        modOption.newfield3 || null,
        1 // synced
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert order_item_modifier_option:", err);
      reject(err);
    }
  });
}

function addOrderHistoryBackup(history) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO order_histories
        (id, order_id, status, created_at, updated_at, newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        history.id,
        history.order_id,
        history.status,
        history.created_at || null,
        history.updated_at || null,
        history.newfield1 || null,
        history.newfield2 || null,
        history.newfield3 || null,
        1 // synced
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert order_history:", err);
      reject(err);
    }
  });
}

function addOrderPlaceBackup(orderPlace) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO order_places
        (id, printer_id, branch_id, name, type, is_active, is_default, created_at, updated_at, newfield1, newfield2, newfield3, isSync)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        orderPlace.id,
        orderPlace.printer_id,
        orderPlace.branch_id,
        orderPlace.name || null,
        orderPlace.type || null,
        orderPlace.is_active ? 1 : 0,
        orderPlace.is_default ? 1 : 0,
        orderPlace.created_at || null,
        orderPlace.updated_at || null,
        orderPlace.newfield1 || null,
        orderPlace.newfield2 || null,
        orderPlace.newfield3 || null,
        1 // synced
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert order_place:", err);
      reject(err);
    }
  });
}

//addPackageModuleBackup
function addPackageModuleBackup(packageModule) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO package_modules
        (
          id, package_id, module_id, created_at, updated_at,
          newfield1, newfield2, newfield3, isSync
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        packageModule.id,
        packageModule.package_id,
        packageModule.module_id,
        packageModule.created_at || new Date().toISOString(),
        packageModule.updated_at || new Date().toISOString(),
        packageModule.newfield1 || null,
        packageModule.newfield2 || null,
        packageModule.newfield3 || null,
        1 // isSync
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert package_module:", err);
      reject(err);
    }
  });
}

function addPasswordResetTokenBackup(token) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO password_reset_tokens
        (
          email, token, created_at,
          newfield1, newfield2, newfield3, isSync
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        token.email,
        token.token,
        token.created_at || new Date().toISOString(),
        token.newfield1 || null,
        token.newfield2 || null,
        token.newfield3 || null,
        1 // isSync
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert password_reset_token:", err);
      reject(err);
    }
  });
}

function addPayfastPaymentBackup(payment) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO payfast_payments
        (
          id, payfast_payment_id, order_id, amount, payment_status,
          payment_date, payment_error_response, created_at, updated_at,
          newfield1, newfield2, newfield3, isSync
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        payment.id,
        payment.payfast_payment_id,
        payment.order_id,
        payment.amount,
        payment.payment_status,
        payment.payment_date,
        payment.payment_error_response,
        payment.created_at || new Date().toISOString(),
        payment.updated_at || new Date().toISOString(),
        payment.newfield1 || null,
        payment.newfield2 || null,
        payment.newfield3 || null,
        1 // isSync
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert payfast_payment:", err);
      reject(err);
    }
  });
}

function addPaymentBackup(payment) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO payments_backup
        (
          id, branch_id, order_id, payment_method, amount,
          balance, transaction_id, created_at, updated_at, isSync
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        payment.id,
        payment.branch_id,
        payment.order_id,
        payment.payment_method,
        payment.amount,
        payment.balance,
        payment.transaction_id || null,
        payment.created_at || new Date().toISOString(),
        payment.updated_at || new Date().toISOString(),
        1 // isSync
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert payment:", err);
      reject(err);
    }
  });
}

function addPaymentBackup1(payment) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO payments
        (
          id, branch_id, order_id, payment_method, amount,
          balance, transaction_id, created_at, updated_at, isSync
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        payment.id,
        payment.branch_id,
        payment.order_id,
        payment.payment_method,
        payment.amount,
        payment.balance,
        payment.transaction_id || null,
        payment.created_at || new Date().toISOString(),
        payment.updated_at || new Date().toISOString(),
        1 // isSync
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert payment:", err);
      reject(err);
    }
  });
}
function addPaymentMethodBackup(method) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO payment_methods
        (
          id, branch_id, restaurant_id, name, value,
          description, is_active, open_drawer,
          created_at, updated_at,
          newfield1, newfield2, newfield3, isSync
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        method.id,
        method.branch_id || null,
        method.restaurant_id,
        method.name,
        method.value,
        method.description || null,
        method.is_active ? "1" : "0",
        method.open_drawer ? "1" : "0",
        method.created_at || new Date().toISOString(),
        method.updated_at || new Date().toISOString(),
        method.newfield1 || null,
        method.newfield2 || null,
        method.newfield3 || null,
        1 // isSync
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert payment_method:", err);
      reject(err);
    }
  });
}

function addPaypalPaymentBackup(paypalPayment) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO paypal_payments
        (
          id, paypal_payment_id, order_id, amount,
          payment_status, payment_date, payment_error_response,
          created_at, updated_at,
          newfield1, newfield2, newfield3, isSync
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        paypalPayment.id,
        paypalPayment.paypal_payment_id || null,
        paypalPayment.order_id,
        paypalPayment.amount,
        paypalPayment.payment_status || "pending",
        paypalPayment.payment_date || null,
        paypalPayment.payment_error_response || null,
        paypalPayment.created_at || new Date().toISOString(),
        paypalPayment.updated_at || new Date().toISOString(),
        paypalPayment.newfield1 || null,
        paypalPayment.newfield2 || null,
        paypalPayment.newfield3 || null,
        1 // isSync
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert paypal_payment:", err);
      reject(err);
    }
  });
}

function addPaystackPaymentBackup(paystackPayment) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO paystack_payments
        (
          id, paystack_payment_id, order_id, amount,
          payment_status, payment_date, payment_error_response,
          created_at, updated_at,
          newfield1, newfield2, newfield3, isSync
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        paystackPayment.id,
        paystackPayment.paystack_payment_id || null,
        paystackPayment.order_id,
        paystackPayment.amount,
        paystackPayment.payment_status || "pending",
        paystackPayment.payment_date || null,
        paystackPayment.payment_error_response || null,
        paystackPayment.created_at || new Date().toISOString(),
        paystackPayment.updated_at || new Date().toISOString(),
        paystackPayment.newfield1 || null,
        paystackPayment.newfield2 || null,
        paystackPayment.newfield3 || null,
        1 // isSync
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert paystack_payment:", err);
      reject(err);
    }
  });
}

function addPermissionBackup(permission) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO permissions
        (
          id, name, guard_name, module_id,
          created_at, updated_at,
          newfield1, newfield2, newfield3, isSync
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        permission.id,
        permission.name,
        permission.guard_name,
        permission.module_id,
        permission.created_at || null,
        permission.updated_at || null,
        permission.newfield1 || null,
        permission.newfield2 || null,
        permission.newfield3 || null,
        1 // isSync
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert permission:", err);
      reject(err);
    }
  });
}

function addPersonalAccessTokenBackup(token) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO personal_access_tokens
        (
          id, tokenable_type, tokenable_id, name, token,
          abilities, last_used_at, expires_at,
          created_at, updated_at,
          newfield1, newfield2, newfield3, isSync
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        token.id,
        token.tokenable_type,
        token.tokenable_id,
        token.name,
        token.token,
        token.abilities || null,
        token.last_used_at || null,
        token.expires_at || null,
        token.created_at || new Date().toISOString(),
        token.updated_at || new Date().toISOString(),
        token.newfield1 || null,
        token.newfield2 || null,
        token.newfield3 || null,
        1 // isSync
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert personal_access_token:", err);
      reject(err);
    }
  });
}

function addPosRegisterBackup(register) {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO pos_registers (
          id, user_id, opened_by, closed_by, open_datetime, close_datetime,
          branch_id, restaurant_id, opening_cash, opening_note,
          total_sales, total_refund, total_payment, taxes, payment_summary,
          closing_cash, closing_note, total_orders, total_customers,
          today_earning, avg_earning, delivery_fee, discount, tip,
          card_slips, check_slips, note,
          created_at, updated_at,
          newfield1, newfield2, newfield3, isSync
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        register.id,
        register.user_id,
        register.opened_by,
        register.closed_by,
        register.open_datetime,
        register.close_datetime,
        register.branch_id,
        register.restaurant_id,
        register.opening_cash,
        register.opening_note,
        register.total_sales,
        register.total_refund,
        register.total_payment,
        register.taxes,
        register.payment_summary,
        register.closing_cash,
        register.closing_note,
        register.total_orders,
        register.total_customers,
        register.today_earning,
        register.avg_earning,
        register.delivery_fee,
        register.discount,
        register.tip,
        register.card_slips,
        register.check_slips,
        register.note,
        register.created_at,
        register.updated_at,
        register.newfield1 || null,
        register.newfield2 || null,
        register.newfield3 || null,
        1
      );
      resolve(true);
    } catch (err) {
      console.error("❌ Failed to insert pos_register:", err);
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
    addInventoryGlobalSettingBackup,
    addFrontDetailBackup,
    addFrontFaqSettingBackup,
    addFrontFeatureBackup,
    addFrontReviewSettingBackup,
    addGlobalInvoiceBackup,
    addGlobalSettingBackup,
    addGlobalSubscriptionBackup,
    addJobBackup,
    addModifierOptionBackup,
    addJobBatchBackup,
    addKotBackup,
    addKotCancelReasonBackup,
    addKotItemBackup,
    addKotItemModifierOptionBackup,
    addKotPlaceBackup,
    addKotSettingBackup,
    addLanguageSettingBackup,
    addLtmTranslationBackup,
    addMigrationBackup,
    addModelHasPermissionBackup,
    addModelHasRoleBackup,
    addModuleBackup,
    addNotificationSettingBackup,
    addOfflinePaymentMethodBackup,
    addOfflinePlanChangeBackup,
    addOnboardingStepBackup,
    saveSyncTime,
    getSyncTime,
    addOrderChargeBackup,
    addOrderBackup,
    addOrderItemBackup,
    addOrderTaxBackup,
    addOrderItemModifierOptionBackup,
    addOrderHistoryBackup,
    addOrderPlaceBackup,
    addPackageModuleBackup,
    addPasswordResetTokenBackup,
    addPayfastPaymentBackup,
    addPaymentBackup,
    addPaymentBackup1,
    addPaymentMethodBackup,
    addPaypalPaymentBackup,
    addPaystackPaymentBackup,
    addPermissionBackup,
    addPersonalAccessTokenBackup,
    addPosRegisterBackup
 };
