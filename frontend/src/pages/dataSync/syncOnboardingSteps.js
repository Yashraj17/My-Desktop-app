import axios from "axios";

export async function syncOnboardingSteps(subdomain, branchId, token,fromDatetime,toDatetime) {
  try {
    const url = `${subdomain}/api/onboarding-steps?branch_id=${branchId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const steps = response.data.data;

      for (const rawStep of steps) {
        const step = normalizeOnboardingStep(rawStep);
        await window.api.addOnboardingStepBackup(step);
      }
    await window.api.saveSyncTime("onboarding_steps", toDatetime);
    }
  } catch (err) {
    console.error("❌ Onboarding Steps sync error:", err);
    throw err;
  }
}
function normalizeOnboardingStep(raw) {
  return {
    id: raw.id,
    branch_id: raw.branch_id,
    add_area_completed: raw.add_area_completed ? 1 : 0,
    add_table_completed: raw.add_table_completed ? 1 : 0,
    add_menu_completed: raw.add_menu_completed ? 1 : 0,
    add_menu_items_completed: raw.add_menu_items_completed ? 1 : 0,
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}
