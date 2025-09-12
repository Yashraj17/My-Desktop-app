import axios from "axios";

export async function syncPurchaseOrders(
  subdomain,
  branchId,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing Purchase Orders...");

    const url = `${subdomain}/api/purchase-orders?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && Array.isArray(response.data.data)) {
      const purchaseOrders = response.data.data;

      for (let po of purchaseOrders) {
        await window.api.addPurchaseOrderBackup(normalizePurchaseOrder(po));
      }

      await window.api.saveSyncTime("purchase_orders", toDatetime);
      setStatus?.("✅ Purchase Orders sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No Purchase Orders found.");
    }
  } catch (err) {
    console.error("❌ Purchase Orders sync error:", err);
    setStatus?.("❌ Failed to sync Purchase Orders.");
    throw err;
  }
}

function normalizePurchaseOrder(raw) {
  return {
    id: raw.id,
    po_number: raw.po_number,
    branch_id: raw.branch_id,
    supplier_id: raw.supplier_id,
    order_date: raw.order_date,
    expected_delivery_date: raw.expected_delivery_date,
    total_amount: raw.total_amount,
    status: raw.status,
    notes: raw.notes,
    created_by: raw.created_by,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}
