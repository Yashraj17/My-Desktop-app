import axios from "axios";

export async function syncModifiers(subdomain, branchId, token, fromDatetime, toDatetime) {
  try {
    // 1. Fetch modifier groups
    const groupUrl = `${subdomain}/api/menu/modifier-groups?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const groupResponse = await axios.get(groupUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (groupResponse.data.status && Array.isArray(groupResponse.data.data)) {
      const groups = groupResponse.data.data;

      for (const rawGroup of groups) {
        const group = normalizeModifierGroup(rawGroup);

        // Save group
        await window.api.addModifierGroupBackup(group);

        // 2. Fetch modifiers for each group
        const modUrl = `${subdomain}/api/menu/item-modifiers?modifier_group_id=${group.id}&from_datetime=${encodeURIComponent(
          fromDatetime
        )}&to_datetime=${encodeURIComponent(toDatetime)}`;

        try {
          const modResponse = await axios.get(modUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (modResponse.data.status && Array.isArray(modResponse.data.data)) {
            for (const rawMod of modResponse.data.data) {
              await window.api.addItemModifierBackup(normalizeItemModifier(rawMod));
            }
          }
        } catch (modErr) {
          console.warn(`⚠️ Failed to sync item_modifiers for group ${group.id}`, modErr);
        }

        // 3. Fetch modifier options for each group
        const optUrl = `${subdomain}/api/modifier-options?modifier_group_id=${group.id}&from_datetime=${encodeURIComponent(
          fromDatetime
        )}&to_datetime=${encodeURIComponent(toDatetime)}`;

        try {
          const optResponse = await axios.get(optUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (optResponse.data.status && Array.isArray(optResponse.data.data)) {
            for (const rawOpt of optResponse.data.data) {
              await window.api.addModifierOptionBackup(normalizeModifierOption(rawOpt));
            }
          }
        } catch (optErr) {
          console.warn(`⚠️ Failed to sync modifier_options for group ${group.id}`, optErr);
        }
      }

      // ✅ Save sync times once at the end
      await window.api.saveSyncTime("modifier_groups", toDatetime);
      await window.api.saveSyncTime("item_modifiers", toDatetime);
      await window.api.saveSyncTime("modifier_options", toDatetime);
    }
  } catch (err) {
    console.error("❌ Modifier sync error:", err);
    throw err;
  }
}

// ---------------- NORMALIZERS ----------------
function normalizeModifierGroup(raw) {
  return {
    ...raw,
    name: raw.name || "",
    description: raw.description || "",
    has_max_quantity: raw.has_max_quantity ? "1" : "0",
    max_quantity: raw.max_quantity != null ? String(raw.max_quantity) : null,
    max_select_option: raw.max_select_option != null ? String(raw.max_select_option) : null,
    branch_id: raw.branch_id || null,
  };
}

function normalizeItemModifier(raw) {
  return {
    ...raw,
    menu_item_id: raw.menu_item_id != null ? String(raw.menu_item_id) : null,
    modifier_group_id: raw.modifier_group_id,
    is_required: raw.is_required ? 1 : 0,
    allow_multiple_selection: raw.allow_multiple_selection ? 1 : 0,
    max_select_option: raw.max_select_option != null ? String(raw.max_select_option) : null,
    has_max_quantity: raw.has_max_quantity ? "1" : "0",
    max_quantity: raw.max_quantity != null ? String(raw.max_quantity) : null,
  };
}

function normalizeModifierOption(raw) {
  return {
    ...raw,
    name: typeof raw.name === "object" ? raw.name.en || "" : raw.name || "",
    price: raw.price != null ? String(raw.price) : "0.00",
    qty: raw.qty != null ? String(raw.qty) : "1",
    is_available: raw.is_available ? 1 : 0,
    sort_order: raw.sort_order != null ? Number(raw.sort_order) : 0,
    is_preselected: raw.is_preselected ? 1 : 0,
  };
}
