// models/userModel.js
const db = require("../services/db");

function findByEmail(email) {
  const stmt = db.prepare(`SELECT * FROM users WHERE email = ? LIMIT 1`);
  return stmt.get(email);
}

function saveUser(user,isSync, plainPassword) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO users (
      id, restaurant_id, branch_id, name, email, phone_number, phone_code, 
      email_verified_at, password, two_factor_secret, two_factor_recovery_codes, 
      two_factor_confirmed_at, remember_token, current_team_id, profile_photo_path, 
      created_at, updated_at, locale, stripe_id, pm_type, pm_last_four, trial_ends_at, 
      newfield1, newfield2, newfield3, isSync
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);

  stmt.run(
    user.id,
    user.restaurant_id,
    user.branch_id,
    user.name,
    user.email,
    user.phone_number,
    user.phone_code,
    user.email_verified_at,
    plainPassword, // store hashed later
    user.two_factor_secret,
    user.two_factor_recovery_codes,
    user.two_factor_confirmed_at,
    user.remember_token,
    user.current_team_id,
    user.profile_photo_path,
    user.created_at,
    user.updated_at,
    user.locale,
    user.stripe_id,
    user.pm_type,
    user.pm_last_four,
    user.trial_ends_at,
    user.newfield1,
    user.newfield2,
    user.newfield3,
    isSync,
  );
}

module.exports = { findByEmail, saveUser };
