import React, { useState, useEffect } from "react";
import { PlusCircle, XCircle } from "lucide-react";

function ModifierGroupForm({ formMode, initialData, onSave, onCancel }) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [maxQty, setMaxQty] = useState(1);
  const [modifiers, setModifiers] = useState([{ name: "", price: 0, is_available: true }]);

  useEffect(() => {
    if (formMode === "edit" && initialData) {
      setGroupName(initialData.name || "");
      setDescription(initialData.description || "");
      setLanguage(initialData.language || "English");
      setMaxQty(initialData.max_quantity || 1);

      let parsedOptions = [];
      if (Array.isArray(initialData.options)) {
        parsedOptions = initialData.options;
      } else if (typeof initialData.options === "string") {
        try {
          parsedOptions = JSON.parse(initialData.options);
        } catch {
          parsedOptions = [];
        }
      }
      setModifiers(parsedOptions.length ? parsedOptions : [{ name: "", price: 0, is_available: true }]);
    } else {
      setGroupName("");
      setDescription("");
      setLanguage("English");
      setMaxQty(1);
      setModifiers([{ name: "", price: 0, is_available: true }]);
    }
  }, [formMode, initialData]);

  const handleModifierChange = (index, key, value) => {
    const updated = [...modifiers];
    updated[index][key] = value;
    setModifiers(updated);
  };

  const addModifier = () => setModifiers([...modifiers, { name: "", price: 0, is_available: true }]);
  const removeModifier = (index) => setModifiers(modifiers.filter((_, i) => i !== index));

  const handleSubmit = () => {
    if (!groupName.trim()) return;
    onSave({ name: groupName, description, language, max_quantity: maxQty, options: modifiers });
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
          {formMode === "add" ? "Add Modifier Group" : "Update Modifier Group"}
        </h3>

        {/* Language Selector */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Select Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="block w-full p-2 border rounded-full"
          >
            <option value="English">English</option>
            <option value="Arabic">Arabic</option>
            <option value="German">German</option>
            <option value="Spanish">Spanish</option>
          </select>
        </div>

        {/* Group Name */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Modifier Group Name ({language})</label>
          <input
            type="text"
            placeholder="e.g., Cheese Options"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="block w-full p-2 border rounded-full"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Description ({language})</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full p-2 border rounded-full"
            placeholder="e.g., Extra toppings for your pizza"
          />
        </div>

        {/* Modifier Options */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Modifier Options</label>
          {modifiers.map((mod, index) => (
            <div key={index} className="p-3 border rounded-md mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g., Extra Cheese"
                  value={mod.name}
                  onChange={(e) => handleModifierChange(index, "name", e.target.value)}
                  className="flex-1 border rounded-full px-2 py-1 text-sm"
                />
                <input
                  type="number"
                  value={mod.price}
                  onChange={(e) => handleModifierChange(index, "price", parseFloat(e.target.value))}
                  className="w-24 border rounded-full px-2 py-1 text-sm"
                  placeholder="Price"
                />
                <button onClick={() => removeModifier(index)} className="text-red-600 hover:text-red-800">
                  <XCircle size={18} />
                </button>
              </div>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={mod.is_available}
                  onChange={(e) => handleModifierChange(index, "is_available", e.target.checked)}
                  className="mr-2"
                />
                Is Available
              </label>
            </div>
          ))}

          <button
            type="button"
            onClick={addModifier}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <PlusCircle size={18} className="mr-1" /> Add Modifier Option
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-800 rounded-full hover:bg-blue-900"
          >
            {formMode === "add" ? "Add" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModifierGroupForm;
