import axios from "axios";

export async function syncModifiers(subdomain, branchId, token) {
  try {
    // 1. Fetch modifier groups
    const groupUrl = `${subdomain}/api/menu/modifier-groups?branch_id=${branchId}`;
    const groupResponse = await axios.get(groupUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (groupResponse.data.status && groupResponse.data.data) {
      const groups = groupResponse.data.data;

      for (const rawGroup of groups) {
        const group = normalizeModifierGroup(rawGroup);

        // Save group
        await window.api.addModifierGroupBackup(group);

        // 2. Fetch modifiers for each group
        const modUrl = `${subdomain}/api/menu/item-modifiers?modifier_group_id=${group.id}`;
        try {
          const modResponse = await axios.get(modUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (modResponse.data.status && modResponse.data.data) {
            const modifiers = modResponse.data.data;

            for (const rawMod of modifiers) {
              const mod = normalizeItemModifier(rawMod);
              await window.api.addItemModifierBackup(mod);
            }
          }
        } catch (modErr) {
          console.warn(`⚠️ Failed to sync item_modifiers for group ${group.id}`, modErr);
        }
      }
    }
  } catch (err) {
    console.error("❌ Modifier sync error:", err);
    throw err;
  }
}
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
