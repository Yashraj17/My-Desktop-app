import axios from "axios";

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

export async function syncMenuItems(subdomain, branchId, token, fromDatetime, toDatetime, setProgress, setStatus) {
  try {
    setStatus?.("Syncing menu items...");

    const url = `${subdomain}/api/menu/items?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && Array.isArray(response.data.data)) {
      const menuItems = response.data.data;

      for (let i = 0; i < menuItems.length; i++) {
        const rawItem = menuItems[i];
        const item = normalizeMenuItem(rawItem);
        const displayName = item.name || rawItem.item_name || `Item-${item.id}`;

        // Save main item
        setStatus?.(`Saving menu item: ${displayName}...`);
        await window.api.addMenuItemBackup(item);

        // Save translations
        if (rawItem.translations?.length > 0) {
          for (let tr of rawItem.translations) {
            await window.api.addMenuItemTranslationBackup(normalizeTranslation(tr));
          }
        }

        // Save variations
        try {
          setStatus?.(`Fetching variations for item: ${displayName}...`);
          const varUrl = `${subdomain}/api/menu/item-variations?menu_item_id=${item.id}`;
          const varResponse = await axios.get(varUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (varResponse.data.status && Array.isArray(varResponse.data.data)) {
            for (let v of varResponse.data.data) {
              await window.api.addMenuItemVariationBackup(normalizeVariation(v));
            }
          }
        } catch (varErr) {
          console.warn(`⚠️ Failed to sync variations for item ${item.id}`, varErr);
          setStatus?.(`⚠️ Variations sync failed for ${displayName}`);
        }
      }

      // ✅ Save sync times once at the end
      await window.api.saveSyncTime("menu_items", toDatetime);
      await window.api.saveSyncTime("menu_item_translations", toDatetime);
      await window.api.saveSyncTime("menu_item_variations", toDatetime);
    }

    setStatus?.("✅ Menu items sync completed.");
  } catch (err) {
    console.error("❌ Menu items sync error:", err);
    setStatus?.("❌ Failed to sync menu items.");
    throw err;
  }
}
