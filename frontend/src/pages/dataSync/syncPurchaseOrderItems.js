import axios from "axios";

export async function syncPurchaseOrderItems(
  subdomain,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing Purchase Order Items...");

    const url = `${subdomain}/api/purchase-order-items?from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && Array.isArray(response.data.data)) {
      const items = response.data.data;

      for (let item of items) {
        await window.api.addPurchaseOrderItemBackup(normalizePurchaseOrderItem(item));
      }

      await window.api.saveSyncTime("purchase_order_items", toDatetime);
      setStatus?.("✅ Purchase Order Items sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No Purchase Order Items found.");
    }
  } catch (err) {
    console.error("❌ Purchase Order Items sync error:", err);
    setStatus?.("❌ Failed to sync Purchase Order Items.");
    throw err;
  }
}
function normalizePurchaseOrderItem(raw) {
  return {
    id: raw.id,
    purchase_order_id: raw.purchase_order_id,
    inventory_item_id: raw.inventory_item_id,
    quantity: raw.quantity,
    received_quantity: raw.received_quantity,
    unit_price: raw.unit_price,
    subtotal: raw.subtotal,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}
