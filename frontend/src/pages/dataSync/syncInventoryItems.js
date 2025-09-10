import axios from "axios";

export async function syncInventoryItems(subdomain, branchId, token,fromDatetime,toDatetime) {
  try {
    const url = `${subdomain}/api/inventory-items?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const items = response.data.data;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // ✅ Call backend via IPC
        await window.api.addInventoryItemBackup({
          id: item.id,
          branch_id: item.branch_id,
          name: item.name,
          inventory_item_category_id: item.inventory_item_category_id,
          unit_id: item.unit_id,
          threshold_quantity: item.threshold_quantity,
          preferred_supplier_id: item.preferred_supplier_id,
          reorder_quantity: item.reorder_quantity,
          unit_purchase_price: item.unit_purchase_price,
          created_at: item.created_at,
          updated_at: item.updated_at,
        });
      }
      await window.api.saveSyncTime("inventory_items", toDatetime);
    }
  } catch (err) {
    console.error("❌ Inventory Items sync error:", err);
    throw err;
  }
}
