import axios from "axios";

export async function syncPrinters(
  subdomain,
  branchId,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing Printers...");

    const url = `${subdomain}/api/printers?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && Array.isArray(response.data.data)) {
      const printers = response.data.data;

      for (let p of printers) {
        await window.api.addPrinterBackup(normalizePrinter(p));
      }

      await window.api.saveSyncTime("printers", toDatetime);
      setStatus?.("✅ Printers sync completed.");
      setProgress?.((prev) => prev + 1);
    } else {
      setStatus?.("⚠️ No Printers found.");
    }
  } catch (err) {
    console.error("❌ Printers sync error:", err);
    setStatus?.("❌ Failed to sync Printers.");
    throw err;
  }
}
function normalizePrinter(raw) {
  return {
    id: raw.id,
    restaurant_id: raw.restaurant_id,
    branch_id: raw.branch_id,
    name: raw.name,
    printing_choice: raw.printing_choice,
    kots: Array.isArray(raw.kots) ? JSON.stringify(raw.kots) : raw.kots || null,
    orders: Array.isArray(raw.orders) ? JSON.stringify(raw.orders) : raw.orders || null,
    print_format: raw.print_format,
    invoice_qr_code: raw.invoice_qr_code,
    open_cash_drawer: raw.open_cash_drawer,
    ipv4_address: raw.ipv4_address,
    thermal_or_nonthermal: raw.thermal_or_nonthermal,
    share_name: raw.share_name,
    type: raw.type,
    profile: raw.profile,
    is_active: raw.is_active,
    is_default: raw.is_default,
    char_per_line: raw.char_per_line,
    ip_address: raw.ip_address,
    port: raw.port,
    path: raw.path,
    printer_name: raw.printer_name,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}
