import React, { useState, useEffect } from "react";

// ✅ Pass roles from parent
function StaffForm({ formMode, initialData, onSave, onCancel, roles }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+91"); // default code
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");

  // ✅ Example country codes
  const phoneCodes = ["+91", "+1", "+44", "+61", "+81", "+1684", "+93", "+213", "+358"];

  useEffect(() => {
    if (formMode === "edit" && initialData) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone_number || "");
      setPhoneCode(initialData.phone_code || "+91");
      setRole(initialData.role || "");
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setPhoneCode("+91");
      setRole("");
    }
  }, [formMode, initialData]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({
      name,
      email,
      phone_number: phone,
      phone_code: phoneCode,
      role,
      isSync: false,
    });
  };

  return (
    <div className="fixed inset-0 flex justify-end z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel}></div>

      {/* Drawer */}
      <div className="relative bg-white w-full sm:w-[30%] h-full p-6 overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {formMode === "add" ? "Add Staff" : "Update Staff"}
        </h3>

        {/* Name */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            placeholder="e.g., John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="e.g., john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Phone with Code */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Restaurant Phone Number
          </label>
          <div className="flex">
            <select
              value={phoneCode}
              onChange={(e) => setPhoneCode(e.target.value)}
              className="border border-gray-300 rounded-l p-2 w-28"
            >
              {phoneCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-r"
            />
          </div>
        </div>

        {/* Role Dropdown */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.name}>
                {r.display_name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-[#00006f] hover:bg-[#00005a] rounded"
          >
            {formMode === "add" ? "Add" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StaffForm;
