const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Database = require("better-sqlite3");
const crypto = require("crypto");
const registerCategoryRoutes = require("./backend/routes/categoryRoutes");
const modifierRoutes = require("./backend/routes/modifierRoutes");
const modifierGroupRoutes = require("./backend/routes/modifierGroupRoutes");
const menuItemRoutes = require("./backend/routes/menuItemRoutes");
const menuRoutes = require("./backend/routes/menuRoutes");
const loginRoute= require("./backend/routes/loginRoute");
const branchBackupRoutes= require("./backend/routes/branchBackupRoutes");
const countryRoutes= require("./backend/routes/countryRoutes");
const currencyRoutes= require("./backend/routes/currencyRoutes");
const globalCurrencyRoutes= require("./backend/routes/globalCurrencyRoutes");
const packageRoutes= require("./backend/routes/packageRoutes");
const restaurantBackupRoutes= require("./backend/routes/restaurantBackupRoutes");
const backupRoutes= require("./backend/routes/backupRoutes");

const Store = require("electron-store");
const store = new Store();

let db;

function createWindow11() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load built React frontend
  win.loadFile(path.join(__dirname, "frontend/dist/index.html"));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === "development") {
    // Dev mode - Vite dev server
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    // Production mode - load built files
    win.loadFile(path.join(__dirname, "frontend", "dist", "index.html"));
    //win.loadFile(path.join(__dirname, 'frontend/dist/index.html'));
  }
}
// Initialize database

const fs = require("fs");

