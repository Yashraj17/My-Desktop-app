import axios from "axios";

export async function syncSessions(subdomain, token, fromDatetime, toDatetime) {
  try {
    const url = `${subdomain}/api/sessions`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const sessions = response.data.data;

      for (let i = 0; i < sessions.length; i++) {
        const session = sessions[i];
        // ✅ Call backend via IPC
        await window.api.addSessionBackup({
          id: session.id,
          user_id: session.user_id,
          ip_address: session.ip_address,
          user_agent: session.user_agent,
          payload: session.payload,
          last_activity: session.last_activity,
          newfield1: null,
          newfield2: null,
          newfield3: null,
        });
      }

      // ✅ Save last sync time
      await window.api.saveSyncTime("sessions", toDatetime);
    }
  } catch (err) {
    console.error("❌ Sessions sync error:", err);
    throw err;
  }
}
