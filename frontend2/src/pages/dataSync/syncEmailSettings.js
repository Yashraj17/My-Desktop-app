import axios from "axios";

export async function syncEmailSettings(subdomain, branchId, token) {
  try {
    // ✅ Build base URL
    let url = `${subdomain}/api/email-settings`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (response.data.status && response.data.data) {
      const emailSettings = response.data.data;

      for (let i = 0; i < emailSettings.length; i++) {
        const setting = emailSettings[i];

        // ✅ Call backend via IPC
        await window.api.addEmailSettingBackup({
          id: setting.id,
          mail_from_name: setting.mail_from_name,
          mail_from_email: setting.mail_from_email,
          enable_queue: setting.enable_queue,
          mail_driver: setting.mail_driver,
          smtp_host: setting.smtp_host,
          smtp_port: setting.smtp_port,
          smtp_encryption: setting.smtp_encryption,
          mail_username: setting.mail_username,
          mail_password: setting.mail_password,
          created_at: setting.created_at,
          updated_at: setting.updated_at,
          email_verified: setting.email_verified,
          verified: setting.verified,
        });
      }
    }
  } catch (err) {
    console.error("❌ Email Settings sync error:", err);
    throw err;
  }
}
