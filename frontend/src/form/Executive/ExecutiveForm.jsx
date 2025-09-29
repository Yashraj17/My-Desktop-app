import React, { useState, useEffect } from "react";

function ExecutiveForm({ formMode, initialData, onSave, onCancel }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("available");

  useEffect(() => {
    if (formMode === "edit" && initialData) {
      setName(initialData.name || "");
      setPhone(initialData.phone || "");
      setStatus(initialData.status || "available");
    } else {
      setName("");
      setPhone("");
      setStatus("available");
    }
  }, [formMode, initialData]);

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) return;
    onSave({
      name,
      phone,
      status,
      isSync: false,
    });
  };

  return (
    <div className="fixed inset-0 flex justify-end z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel}></div>
      <div className="relative bg-white w-full sm:w-[30%] h-full p-6 overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {formMode === "add" ? "Add Executive" : "Update Executive"}
        </h3>

        {/* Name */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            placeholder="e.g., Sherwino"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full p-2 border border-gray-300"
            required
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            placeholder="e.g., 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="block w-full p-2 border border-gray-300"
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="block w-full p-2 border border-gray-300"
          >
            <option value="available">Available</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-[#00006f] hover:bg-[#00005a]"
          >
            {formMode === "add" ? "Add" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExecutiveForm;
