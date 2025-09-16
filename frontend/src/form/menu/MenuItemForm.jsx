import React, { useState } from "react";
import CategoryForm from "./CategoryForm"; // ✅ adjust path if needed

function MenuItemForm({ formMode, initialData, menus, categories, onSave, onCancel, onAddCategory }) {
  const [language, setLanguage] = useState(initialData?.language || "English");
  const [itemName, setItemName] = useState(initialData?.item_name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [menuId, setMenuId] = useState(initialData?.menu_id || "");
  const [categoryId, setCategoryId] = useState(initialData?.item_category_id || "");
  const [itemType, setItemType] = useState(initialData?.type || "Veg");
  const [prepTime, setPrepTime] = useState(initialData?.preparation_time || "");
  const [isAvailable, setIsAvailable] = useState(initialData?.is_available ? "1" : "0");
  const [hasVariations, setHasVariations] = useState(initialData?.has_variations || false);
  const [price, setPrice] = useState(initialData?.price || "");
  const [image, setImage] = useState(initialData?.image || null);

  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const handleSubmit = () => {
    const payload = {
      item_name: itemName,
      description,
      type: itemType,
      price: parseFloat(price) || 0,
      menu_id: menuId,
      item_category_id: categoryId,
      preparation_time: prepTime || null,
      is_available: isAvailable === "1" ? 1 : 0,
      has_variations: hasVariations ? 1 : 0,
      language,
      image,
    };
    onSave(payload);
  };

  // 🔹 Handle new category save
  const handleCategorySave = (newCategory) => {
    const categoryWithId = {
      id: Date.now(), // if backend returns ID, use that instead
      category_name: newCategory.name,
      language: newCategory.language,
    };
    onAddCategory(categoryWithId);
    setCategoryId(categoryWithId.id);
    setShowCategoryForm(false);
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
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {formMode === "add" ? "Add Menu Item" : "Update Menu Item"}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Fill in the details below to {formMode === "add" ? "add a new" : "update the"} menu item.
        </p>

        {/* Language */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 border rounded-full"
          >
            <option>English</option>
            <option>Arabic</option>
            <option>German</option>
            <option>Spanish</option>
          </select>
        </div>

        {/* Name */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Item Name ({language})</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g., Margherita Pizza"
            className="w-full px-3 py-2 border rounded-full"
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Description ({language})</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., A classic Italian pizza with fresh tomatoes and basil."
            className="w-full px-3 py-2 border rounded-full"
          />
        </div>

        {/* Menu & Category */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Menu</label>
            <select
              value={menuId}
              onChange={(e) => setMenuId(e.target.value)}
              className="w-full px-3 py-2 border rounded-full"
            >
              <option value="">--</option>
              {menus.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Item Category</label>
            <div className="flex items-center gap-2">
              <select
                value={categoryId}
                className="flex-1 px-3 py-2 border rounded-full"
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">--</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowCategoryForm(true)}
                className="px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                ⚙
              </button>
             
            </div>
          </div>
        </div>

        {/* Item Type */}
        <div className="flex flex-wrap gap-2 mb-3">
          {["Veg", "Non Veg", "Egg", "Drink", "Other"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setItemType(type)}
              className={`px-3 py-2 rounded-full ${
                itemType === type
                  ? "bg-[#00006f] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {type === "Veg" && "🥦"}
              {type === "Non Veg" && "🍗"}
              {type === "Egg" && "🥚"}
              {type === "Drink" && "🥤"}
              {type === "Other" && "🍽"} {type}
            </button>
          ))}
        </div>

        {/* Prep Time */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Preparation Time (minutes)</label>
          <input
            type="number"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            className="w-full px-3 py-2 border rounded-full"
          />
        </div>

        {/* Availability */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Available</label>
          <select
            value={isAvailable}
            onChange={(e) => setIsAvailable(e.target.value)}
            className="w-full px-3 py-2 border rounded-full"
          >
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Variations */}
        <div className="mb-3 flex items-center gap-2">
          <input
            type="checkbox"
            checked={hasVariations}
            onChange={(e) => setHasVariations(e.target.checked)}
          />
          <span className="text-sm">Has Variations</span>
        </div>

        {/* Image Upload */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => setImage({ name: file.name, data: reader.result });
                reader.readAsDataURL(file);
              }
            }}
            className="w-full"
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Price (AED)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded-full"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#00006f] text-white rounded-full hover:bg-[#00005a]"
          >
            {formMode === "add" ? "Save" : "Update"}
          </button>
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryForm && (
        <CategoryForm
          formMode="add"
          onSave={handleCategorySave}
          onCancel={() => setShowCategoryForm(false)}
        />
      )}
    </div>
  );
}

export default MenuItemForm;
