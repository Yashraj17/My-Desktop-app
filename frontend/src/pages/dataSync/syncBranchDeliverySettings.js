import axios from "axios";

export async function syncBranchDeliverySettings(subdomain, branchId, token,fromDatetime,toDatetime) {
  try {
    const url = `${subdomain}/api/branch-delivery-settings?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const settings = response.data.data;

      for (let i = 0; i < settings.length; i++) {
        const setting = settings[i];

        // ✅ Call backend via IPC
        await window.api.addBranchDeliverySettingBackup({
          id: setting.id,
          branch_id: setting.branch_id,
          max_radius: setting.max_radius,
          unit: setting.unit,
          fee_type: setting.fee_type,
          fixed_fee: setting.fixed_fee,
          per_distance_rate: setting.per_distance_rate,
          free_delivery_over_amount: setting.free_delivery_over_amount,
          free_delivery_within_radius: setting.free_delivery_within_radius,
          delivery_schedule_start: setting.delivery_schedule_start,
          delivery_schedule_end: setting.delivery_schedule_end,
          prep_time_minutes: setting.prep_time_minutes,
          additional_eta_buffer_time: setting.additional_eta_buffer_time,
          avg_delivery_speed_kmh: setting.avg_delivery_speed_kmh,
          is_enabled: setting.is_enabled,
          created_at: setting.created_at,
          updated_at: setting.updated_at,
        });
      }
      await window.api.saveSyncTime("branch_delivery_settings", toDatetime);
    }
  } catch (err) {
    console.error("❌ Branch Delivery Settings sync error:", err);
    throw err;
  }
}