function initDatabase11() {
  const userDataPath = app.getPath("userData");
  const dbFileName = "app.db";
  const dbFilePath = path.join(userDataPath, dbFileName);

  // Get path to bundled db file (in production mode)
  const bundledDbPath = path.join(process.resourcesPath, "assets", dbFileName);

  // If the DB doesn't exist in userData, copy it from the bundled path
  if (!fs.existsSync(dbFilePath)) {
    try {
      fs.copyFileSync(bundledDbPath, dbFilePath);
    } catch (err) {
      console.error("Failed to copy DB to userData:", err);
    }
  }

  // Open DB from writable userData location
  db = new Database(dbFilePath);

  // Create tables if needed
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_name TEXT NOT NULL
    )
  `
  ).run();
}

function initDatabase() {
  const userDataPath = app.getPath("userData");
  const dbFilePath = path.join(userDataPath, "app.db");

  // Create the database in the userData path (it auto-creates if it doesn't exist)
  db = new Database(dbFilePath);

  // Create tables if they don’t exist

  const queries = [
   
    // areas
  `CREATE TABLE IF NOT EXISTS "areas" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "area_name" TEXT NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // branch_delivery_settings
    `CREATE TABLE IF NOT EXISTS "branch_delivery_settings" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "max_radius" REAL NOT NULL DEFAULT '5.00' ,
  "unit" TEXT NOT NULL DEFAULT 'km' ,
  "fee_type" TEXT NOT NULL DEFAULT 'fixed' ,
  "fixed_fee" REAL   ,
  "per_distance_rate" REAL   ,
  "free_delivery_over_amount" REAL   ,
  "free_delivery_within_radius" REAL   ,
  "delivery_schedule_start" TEXT   ,
  "delivery_schedule_end" TEXT   ,
  "prep_time_minutes" INTEGER NOT NULL DEFAULT '20' ,
  "additional_eta_buffer_time" INTEGER   ,
  "avg_delivery_speed_kmh" INTEGER NOT NULL DEFAULT '30' ,
  "is_enabled" INTEGER NOT NULL DEFAULT '1' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // branches
    `CREATE TABLE IF NOT EXISTS "branches" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT   ,
  "name" TEXT NOT NULL  ,
  "address" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "lat" REAL   ,
  "lng" REAL   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // cache
    `CREATE TABLE IF NOT EXISTS "cache" (
  "key" TEXT NOT NULL  PRIMARY KEY,
  "value" TEXT NOT NULL  ,
  "expiration" INTEGER NOT NULL  ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // cache_locks
    `CREATE TABLE IF NOT EXISTS "cache_locks" (
  "key" TEXT NOT NULL  PRIMARY KEY,
  "owner" TEXT NOT NULL  ,
  "expiration" INTEGER NOT NULL  ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // contacts
    `CREATE TABLE IF NOT EXISTS "contacts" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "language_setting_id" TEXT   ,
  "email" TEXT   ,
  "contact_company" TEXT   ,
  "image" TEXT   ,
  "address" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "image_url" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // countries
    `CREATE TABLE IF NOT EXISTS "countries" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "countries_code" TEXT NOT NULL  ,
  "countries_name" TEXT NOT NULL  ,
  "phonecode" TEXT NOT NULL  ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // currencies
    `CREATE TABLE IF NOT EXISTS "currencies" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT   ,
  "currency_name" TEXT NOT NULL  ,
  "currency_code" TEXT NOT NULL  ,
  "currency_symbol" TEXT NOT NULL  ,
  "currency_position" TEXT NOT NULL DEFAULT 'left' ,
  "no_of_decimal" TEXT NOT NULL DEFAULT '2' ,
  "thousand_separator" TEXT  DEFAULT ',' ,
  "decimal_separator" TEXT  DEFAULT '.' ,
  "exchange_rate" REAL   ,
  "usd_price" REAL   ,
  "is_cryptocurrency" TEXT NOT NULL DEFAULT 'no' ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // custom_menus
    `CREATE TABLE IF NOT EXISTS "custom_menus" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "menu_name" TEXT NOT NULL  ,
  "menu_slug" TEXT NOT NULL  ,
  "menu_content" TEXT   ,
  "is_active" INTEGER NOT NULL DEFAULT '1' ,
  "position" TEXT NOT NULL DEFAULT 'header' ,
  "sort_order" INTEGER NOT NULL DEFAULT '0' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // customer_addresses
    `CREATE TABLE IF NOT EXISTS "customer_addresses" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "customer_id" TEXT   ,
  "label" TEXT   ,
  "address" TEXT   ,
  "lat" REAL   ,
  "lng" REAL   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // customers
  `CREATE TABLE IF NOT EXISTS "customers" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT   ,
  "name" TEXT   ,
  "phone" TEXT   ,
  "email" TEXT   ,
  "email_otp" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "delivery_address" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // delivery_executives
    `CREATE TABLE IF NOT EXISTS "delivery_executives" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "name" TEXT NOT NULL  ,
  "phone" TEXT   ,
  "photo" TEXT   ,
  "status" TEXT NOT NULL DEFAULT 'available' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // delivery_fee_tiers
    `CREATE TABLE IF NOT EXISTS "delivery_fee_tiers" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "min_distance" REAL   ,
  "max_distance" REAL   ,
  "fee" REAL   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // email_settings
    `CREATE TABLE IF NOT EXISTS "email_settings" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "mail_from_name" TEXT   ,
  "mail_from_email" TEXT   ,
  "enable_queue" TEXT NOT NULL DEFAULT 'no' ,
  "mail_driver" TEXT NOT NULL DEFAULT 'mail' ,
  "smtp_host" TEXT   ,
  "smtp_port" TEXT   ,
  "smtp_encryption" TEXT   ,
  "mail_username" TEXT   ,
  "mail_password" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "email_verified" INTEGER NOT NULL DEFAULT '0' ,
  "verified" INTEGER NOT NULL DEFAULT '0' ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // expense_categories
    `CREATE TABLE IF NOT EXISTS "expense_categories" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "name" TEXT NOT NULL  ,
  "description" TEXT   ,
  "is_active" INTEGER NOT NULL DEFAULT '1' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // expenses
    `CREATE TABLE IF NOT EXISTS "expenses" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "expense_category_id" TEXT   ,
  "branch_id" INTEGER  ,
  "expense_title" TEXT   ,
  "description" TEXT   ,
  "amount" REAL NOT NULL  ,
  "expense_date" TEXT NOT NULL  ,
  "payment_status" TEXT NOT NULL  ,
  "payment_date" TEXT   ,
  "payment_due_date" TEXT   ,
  "payment_method" TEXT   ,
  "receipt_path" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "expense_receipt_url" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // failed_jobs
    `CREATE TABLE IF NOT EXISTS "failed_jobs" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "uuid" TEXT NOT NULL  ,
  "connection" TEXT NOT NULL  ,
  "queue" TEXT NOT NULL  ,
  "payload" TEXT NOT NULL  ,
  "exception" TEXT NOT NULL  ,
  "failed_at" TEXT NOT NULL DEFAULT 'CURRENT_TIMESTAMP' ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // file_storage
    `CREATE TABLE IF NOT EXISTS "file_storage" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT   ,
  "path" TEXT NOT NULL  ,
  "filename" TEXT NOT NULL  ,
  "type" TEXT   ,
  "size" TEXT NOT NULL  ,
  "storage_location" TEXT NOT NULL DEFAULT 'local' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "file_url" TEXT   ,
  "icon" TEXT   ,
  "size_format" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // file_storage_settings
    `CREATE TABLE IF NOT EXISTS "file_storage_settings" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "filesystem" TEXT NOT NULL  ,
  "auth_keys" TEXT   ,
  "status" TEXT NOT NULL DEFAULT 'disabled' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // flags
    `CREATE TABLE IF NOT EXISTS "flags" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "capital" TEXT   ,
  "code" TEXT   ,
  "continent" TEXT   ,
  "name" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // flutterwave_payments
    `CREATE TABLE IF NOT EXISTS "flutterwave_payments" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "flutterwave_payment_id" TEXT   ,
  "order_id" TEXT NOT NULL  ,
  "amount" REAL NOT NULL  ,
  "payment_status" TEXT NOT NULL DEFAULT 'pending' ,
  "payment_date" TEXT   ,
  "payment_error_response" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // front_details
    `CREATE TABLE IF NOT EXISTS "front_details" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "language_setting_id" TEXT   ,
  "header_title" TEXT   ,
  "header_description" TEXT   ,
  "image" TEXT   ,
  "feature_with_image_heading" TEXT   ,
  "review_heading" TEXT   ,
  "feature_with_icon_heading" TEXT   ,
  "comments_heading" TEXT   ,
  "price_heading" TEXT   ,
  "price_description" TEXT   ,
  "faq_heading" TEXT   ,
  "faq_description" TEXT   ,
  "contact_heading" TEXT   ,
  "footer_copyright_text" TEXT   ,
   "image_url" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // front_faq_settings
    `CREATE TABLE IF NOT EXISTS "front_faq_settings" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "language_setting_id" TEXT   ,
  "question" TEXT   ,
  "answer" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // front_features
    `CREATE TABLE IF NOT EXISTS "front_features" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "language_setting_id" TEXT   ,
  "title" TEXT NOT NULL  ,
  "description" TEXT   ,
  "image" TEXT   ,
  "icon" TEXT   ,
  "type" TEXT NOT NULL DEFAULT 'image' ,
    "image_url" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // front_review_settings
    `CREATE TABLE IF NOT EXISTS "front_review_settings" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "language_setting_id" TEXT   ,
  "reviews" TEXT   ,
  "reviewer_name" TEXT   ,
  "reviewer_designation" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // global_currencies
    `CREATE TABLE IF NOT EXISTS "global_currencies" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "currency_name" TEXT NOT NULL  ,
  "currency_symbol" TEXT NOT NULL  ,
  "currency_code" TEXT NOT NULL  ,
  "exchange_rate" REAL   ,
  "usd_price" REAL   ,
  "is_cryptocurrency" TEXT NOT NULL DEFAULT 'no' ,
  "currency_position" TEXT NOT NULL DEFAULT 'left' ,
  "no_of_decimal" TEXT NOT NULL DEFAULT '2' ,
  "thousand_separator" TEXT   ,
  "decimal_separator" TEXT   ,
  "status" TEXT NOT NULL DEFAULT 'enable' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "deleted_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // global_invoices
`CREATE TABLE IF NOT EXISTS "global_invoices" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT   ,
  "currency_id" TEXT   ,
  "package_id" TEXT   ,
  "global_subscription_id" TEXT   ,
  "offline_method_id" TEXT   ,
  "signature" TEXT   ,
  "token" TEXT   ,
  "transaction_id" TEXT   ,
  "event_id" TEXT   ,
  "package_type" TEXT   ,
  "sub_total" INTEGER   ,
  "total" INTEGER   ,
  "billing_frequency" TEXT   ,
  "billing_interval" TEXT   ,
  "recurring" TEXT   ,
  "plan_id" TEXT   ,
  "subscription_id" TEXT   ,
  "invoice_id" TEXT   ,
  "amount" REAL   ,
  "stripe_invoice_number" TEXT   ,
  "pay_date" TEXT   ,
  "next_pay_date" TEXT   ,
  "gateway_name" TEXT   ,
  "status" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "m_payment_id" TEXT   ,
  "pf_payment_id" TEXT   ,
  "payfast_plan" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // global_settings
    `CREATE TABLE IF NOT EXISTS "global_settings" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "purchase_code" TEXT   ,
  "supported_until" TEXT   ,
  "last_license_verified_at" TEXT   ,
  "email" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "name" TEXT NOT NULL  ,
  "logo" TEXT   ,
  "theme_hex" TEXT   ,
  "theme_rgb" TEXT   ,
  "locale" TEXT NOT NULL DEFAULT 'en' ,
  "license_type" TEXT   ,
  "hide_cron_job" INTEGER NOT NULL DEFAULT '0' ,
  "last_cron_run" TEXT   ,
  "system_update" INTEGER NOT NULL DEFAULT '1' ,
  "purchased_on" TEXT   ,
  "timezone" TEXT  DEFAULT 'Asia/Kolkata' ,
  "disable_landing_site" INTEGER NOT NULL DEFAULT '0' ,
  "landing_type" TEXT NOT NULL DEFAULT 'static' ,
  "landing_site_type" TEXT NOT NULL DEFAULT 'theme' ,
  "landing_site_url" TEXT   ,
  "installed_url" TEXT   ,
  "requires_approval_after_signup" INTEGER NOT NULL DEFAULT '0' ,
  "facebook_link" TEXT   ,
  "instagram_link" TEXT   ,
  "twitter_link" TEXT   ,
  "yelp_link" TEXT   ,
  "default_currency_id" TEXT   ,
  "show_logo_text" INTEGER NOT NULL DEFAULT '1' ,
  "meta_title" TEXT   ,
  "meta_keyword" TEXT   ,
  "meta_description" TEXT   ,
  "upload_fav_icon_android_chrome_192" TEXT   ,
  "upload_fav_icon_android_chrome_512" TEXT   ,
  "upload_fav_icon_apple_touch_icon" TEXT   ,
  "upload_favicon_16" TEXT   ,
  "upload_favicon_32" TEXT   ,
  "favicon" TEXT   ,
  "hash" TEXT   ,
  "webmanifest" TEXT   ,
  "is_pwa_install_alert_show" TEXT NOT NULL DEFAULT '1' ,
  "google_map_api_key" TEXT   ,
  "session_driver" TEXT NOT NULL DEFAULT 'database' ,
  "enable_stripe" INTEGER NOT NULL DEFAULT '1' ,
  "enable_razorpay" INTEGER NOT NULL DEFAULT '1' ,
  "enable_flutterwave" INTEGER NOT NULL DEFAULT '1' ,
  "enable_payfast" INTEGER NOT NULL DEFAULT '1' ,
  "enable_paypal" INTEGER NOT NULL DEFAULT '1' ,
  "enable_paystack" INTEGER NOT NULL DEFAULT '1' ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // global_subscriptions
    `CREATE TABLE IF NOT EXISTS "global_subscriptions" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT   ,
  "package_id" TEXT   ,
  "currency_id" TEXT   ,
  "package_type" TEXT   ,
  "plan_type" TEXT   ,
  "transaction_id" TEXT   ,
  "name" TEXT   ,
  "user_id" TEXT   ,
  "quantity" TEXT   ,
  "token" TEXT   ,
  "razorpay_id" TEXT   ,
  "razorpay_plan" TEXT   ,
  "stripe_id" TEXT   ,
  "stripe_status" TEXT   ,
  "stripe_price" TEXT   ,
  "gateway_name" TEXT   ,
  "trial_ends_at" TEXT   ,
  "subscription_status" TEXT   ,
  "ends_at" TEXT   ,
  "subscribed_on_date" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "subscription_id" TEXT   ,
  "customer_id" TEXT   ,
  "flutterwave_id" TEXT   ,
  "flutterwave_payment_ref" TEXT   ,
  "flutterwave_status" TEXT   ,
  "flutterwave_customer_id" TEXT   ,
  "payfast_plan" TEXT   ,
  "payfast_status" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // inventory_global_settings
    `CREATE TABLE IF NOT EXISTS "inventory_global_settings" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "license_type" TEXT   ,
  "purchase_code" TEXT   ,
  "purchased_on" TEXT   ,
  "supported_until" TEXT   ,
  "notify_update" INTEGER NOT NULL DEFAULT '1' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // inventory_item_categories
    `CREATE TABLE IF NOT EXISTS "inventory_item_categories" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "name" TEXT NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // inventory_items
    `CREATE TABLE IF NOT EXISTS "inventory_items" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "name" TEXT NOT NULL  ,
  "inventory_item_category_id" TEXT NOT NULL  ,
  "unit_id" TEXT NOT NULL  ,
  "threshold_quantity" REAL NOT NULL DEFAULT '0.00' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "preferred_supplier_id" TEXT   ,
  "reorder_quantity" REAL NOT NULL DEFAULT '0.00' ,
  "unit_purchase_price" REAL NOT NULL DEFAULT '0.00' ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // inventory_movements
    `CREATE TABLE IF NOT EXISTS "inventory_movements" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "inventory_item_id" TEXT NOT NULL  ,
  "quantity" REAL NOT NULL DEFAULT '0.00' ,
  "transaction_type" TEXT NOT NULL DEFAULT 'in' ,
  "waste_reason" TEXT   ,
  "added_by" TEXT   ,
  "supplier_id" TEXT   ,
  "transfer_branch_id" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "unit_purchase_price" REAL NOT NULL DEFAULT '0.00' ,
  "expiration_date" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // inventory_settings
    `CREATE TABLE IF NOT EXISTS "inventory_settings" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT NOT NULL  ,
  "allow_auto_purchase" INTEGER NOT NULL DEFAULT '0' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // inventory_stocks
    `CREATE TABLE IF NOT EXISTS "inventory_stocks" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "inventory_item_id" TEXT NOT NULL  ,
  "quantity" REAL NOT NULL DEFAULT '0.00' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // item_categories
    `CREATE TABLE IF NOT EXISTS "item_categories" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "category_name" TEXT   ,
  "sort_order" TEXT NOT NULL DEFAULT '0' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // item_modifiers
    `CREATE TABLE IF NOT EXISTS "item_modifiers" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "menu_item_id" TEXT   ,
  "modifier_group_id" TEXT   ,
  "is_required" INTEGER NOT NULL DEFAULT '0' ,
  "allow_multiple_selection" INTEGER NOT NULL DEFAULT '0' ,
  "max_select_option" TEXT   ,
  "has_max_quantity" TEXT   ,
  "max_quantity" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // job_batches
    `CREATE TABLE IF NOT EXISTS "job_batches" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL  ,
  "total_jobs" INTEGER NOT NULL  ,
  "pending_jobs" INTEGER NOT NULL  ,
  "failed_jobs" INTEGER NOT NULL  ,
  "failed_job_ids" TEXT NOT NULL  ,
  "options" TEXT   ,
  "cancelled_at" INTEGER   ,
  "created_at" INTEGER NOT NULL  ,
  "finished_at" INTEGER   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // jobs
    `CREATE TABLE IF NOT EXISTS "jobs" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "queue" TEXT NOT NULL  ,
  "payload" TEXT NOT NULL  ,
  "attempts" TEXT NOT NULL  ,
  "reserved_at" TEXT   ,
  "available_at" TEXT NOT NULL  ,
  "created_at" TEXT NOT NULL  ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // kot_item_modifier_options
    `CREATE TABLE IF NOT EXISTS "kot_item_modifier_options" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "kot_item_id" TEXT NOT NULL  ,
  "modifier_option_id" TEXT NOT NULL  ,
  "qty" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // kot_items
    `CREATE TABLE IF NOT EXISTS "kot_items" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "kot_id" TEXT NOT NULL  ,
  "transaction_id" TEXT   ,
  "menu_item_id" TEXT NOT NULL  ,
  "menu_item_variation_id" TEXT   ,
  "quantity" INTEGER NOT NULL  ,
  "status" TEXT   ,
  "note" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // kot_places
    `CREATE TABLE IF NOT EXISTS "kot_places" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "printer_id" TEXT   ,
  "branch_id" INTEGER  ,
  "name" TEXT NOT NULL  ,
  "type" TEXT   ,
  "is_active" INTEGER NOT NULL DEFAULT '1' ,
  "is_default" INTEGER NOT NULL DEFAULT '0' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,


 // kot_cancel_reasons
    `CREATE TABLE IF NOT EXISTS "kot_cancel_reasons" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" INTEGER  ,
  "reason" TEXT NOT NULL  ,
  "cancel_order" TEXT   ,
  "cancel_kot" TEXT,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,
    // kot_settings
    `CREATE TABLE IF NOT EXISTS "kot_settings" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "default_status" TEXT NOT NULL DEFAULT 'pending' ,
  "enable_item_level_status" INTEGER NOT NULL DEFAULT '1' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // kots
    `CREATE TABLE IF NOT EXISTS "kots" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "kot_number" TEXT NOT NULL  ,
  "order_id" TEXT NOT NULL  ,
  "transaction_id" TEXT   ,
  "note" TEXT   ,
  "status" TEXT NOT NULL DEFAULT 'in_kitchen' ,
  "cancel_reason_id" TEXT   ,
  "cancel_reason_text" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // language_settings
    `CREATE TABLE IF NOT EXISTS "language_settings" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "language_code" TEXT NOT NULL  ,
  "language_name" TEXT NOT NULL  ,
  "flag_code" TEXT NOT NULL  ,
  "active" INTEGER NOT NULL DEFAULT '1' ,
  "is_rtl" INTEGER NOT NULL DEFAULT '0' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // ltm_translations
    `CREATE TABLE IF NOT EXISTS "ltm_translations" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "status" INTEGER NOT NULL DEFAULT '0' ,
  "locale" TEXT NOT NULL  ,
  "group" TEXT NOT NULL  ,
  "key" TEXT NOT NULL  ,
  "value" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // menu_item_translations
    `CREATE TABLE IF NOT EXISTS "menu_item_translations" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "menu_item_id" TEXT NOT NULL  ,
  "locale" TEXT NOT NULL  ,
  "item_name" TEXT NOT NULL  ,
  "description" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // menu_item_variations
    `CREATE TABLE IF NOT EXISTS "menu_item_variations" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "variation" TEXT NOT NULL  ,
  "price" REAL NOT NULL  ,
  "menu_item_id" TEXT NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // menu_items
    `CREATE TABLE IF NOT EXISTS "menu_items" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "kot_place_id" TEXT   ,
  "item_name" TEXT NOT NULL  ,
  "image" TEXT   ,
  "description" TEXT   ,
  "type" TEXT NOT NULL DEFAULT 'veg' ,
  "price" REAL   ,
  "menu_id" TEXT NOT NULL  ,
  "item_category_id" TEXT NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "preparation_time" INTEGER   ,
  "is_available" INTEGER NOT NULL DEFAULT '1' ,
  "show_on_customer_site" INTEGER NOT NULL DEFAULT '1' ,
  "in_stock" INTEGER NOT NULL DEFAULT '1' ,
  "sort_order" TEXT NOT NULL DEFAULT '0' ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // menus
    `CREATE TABLE IF NOT EXISTS "menus" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "menu_name" TEXT   ,
  "sort_order" TEXT NOT NULL DEFAULT '0' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // migrations
    `CREATE TABLE IF NOT EXISTS "migrations" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "migration" TEXT NOT NULL  ,
  "batch" INTEGER NOT NULL  ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

//model_has_permissions
 `CREATE TABLE IF NOT EXISTS "model_has_permissions" (
  permission_id INTEGER NOT NULL,
  model_type TEXT NOT NULL,
  model_id INTEGER NOT NULL,
  newfield1 TEXT,
  newfield2 TEXT,
  newfield3 TEXT,
  isSync BOOLEAN DEFAULT 0
);`,

//model_has_roles
`CREATE TABLE IF NOT EXISTS "model_has_roles" (
  role_id INTEGER NOT NULL,
  model_type TEXT NOT NULL,
  model_id INTEGER NOT NULL,
  newfield1 TEXT,
  newfield2 TEXT,
  newfield3 TEXT,
  isSync BOOLEAN DEFAULT 0
);`,
    // modifier_groups
    `CREATE TABLE IF NOT EXISTS "modifier_groups" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL  ,
  "description" TEXT   ,
  "has_max_quantity" TEXT   ,
  "max_quantity" TEXT   ,
  "max_select_option" TEXT   ,
  "branch_id" INTEGER  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // modifier_options
    `CREATE TABLE IF NOT EXISTS "modifier_options" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "modifier_group_id" TEXT NOT NULL  ,
  "name" TEXT NOT NULL  ,
  "price" REAL NOT NULL  ,
  "is_available" INTEGER NOT NULL DEFAULT '1' ,
  "sort_order" INTEGER NOT NULL DEFAULT '0' ,
  "is_preselected" INTEGER NOT NULL DEFAULT '0' ,
  "qty" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // modules
    `CREATE TABLE IF NOT EXISTS "modules" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // notification_settings
    `CREATE TABLE IF NOT EXISTS "notification_settings" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT   ,
  "type" TEXT NOT NULL  ,
  "send_email" INTEGER NOT NULL DEFAULT '1' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // offline_payment_methods
    `CREATE TABLE IF NOT EXISTS "offline_payment_methods" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT   ,
  "name" TEXT NOT NULL  ,
  "description" TEXT   ,
  "status" TEXT NOT NULL DEFAULT 'active' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // offline_plan_changes
    `CREATE TABLE IF NOT EXISTS "offline_plan_changes" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT   ,
  "package_id" TEXT NOT NULL  ,
  "package_type" TEXT NOT NULL  ,
  "amount" REAL   ,
  "pay_date" TEXT   ,
  "next_pay_date" TEXT   ,
  "invoice_id" TEXT   ,
  "offline_method_id" TEXT   ,
  "file_name" TEXT   ,
  "status" TEXT NOT NULL DEFAULT 'pending' ,
  "remark" TEXT   ,
  "description" TEXT NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // onboarding_steps
    `CREATE TABLE IF NOT EXISTS "onboarding_steps" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "add_area_completed" INTEGER NOT NULL DEFAULT '0' ,
  "add_table_completed" INTEGER NOT NULL DEFAULT '0' ,
  "add_menu_completed" INTEGER NOT NULL DEFAULT '0' ,
  "add_menu_items_completed" INTEGER NOT NULL DEFAULT '0' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // order_charges
    `CREATE TABLE IF NOT EXISTS "order_charges" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "order_id" TEXT NOT NULL  ,
  "charge_id" TEXT NOT NULL  ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // order_histories
    `CREATE TABLE IF NOT EXISTS "order_histories" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "order_id" TEXT NOT NULL  ,
  "status" TEXT NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // order_item_modifier_options
    `CREATE TABLE IF NOT EXISTS "order_item_modifier_options" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "order_item_id" TEXT NOT NULL  ,
  "modifier_option_id" TEXT NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // order_items
    `CREATE TABLE IF NOT EXISTS "order_items" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "order_id" TEXT NOT NULL  ,
  "transaction_id" TEXT   ,
  "menu_item_id" TEXT NOT NULL  ,
  "menu_item_variation_id" TEXT   ,
  "quantity" INTEGER NOT NULL  ,
  "price" REAL NOT NULL  ,
  "amount" REAL NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // order_places
    `CREATE TABLE IF NOT EXISTS "order_places" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "printer_id" TEXT   ,
  "branch_id" INTEGER  ,
  "name" TEXT NOT NULL  ,
  "type" TEXT   ,
  "is_active" INTEGER NOT NULL DEFAULT '1' ,
  "is_default" INTEGER NOT NULL DEFAULT '0' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // order_taxes
    `CREATE TABLE IF NOT EXISTS "order_taxes" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "order_id" TEXT NOT NULL  ,
  "tax_id" TEXT NOT NULL  ,
  "tax_amount"TEXT,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // orders
    `CREATE TABLE IF NOT EXISTS "orders" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "uuid" TEXT   ,
  "branch_id" INTEGER  ,
  "order_number" TEXT NOT NULL  ,
  "date_time" TEXT NOT NULL  ,
  "table_id" TEXT   ,
  "customer_id" TEXT   ,
  "number_of_pax" INTEGER   ,
  "waiter_id" TEXT   ,
  "status" TEXT NOT NULL DEFAULT 'kot' ,
  "sub_total" REAL NOT NULL  ,
  "tip_amount" REAL  DEFAULT '0.00' ,
  "tip_note" TEXT   ,
  "total" REAL NOT NULL  ,
  "amount_paid" REAL NOT NULL DEFAULT '0.00' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "order_type" TEXT NOT NULL DEFAULT 'dine_in' ,
  "delivery_executive_id" TEXT   ,
  "delivery_address" TEXT   ,
  "delivery_time" TEXT   ,
  "estimated_delivery_time" TEXT   ,
  "split_type" TEXT   ,
  "discount_type" TEXT   ,
  "discount_value" REAL   ,
  "discount_amount" REAL   ,
  "order_status" TEXT NOT NULL DEFAULT 'placed' ,
  "delivery_fee" REAL NOT NULL DEFAULT '0.00' ,
  "customer_lat" REAL   ,
  "customer_lng" REAL   ,
  "is_within_radius" INTEGER NOT NULL DEFAULT '0' ,
  "delivery_started_at" TEXT   ,
  "delivered_at" TEXT   ,
  "estimated_eta_min" INTEGER   ,
  "estimated_eta_max" INTEGER   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // package_modules
    `CREATE TABLE IF NOT EXISTS "package_modules" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "package_id" TEXT   ,
  "module_id" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // packages
    `CREATE TABLE IF NOT EXISTS "packages" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "package_name" TEXT NOT NULL  ,
  "price" REAL NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "currency_id" TEXT   ,
  "description" TEXT   ,
  "annual_price" REAL   ,
  "monthly_price" REAL   ,
  "monthly_status" TEXT  DEFAULT '1' ,
  "annual_status" TEXT  DEFAULT '1' ,
  "stripe_annual_plan_id" TEXT   ,
  "stripe_monthly_plan_id" TEXT   ,
  "razorpay_annual_plan_id" TEXT   ,
  "razorpay_monthly_plan_id" TEXT   ,
  "flutterwave_annual_plan_id" TEXT   ,
  "flutterwave_monthly_plan_id" TEXT   ,
  "paystack_annual_plan_id" TEXT   ,
  "paystack_monthly_plan_id" TEXT   ,
  "stripe_lifetime_plan_id" TEXT   ,
  "razorpay_lifetime_plan_id" TEXT   ,
  "billing_cycle" TEXT   ,
  "sort_order" TEXT   ,
  "is_private" INTEGER NOT NULL DEFAULT '0' ,
  "is_free" INTEGER NOT NULL DEFAULT '0' ,
  "is_recommended" INTEGER NOT NULL DEFAULT '0' ,
  "package_type" TEXT NOT NULL DEFAULT 'standard' ,
  "trial_status" INTEGER   ,
  "trial_days" INTEGER   ,
  "trial_notification_before_days" INTEGER   ,
  "trial_message" TEXT   ,
  "additional_features" TEXT   ,
  "branch_limit" INTEGER   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // password_reset_tokens
    `CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
  "email" TEXT NOT NULL  PRIMARY KEY,
  "token" TEXT NOT NULL  ,
  "created_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // payfast_payments
    `CREATE TABLE IF NOT EXISTS "payfast_payments" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "payfast_payment_id" TEXT   ,
  "order_id" TEXT NOT NULL  ,
  "amount" REAL NOT NULL  ,
  "payment_status" TEXT NOT NULL DEFAULT 'pending' ,
  "payment_date" TEXT   ,
  "payment_error_response" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // payment_gateway_credentials
    `CREATE TABLE IF NOT EXISTS "payment_gateway_credentials" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT   ,
  "razorpay_key" TEXT   ,
  "razorpay_secret" TEXT   ,
  "razorpay_status" INTEGER NOT NULL DEFAULT '0' ,
  "stripe_key" TEXT   ,
  "stripe_secret" TEXT   ,
  "stripe_status" INTEGER NOT NULL DEFAULT '0' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "is_dine_in_payment_enabled" INTEGER NOT NULL DEFAULT '0' ,
  "is_delivery_payment_enabled" INTEGER NOT NULL DEFAULT '0' ,
  "is_pickup_payment_enabled" INTEGER NOT NULL DEFAULT '0' ,
  "is_cash_payment_enabled" INTEGER NOT NULL DEFAULT '0' ,
  "is_qr_payment_enabled" INTEGER NOT NULL DEFAULT '0' ,
  "is_offline_payment_enabled" INTEGER NOT NULL DEFAULT '0' ,
  "offline_payment_detail" TEXT   ,
  "qr_code_image" TEXT   ,
  "flutterwave_status" INTEGER NOT NULL DEFAULT '0' ,
  "flutterwave_mode" TEXT NOT NULL DEFAULT 'test' ,
  "test_flutterwave_key" TEXT   ,
  "test_flutterwave_secret" TEXT   ,
  "test_flutterwave_hash" TEXT   ,
  "live_flutterwave_key" TEXT   ,
  "live_flutterwave_secret" TEXT   ,
  "live_flutterwave_hash" TEXT   ,
  "flutterwave_webhook_secret_hash" TEXT   ,
  "paypal_client_id" TEXT   ,
  "paypal_secret" TEXT   ,
  "paypal_status" INTEGER NOT NULL DEFAULT '0' ,
  "paypal_mode" TEXT NOT NULL DEFAULT 'sandbox' ,
  "sandbox_paypal_client_id" TEXT   ,
  "sandbox_paypal_secret" TEXT   ,
  "payfast_merchant_id" TEXT   ,
  "payfast_merchant_key" TEXT   ,
  "payfast_passphrase" TEXT   ,
  "payfast_mode" TEXT NOT NULL DEFAULT 'sandbox' ,
  "payfast_status" INTEGER NOT NULL DEFAULT '0' ,
  "test_payfast_merchant_id" TEXT   ,
  "test_payfast_merchant_key" TEXT   ,
  "test_payfast_passphrase" TEXT   ,
  "paystack_key" TEXT   ,
  "paystack_secret" TEXT   ,
  "paystack_merchant_email" TEXT   ,
  "paystack_status" INTEGER NOT NULL DEFAULT '0' ,
  "paystack_mode" TEXT NOT NULL DEFAULT 'sandbox' ,
  "test_paystack_key" TEXT   ,
  "test_paystack_secret" TEXT   ,
  "test_paystack_merchant_email" TEXT   ,
  "paystack_payment_url" TEXT  DEFAULT 'https://api.paystack.co' ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // payments
    `CREATE TABLE IF NOT EXISTS "payments" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "order_id" TEXT NOT NULL  ,
  "payment_method" TEXT NOT NULL DEFAULT 'cash' ,
  "amount" REAL NOT NULL  ,
  "balance" REAL  DEFAULT '0.00' ,
  "transaction_id" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // paypal_payments
    `CREATE TABLE IF NOT EXISTS "paypal_payments" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "paypal_payment_id" TEXT   ,
  "order_id" TEXT NOT NULL  ,
  "amount" REAL NOT NULL  ,
  "payment_status" TEXT NOT NULL DEFAULT 'pending' ,
  "payment_date" TEXT   ,
  "payment_error_response" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // paystack_payments
    `CREATE TABLE IF NOT EXISTS "paystack_payments" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "paystack_payment_id" TEXT   ,
  "order_id" TEXT NOT NULL  ,
  "amount" REAL NOT NULL  ,
  "payment_status" TEXT NOT NULL DEFAULT 'pending' ,
  "payment_date" TEXT   ,
  "payment_error_response" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // permissions
    `CREATE TABLE IF NOT EXISTS "permissions" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL  ,
  "guard_name" TEXT NOT NULL  ,
  "module_id" TEXT NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // personal_access_tokens
    `CREATE TABLE IF NOT EXISTS "personal_access_tokens" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "tokenable_type" TEXT NOT NULL  ,
  "tokenable_id" TEXT NOT NULL  ,
  "name" TEXT NOT NULL  ,
  "token" TEXT NOT NULL  ,
  "abilities" TEXT   ,
  "last_used_at" TEXT   ,
  "expires_at" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // printers
    `CREATE TABLE IF NOT EXISTS "printers" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT   ,
  "branch_id" INTEGER  ,
  "name" TEXT NOT NULL  ,
  "printing_choice" TEXT   ,
  "kots" TEXT   ,
  "orders" TEXT   ,
  "print_format" TEXT   ,
  "invoice_qr_code" INTEGER   ,
  "open_cash_drawer" TEXT   ,
  "ipv4_address" TEXT   ,
  "thermal_or_nonthermal" TEXT   ,
  "share_name" TEXT   ,
  "type" TEXT   ,
  "profile" TEXT   ,
  "is_active" INTEGER NOT NULL DEFAULT '1' ,
  "is_default" INTEGER NOT NULL DEFAULT '0' ,
  "char_per_line" INTEGER   ,
  "ip_address" TEXT   ,
  "port" INTEGER   ,
  "path" TEXT   ,
  "printer_name" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // purchase_order_items
    `CREATE TABLE IF NOT EXISTS "purchase_order_items" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "purchase_order_id" TEXT NOT NULL  ,
  "inventory_item_id" TEXT NOT NULL  ,
  "quantity" REAL NOT NULL  ,
  "received_quantity" REAL NOT NULL DEFAULT '0.00' ,
  "unit_price" REAL NOT NULL  ,
  "subtotal" REAL NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // purchase_orders
    `CREATE TABLE IF NOT EXISTS "purchase_orders" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "po_number" TEXT NOT NULL  ,
  "branch_id" INTEGER  ,
  "supplier_id" TEXT NOT NULL  ,
  "order_date" TEXT NOT NULL  ,
  "expected_delivery_date" TEXT   ,
  "total_amount" REAL NOT NULL DEFAULT '0.00' ,
  "status" TEXT NOT NULL DEFAULT 'draft' ,
  "notes" TEXT   ,
  "created_by" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // pusher_settings
    `CREATE TABLE IF NOT EXISTS "pusher_settings" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "beamer_status" INTEGER NOT NULL DEFAULT '0' ,
  "instance_id" TEXT   ,
  "beam_secret" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // razorpay_payments
    `CREATE TABLE IF NOT EXISTS "razorpay_payments" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "order_id" TEXT NOT NULL  ,
  "payment_date" TEXT   ,
  "amount" REAL   ,
  "payment_status" TEXT NOT NULL DEFAULT 'pending' ,
  "payment_error_response" TEXT   ,
  "razorpay_order_id" TEXT   ,
  "razorpay_payment_id" TEXT   ,
  "razorpay_signature" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // receipt_settings
    `CREATE TABLE IF NOT EXISTS "receipt_settings" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT   ,
  "show_customer_name" INTEGER NOT NULL DEFAULT '0' ,
  "show_customer_address" INTEGER NOT NULL DEFAULT '0' ,
  "show_table_number" INTEGER NOT NULL DEFAULT '0' ,
  "payment_qr_code" TEXT   ,
  "show_payment_qr_code" INTEGER NOT NULL DEFAULT '0' ,
  "show_waiter" INTEGER NOT NULL DEFAULT '0' ,
  "show_total_guest" INTEGER NOT NULL DEFAULT '0' ,
  "show_restaurant_logo" INTEGER NOT NULL DEFAULT '0' ,
  "show_tax" INTEGER NOT NULL DEFAULT '0' ,
  "show_payment_details" INTEGER NOT NULL DEFAULT '1' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // recipes
    `CREATE TABLE IF NOT EXISTS "recipes" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "menu_item_id" TEXT NOT NULL  ,
  "inventory_item_id" TEXT NOT NULL  ,
  "quantity" REAL NOT NULL DEFAULT '0.00' ,
  "unit_id" TEXT NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // reservation_settings
    `CREATE TABLE IF NOT EXISTS "reservation_settings" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "day_of_week" TEXT NOT NULL  ,
  "time_slot_start" TEXT NOT NULL  ,
  "time_slot_end" TEXT NOT NULL  ,
  "time_slot_difference" INTEGER NOT NULL  ,
  "slot_type" TEXT NOT NULL  ,
  "available" INTEGER NOT NULL DEFAULT '1' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // reservations
    `CREATE TABLE IF NOT EXISTS "reservations" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "table_id" TEXT   ,
  "customer_id" TEXT   ,
  "reservation_date_time" TEXT NOT NULL  ,
  "party_size" INTEGER NOT NULL  ,
  "special_requests" TEXT   ,
  "reservation_status" TEXT NOT NULL DEFAULT 'Confirmed' ,
  "reservation_slot_type" TEXT NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // restaurant_charges
    `CREATE TABLE IF NOT EXISTS "restaurant_charges" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT   ,
  "charge_name" TEXT NOT NULL  ,
  "charge_type" TEXT NOT NULL DEFAULT 'fixed' ,
  "charge_value" REAL   ,
  "order_types" TEXT NOT NULL  ,
  "is_enabled" INTEGER NOT NULL DEFAULT '1' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // restaurant_payments
    `CREATE TABLE IF NOT EXISTS "restaurant_payments" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT NOT NULL  ,
  "amount" REAL NOT NULL  ,
  "status" TEXT NOT NULL DEFAULT 'pending' ,
  "payment_source" TEXT NOT NULL DEFAULT 'official_site' ,
  "razorpay_order_id" TEXT   ,
  "razorpay_payment_id" TEXT   ,
  "razorpay_signature" TEXT   ,
  "transaction_id" TEXT   ,
  "payment_date_time" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "stripe_payment_intent" TEXT   ,
  "stripe_session_id" TEXT   ,
  "package_id" TEXT   ,
  "package_type" TEXT   ,
  "currency_id" TEXT   ,
  "flutterwave_transaction_id" TEXT   ,
  "flutterwave_payment_ref" TEXT   ,
  "paypal_payment_id" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // restaurant_taxes
    `CREATE TABLE IF NOT EXISTS "restaurant_taxes" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT NOT NULL  ,
  "tax_id" TEXT   ,
  "tax_name" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // restaurants
  `CREATE TABLE IF NOT EXISTS "restaurants" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "sub_domain" TEXT   ,
  "name" TEXT NOT NULL  ,
  "hash" TEXT   ,
  "address" TEXT   ,
  "phone_number" TEXT   ,
  "phone_code" TEXT   ,
  "email" TEXT   ,
  "timezone" TEXT NOT NULL  ,
  "theme_hex" TEXT NOT NULL  ,
  "theme_rgb" TEXT NOT NULL  ,
  "logo" TEXT   ,
  "country_id" TEXT NOT NULL  ,
  "hide_new_orders" INTEGER NOT NULL DEFAULT '0' ,
  "hide_new_reservations" INTEGER NOT NULL DEFAULT '0' ,
  "hide_new_waiter_request" INTEGER NOT NULL DEFAULT '0' ,
  "currency_id" TEXT   ,
  "license_type" TEXT NOT NULL DEFAULT 'free' ,
  "is_active" INTEGER NOT NULL DEFAULT '1' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "customer_login_required" INTEGER NOT NULL DEFAULT '0' ,
  "about_us" TEXT   ,
  "allow_customer_delivery_orders" INTEGER NOT NULL DEFAULT '1' ,
  "allow_customer_pickup_orders" INTEGER NOT NULL DEFAULT '1' ,
  "allow_customer_orders" INTEGER NOT NULL DEFAULT '1' ,
  "allow_dine_in_orders" INTEGER NOT NULL DEFAULT '1' ,
  "package_id" TEXT   ,
  "package_type" TEXT   ,
  "status" TEXT NOT NULL DEFAULT 'active' ,
  "license_expire_on" TEXT   ,
  "trial_ends_at" TEXT   ,
  "license_updated_at" TEXT   ,
  "subscription_updated_at" TEXT   ,
  "stripe_id" TEXT   ,
  "pm_type" TEXT   ,
  "pm_last_four" TEXT   ,
  "is_waiter_request_enabled" INTEGER NOT NULL DEFAULT '1' ,
  "default_table_reservation_status" TEXT NOT NULL DEFAULT 'Confirmed' ,
  "approval_status" TEXT NOT NULL DEFAULT 'Approved' ,
  "rejection_reason" TEXT   ,
  "facebook_link" TEXT   ,
  "instagram_link" TEXT   ,
  "twitter_link" TEXT   ,
  "yelp_link" TEXT   ,
  "table_required" INTEGER NOT NULL DEFAULT '0' ,
  "show_logo_text" INTEGER NOT NULL DEFAULT '1' ,
  "meta_keyword" TEXT   ,
  "meta_description" TEXT   ,
  "upload_fav_icon_android_chrome_192" TEXT   ,
  "upload_fav_icon_android_chrome_512" TEXT   ,
  "upload_fav_icon_apple_touch_icon" TEXT   ,
  "upload_favicon_16" TEXT   ,
  "upload_favicon_32" TEXT   ,
  "favicon" TEXT   ,
  "is_waiter_request_enabled_on_desktop" INTEGER NOT NULL DEFAULT '1' ,
  "is_waiter_request_enabled_on_mobile" INTEGER NOT NULL DEFAULT '1' ,
  "is_waiter_request_enabled_open_by_qr" INTEGER NOT NULL DEFAULT '0' ,
  "webmanifest" TEXT   ,
  "enable_tip_shop" INTEGER NOT NULL DEFAULT '1' ,
  "enable_tip_pos" INTEGER NOT NULL DEFAULT '1' ,
  "is_pwa_install_alert_show" INTEGER NOT NULL DEFAULT '1' ,
  "auto_confirm_orders" INTEGER NOT NULL DEFAULT '0' ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,
    // roles
    `CREATE TABLE IF NOT EXISTS "roles" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL  ,
  "display_name" TEXT   ,
  "guard_name" TEXT NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "restaurant_id" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // sessions
    `CREATE TABLE IF NOT EXISTS "sessions" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "user_id" TEXT   ,
  "ip_address" TEXT   ,
  "user_agent" TEXT   ,
  "payload" TEXT NOT NULL  ,
  "last_activity" INTEGER NOT NULL  ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // split_order_items
    `CREATE TABLE IF NOT EXISTS "split_order_items" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "split_order_id" TEXT NOT NULL  ,
  "order_item_id" TEXT NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // split_orders
    `CREATE TABLE IF NOT EXISTS "split_orders" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "order_id" TEXT NOT NULL  ,
  "amount" REAL NOT NULL  ,
  "status" TEXT NOT NULL DEFAULT 'pending' ,
  "payment_method" TEXT NOT NULL DEFAULT 'cash' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // stripe_payments
    `CREATE TABLE IF NOT EXISTS "stripe_payments" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "order_id" TEXT NOT NULL  ,
  "payment_date" TEXT   ,
  "amount" REAL   ,
  "payment_status" TEXT NOT NULL DEFAULT 'pending' ,
  "payment_error_response" TEXT   ,
  "stripe_payment_intent" TEXT   ,
  "stripe_session_id" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // sub_domain_module_settings
    `CREATE TABLE IF NOT EXISTS "sub_domain_module_settings" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "license_type" TEXT   ,
  "purchase_code" TEXT   ,
  "purchased_on" TEXT   ,
  "supported_until" TEXT   ,
  "banned_subdomain" TEXT   ,
  "notify_update" INTEGER NOT NULL DEFAULT '1' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // superadmin_payment_gateways
    `CREATE TABLE IF NOT EXISTS "superadmin_payment_gateways" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "razorpay_type" TEXT NOT NULL DEFAULT 'test' ,
  "test_razorpay_key" TEXT   ,
  "test_razorpay_secret" TEXT   ,
  "razorpay_test_webhook_key" TEXT   ,
  "live_razorpay_key" TEXT   ,
  "live_razorpay_secret" TEXT   ,
  "razorpay_live_webhook_key" TEXT   ,
  "razorpay_status" INTEGER NOT NULL DEFAULT '0' ,
  "stripe_type" TEXT NOT NULL DEFAULT 'test' ,
  "test_stripe_key" TEXT   ,
  "test_stripe_secret" TEXT   ,
  "stripe_test_webhook_key" TEXT   ,
  "live_stripe_key" TEXT   ,
  "live_stripe_secret" TEXT   ,
  "stripe_live_webhook_key" TEXT   ,
  "stripe_status" INTEGER NOT NULL DEFAULT '0' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "flutterwave_status" INTEGER NOT NULL DEFAULT '0' ,
  "flutterwave_type" TEXT NOT NULL DEFAULT 'test' ,
  "test_flutterwave_key" TEXT   ,
  "test_flutterwave_secret" TEXT   ,
  "test_flutterwave_hash" TEXT   ,
  "flutterwave_test_webhook_key" TEXT   ,
  "live_flutterwave_key" TEXT   ,
  "live_flutterwave_secret" TEXT   ,
  "live_flutterwave_hash" TEXT   ,
  "flutterwave_live_webhook_key" TEXT   ,
  "live_paypal_client_id" TEXT   ,
  "live_paypal_secret" TEXT   ,
  "test_paypal_client_id" TEXT   ,
  "test_paypal_secret" TEXT   ,
  "paypal_status" INTEGER NOT NULL DEFAULT '0' ,
  "paypal_mode" TEXT NOT NULL DEFAULT 'sandbox' ,
  "payfast_merchant_id" TEXT   ,
  "payfast_merchant_key" TEXT   ,
  "payfast_passphrase" TEXT   ,
  "test_payfast_merchant_id" TEXT   ,
  "test_payfast_merchant_key" TEXT   ,
  "test_payfast_passphrase" TEXT   ,
  "payfast_mode" TEXT NOT NULL DEFAULT 'sandbox' ,
  "payfast_status" INTEGER NOT NULL DEFAULT '0' ,
  "live_paystack_key" TEXT   ,
  "live_paystack_secret" TEXT   ,
  "live_paystack_merchant_email" TEXT   ,
  "test_paystack_key" TEXT   ,
  "test_paystack_secret" TEXT   ,
  "test_paystack_merchant_email" TEXT   ,
  "paystack_payment_url" TEXT  DEFAULT 'https://api.paystack.co' ,
  "paystack_status" INTEGER NOT NULL DEFAULT '0' ,
  "paystack_mode" TEXT NOT NULL DEFAULT 'sandbox' ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // suppliers
    `CREATE TABLE IF NOT EXISTS "suppliers" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT NOT NULL  ,
  "name" TEXT NOT NULL  ,
  "phone" TEXT   ,
  "email" TEXT   ,
  "address" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // tables
    `CREATE TABLE IF NOT EXISTS "tables" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "table_code" TEXT NOT NULL  ,
  "hash" TEXT NOT NULL  ,
  "status" TEXT NOT NULL DEFAULT 'active' ,
  "available_status" TEXT NOT NULL DEFAULT 'available' ,
  "area_id" TEXT NOT NULL  ,
  "seating_capacity" TEXT NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // taxes
    `CREATE TABLE IF NOT EXISTS "taxes" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT   ,
  "tax_name" TEXT NOT NULL  ,
  "tax_percent" REAL NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // units
    `CREATE TABLE IF NOT EXISTS "units" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "name" TEXT NOT NULL  ,
  "symbol" TEXT NOT NULL  ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // users
    `CREATE TABLE IF NOT EXISTS "users" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "restaurant_id" TEXT   ,
  "branch_id" INTEGER  ,
  "name" TEXT NOT NULL  ,
  "email" TEXT NOT NULL  ,
  "phone_number" TEXT   ,
  "phone_code" TEXT   ,
  "email_verified_at" TEXT   ,
  "password" TEXT NOT NULL  ,
  "two_factor_secret" TEXT   ,
  "two_factor_recovery_codes" TEXT   ,
  "two_factor_confirmed_at" TEXT   ,
  "remember_token" TEXT   ,
  "current_team_id" TEXT   ,
  "profile_photo_path" TEXT   ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "locale" TEXT NOT NULL DEFAULT 'en' ,
  "stripe_id" TEXT   ,
  "pm_type" TEXT   ,
  "pm_last_four" TEXT   ,
  "trial_ends_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

    // waiter_requests
    `CREATE TABLE IF NOT EXISTS "waiter_requests" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "branch_id" INTEGER  ,
  "table_id" TEXT NOT NULL  ,
  "status" TEXT NOT NULL DEFAULT 'pending' ,
  "created_at" TEXT   ,
  "updated_at" TEXT   ,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,

 `CREATE TABLE IF NOT EXISTS "desktop_applications" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "windows_file_path" TEXT,
  "mac_intel_file_path" TEXT,
  "linux_file_path" TEXT,
  "mac_silicon_file_path" TEXT,
  "created_at" TEXT,
  "updated_at" TEXT,
  "newfield1" TEXT,
  "newfield2" TEXT,
  "newfield3" TEXT,
  "isSync" BOOLEAN DEFAULT 0
);`,
// sync_table
  `CREATE TABLE IF NOT EXISTS "sync_table" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "table_name" TEXT NOT NULL  ,
  "sync_at" TEXT  
);`
  ];

  queries.forEach((query) => {
    db.prepare(query).run();
  });

// --- SEED DATA ---
// Insert default data
const inserts = [
  // 1. countries
  `INSERT OR IGNORE INTO "countries" (id, countries_code, countries_name, phonecode, isSync)
   VALUES (236, 'US', 'United States', '+1', 0);`,

  // 2. currencies
  `INSERT OR IGNORE INTO "currencies" (id, restaurant_id, currency_name, currency_code, currency_symbol, currency_position, no_of_decimal, thousand_separator, decimal_separator, exchange_rate, usd_price, is_cryptocurrency, isSync)
   VALUES (1, NULL, 'US Dollar', 'USD', '$', 'left', '2', ',', '.', 1.0, 1.0, 'no', 0);`,
   
`INSERT OR IGNORE INTO global_currencies (id, currency_name, currency_symbol, currency_code, exchange_rate, usd_price, status, created_at, updated_at, isSync)
   VALUES (1, 'US Dollar', '$', 'USD', 1.0, 1.0, 'enable', '2025-05-19 14:51:05', '2025-05-19 14:51:05', 0);`,

  // 3. packages
  `INSERT OR IGNORE INTO "packages" (id, package_name, price, created_at, updated_at, currency_id, description, billing_cycle, isSync)
   VALUES (3, 'Lifetime', 0.0, '2025-05-19 14:51:11', '2025-05-19 14:51:11', 1, 'Lifetime access plan', 'lifetime', 0);`,

  // 4. restaurants
  `INSERT OR IGNORE INTO "restaurants" (id, sub_domain, name, hash, email, timezone, theme_hex, theme_rgb, logo, country_id, currency_id, package_id, status, isSync)
   VALUES (1, 'restrofox.restrofox.com', 'Restrofox', 'restrofox', 'contact-restrofox@devotrend.com', 'America/New_York', '#000080', '0,0,128', 'logo.svg', 236, 1, 3, 'active', 0);`,

  // 5. branches
  `INSERT OR IGNORE INTO "branches" (id, restaurant_id, name, address, isSync)
   VALUES (1, 1, 'RestroFox', 'Dubai, UAE', 0);`
];
// inserts.forEach(sql => {
//   db.prepare(sql).run();
// });


  console.log("Database initialized at:", dbFilePath);
}


//set branch id
let currentBranchId = 1; // Default fallback

ipcMain.on("set-branch-id", (event, id) => {
  currentBranchId = id;
store.set("branchId", id);});


// Listen for login data
ipcMain.handle("store:setLogin", (event, { branchId, token,name }) => {
  if (branchId === null || branchId === undefined) {
    store.delete("branchId");   // safe clear
  } else {
    store.set("branchId", branchId);
  }

  store.set("token", token || ""); // ensure token is string
  store.set("name", name || "");
  return true;
});

ipcMain.handle("store:logout", () => {
  store.delete("token");
  store.delete("branchId");
  store.delete("restaurantId");
  store.delete("user");
  return true;
});

ipcMain.handle("store:get", (event, key) => {
  return store.get(key);
});

ipcMain.handle("get-uploads-path", (event, filename) => {
  if (!filename) return null;

  // Point to public/upload/menu/
  const filePath = path.join(__dirname, "public", "upload", "menu", filename);

  // Check if file exists before returning
  if (fs.existsSync(filePath)) {
    return filePath;
  } else {
    return null; // File not found
  }
});
// App lifecycle
app.whenReady().then(() => {
  initDatabase();
  registerCategoryRoutes(); // ✅ Register Category IPC
  modifierRoutes();
  modifierGroupRoutes();
  menuItemRoutes();
  menuRoutes();
  loginRoute();
  branchBackupRoutes();
  countryRoutes();
  currencyRoutes();
  globalCurrencyRoutes();
  packageRoutes();
  restaurantBackupRoutes();
  backupRoutes();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
