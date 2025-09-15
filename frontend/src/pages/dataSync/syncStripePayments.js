import axios from "axios";

export async function syncStripePayments(subdomain, token, fromDatetime, toDatetime) {
  try {
    const url = `${subdomain}/api/stripe-payments?from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const stripePayments = response.data.data;

      for (let i = 0; i < stripePayments.length; i++) {
        const payment = stripePayments[i];

        // ✅ Send to backend for SQLite insert
        await window.api.addStripePaymentBackup({
          id: payment.id,
          order_id: payment.order_id,
          payment_date: payment.payment_date,
          amount: parseFloat(payment.amount) || 0,
          payment_status: payment.payment_status || "pending",
          payment_error_response: payment.payment_error_response,
          stripe_payment_intent: payment.stripe_payment_intent,
          stripe_session_id: payment.stripe_session_id,
          created_at: payment.created_at,
          updated_at: payment.updated_at,
          newfield1: null,
          newfield2: null,
          newfield3: null,
        });
      }

      // ✅ Save sync time
      await window.api.saveSyncTime("stripe_payments", toDatetime);
    }
  } catch (err) {
    console.error("❌ Stripe Payments sync error:", err);
    throw err;
  }
}
