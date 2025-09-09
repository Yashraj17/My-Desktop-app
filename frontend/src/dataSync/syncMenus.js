import axios from "axios";
// syncMenus.js
export async function syncMenus(subdomain, branchId, token, ) {
  try {
    // const fromDatetime = "2025-08-10 10:00:00";
    // const toDatetime = "2025-08-20 18:00:00";

    // const menuUrlOLD = `${subdomain}/api/menu/list?branch_id=${branchId}&from_datetime=${encodeURIComponent(
    //   fromDatetime
    // )}&to_datetime=${encodeURIComponent(toDatetime)}`;
    const menuUrl = `${subdomain}/api/menu/list?branch_id=${branchId}`;
    const menuResponse = await axios.get(menuUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (menuResponse.data.status && menuResponse.data.data) {
      const menus = menuResponse.data.data;

      for (let i = 0; i < menus.length; i++) {
        const menu = menus[i];

        await window.api.addMenuBackup({
          id: menu.id,
          branch_id: menu.branch_id,
          menu_name: menu.menu_name.en,
          sort_order: menu.sort_order,
          show_on_customer_site: menu.show_on_customer_site ? 1 : 0,
          created_at: menu.created_at,
          updated_at: menu.updated_at,
        });


        
      }
    }
  } catch (err) {
    console.error("❌ Menu sync error:", err);
    throw err;
  }
}

