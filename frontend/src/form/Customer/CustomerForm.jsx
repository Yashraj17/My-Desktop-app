import React, { useState, useEffect } from "react";

function CustomerForm({ formMode, initialData, onSave, onCancel }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (formMode === "edit" && initialData) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setAddress(initialData.delivery_address || "");
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
    }
  }, [formMode, initialData]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({
      name,
      email,
      phone,
      delivery_address: address,
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
          {formMode === "add" ? "Add Customer" : "Update Customer"}
        </h3>

        {/* Name */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Customer Name
          </label>
          <input
            type="text"
            placeholder="e.g., John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full p-2 border border-gray-300"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            placeholder="e.g., john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full p-2 border border-gray-300"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            placeholder="e.g., +123456789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="block w-full p-2 border border-gray-300"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            placeholder="Customer address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="block w-full p-2 border border-gray-300"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300"
          >
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

export default CustomerForm;
