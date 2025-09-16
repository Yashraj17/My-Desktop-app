import React, { useState, useEffect } from "react";

function CategoryForm({ formMode, initialData, onSave, onCancel }) {
  const [categoryName, setCategoryName] = useState("");
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    if (formMode === "edit" && initialData) {
      setCategoryName(initialData.category_name);
      setLanguage(initialData.language || "English");
    } else {
      setCategoryName("");
      setLanguage("English");
    }
  }, [formMode, initialData]);

  const handleSubmit = () => {
    if (!categoryName.trim()) return;
    onSave({ name: categoryName, language });
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
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {formMode === "add" ? "Add New Category" : "Update Category"}
        </h3>

        {/* Language Dropdown */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Select Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-full"
          >
            <option value="English">English</option>
            <option value="Arabic">Arabic</option>
            <option value="German">German</option>
            <option value="Spanish">Spanish</option>
          </select>
        </div>

        {/* Category Name */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Item Category Name ({language})
          </label>
          <input
            type="text"
            placeholder="e.g., Desserts"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-full"
            required
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-[#00006f] rounded-full hover:bg-[#00005a]"
          >
            {formMode === "add" ? "Add" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryForm;
