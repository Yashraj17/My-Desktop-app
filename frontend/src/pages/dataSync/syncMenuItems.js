import axios from "axios";

// 🔹 Normalizers
function normalizeMenuItem(item) {
  return {
    ...item,
    price: item.price != null ? Number(item.price) : 0,
    is_available: item.is_available ? 1 : 0,
    show_on_customer_site: item.show_on_customer_site ? 1 : 0,
    in_stock: item.in_stock ? 1 : 0,
    sort_order: item.sort_order != null ? String(item.sort_order) : "0",
    kot_place_id: item.kot_place_id != null ? String(item.kot_place_id) : null,
    item_category_id: item.item_category_id != null ? String(item.item_category_id) : null,
    menu_id: item.menu_id != null ? String(item.menu_id) : null,
  };
}

function normalizeTranslation(tr) {
  return {
    ...tr,
    menu_item_id: tr.menu_item_id != null ? String(tr.menu_item_id) : null,
    item_name: tr.item_name || "",
    description: tr.description || "",
  };
}

function normalizeVariation(v) {
  return {
    ...v,
    menu_item_id: v.menu_item_id != null ? String(v.menu_item_id) : null,
    variation: v.variation || "",
    price: v.price != null ? Number(v.price) : 0,
  };
}

// 🔹 Syncer (all at once, filter by ID)
export async function syncMenuItems(
  subdomain,
  branchId,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("📦 Fetching menu data...");

    // 1️⃣ Fetch all three datasets at once
    const [itemsRes, trRes, varRes] = await Promise.all([
      axios.get(
        `${subdomain}/api/menu/items?branch_id=${branchId}&from_datetime=${encodeURIComponent(
          fromDatetime
        )}&to_datetime=${encodeURIComponent(toDatetime)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      axios.get(`${subdomain}/api/menu/item-translations`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${subdomain}/api/menu/item-variations`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const menuItems = itemsRes.data?.data || [];
    const translations = trRes.data?.data || [];
    const variations = varRes.data?.data || [];

    // Build quick lookup sets
    const itemIds = new Set(menuItems.map((m) => m.id));

    // 2️⃣ Save menu items
    for (const raw of menuItems) {
      const item = normalizeMenuItem(raw);
      await window.api.addMenuItemBackup(item);
      setStatus?.(`💾 Saved item ${item.id} - ${item.name || raw.item_name}`);
    }

    // 3️⃣ Save translations linked to valid menu items
    for (const tr of translations) {
      if (itemIds.has(tr.menu_item_id)) {
        await window.api.addMenuItemTranslationBackup(normalizeTranslation(tr));
      }
    }

    // 4️⃣ Save variations linked to valid menu items
    for (const v of variations) {
      if (itemIds.has(v.menu_item_id)) {
        await window.api.addMenuItemVariationBackup(normalizeVariation(v));
      }
    }

    // ✅ Save sync times once
    await window.api.saveSyncTime("menu_items", toDatetime);
    await window.api.saveSyncTime("menu_item_translations", toDatetime);
    await window.api.saveSyncTime("menu_item_variations", toDatetime);

    setStatus?.("✅ Menu items sync completed.");
  } catch (err) {
    console.error("❌ Menu items sync error:", err);
    setStatus?.("❌ Failed to sync menu items.");
    throw err;
  }
}
