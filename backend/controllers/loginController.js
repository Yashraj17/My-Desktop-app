// controllers/loginController.js
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const axios = require("axios");

async function login({ email, password, subdomain }) {
  // 1. Check locally first
  const localUser = userModel.findByEmail(email);
  if (localUser) {
    const isMatch = bcrypt.compareSync(password, localUser.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return {
      token: `local_token_${localUser.id}_${Date.now()}`,
      user: localUser,
      source: "local",
      password:password
    };
  }

  // 2. Call remote Laravel API
  const baseUrl = `${subdomain}/api/login`;
  const response = await axios.post(baseUrl, { email, password });

  const user = response.data.user;
  const token = response.data.token;
  const isSync =1;
  // Save locally (store bcrypt hashed password)
  userModel.saveUserOLD(user,isSync,bcrypt.hashSync(password, 10));

  return { token, user, source: "remote",password:password };
}

// controllers/loginController.js
async function login111({ email, password, subdomain }) {
  // 1. Check locally first
  const localUser = userModel.findByEmail(email);
  if (localUser) {
    const isMatch = bcrypt.compareSync(password, localUser.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return {
      token: `local_token_${localUser.id}_${Date.now()}`,
      user: localUser,
      source: "local",
    };
  }

  // 2. Call remote Laravel API
   const baseUrl = `${subdomain}/api/login`;
  const response = await axios.post(baseUrl, { email, password });

  const user = response.data.user;
  const token = response.data.token;
  return { token, user, source: "remote" };
}

function saveUser(data) {
  return userModel.saveUser(data);
}


module.exports = { login,saveUser };
