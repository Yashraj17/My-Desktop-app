import axios from "axios";

// ✅ Sync global settings from API
export async function syncGlobalSettings(subdomain, token) {
  try {
    const url = `${subdomain}/api/global-settings`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.status && response.data.data) {
      const settings = response.data.data;

      for (let i = 0; i < settings.length; i++) {
        const setting = settings[i];

        // ✅ Call backend via IPC (no direct DB access here)
        await window.api.addGlobalSettingBackup({
          id: setting.id,
          purchase_code: setting.purchase_code,
          supported_until: setting.supported_until,
          last_license_verified_at: setting.last_license_verified_at,
          email: setting.email,
          created_at: setting.created_at,
          updated_at: setting.updated_at,
          name: setting.name,
          logo: setting.logo,
          theme_hex: setting.theme_hex,
          theme_rgb: setting.theme_rgb,
          locale: setting.locale,
          license_type: setting.license_type,
          hide_cron_job: setting.hide_cron_job,
          last_cron_run: setting.last_cron_run,
          system_update: setting.system_update,
          purchased_on: setting.purchased_on,
          timezone: setting.timezone,
          disable_landing_site: setting.disable_landing_site,
          landing_type: setting.landing_type,
          landing_site_type: setting.landing_site_type,
          landing_site_url: setting.landing_site_url,
          installed_url: setting.installed_url,
          requires_approval_after_signup: setting.requires_approval_after_signup,
          facebook_link: setting.facebook_link,
          instagram_link: setting.instagram_link,
          twitter_link: setting.twitter_link,
          yelp_link: setting.yelp_link,
          default_currency_id: setting.default_currency_id,
          show_logo_text: setting.show_logo_text,
          meta_title: setting.meta_title,
          meta_keyword: setting.meta_keyword,
          meta_description: setting.meta_description,
          upload_fav_icon_android_chrome_192: setting.upload_fav_icon_android_chrome_192,
          upload_fav_icon_android_chrome_512: setting.upload_fav_icon_android_chrome_512,
          upload_fav_icon_apple_touch_icon: setting.upload_fav_icon_apple_touch_icon,
          upload_favicon_16: setting.upload_favicon_16,
          upload_favicon_32: setting.upload_favicon_32,
          favicon: setting.favicon,
          hash: setting.hash,
          webmanifest: setting.webmanifest,
          is_pwa_install_alert_show: setting.is_pwa_install_alert_show,
          google_map_api_key: setting.google_map_api_key,
          session_driver: setting.session_driver,
          enable_stripe: setting.enable_stripe,
          enable_razorpay: setting.enable_razorpay,
          enable_flutterwave: setting.enable_flutterwave,
          enable_payfast: setting.enable_payfast,
          enable_paypal: setting.enable_paypal,
          enable_paystack: setting.enable_paystack,
        });
      }
    }
  } catch (err) {
    console.error("❌ Global settings sync error:", err);
    throw err;
  }
}