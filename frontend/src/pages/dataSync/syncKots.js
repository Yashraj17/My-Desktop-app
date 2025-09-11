import axios from "axios";

// -------------------- Sync Function --------------------
export async function syncKots(
  subdomain,
  branchId,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("🔄 Syncing KOTs...");

    // 1️⃣ Fetch KOTs
    const kotUrl = `${subdomain}/api/kots?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const kotRes = await axios.get(kotUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!kotRes.data.status || !Array.isArray(kotRes.data.data)) {
      setStatus?.("⚠️ No KOTs found to sync.");
      return;
    }

    const kots = kotRes.data.data.map(normalizeKot);
    const kotIds = new Set(kots.map((k) => k.id));

    for (let kot of kots) {
      await window.api.addKotBackup(kot);
      setStatus?.(`💾 Saved KOT #${kot.kot_number}`);
    }

    // 2️⃣ Bulk fetch items + modifiers
    const [itemsRes, modsRes] = await Promise.all([
      axios.get(
        `${subdomain}/api/kot-items?from_datetime=${encodeURIComponent(
          fromDatetime
        )}&to_datetime=${encodeURIComponent(toDatetime)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      axios.get(
        `${subdomain}/api/kot-item-modifier-options`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    ]);

    // 3️⃣ KOT Items
    const kotItems = (itemsRes.data.data || [])
      .filter((i) => kotIds.has(i.kot_id))
      .map(normalizeKotItem);

    const kotItemIds = new Set(kotItems.map((i) => i.id));

    for (let item of kotItems) {
      await window.api.addKotItemBackup(item);
      setStatus?.(`✅ Saved item ${item.menu_item_id} for KOT ${item.kot_id}`);
    }

    // 4️⃣ KOT Item Modifier Options
    const modifierOptions = (modsRes.data.data || [])
      .filter((m) => kotItemIds.has(m.kot_item_id))
      .map(normalizeKotItemModifierOption);

    for (let opt of modifierOptions) {
      await window.api.addKotItemModifierOptionBackup(opt);
      setStatus?.(
        `✅ Saved modifier ${opt.modifier_option_id} for item ${opt.kot_item_id}`
      );
    }

    // 5️⃣ Save Sync Times
    await window.api.saveSyncTime("kots", toDatetime);
    await window.api.saveSyncTime("kot_items", toDatetime);
    await window.api.saveSyncTime("kot_item_modifier_options", toDatetime);

    setStatus?.("🎉 KOT sync completed.");
  } catch (err) {
    console.error("❌ KOT sync error:", err);
    setStatus?.("❌ Failed to sync KOTs.");
    throw err;
  }
}

// -------------------- Normalizers --------------------
function normalizeKot(raw) {
  return {
    ...raw,
    kot_number: raw.kot_number || 0,
    status: raw.status || "pending",
    note: raw.note || "",
    transaction_id: raw.transaction_id || null,
    cancel_reason_id: raw.cancel_reason_id || null,
    cancel_reason_text: raw.cancel_reason_text || "",
    branch_id: raw.branch_id || null,
  };
}

function normalizeKotItem(raw) {
  return {
    ...raw,
    kot_id: raw.kot_id,
    transaction_id: raw.transaction_id || null,
    menu_item_id: raw.menu_item_id || null,
    menu_item_variation_id: raw.menu_item_variation_id || null,
    note: raw.note || "",
    quantity: raw.quantity != null ? String(raw.quantity) : "1",
    status: raw.status || null,
  };
}

function normalizeKotItemModifierOption(raw) {
  return {
    ...raw,
    kot_item_id: raw.kot_item_id,
    modifier_option_id: raw.modifier_option_id,
    qty: raw.qty != null ? String(raw.qty) : "1",
  };
}
