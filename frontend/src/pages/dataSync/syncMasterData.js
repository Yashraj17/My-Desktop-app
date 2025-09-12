import axios from "axios";
import { syncMenus } from "../dataSync/syncMenus"; // ✅ import sync
import { syncArea } from "../dataSync/syncArea";
import { syncBranchDeliverySettings } from "../dataSync/syncBranchDeliverySettings";
import { syncContacts } from "../dataSync/syncContacts";
import { syncCustomers } from "../dataSync/syncCustomers";
import { syncDeliveryExecutives } from "../dataSync/syncDeliveryExecutives";
import { syncDesktopApplications } from "../dataSync/syncDesktopApplications";
import { syncEmailSettings } from "../dataSync/syncEmailSettings";
import { syncExpenseCategories } from "../dataSync/syncExpenseCategories";
import { syncExpenses } from "../dataSync/syncExpenses";
import { syncMenuItems } from "../dataSync/syncMenuItems";
import { syncMenuCategories } from "../dataSync/syncMenuCategories";
import { syncModifiers } from "../dataSync/syncModifiers";
import { syncFailedJobs } from "../dataSync/syncFailedJobs";
import { syncFileStorage } from "../dataSync/syncFileStorage";
import { syncFileStorageSettings } from "../dataSync/syncFileStorageSettings";
import { syncFlags } from "../dataSync/syncFlags";
import { syncTables } from "../dataSync/syncTables";
import { syncInventorySettings } from "../dataSync/syncInventorySettings";
import { syncInventoryStocks } from "../dataSync/syncInventoryStocks";
import { syncInventoryMovements } from "../dataSync/syncInventoryMovements";
import { syncInventoryItemCategories } from "../dataSync/syncInventoryItemCategories";
import { syncInventoryItems } from "../dataSync/syncInventoryItems";
import { syncInventoryGlobalSettings } from "../dataSync/syncInventoryGlobalSettings";
import { syncFrontDetails } from "../dataSync/syncFrontDetails";
import { syncFrontFaqSettings } from "../dataSync/syncFrontFaqSettings";
import { syncFrontFeatures } from "../dataSync/syncFrontFeatures";
import { syncFrontReviewSettings } from "../dataSync/syncFrontReviewSettings";
import { syncGlobalInvoices } from "../dataSync/syncGlobalInvoices";
import { syncGlobalSettings } from "../dataSync/syncGlobalSettings";
import { syncGlobalSubscriptions } from "../dataSync/syncGlobalSubscriptions";
import { syncJobs } from "../dataSync/syncJobs";
import { syncJobBatches } from "../dataSync/syncJobBatches";
import { syncKots } from "../dataSync/syncKots";
import { syncKotCancelReasons } from "../dataSync/syncKotCancelReasons";
import { syncKotPlaces } from "../dataSync/syncKotPlaces";
import { syncKotSettings } from "../dataSync/syncKotSettings";
import { syncLanguageSettings } from "../dataSync/syncLanguageSettings";
import { syncLtmTranslations } from "../dataSync/syncLtmTranslations";
import { syncMigrations } from "../dataSync/syncMigrations";
import { syncModelHasPermissions } from "../dataSync/syncModelHasPermissions";
import { syncModelHasRoles } from "../dataSync/syncModelHasRoles";
import { syncModules } from "../dataSync/syncModules";
import { syncNotificationSettings } from "../dataSync/syncNotificationSettings";
import { syncOfflinePaymentMethods } from "../dataSync/syncOfflinePaymentMethods";
import { syncOfflinePlanChanges } from "../dataSync/syncOfflinePlanChanges";
import { syncOnboardingSteps } from "../dataSync/syncOnboardingSteps";
import { syncOrders } from "../dataSync/syncOrders";
import { syncPackageModules } from "../dataSync/syncPackageModules";
import { syncPasswordResetTokens } from "../dataSync/syncPasswordResetTokens";
import { syncPayments } from "../dataSync/syncPayments";
import { syncPaymentsBackup } from "../dataSync/syncPaymentsBackup";
import { syncPaymentMethods } from "../dataSync/syncPaymentMethods";
import { syncPaypalPayments } from "../dataSync/syncPaypalPayments";
import { syncPaystackPayments } from "../dataSync/syncPaystackPayments";
import { syncPermissions } from "../dataSync/syncPermissions";
import { syncPersonalAccessTokens } from "../dataSync/syncPersonalAccessTokens";
import { syncPosRegisters } from "../dataSync/syncPosRegisters";

