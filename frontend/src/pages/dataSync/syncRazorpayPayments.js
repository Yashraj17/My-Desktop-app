import axios from "axios";

export async function syncRazorpayPayments(
  subdomain,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing Razorpay Payments...");

    const url = `${subdomain}/api/razorpay-payments?from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && Array.isArray(response.data.data)) {
      const payments = response.data.data;

      for (let payment of payments) {
        await window.api.addRazorpayPaymentBackup(normalizeRazorpayPayment(payment));
      }

      await window.api.saveSyncTime("razorpay_payments", toDatetime);
      setStatus?.("✅ Razorpay Payments sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No Razorpay Payments found.");
    }
  } catch (err) {
    console.error("❌ Razorpay Payments sync error:", err);
    setStatus?.("❌ Failed to sync Razorpay Payments.");
    throw err;
  }
}
function normalizeRazorpayPayment(raw) {
  return {
    id: raw.id,
    order_id: raw.order_id,
    payment_date: raw.payment_date,
    amount: raw.amount,
    payment_status: raw.payment_status,
    payment_error_response: raw.payment_error_response,
    razorpay_order_id: raw.razorpay_order_id,
    razorpay_payment_id: raw.razorpay_payment_id,
    razorpay_signature: raw.razorpay_signature,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}
