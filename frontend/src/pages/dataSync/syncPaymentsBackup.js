function normalizePayment(raw) {
  return {
    id: raw.id,
    branch_id: raw.branch_id,
    order_id: raw.order_id,
    payment_method: raw.payment_method,
    amount: raw.amount,
    balance: raw.balance,
    transaction_id: raw.transaction_id || null,
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null,
  };
}
import axios from "axios";

export async function syncPaymentsBackup(
  subdomain,
  branchId,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing paymentsBackup...");

    const url = `${subdomain}/api/payments-backup?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && Array.isArray(response.data.data)) {
      const payments = response.data.data;

      for (let pay of payments) {
        await window.api.addPaymentBackup(normalizePayment(pay));
      }

      await window.api.saveSyncTime("payments_backup", toDatetime);
      setStatus?.("✅ payments_backup sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No payments_backup found.");
    }
  } catch (err) {
    console.error("❌ payments_backup sync error:", err);
    setStatus?.("❌ Failed to sync payments_backup.");
    throw err;
  }
}
