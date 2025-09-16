import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function MenuForm({ formMode, initialData, onSave, onCancel }) {
  const [menuName, setMenuName] = useState("");
  const [showOnCustomerSite, setShowOnCustomerSite] = useState(false);

  useEffect(() => {
    if (formMode === "edit" && initialData) {
      setMenuName(initialData.name || "");
      setShowOnCustomerSite(!!initialData.show_on_customer_site);
    } else {
      setMenuName("");
      setShowOnCustomerSite(false);
    }
  }, [formMode, initialData]);

  const handleSubmit = async () => {
    if (!menuName.trim()) {
      Swal.fire({ icon: "warning", title: "Required", text: "Enter menu name" });
      return;
    }
    const payload = {
      menu_name: menuName,
      show_on_customer_site: showOnCustomerSite ? 1 : 0,
    };
    try {
      if (formMode === "edit" && initialData) {
        await window.api.updateMenu(initialData.id, payload);
      } else {
        await window.api.addMenu(payload);
      }
      Swal.fire({
        icon: "success",
        title: `Menu ${formMode === "edit" ? "updated" : "added"}`,
        timer: 1500,
        showConfirmButton: false,
      });
      onSave();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message });
    }
  };

  return (
<div className="fixed inset-0 flex justify-end z-50">
  {/* Overlay */}
  <div 
    className="absolute inset-0 bg-black/40"
    onClick={onCancel} // click outside to close
  ></div>

  {/* Drawer */}
  <div className="relative bg-white w-full sm:w-[700px] max-w-md h-full p-6 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {formMode === "add" ? "Add Menu" : "Update Menu"}
        </h3>
        <input
          type="text"
          placeholder="Menu name"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          className="w-full px-3 py-2 border rounded-full mb-3"
        />
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={showOnCustomerSite}
            onChange={(e) => setShowOnCustomerSite(e.target.checked)}
          />
          Show on customer site
        </label>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#00006f] text-white rounded-full"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuForm;