function createApi(subdomain, token) {
  return axios.create({
    baseURL: subdomain,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
}

export async function syncMasterData(subdomain, token, setProgress, setStatus, user,fromDatetime,toDatetime) {
  const api = createApi(subdomain, token);

  try {
    let progress = 0;
    const totalSteps = 90;
    const updateProgress = () => {
      if (setProgress) {
        progress += (1 / totalSteps) * 100;
        setProgress(Math.min(100, Math.round(progress)));
      }
      
    };

    async function getLastSyncTime(tableName, defaultFromDatetime) {
  try {
    // Call backend (or preload API in Electron)
    const lastSync = await window.api.getSyncTime(tableName);

    if (lastSync && lastSync.sync_at) {
      return lastSync.sync_at;  // ✅ Use stored sync time
    } else {
      return defaultFromDatetime; // ✅ Fallback if no entry
    }
  } catch (error) {
    console.error("Error getting last sync time:", error);
    return defaultFromDatetime;
  }
}


    // 1. COUNTRIES
    setStatus?.("Syncing countries...");
    const lastSyncCountries = await getLastSyncTime("countries", fromDatetime);
    console.log("Syncing countries from:", lastSyncCountries);
    const countryRes = await api.get("/api/countries");
    if (countryRes.data.status) {
      for (let c of countryRes.data.data) {
        await window.api.addCountryBackup({
          id: c.id,
          countries_code: c.countries_code,
          countries_name: c.countries_name,
          phonecode: c.phonecode,
          isSync: 1,
        });
      }
      await window.api.saveSyncTime("countries", toDatetime);
      updateProgress();
    }

    // 2. GLOBAL CURRENCIES
    setStatus?.("Syncing global currencies...");
    const globalCurrencyRes = await api.get("/api/global-currencies");
    if (globalCurrencyRes.data.status) {
      for (let cu of globalCurrencyRes.data.data) {
        await window.api.addGlobalCurrencyBackup({
          id: cu.id,
          currency_name: cu.currency_name,
          currency_symbol: cu.currency_symbol,
          currency_code: cu.currency_code,
          exchange_rate: cu.exchange_rate,
          usd_price: cu.usd_price,
          status: "enable",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          isSync: 1,
        });
      }
      await window.api.saveSyncTime("global_currencies", toDatetime);
      updateProgress();
    }

    // 3. PACKAGES
    setStatus?.("Syncing packages...");
    const packageRes = await api.get("/api/packages");
    if (packageRes.data.status) {
      for (let p of packageRes.data.data) {
        await window.api.addPackageBackup({
          id: p.id,
          package_name: p.package_name,
          price: p.price,
          created_at: p.created_at,
          updated_at: p.updated_at,
          currency_id: p.currency_id,
          description: p.description,
          billing_cycle: p.billing_cycle,
          isSync: 1,
        });
      }
      await window.api.saveSyncTime("packages", toDatetime);
      updateProgress();
    }

    // 4. RESTAURANTS
    setStatus?.("Syncing restaurant info...");
    const restaurantRes = await api.get(`/api/restaurants?id=${user.restaurant_id}`);
    if (restaurantRes.data.status) {
      for (let r of restaurantRes.data.data) {
        await window.api.addRestaurantBackup({
          id: r.id,
          sub_domain: r.sub_domain,
          name: r.name,
          hash: r.hash,
          email: r.email,
          timezone: r.timezone,
          theme_hex: r.theme_hex,
          theme_rgb: r.theme_rgb,
          logo: r.logo,
          country_id: r.country_id,
          currency_id: r.currency_id,
          package_id: r.package_id,
          status: r.status,
          created_at: r.created_at,
          updated_at: r.updated_at,
          isSync: 1,
        });
      }
      await window.api.saveSyncTime("restaurants", toDatetime);
      updateProgress();
    }

    // 5. RESTAURANT CURRENCIES
    setStatus?.("Syncing restaurant currencies...");
    const restaurantCurrencyRes = await api.get(`/api/currencies?restaurant_id=${user.restaurant_id}`);
    if (restaurantCurrencyRes.data.status) {
      for (let cu of restaurantCurrencyRes.data.data) {
        await window.api.addCurrencyBackup({
          id: cu.id,
          restaurant_id: cu.restaurant_id,
          currency_name: cu.currency_name,
          currency_code: cu.currency_code,
          currency_symbol: cu.currency_symbol,
          currency_position: cu.currency_position,
          no_of_decimal: cu.no_of_decimal,
          thousand_separator: cu.thousand_separator,
          decimal_separator: cu.decimal_separator,
          exchange_rate: cu.exchange_rate,
          usd_price: cu.usd_price,
          is_cryptocurrency: cu.is_cryptocurrency,
          isSync: 1,
        });
      }
      await window.api.saveSyncTime("currencies", toDatetime);
      updateProgress();
    }

    // 6. BRANCHES
    setStatus?.("Syncing branches...");
    const branchRes = await api.get(`/api/branches?restaurant_id=${user.restaurant_id}`);
    if (branchRes.data.status) {
      for (let b of branchRes.data.data) {
        await window.api.addBranchBackup({
          id: b.id,
          restaurant_id: b.restaurant_id,
          name: b.name,
          address: b.address,
          created_at: b.created_at,
          updated_at: b.updated_at,
          isSync: 1,
        });
      }
    await window.api.saveSyncTime("branches", toDatetime);
      updateProgress();
    }

    // 7. MENUS
    if(user.branch_id)
    {
    setStatus?.("Syncing menus...");
    const lastDatetime = await getLastSyncTime("menus", fromDatetime);
    console.log("Syncing menus from:", lastDatetime);
    await syncMenus(subdomain, user.branch_id, token,lastDatetime,toDatetime,setProgress, setStatus);
    updateProgress();
    }

    // area 
    if(user.branch_id)
    {
    setStatus?.("Syncing area...");
    const lastDatetime = await getLastSyncTime("areas", fromDatetime);
    console.log("Syncing areas from:", lastDatetime);
    await syncArea(subdomain, user.branch_id, token,lastDatetime,toDatetime, setProgress, setStatus);
    updateProgress();
    }
     //syncBranchDeliverySettings 
    if(user.branch_id)
    {
    setStatus?.("Syncing branch delivery setting...");
    const lastDatetime = await getLastSyncTime("branch_delivery_settings", fromDatetime);
    console.log("Syncing branch_delivery_settings from:", lastDatetime);
    await syncBranchDeliverySettings(subdomain, user.branch_id, token,lastDatetime,toDatetime, setProgress, setStatus);
    updateProgress();
    }

    //syncContacts
     setStatus?.("Syncing contacts...");
     const lastDatetime = await getLastSyncTime("contacts", fromDatetime);
    console.log("Syncing contacts from:", lastDatetime);
    await syncContacts(subdomain, user.branch_id, token,lastDatetime,toDatetime, setProgress, setStatus);
    updateProgress();

   //syncCustomers 
    if(user.restaurant_id)
    {
    setStatus?.("Syncing customer...");
    const lastDatetime = await getLastSyncTime("customers", fromDatetime);
    console.log("Syncing customers from:", lastDatetime);
    await syncCustomers(subdomain, user.restaurant_id, token,lastDatetime,toDatetime, setProgress, setStatus);
    updateProgress();
    }

     //syncDeliveryExecutives 
    if(user.branch_id)
    {
    setStatus?.("Syncing delivery executives...");
    const lastDatetime = await getLastSyncTime("delivery_executives", fromDatetime);
    console.log("Syncing delivery_executives from:", lastDatetime);
    await syncDeliveryExecutives(subdomain, user.branch_id, token,lastDatetime,toDatetime, setProgress, setStatus);
    updateProgress();
    }

    //syncDesktopApplications
    setStatus?.("Syncing dsektop application...");
    const lastDatetimed = await getLastSyncTime("desktop_applications", fromDatetime);
    console.log("Syncing desktop_applications from:", lastDatetime);
    await syncDesktopApplications(subdomain, user.branch_id, token,lastDatetimed,toDatetime,setProgress, setStatus);
    updateProgress();

    //syncEmailSettings
     setStatus?.("Syncing email setting...");
     const lastDatetimee= await getLastSyncTime("email_settings", fromDatetime);
    console.log("Syncing email_settings from:", lastDatetimee);
    await syncEmailSettings(subdomain, user.branch_id, token,lastDatetimee,toDatetime, setProgress, setStatus);
    updateProgress();

   // syncExpenseCategories
if (user.branch_id) {
  setStatus?.("Syncing expense category...");
  const lastExpenseCategory = await getLastSyncTime("expense_categories", fromDatetime);
  await syncExpenseCategories(subdomain, user.branch_id, token, lastExpenseCategory, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncExpenses
if (user.branch_id) {
  setStatus?.("Syncing expense...");
  const lastExpenses = await getLastSyncTime("expenses", fromDatetime);
  await syncExpenses(subdomain, user.branch_id, token, lastExpenses, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncMenuItems
if (user.branch_id) {
  setStatus?.("Syncing menu items...");
  const lastMenuItems = await getLastSyncTime("menu_items", fromDatetime);
  await syncMenuItems(subdomain, user.branch_id, token, lastMenuItems, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncMenuCategories
if (user.branch_id) {
  setStatus?.("Syncing menu categories...");
  const lastMenuCategories = await getLastSyncTime("menu_categories", fromDatetime);
  await syncMenuCategories(subdomain, user.branch_id, token, lastMenuCategories, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncModifiers
if (user.branch_id) {
  setStatus?.("Syncing item modifiers...");
  const lastModifiers = await getLastSyncTime("item_modifiers", fromDatetime);
  await syncModifiers(subdomain, user.branch_id, token, lastModifiers, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncFailedJobs
setStatus?.("Syncing failed jobs...");
const lastFailedJobs = await getLastSyncTime("failed_jobs", fromDatetime);
await syncFailedJobs(subdomain, token, user.branch_id, lastFailedJobs, toDatetime, setProgress, setStatus);
updateProgress();

// syncFileStorage
if (user.restaurant_id) {
  setStatus?.("Syncing file storage...");
  const lastFileStorage = await getLastSyncTime("file_storage", fromDatetime);
  await syncFileStorage(subdomain, user.restaurant_id, token, lastFileStorage, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncFileStorageSettings
setStatus?.("Syncing file storage setting...");
const lastFileStorageSettings = await getLastSyncTime("file_storage_settings", fromDatetime);
await syncFileStorageSettings(subdomain, token, lastFileStorageSettings, toDatetime, user.restaurant_id, setProgress, setStatus);
updateProgress();

// syncFlags
setStatus?.("Syncing flags...");
const lastFlags = await getLastSyncTime("flags", fromDatetime);
await syncFlags(subdomain, token, user.restaurant_id, lastFlags, toDatetime, setProgress, setStatus);
updateProgress();

// syncTables
if (user.branch_id) {
  setStatus?.("Syncing table...");
  const lastTables = await getLastSyncTime("tables", fromDatetime);
  await syncTables(subdomain, user.branch_id, token, lastTables, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncInventorySettings
if (user.restaurant_id) {
  setStatus?.("Syncing inventory setting...");
  const lastInvSettings = await getLastSyncTime("inventory_settings", fromDatetime);
  await syncInventorySettings(subdomain, user.restaurant_id, token, lastInvSettings, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncInventoryStocks
if (user.branch_id) {
  setStatus?.("Syncing inventory stocks...");
  const lastInvStocks = await getLastSyncTime("inventory_stocks", fromDatetime);
  await syncInventoryStocks(subdomain, user.branch_id, token, lastInvStocks, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncInventoryMovements
if (user.branch_id) {
  setStatus?.("Syncing inventory movements...");
  const lastInvMovements = await getLastSyncTime("inventory_movements", fromDatetime);
  await syncInventoryMovements(subdomain, user.branch_id, token, lastInvMovements, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncInventoryItemCategories
if (user.branch_id) {
  setStatus?.("Syncing inventory item categories...");
  const lastInvItemCategories = await getLastSyncTime("inventory_item_categories", fromDatetime);
  await syncInventoryItemCategories(subdomain, user.branch_id, token, lastInvItemCategories, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncInventoryItems
if (user.branch_id) {
  setStatus?.("Syncing inventory items...");
  const lastInvItems = await getLastSyncTime("inventory_items", fromDatetime);
  await syncInventoryItems(subdomain, user.branch_id, token, lastInvItems, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncInventoryGlobalSettings
setStatus?.("Syncing inventory global setting...");
const lastInvGlobalSettings = await getLastSyncTime("inventory_global_settings", fromDatetime);
await syncInventoryGlobalSettings(subdomain, token, user.branch_id, lastInvGlobalSettings, toDatetime, setProgress, setStatus);
updateProgress();

// syncFrontDetails
setStatus?.("Syncing front details...");
const lastFrontDetails = await getLastSyncTime("front_details", fromDatetime);
await syncFrontDetails(subdomain, token, user.branch_id, lastFrontDetails, toDatetime, setProgress, setStatus);
updateProgress();

// syncFrontFaqSettings
setStatus?.("Syncing front faq setting...");
const lastFrontFaq = await getLastSyncTime("front_faq_settings", fromDatetime);
await syncFrontFaqSettings(subdomain, token, user.branch_id, lastFrontFaq, toDatetime, setProgress, setStatus);
updateProgress();

// syncFrontFeatures
setStatus?.("Syncing front features...");
const lastFrontFeatures = await getLastSyncTime("front_features", fromDatetime);
await syncFrontFeatures(subdomain, token, user.branch_id, lastFrontFeatures, toDatetime, setProgress, setStatus);
updateProgress();

// syncFrontReviewSettings
setStatus?.("Syncing front review setting...");
const lastFrontReview = await getLastSyncTime("front_review_settings", fromDatetime);
await syncFrontReviewSettings(subdomain, token, user.branch_id, lastFrontReview, toDatetime, setProgress, setStatus);
updateProgress();

// syncGlobalInvoices
if (user.restaurant_id) {
  setStatus?.("Syncing global invoices...");
  const lastGlobalInvoices = await getLastSyncTime("global_invoices", fromDatetime);
  await syncGlobalInvoices(subdomain, user.restaurant_id, token, lastGlobalInvoices, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncGlobalSettings
setStatus?.("Syncing global setting...");
const lastGlobalSettings = await getLastSyncTime("global_settings", fromDatetime);
await syncGlobalSettings(subdomain, token, user.restaurant_id, lastGlobalSettings, toDatetime, setProgress, setStatus);
updateProgress();

// syncGlobalSubscriptions
if (user.restaurant_id) {
  setStatus?.("Syncing global subscriptions...");
  const lastGlobalSubs = await getLastSyncTime("global_subscriptions", fromDatetime);
  await syncGlobalSubscriptions(subdomain, user.restaurant_id, token, lastGlobalSubs, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncJobs
if (user.branch_id) {
  setStatus?.("Syncing jobs...");
  const lastJobs = await getLastSyncTime("jobs", fromDatetime);
  await syncJobs(subdomain, user.branch_id, token, lastJobs, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncJobBatches
if (user.branch_id) {
  setStatus?.("Syncing job batches...");
  const lastJobBatches = await getLastSyncTime("job_batches", fromDatetime);
  await syncJobBatches(subdomain, user.branch_id, token, lastJobBatches, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncKots
if (user.branch_id) {
  setStatus?.("Syncing kots...");
  const lastKots = await getLastSyncTime("kots", fromDatetime);
  await syncKots(subdomain, user.branch_id, token, lastKots, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncKotCancelReasons
if (user.restaurant_id) {
  setStatus?.("Syncing kot cancel reasons...");
  const lastKotCancel = await getLastSyncTime("kot_cancel_reasons", fromDatetime);
  await syncKotCancelReasons(subdomain, user.restaurant_id, token, lastKotCancel, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncKotPlaces
if (user.branch_id) {
  setStatus?.("Syncing kot places...");
  const lastKotPlaces = await getLastSyncTime("kot_places", fromDatetime);
  await syncKotPlaces(subdomain, user.branch_id, token, lastKotPlaces, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncKotSettings
if (user.branch_id) {
  setStatus?.("Syncing kot settings...");
  const lastKotSettings = await getLastSyncTime("kot_settings", fromDatetime);
  await syncKotSettings(subdomain, user.branch_id, token, lastKotSettings, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncLanguageSettings
setStatus?.("Syncing language settings...");
const lastLangSettings = await getLastSyncTime("language_settings", fromDatetime);
await syncLanguageSettings(subdomain, token, user.branch_id, lastLangSettings, toDatetime, setProgress, setStatus);
updateProgress();

// syncLtmTranslations
setStatus?.("Syncing ltm translations...");
const lastTranslations = await getLastSyncTime("ltm_translations", fromDatetime);
await syncLtmTranslations(subdomain, token, user.branch_id, lastTranslations, toDatetime, setProgress, setStatus);
updateProgress();

// syncMigrations
setStatus?.("Syncing migrations...");
const lastMigrations = await getLastSyncTime("migrations", fromDatetime);
await syncMigrations(subdomain, token, user.branch_id, lastMigrations, toDatetime, setProgress, setStatus);
updateProgress();

// syncModelHasPermissions
setStatus?.("Syncing model has permissions...");
const lastModelPerms = await getLastSyncTime("model_has_permissions", fromDatetime);
await syncModelHasPermissions(subdomain, token, user.branch_id, lastModelPerms, toDatetime, setProgress, setStatus);
updateProgress();

// syncModelHasRoles
setStatus?.("Syncing model has roles...");
const lastModelRoles = await getLastSyncTime("model_has_roles", fromDatetime);
await syncModelHasRoles(subdomain, token, user.branch_id, lastModelRoles, toDatetime, setProgress, setStatus);
updateProgress();

// syncModules
setStatus?.("Syncing modules...");
const lastModules = await getLastSyncTime("modules", fromDatetime);
await syncModules(subdomain, token, user.branch_id, lastModules, toDatetime, setProgress, setStatus);
updateProgress();

// syncNotificationSettings
if (user.restaurant_id) {
  setStatus?.("Syncing notification settings...");
  const lastNotifSettings = await getLastSyncTime("notification_settings", fromDatetime);
  await syncNotificationSettings(subdomain, user.restaurant_id, token, lastNotifSettings, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncOfflinePaymentMethods
if (user.restaurant_id) {
  setStatus?.("Syncing offline payment methods...");
  const lastOfflinePay = await getLastSyncTime("offline_payment_methods", fromDatetime);
  await syncOfflinePaymentMethods(subdomain, user.restaurant_id, token, lastOfflinePay, toDatetime, setProgress, setStatus);
  updateProgress();
}

// syncOfflinePlanChanges
setStatus?.("Syncing offline plan changes...");
const lastOfflinePlans = await getLastSyncTime("offline_plan_changes", fromDatetime);
await syncOfflinePlanChanges(subdomain, token, user.restaurant_id, lastOfflinePlans, toDatetime, setProgress, setStatus);
updateProgress();

// syncOnboardingSteps
if (user.branch_id) {
  setStatus?.("Syncing onboarding steps...");
  const lastOnboarding = await getLastSyncTime("onboarding_steps", fromDatetime);
  await syncOnboardingSteps(subdomain, user.branch_id, token, lastOnboarding, toDatetime, setProgress, setStatus);
  updateProgress();
}
//syncOrders
if (user.branch_id) {
 setStatus?.("Syncing orders...");
  const lastorders = await getLastSyncTime("orders", fromDatetime);
  await syncOrders(subdomain,user.branch_id, token, lastorders, toDatetime, setProgress, setStatus);
  updateProgress();
}

//syncPackageModules
 setStatus?.("Syncing package_modules...");
  const lastorders = await getLastSyncTime("package_modules", fromDatetime);
  await syncPackageModules(subdomain,token, lastorders, toDatetime, setProgress, setStatus);
  updateProgress();


   setStatus?.("Syncing password reset tokens...");
  const lastsyncPasswordResetTokens = await getLastSyncTime("password_reset_tokens", fromDatetime);
  await syncPasswordResetTokens(subdomain,token, lastsyncPasswordResetTokens, toDatetime, setProgress, setStatus);
  updateProgress();
  

  //syncPayments
  if (user.branch_id) {
 setStatus?.("Syncing payment...");
  const lastorders = await getLastSyncTime("payments", fromDatetime);
  await syncPayments(subdomain,user.branch_id, token, lastorders, toDatetime, setProgress, setStatus);
  updateProgress();
}

//syncPaymentsBackup
if (user.branch_id) {
 setStatus?.("Syncing payment backup...");
  const lastorders = await getLastSyncTime("payments_backup", fromDatetime);
  await syncPaymentsBackup(subdomain,user.branch_id, token, lastorders, toDatetime, setProgress, setStatus);
  updateProgress();
}
//syncPaymentMethods
if (user.restaurant_id) {
  setStatus?.("Syncing payment methods...");
  const lastPay = await getLastSyncTime("payment_methods", fromDatetime);
  await syncPaymentMethods(subdomain, user.restaurant_id, token, lastPay, toDatetime, setProgress, setStatus);
  updateProgress();
}
//syncPaypalPayments
setStatus?.("Syncing paypal payment...");
  const lastPay = await getLastSyncTime("paypal_payments", fromDatetime);
  await syncPaypalPayments(subdomain, token, lastPay, toDatetime, setProgress, setStatus);
  updateProgress();

  //syncPaystackPayments
setStatus?.("Syncing paystackpayment...");
  const lastPaystack = await getLastSyncTime("paystack_payments", fromDatetime);
  await syncPaystackPayments(subdomain, token, lastPaystack, toDatetime, setProgress, setStatus);
  updateProgress();

  //syncPermissions
  setStatus?.("Syncing permission...");
  const lastPermission = await getLastSyncTime("permissions", fromDatetime);
  await syncPermissions(subdomain, token, lastPermission, toDatetime, setProgress, setStatus);
  updateProgress();

  //syncPersonalAccessTokens
  setStatus?.("Syncing personal access token...");
  const lastPersonal = await getLastSyncTime("personal_access_tokens", fromDatetime);
  await syncPersonalAccessTokens(subdomain, token, lastPersonal, toDatetime, setProgress, setStatus);
  updateProgress();

  //syncPosRegisters
  if (user.restaurant_id) {
  setStatus?.("Syncing pos registers...");
  const lastPOS = await getLastSyncTime("pos_registers", fromDatetime);
  await syncPosRegisters(subdomain, user.restaurant_id, token, lastPOS, toDatetime, setProgress, setStatus);
  updateProgress();
}
    setStatus?.("Sync complete ✅");
    return true;
  } catch (err) {
    console.error("❌ Master data sync error:", err);
    throw err;
  }
}
