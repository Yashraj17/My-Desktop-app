import React, { useState, useEffect } from "react";

function AreaForm({ formMode, initialData, onSave, onCancel }) {
  const [areaName, setAreaName] = useState("");
  const [isSync, setisSync] = useState(false);

  useEffect(() => {
    if (formMode === "edit" && initialData) {
      setAreaName(initialData.area_name);
      setisSync(initialData.isSync === 1);
    } else {
      setAreaName("");
      setisSync(false);
    }
  }, [formMode, initialData]);

  const handleSubmit = () => {
    if (!areaName.trim()) return;
    onSave({ area_name: areaName, isSync });
  };

  return (
    <div className="fixed inset-0 flex justify-end z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      ></div>

      {/* Drawer */}
      <div className="relative bg-white w-full sm:w-[30%] h-full p-6 overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {formMode === "add" ? "Add New Area" : "Update Area"}
        </h3>

        {/* Area Name */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Area Name
          </label>
          <input
            type="text"
            placeholder="e.g., Rooftop"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
            className="block w-full p-2 border border-gray-300"
            required
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

export default AreaForm;
