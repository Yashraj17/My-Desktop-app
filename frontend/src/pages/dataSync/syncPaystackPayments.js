function normalizePaystackPayment(raw) {
  return {
    id: raw.id,
    paystack_payment_id: raw.paystack_payment_id || null,
    order_id: raw.order_id,
    amount: raw.amount,
    payment_status: raw.payment_status || "pending",
    payment_date: raw.payment_date || null,
    payment_error_response: raw.payment_error_response || null,
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}

import axios from "axios";

export async function syncPaystackPayments(
  subdomain,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing Paystack payments...");

    const url = `${subdomain}/api/paystack-payments?from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && Array.isArray(response.data.data)) {
      const payments = response.data.data;

      for (let p of payments) {
        await window.api.addPaystackPaymentBackup(normalizePaystackPayment(p));
      }

      await window.api.saveSyncTime("paystack_payments", toDatetime);
      setStatus?.("✅ Paystack payments sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No Paystack payments found.");
    }
  } catch (err) {
    console.error("❌ Paystack payments sync error:", err);
    setStatus?.("❌ Failed to sync Paystack payments.");
    throw err;
  }
}

