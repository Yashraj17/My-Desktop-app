import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import icon from "/images/icon.ico";
import { syncMasterData } from "./dataSync/syncMasterData";
import axios from "axios";

function RestaurantLogin({ setIsAuthenticated }) {
  const [subdomain, setSubdomain] = useState("https://www.prtechit.com");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Starting sync...");
  const navigate = useNavigate();
  const syncIntervalRef = useRef(null);

  // 🚀 Background auto sync
  const startSyncScheduler = (subdomain, email, password, user) => {
  syncIntervalRef.current = setInterval(async () => {
    try {
      const online = await window.api.isOnline(subdomain);
      if (!online) {
        console.log("⚠️ Skipping sync: No internet");
        return;
      }

      console.log("🔑 Logging into server for fresh token...");

      // 🔹 Direct server login (not local fallback)
      const baseUrl = `${subdomain}/api/login`;
      const response = await axios.post(baseUrl, { email, password });

      const { token, user: freshUser } = response.data;

      const fromDatetime = "2000-08-10 00:00:00";
      const now = new Date();
      const toDatetime = now.toISOString().slice(0, 19).replace("T", " ");

      console.log("🔄 Auto Sync triggered with server token");
      await syncMasterData(
        subdomain,
        token,
        () => {}, // background sync → no UI update
        () => {},
        freshUser,
        fromDatetime,
        toDatetime
      );

      console.log("✅ Auto sync completed");
    } catch (err) {
      console.error("❌ Auto sync failed:", err.message);
    }
  }, 600000); // every 10 min
};


  const stopSyncScheduler = () => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
      console.log("🛑 Auto sync stopped");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setProgress(0);
    setStatus("Logging in...");

    try {
      // ✅ Call login via Electron IPC
      const { token, user, source } = await window.api.login({
        email,
        password,
        subdomain,
      });

      console.log("Login source:", source);
      console.log("User data:", user, "token", token,"password:",password,"user email",user.email);

      let branchId = user?.branch_id || 1;
      const userName = user?.name || "Unknown";

      // ✅ Save login locally
      await window.api.saveLogin(branchId, token, userName);

      const fromDatetime = "2000-08-10 00:00:00";
      const now = new Date();
      const toDatetime = now.toISOString().slice(0, 19).replace("T", " ");
      startSyncScheduler(subdomain,user.email, password, user);

      if (source === "remote") {
        // ✅ First sync with UI progress
        await syncMasterData(
          subdomain,
          token,
          setProgress,
          setStatus,
          user,
          fromDatetime,
          toDatetime
        );
      } else {
        setProgress(100);
        setStatus("Loaded from local storage");
      }

      // ✅ Redirect after sync/login
      setIsAuthenticated(true);
      navigate("/");

      // 🔔 Start background auto-sync
      //startSyncScheduler(subdomain, email, password, user);
      startSyncScheduler(subdomain,user.email,password , user);

    } catch (err) {
      console.error("Login/Menu sync error:", err.message);
      setError("Login or data sync failed. Check console for details.");
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setStatus("Starting sync...");
      }, 1200);
    }
  };

  // 🧹 Cleanup when component unmounts
  useEffect(() => {
    return () => stopSyncScheduler();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={icon} alt="RestroFox" className="h-12" />
        </div>

        {/* Heading */}
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Restaurant Login
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter your email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4 text-blue-600" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot your password?
            </a>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-full bg-blue-900 text-white hover:bg-blue-800"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Progress Bar */}
        {loading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1 text-center">
              {status} {progress > 0 ? `${progress}%` : ""}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <button className="text-sm text-gray-500 hover:text-blue-600">
            🌐 Change Language
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestaurantLogin;
