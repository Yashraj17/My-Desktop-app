import axios from "axios";

export async function syncContacts(subdomain, languageSettingId, token,fromDatetime,toDatetime) {
  try {
    //const url = `${subdomain}/api/contacts?language_setting_id=${languageSettingId}`;
        const url = `${subdomain}/api/contacts?language_setting_id=1&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const contacts = response.data.data;

      for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        // ✅ Call backend via IPC
        await window.api.addContactBackup({
          id: contact.id,
          language_setting_id: contact.language_setting_id,
          email: contact.email,
          contact_company: contact.contact_company,
          image: contact.image,
          address: contact.address,
          created_at: contact.created_at,
          updated_at: contact.updated_at,
          image_url: contact.image_url,
        });
      }
      await window.api.saveSyncTime("contacts", toDatetime);
    }
  } catch (err) {
    console.error("❌ Contacts sync error:", err);
    throw err;
  }
}
