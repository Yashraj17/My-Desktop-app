import axios from "axios";

export async function syncSplitOrderItems(subdomain, token, fromDatetime, toDatetime) {
  try {
    const url = `${subdomain}/api/split-order-items?from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const splitOrderItems = response.data.data;

      for (let i = 0; i < splitOrderItems.length; i++) {
        const item = splitOrderItems[i];

        // ✅ Send to backend for SQLite insert
        await window.api.addSplitOrderItemBackup({
          id: item.id,
          split_order_id: item.split_order_id,
          order_item_id: item.order_item_id,
          created_at: item.created_at,
          updated_at: item.updated_at,
          newfield1: null,
          newfield2: null,
          newfield3: null,
        });
      }

      // ✅ Save sync time
      await window.api.saveSyncTime("split_order_items", toDatetime);
    }
  } catch (err) {
    console.error("❌ Split Order Items sync error:", err);
    throw err;
  }
}
