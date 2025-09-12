import axios from "axios";

// ✅ Sync Roles + Role Has Permissions
export async function syncRolesAndPermissions(
  subdomain,
  restaurantId,
  token,
  fromDatetime,
  toDatetime,
  setProgress,
  setStatus
) {
  try {
    setStatus?.("Syncing Roles & Role Has Permissions...");

    // 1️⃣ Fetch Roles
    const roleUrl = `${subdomain}/api/roles?restaurant_id=${restaurantId}&from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const rolesRes = await axios.get(roleUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const roles = rolesRes.data?.data || [];

    // Save roles locally
    for (let r of roles) {
      await window.api.addRoleBackup(normalizeRole(r));
    }

    // Build quick lookup for role IDs
    const roleIds = new Set(roles.map((r) => r.id));

    // 2️⃣ Fetch Role Has Permissions (without role_id filter)
    const rhpUrl = `${subdomain}/api/role-has-permissions?from_datetime=${encodeURIComponent(
      fromDatetime
    )}&to_datetime=${encodeURIComponent(toDatetime)}`;

    const rhpRes = await axios.get(rhpUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const roleHasPermissions = rhpRes.data?.data || [];

    // Save role_has_permissions only if role_id exists
    for (let rhp of roleHasPermissions) {
      if (roleIds.has(rhp.role_id)) {
        await window.api.addRoleHasPermissionBackup(normalizeRoleHasPermission(rhp));
      }
    }

    // 3️⃣ Save sync times
    await window.api.saveSyncTime("roles", toDatetime);
    await window.api.saveSyncTime("role_has_permissions", toDatetime);

    setStatus?.("✅ Roles & Role Has Permissions sync completed.");
    setProgress?.((prev) => prev + 1);
  } catch (err) {
    console.error("❌ Sync error:", err);
    setStatus?.("❌ Failed to sync Roles & Role Has Permissions.");
    throw err;
  }
}

// ✅ Normalizer for Role
function normalizeRole(raw) {
  return {
    id: raw.id,
    name: raw.name,
    display_name: raw.display_name,
    guard_name: raw.guard_name,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    restaurant_id: raw.restaurant_id,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}

// ✅ Normalizer for Role Has Permission
function normalizeRoleHasPermission(raw) {
  return {
    id: raw.id || null,
    permission_id: raw.permission_id ? String(raw.permission_id) : null,
    role_id: raw.role_id ? String(raw.role_id) : null,
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null,
    restaurant_id: raw.restaurant_id || null,
    newfield1: raw.newfield1 || null,
    newfield2: raw.newfield2 || null,
    newfield3: raw.newfield3 || null,
  };
}
