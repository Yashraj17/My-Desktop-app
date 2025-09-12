function normalizePosRegister(raw) {
  return {
    id: raw.id,
    user_id: raw.user_id,
    opened_by: raw.opened_by,
    closed_by: raw.closed_by,
    open_datetime: raw.open_datetime,
    close_datetime: raw.close_datetime,
    branch_id: raw.branch_id,
    restaurant_id: raw.restaurant_id,
    opening_cash: raw.opening_cash,
    opening_note: raw.opening_note,
    total_sales: raw.total_sales,
    total_refund: raw.total_refund,
    total_payment: raw.total_payment,
    taxes: raw.taxes,
    payment_summary: raw.payment_summary,
    closing_cash: raw.closing_cash,
    closing_note: raw.closing_note,
    total_orders: raw.total_orders,
    total_customers: raw.total_customers,
    today_earning: raw.today_earning,
    avg_earning: raw.avg_earning,
    delivery_fee: raw.delivery_fee,
    discount: raw.discount,
    tip: raw.tip,
    card_slips: raw.card_slips,
    check_slips: raw.check_slips,
    note: raw.note,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}

import axios from "axios";

export async function syncPosRegisters(
  subdomain,
  restaurantId,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing POS Registers...");

    const url = `${subdomain}/api/pos-registers?restaurant_id=${restaurantId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && Array.isArray(response.data.data)) {
      const registers = response.data.data;

      for (let r of registers) {
        await window.api.addPosRegisterBackup(normalizePosRegister(r));
      }

      await window.api.saveSyncTime("pos_registers", toDatetime);
      setStatus?.("✅ POS Registers sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No POS Registers found.");
    }
  } catch (err) {
    console.error("❌ POS Registers sync error:", err);
    setStatus?.("❌ Failed to sync POS Registers.");
    throw err;
  }
}
