import React from "react";

function ModifierForm({ modifier, setModifier, menuItems, modifierGroups, formMode, onSave }) {
  return (
    <div className="p-6 bg-white rounded-md w-full max-w-lg">
      <h3 className="text-lg font-semibold mb-4">
        {formMode === "add" ? "Add Modifier" : "Update Modifier"}
      </h3>

      {/* Menu Item Name */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Menu Item Name</label>
        <select
          value={modifier.menu_item_id}
          onChange={(e) =>
            setModifier({ ...modifier, menu_item_id: e.target.value })
          }
          className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm"
          required
        >
          <option value="">Select Menu Item</option>
          {menuItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.item_name}
            </option>
          ))}
        </select>
      </div>

      {/* Modifier Group */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Modifier Group</label>
        <select
          value={modifier.modifier_group_id}
          onChange={(e) =>
            setModifier({ ...modifier, modifier_group_id: e.target.value })
          }
          className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm"
          required
        >
          <option value="">Select Modifier Group</option>
          {modifierGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      {/* Allow Multiple Selection */}
      <div className="mb-4">
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            checked={modifier.allow_multiple_selection}
            onChange={(e) =>
              setModifier({
                ...modifier,
                allow_multiple_selection: e.target.checked,
              })
            }
            className="mr-2"
          />
          Allow Multiple Selection
        </label>
      </div>

      {/* Is Required */}
      <div className="mb-4">
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            checked={modifier.is_required}
            onChange={(e) =>
              setModifier({
                ...modifier,
                is_required: e.target.checked,
              })
            }
            className="mr-2"
          />
          Is Required
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <form method="dialog">
          <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-full border">
            Cancel
          </button>
        </form>
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm bg-blue-800 hover:bg-blue-900 text-white rounded-full"
        >
          {formMode === "add" ? "Add" : "Update"}
        </button>
      </div>
    </div>
  );
}

export default ModifierForm;
