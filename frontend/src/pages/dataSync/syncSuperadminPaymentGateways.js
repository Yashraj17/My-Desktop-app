import axios from "axios";

export async function syncSuperadminPaymentGateways(subdomain, token, fromDatetime, toDatetime) {
  try {
    const url = `${subdomain}/api/superadmin-payment-gateways?from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const gateways = response.data.data;

      for (let i = 0; i < gateways.length; i++) {
        const gateway = gateways[i];

        // ✅ Send to backend for SQLite insert
        await window.api.addSuperadminPaymentGatewayBackup({
          ...gateway,
          razorpay_status: gateway.razorpay_status ?? 0,
          stripe_status: gateway.stripe_status ?? 0,
          flutterwave_status: gateway.flutterwave_status ?? 0,
          paypal_status: gateway.paypal_status ?? 0,
          payfast_status: gateway.payfast_status ?? 0,
          paystack_status: gateway.paystack_status ?? 0,
          created_at: gateway.created_at,
          updated_at: gateway.updated_at,
          newfield1: null,
          newfield2: null,
          newfield3: null,
        });
      }

      // ✅ Save last sync time
      await window.api.saveSyncTime("superadmin_payment_gateways", toDatetime);
    }
  } catch (err) {
    console.error("❌ Superadmin Payment Gateways sync error:", err);
    throw err;
  }
}
