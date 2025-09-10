import axios from "axios";

export async function syncGlobalSubscriptions(subdomain, restaurantId, token) {
  try {
    //const url = `${subdomain}/global-subscriptions?restaurant_id=${restaurantId}`;
    const url = `${subdomain}/api/global-subscriptions?restaurant_id=1`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const subscriptions = response.data.data;

      for (let i = 0; i < subscriptions.length; i++) {
        const sub = subscriptions[i];

        // ✅ Call backend via IPC
        await window.api.addGlobalSubscriptionBackup({
          id: sub.id,
          restaurant_id: sub.restaurant_id,
          package_id: sub.package_id,
          currency_id: sub.currency_id,
          package_type: sub.package_type,
          plan_type: sub.plan_type,
          transaction_id: sub.transaction_id,
          name: sub.name,
          user_id: sub.user_id,
          quantity: sub.quantity,
          token: sub.token,
          razorpay_id: sub.razorpay_id,
          razorpay_plan: sub.razorpay_plan,
          stripe_id: sub.stripe_id,
          stripe_status: sub.stripe_status,
          stripe_price: sub.stripe_price,
          gateway_name: sub.gateway_name,
          trial_ends_at: sub.trial_ends_at,
          subscription_status: sub.subscription_status,
          ends_at: sub.ends_at,
          subscribed_on_date: sub.subscribed_on_date,
          created_at: sub.created_at,
          updated_at: sub.updated_at,
          subscription_id: sub.subscription_id,
          customer_id: sub.customer_id,
          flutterwave_id: sub.flutterwave_id,
          flutterwave_payment_ref: sub.flutterwave_payment_ref,
          flutterwave_status: sub.flutterwave_status,
          flutterwave_customer_id: sub.flutterwave_customer_id,
          payfast_plan: sub.payfast_plan,
          payfast_status: sub.payfast_status,
        });
      }
    }
  } catch (err) {
    console.error("❌ Global Subscriptions sync error:", err);
    throw err;
  }
}
