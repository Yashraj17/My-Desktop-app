import axios from "axios";

export async function syncSplitOrders(subdomain, token, fromDatetime, toDatetime) {
  try {
    const url = `${subdomain}/api/split-orders?from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const splitOrders = response.data.data;

      for (let i = 0; i < splitOrders.length; i++) {
        const splitOrder = splitOrders[i];

        // ✅ Send to backend for SQLite insert
        await window.api.addSplitOrderBackup({
          id: splitOrder.id,
          order_id: splitOrder.order_id,
          amount: parseFloat(splitOrder.amount) || 0,
          status: splitOrder.status || "pending",
          payment_method: splitOrder.payment_method || "cash",
          created_at: splitOrder.created_at,
          updated_at: splitOrder.updated_at,
          newfield1: null,
          newfield2: null,
          newfield3: null,
        });
      }

      // ✅ Save sync time
      await window.api.saveSyncTime("split_orders", toDatetime);
    }
  } catch (err) {
    console.error("❌ Split Orders sync error:", err);
    throw err;
  }
}
