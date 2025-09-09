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

function createApi(subdomain, token) {
  return axios.create({
    baseURL: subdomain,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
}

export async function syncMasterData(subdomain, token, setProgress, setStatus, user) {
  const api = createApi(subdomain, token);

  try {
    let progress = 0;
    const totalSteps = 30;
    const updateProgress = () => {
      if (setProgress) {
        progress += (1 / totalSteps) * 100;
        setProgress(Math.min(100, Math.round(progress)));
      }
      
    };

    // 1. COUNTRIES
    setStatus?.("Syncing countries...");
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
      updateProgress();
    }

    // 7. MENUS
    if(user.branch_id)
    {
    setStatus?.("Syncing menus...");
    await syncMenus(subdomain, user.branch_id, token, setProgress, setStatus);
    updateProgress();
    }

    // area 
    if(user.branch_id)
    {
    setStatus?.("Syncing area...");
    await syncArea(subdomain, user.branch_id, token, setProgress, setStatus);
    updateProgress();
    }
     //syncBranchDeliverySettings 
    if(user.branch_id)
    {
    setStatus?.("Syncing branch delivery setting...");
    await syncBranchDeliverySettings(subdomain, user.branch_id, token, setProgress, setStatus);
    updateProgress();
    }

    //syncContacts
     setStatus?.("Syncing contacts...");
    await syncContacts(subdomain, user.branch_id, token, setProgress, setStatus);
    updateProgress();

   //syncCustomers 
    if(user.restaurant_id)
    {
    setStatus?.("Syncing customer...");
    await syncCustomers(subdomain, user.restaurant_id, token, setProgress, setStatus);
    updateProgress();
    }

     //syncDeliveryExecutives 
    if(user.branch_id)
    {
    setStatus?.("Syncing delivery executives...");
    await syncDeliveryExecutives(subdomain, user.branch_id, token, setProgress, setStatus);
    updateProgress();
    }

    //syncDesktopApplications
    setStatus?.("Syncing dsektop application...");
    await syncDesktopApplications(subdomain, user.branch_id, token, setProgress, setStatus);
    updateProgress();

    //syncEmailSettings
     setStatus?.("Syncing email setting...");
    await syncEmailSettings(subdomain, user.branch_id, token, setProgress, setStatus);
    updateProgress();

    //syncExpenseCategories
    if(user.branch_id)
    {
    setStatus?.("Syncing expense category...");
    await syncExpenseCategories(subdomain, user.branch_id, token, setProgress, setStatus);
    updateProgress();
    }

    //syncExpenses
    if(user.branch_id)
    {
    setStatus?.("Syncing expense...");
    await syncExpenses(subdomain, user.branch_id, token, setProgress, setStatus);
    updateProgress();
    }

    //syncMenuItems
     if(user.branch_id)
    {
    setStatus?.("Syncing menu items...");
    await syncMenuItems(subdomain, user.branch_id, token, setProgress, setStatus);
    updateProgress();
    }

    //syncMenuCategories
     if(user.branch_id)
    {
    setStatus?.("Syncing menu categories...");
    await syncMenuCategories(subdomain, user.branch_id, token, setProgress, setStatus);
    updateProgress();
    }

    //syncModifiers
     if(user.branch_id)
    {
    setStatus?.("Syncing item modifiers...");
    await syncModifiers(subdomain, user.branch_id, token, setProgress, setStatus);
    updateProgress();
    }

    //syncFailedJobs
    setStatus?.("Syncing faild jobs...");
    await syncFailedJobs(subdomain,token,user.branch_id, setProgress, setStatus);
    updateProgress();

    //syncFileStorage
    if(user.restaurant_id)
    {
    setStatus?.("Syncing file storage...");
    await syncFileStorage(subdomain, user.restaurant_id, token, setProgress, setStatus);
    updateProgress();
    }

    //syncFileStorageSettings
    setStatus?.("Syncing file storage setting...");
    await syncFileStorageSettings(subdomain,token,user.restaurant_id, setProgress, setStatus);
    updateProgress();
    //syncFlags
    setStatus?.("Syncing flage...");
    await syncFlags(subdomain,token,user.restaurant_id, setProgress, setStatus);
    updateProgress();
    //syncTables
     if(user.branch_id)
    {
    setStatus?.("Syncing table...");
    await syncTables(subdomain, user.branch_id, token, setProgress, setStatus);
    updateProgress();
    }

    //syncInventorySettings
    if(user.restaurant_id)
    {
    setStatus?.("Syncing inventory setting...");
    await syncInventorySettings(subdomain, user.restaurant_id, token, setProgress, setStatus);
    updateProgress();
    }

    //syncInventoryStocks
    if(user.branch_id)
    {
    setStatus?.("Syncing inventory stocks...");
    await syncInventoryStocks(subdomain, user.branch_id, token, setProgress, setStatus);
    updateProgress();
    }
    //syncInventoryMovements
    if(user.branch_id)
    {
    setStatus?.("Syncing inventory movements...");
    await syncInventoryMovements(subdomain, user.branch_id, token, setProgress, setStatus);
    updateProgress();
    }

    //syncInventoryItemCategories
    if(user.branch_id)
    {
    setStatus?.("Syncing inventory item categories...");
    await syncInventoryItemCategories(subdomain, user.branch_id, token, setProgress, setStatus);
    updateProgress();
    }

    //syncInventoryItems
     if(user.branch_id)
    {
    setStatus?.("Syncing inventory item...");
    await syncInventoryItems(subdomain, user.branch_id, token, setProgress, setStatus);
    updateProgress();
    }

    //syncInventoryGlobalSettings
    setStatus?.("Syncing inventory global setting...");
    await syncInventoryGlobalSettings(subdomain,token, user.branch_id,  setProgress, setStatus);
    updateProgress();
    
    setStatus?.("Sync complete ✅");
    return true;
  } catch (err) {
    console.error("❌ Master data sync error:", err);
    throw err;
  }
}
