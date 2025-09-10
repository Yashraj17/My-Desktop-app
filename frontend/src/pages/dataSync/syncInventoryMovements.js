import axios from "axios";

export async function syncInventoryMovements(subdomain, branchId, token,fromDatetime,toDatetime) {
  try {
    const url = `${subdomain}/api/inventory-movements?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const movements = response.data.data;

      for (let i = 0; i < movements.length; i++) {
        const movement = movements[i];

        // ✅ Call backend via IPC
        await window.api.addInventoryMovementBackup({
          id: movement.id,
          branch_id: movement.branch_id,
          inventory_item_id: movement.inventory_item_id,
          quantity: movement.quantity,
          transaction_type: movement.transaction_type,
          waste_reason: movement.waste_reason,
          added_by: movement.added_by,
          supplier_id: movement.supplier_id,
          transfer_branch_id: movement.transfer_branch_id,
          unit_purchase_price: movement.unit_purchase_price,
          expiration_date: movement.expiration_date,
          created_at: movement.created_at,
          updated_at: movement.updated_at,
        });
      }
      await window.api.saveSyncTime("inventory_movements", toDatetime);
    }
  } catch (err) {
    console.error("❌ Inventory Movements sync error:", err);
    throw err;
  }
}
