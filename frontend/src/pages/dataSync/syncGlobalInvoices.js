import axios from "axios";

// ✅ Sync global invoices from API
export async function syncGlobalInvoices(subdomain, restaurantId, token,fromDatetime,toDatetime) {
  try {
    const url = `${subdomain}/api/global-invoices?restaurant_id=${restaurantId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;
  //const url = `${subdomain}/api/global-invoices?restaurant_id=1`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const invoices = response.data.data;

      for (let i = 0; i < invoices.length; i++) {
        const invoice = invoices[i];

        // ✅ Call backend via IPC (no direct DB access here)
        await window.api.addGlobalInvoiceBackup({
          id: invoice.id,
          restaurant_id: invoice.restaurant_id,
          currency_id: invoice.currency_id,
          package_id: invoice.package_id,
          global_subscription_id: invoice.global_subscription_id,
          offline_method_id: invoice.offline_method_id,
          signature: invoice.signature,
          token: invoice.token,
          transaction_id: invoice.transaction_id,
          event_id: invoice.event_id,
          package_type: invoice.package_type,
          sub_total: invoice.sub_total,
          total: invoice.total,
          billing_frequency: invoice.billing_frequency,
          billing_interval: invoice.billing_interval,
          recurring: invoice.recurring,
          plan_id: invoice.plan_id,
          subscription_id: invoice.subscription_id,
          invoice_id: invoice.invoice_id,
          amount: invoice.amount,
          stripe_invoice_number: invoice.stripe_invoice_number,
          pay_date: invoice.pay_date,
          next_pay_date: invoice.next_pay_date,
          gateway_name: invoice.gateway_name,
          status: invoice.status,
          created_at: invoice.created_at,
          updated_at: invoice.updated_at,
          m_payment_id: invoice.m_payment_id,
          pf_payment_id: invoice.pf_payment_id,
          payfast_plan: invoice.payfast_plan,
        });
      }
      await window.api.saveSyncTime("global_invoices", toDatetime);
    }
  } catch (err) {
    console.error("❌ Global invoices sync error:", err);
    throw err;
  }
}