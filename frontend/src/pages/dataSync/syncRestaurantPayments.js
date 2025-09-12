import axios from "axios";

// ✅ Sync restaurant_payments
export async function syncRestaurantPayments(
  subdomain,
  restaurantId,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing Restaurant Payments...");

    const url = `${subdomain}/api/restaurant-payments?restaurant_id=${restaurantId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data?.status && Array.isArray(response.data.data)) {
      const payments = response.data.data;

      for (let p of payments) {
        await window.api.addRestaurantPaymentBackup(normalizeRestaurantPayment(p));
      }

      await window.api.saveSyncTime("restaurant_payments", toDatetime);
      setStatus?.("✅ Restaurant Payments sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No Restaurant Payments found.");
    }
  } catch (err) {
    console.error("❌ Restaurant Payments sync error:", err);
    setStatus?.("❌ Failed to sync Restaurant Payments.");
    throw err;
  }
}

// ✅ Normalizer
function normalizeRestaurantPayment(raw) {
  return {
    id: raw.id,
    restaurant_id: raw.restaurant_id,
    amount: raw.amount,
    status: raw.status,
    payment_source: raw.payment_source,
    razorpay_order_id: raw.razorpay_order_id,
    razorpay_payment_id: raw.razorpay_payment_id,
    razorpay_signature: raw.razorpay_signature,
    transaction_id: raw.transaction_id,
    payment_date_time: raw.payment_date_time,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    stripe_payment_intent: raw.stripe_payment_intent,
    stripe_session_id: raw.stripe_session_id,
    package_id: raw.package_id,
    package_type: raw.package_type,
    currency_id: raw.currency_id,
    flutterwave_transaction_id: raw.flutterwave_transaction_id,
    flutterwave_payment_ref: raw.flutterwave_payment_ref,
    paypal_payment_id: raw.paypal_payment_id,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}