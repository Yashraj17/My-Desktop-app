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
    const ordersUrl = `${subdomain}/api/orders?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const ordersRes = await axios.get(ordersUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!ordersRes.data.status || !Array.isArray(ordersRes.data.data)) {
      setStatus?.("⚠️ No orders found to sync.");
      return;
    }

    const orders = ordersRes.data.data.map(normalizeOrder);
    const orderIds = new Set(orders.map((o) => o.id));

    // 💾 Save main orders
    for (let order of orders) {
      await window.api.addOrderBackup(order);
      setStatus?.(`💾 Saved order #${order.order_number}`);
    }

    // 2️⃣ Bulk fetch related entities
    const [
      chargesRes,
      itemsRes,
      modsRes,
      taxesRes,
      historiesRes,
      placesRes,
      payRes,
    ] = await Promise.all([
      axios.get(
        `${subdomain}/api/order-charges`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      axios.get(
        `${subdomain}/api/order-items?from_datetime=${encodeURIComponent(
          fromDatetime
        )}&to_datetime=${encodeURIComponent(toDatetime)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      axios.get(
        `${subdomain}/api/order-item-modifier-options`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      axios.get(
        `${subdomain}/api/order-taxes?from_datetime=${encodeURIComponent(
          fromDatetime
        )}&to_datetime=${encodeURIComponent(toDatetime)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      axios.get(
        `${subdomain}/api/order-histories?from_datetime=${encodeURIComponent(
          fromDatetime
        )}&to_datetime=${encodeURIComponent(toDatetime)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      axios.get(
        `${subdomain}/api/order-places`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      axios.get(
        `${subdomain}/api/payfast-payments?from_datetime=${encodeURIComponent(
          fromDatetime
        )}&to_datetime=${encodeURIComponent(toDatetime)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    ]);

const orderItemIds = new Set((itemsRes.data?.data || []).map((o) => o.id));
    // 3️⃣ Filter + normalize + save
    const charges = (chargesRes.data.data || [])
      .filter((c) => orderIds.has(c.order_id))
      .map(normalizeOrderCharge);
    for (let c of charges) {
      await window.api.addOrderChargeBackup(c);
      setStatus?.(`✅ Saved charge ${c.charge_id} for order ${c.order_id}`);
    }

    const items = (itemsRes.data.data || [])
      .filter((i) => orderIds.has(i.order_id))
      .map(normalizeOrderItem);
    for (let i of items) {
      await window.api.addOrderItemBackup(i);
      setStatus?.(`✅ Saved item ${i.menu_item_id} for order ${i.order_id}`);
    }

    const mods = (modsRes.data.data || [])
      .filter((m) => orderItemIds.has(m.order_item_id))
      .map(normalizeOrderItemModifierOption);
    for (let m of mods) {
      await window.api.addOrderItemModifierOptionBackup(m);
      setStatus?.(
        `✅ Saved modifier ${m.modifier_option_id} for item ${m.order_item_id}`
      );
    }

    const taxes = (taxesRes.data.data || [])
      .filter((t) => orderIds.has(t.order_id))
      .map(normalizeOrderTax);
    for (let t of taxes) {
      await window.api.addOrderTaxBackup(t);
      setStatus?.(`✅ Saved tax ${t.tax_id} for order ${t.order_id}`);
    }

    const histories = (historiesRes.data.data || [])
      .filter(
        (h) => orderIds.has(h.order_id) && ["served", "paid"].includes(h.status)
      )
      .map(normalizeOrderHistory);
    for (let h of histories) {
      await window.api.addOrderHistoryBackup(h);
      setStatus?.(
        `✅ Saved history "${h.status}" for order ${h.order_id}`
      );
    }

    const places = (placesRes.data.data || []).map(normalizeOrderPlace);
    for (let p of places) {
      await window.api.addOrderPlaceBackup(p);
      setStatus?.(`✅ Saved order place "${p.name}" for branch #${branchId}`);
    }

    const payments = (payRes.data.data || [])
      .filter((p) => orderIds.has(p.order_id))
      .map(normalizePayfastPayment);
    for (let p of payments) {
      await window.api.addPayfastPaymentBackup(p);
      setStatus?.(
        `✅ Saved Payfast payment ${p.payfast_payment_id} for order ${p.order_id}`
      );
    }

    // 4️⃣ Save Sync Times
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
