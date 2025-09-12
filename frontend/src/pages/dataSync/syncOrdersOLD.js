import axios from "axios";

// -------------------- Normalizers --------------------
function normalizeOrder(raw) {
  return {
    ...raw,
    branch_id: raw.branch_id || null,
    order_number: raw.order_number != null ? Number(raw.order_number) : 0,
    sub_total: raw.sub_total != null ? Number(raw.sub_total) : 0,
    total: raw.total != null ? Number(raw.total) : 0,
    amount_paid: raw.amount_paid != null ? Number(raw.amount_paid) : 0,
    discount_value: raw.discount_value != null ? Number(raw.discount_value) : 0,
    discount_amount: raw.discount_amount != null ? Number(raw.discount_amount) : 0,
    delivery_fee: raw.delivery_fee != null ? Number(raw.delivery_fee) : 0,
    is_within_radius: raw.is_within_radius ? 1 : 0,
  };
}

function normalizeOrderCharge(raw) {
  return {
    id: raw.id,
    order_id: raw.order_id,
    charge_id: raw.charge_id,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}

function normalizeOrderItem(raw) {
  return {
    ...raw,
    branch_id: raw.branch_id || null,
    price: raw.price != null ? Number(raw.price) : 0,
    amount: raw.amount != null ? Number(raw.amount) : 0,
    quantity: raw.quantity != null ? Number(raw.quantity) : 0,
  };
}

function normalizeOrderItemModifierOption(raw) {
  return {
    ...raw,
    qty: raw.qty != null ? Number(raw.qty) : 1,
  };
}

function normalizeOrderTax(raw) {
  return {
    ...raw,
    tax_amount: raw.tax_amount != null ? Number(raw.tax_amount) : 0,
  };
}

function normalizeOrderHistory(raw) {
  return {
    id: raw.id,
    order_id: raw.order_id,
    status: raw.status || "",
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}

function normalizeOrderPlace(raw) {
  return {
    ...raw,
    is_active: raw.is_active ? 1 : 0,
    is_default: raw.is_default ? 1 : 0,
  };
}

function normalizePayfastPayment(raw) {
  return {
    id: raw.id,
    payfast_payment_id: raw.payfast_payment_id || null,
    order_id: raw.order_id,
    amount: raw.amount != null ? Number(raw.amount) : 0,
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


// -------------------- Sync Function --------------------
export async function syncOrders(
  subdomain,
  branchId,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("🔄 Syncing orders...");

    // 1️⃣ Fetch Orders
    const url = `${subdomain}/api/orders?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Orders API response:", response);

    if (!response.data.status || !Array.isArray(response.data.data)) {
      setStatus?.("⚠️ No orders found to sync.");
      return;
    }

    const orders = response.data.data;

    for (let orderRaw of orders) {
      const order = normalizeOrder(orderRaw);

      // Save main order
      setStatus?.(`💾 Saving order #${order.order_number}...`);
      await window.api.addOrderBackup(order);

      // 2️⃣ Order Charges
      try {
        const chargeRes = await axios.get(`${subdomain}/api/order-charges?order_id=${order.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (chargeRes.data.status && Array.isArray(chargeRes.data.data)) {
          for (let c of chargeRes.data.data) {
            const charge = normalizeOrderCharge(c);
            await window.api.addOrderChargeBackup(charge);
            setStatus?.(`✅ Saved charge ${charge.charge_id} for order #${order.order_number}`);
          }
        }
      } catch (e) {
        console.warn(`⚠️ Charges fetch failed for order ${order.id}`, e);
      }

      // 3️⃣ Order Items
      try {
        const itemRes = await axios.get(`${subdomain}/api/order-items?order_id=${order.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (itemRes.data.status && Array.isArray(itemRes.data.data)) {
          for (let item of itemRes.data.data) {
            const normalizedItem = normalizeOrderItem(item);
            await window.api.addOrderItemBackup(normalizedItem);
            setStatus?.(
              `✅ Saved item ${normalizedItem.menu_item_id} for order #${order.order_number}`
            );
          }
        }
      } catch (e) {
        console.warn(`⚠️ Items fetch failed for order ${order.id}`, e);
      }

      // 4️⃣ Order Item Modifier Options
      try {
        const modRes = await axios.get(
          `${subdomain}/api/order-item-modifier-options?order_id=${order.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (modRes.data.status && Array.isArray(modRes.data.data)) {
          for (let opt of modRes.data.data) {
            const mod = normalizeOrderItemModifierOption(opt);
            await window.api.addOrderItemModifierOptionBackup(mod);
            setStatus?.(
              `✅ Saved modifier ${mod.modifier_option_id} for item ${mod.order_item_id}`
            );
          }
        }
      } catch (e) {
        console.warn(`⚠️ Modifier options fetch failed for order ${order.id}`, e);
      }

      // 5️⃣ Order Taxes
      try {
        const taxRes = await axios.get(`${subdomain}/api/order-taxes?order_id=${order.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (taxRes.data.status && Array.isArray(taxRes.data.data)) {
          for (let t of taxRes.data.data) {
            const tax = normalizeOrderTax(t);
            await window.api.addOrderTaxBackup(tax);
            setStatus?.(
              `✅ Saved tax ${tax.tax_id} for order #${order.order_number}`
            );
          }
        }
      } catch (e) {
        console.warn(`⚠️ Taxes fetch failed for order ${order.id}`, e);
      }

      // 6️⃣ Order Histories (Optionally filter by status)
      try {
        const historyRes = await axios.get(`${subdomain}/api/order-histories?order_id=${order.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (historyRes.data.status && Array.isArray(historyRes.data.data)) {
          const histories = historyRes.data.data.filter(h => ["served", "paid"].includes(h.status));
          for (let h of histories) {
            const history = normalizeOrderHistory(h);
            await window.api.addOrderHistoryBackup(history);
            setStatus?.(
              `✅ Saved history "${history.status}" for order #${order.order_number}`
            );
          }
        }
      } catch (e) {
        console.warn(`⚠️ Order histories fetch failed for order ${order.id}`, e);
      }

      // 7️⃣ Order Places
      try {
        const placeRes = await axios.get(`${subdomain}/api/order-places?branch_id=${branchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (placeRes.data.status && Array.isArray(placeRes.data.data)) {
          for (let p of placeRes.data.data) {
            const place = normalizeOrderPlace(p);
            await window.api.addOrderPlaceBackup(place);
            setStatus?.(`✅ Saved order place "${place.name}" for branch #${branchId}`);
          }
        }
      } catch (e) {
        console.warn(`⚠️ Order places fetch failed for branch ${branchId}`, e);
      }
      // 8️⃣ Payfast Payments

      try {
        const payRes = await axios.get(
          `${subdomain}/api/payfast-payments?order_id=${order.id}&from_datetime=${encodeURIComponent(
            fromDatetime
          )}&to_datetime=${encodeURIComponent(toDatetime)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (payRes.data.status && Array.isArray(payRes.data.data)) {
          for (let pf of payRes.data.data) {
            const payment = normalizePayfastPayment(pf);
            await window.api.addPayfastPaymentBackup(payment);
            setStatus?.(
              `✅ Saved Payfast payment ${payment.payfast_payment_id} for order #${order.order_number}`
            );
          }
        }
      } catch (e) {
        console.warn(`⚠️ Payfast payments fetch failed for order ${order.id}`, e);
      }
    }
    

    // ✅ Save Sync Times
    await window.api.saveSyncTime("orders", toDatetime);
    await window.api.saveSyncTime("order_charges", toDatetime);
    await window.api.saveSyncTime("order_items", toDatetime);
    await window.api.saveSyncTime("order_item_modifier_options", toDatetime);
    await window.api.saveSyncTime("order_taxes", toDatetime);
    await window.api.saveSyncTime("order_histories", toDatetime);
    await window.api.saveSyncTime("order_places", toDatetime);
    await window.api.saveSyncTime("payfast_payments", toDatetime);

    setStatus?.("🎉 Orders sync completed.");
  } catch (err) {
    console.error("❌ Orders sync error:", err);
    setStatus?.("❌ Failed to sync orders.");
    throw err;
  }
}
