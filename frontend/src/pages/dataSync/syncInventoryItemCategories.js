import axios from "axios";

export async function syncInventoryItemCategories(subdomain, branchId, token,fromDatetime,toDatetime) {
  try {
    const url = `${subdomain}/api/inventory-item-categories?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const categories = response.data.data;

      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];

        // ✅ Call backend via IPC
        await window.api.addInventoryItemCategoryBackup({
          id: category.id,
          branch_id: category.branch_id,
          name: category.name,
          created_at: category.created_at,
          updated_at: category.updated_at,
        });
      }
      await window.api.saveSyncTime("inventory_item_categories", toDatetime);
    }
  } catch (err) {
    console.error("❌ Inventory Item Categories sync error:", err);
    throw err;
  }
}
