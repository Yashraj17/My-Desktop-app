import React, { useEffect, useState, useRef } from "react";
import { Pencil, Trash } from "lucide-react";
import Swal from "sweetalert2";
import "./styles.css";
import foodImage from "/images/food.svg";

function MenuManagement() {
  const [menus, setMenus] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [formMode, setFormMode] = useState("add");
  const [editId, setEditId] = useState(null);
  const dialogRef = useRef(null);
  const dialogRefMenu = useRef(null);
  const dialogRef1 = useRef(null);
  const [language, setLanguage] = useState("en");
  const [description, setDescription] = useState("");
  const [menuId, setMenuId] = useState(1);
  const [menuName, setMenuName] = useState("");
  const [showOnCustomerSite, setShowOnCustomerSite] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [categories, setCategories] = useState([]);
  const [itemType, setItemType] = useState("Veg");
  const [prepTime, setPrepTime] = useState(0);
  const [isAvailable, setIsAvailable] = useState(1);
  const [hasVariations, setHasVariations] = useState(false);
  const [categoryName, setCategoryName] = useState("");
 
  const loadData = async () => {
    const datann = await window.api.getMenuItems();
    const data = await window.api.getMenusWithItems();
    const data1 = await window.api.getCategories();

    // Resolve image paths for all items inside menus
    const menusWithPaths = await Promise.all(
      data.map(async (menu) => {
        const itemsWithPaths = await Promise.all(
          menu.items.map(async (item) => ({
            ...item,
            imagePath: item.image
              ? await window.api.getUploadsPath(item.image)
              : null,
          }))
        );
        return {
          ...menu,
          items: itemsWithPaths,
        };
      })
    );

    setMenus(menusWithPaths);
    setCategories(data1);

    console.log("Menus with paths:", menusWithPaths, "menuuuu");
    console.log("Categories:", data1, "Raw Items:", datann);

    if (data.length > 0) setActiveMenuId(data[0].id);
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeMenu = menus.find((m) => m.id === activeMenuId);

  const filteredItems = activeMenu
    ? activeMenu.items.filter((item) =>
        item.menu_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSave = async () => {
    if (!itemName.trim() || !price.trim() || !categories || !itemType) {
      Swal.fire({
        icon: "warning",
        title: "Required",
        text: "Please fill in all required fields.",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const payload = {
      item_name: itemName,
      image,
      description: description || "",
      type: itemType,
      price: parseFloat(price),
      menu_id: menuId || 1,
      item_category_id: categoryId || 1,
      preparation_time: prepTime || null,
      is_available: isAvailable ? 1 : 0,
    };

    try {
      if (formMode === "edit" && editId !== null) {
        await window.api.updateMenuItem(editId, payload);
        Swal.fire({
          icon: "success",
          title: "Menu item updated",
          toast: true,
          position: "top-end",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await window.api.addMenuItem(payload);
        Swal.fire({
          icon: "success",
          title: "Menu item added",
          toast: true,
          position: "top-end",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      setTimeout(() => {
        resetForm();
        dialogRef.current.close();
        loadData();
      }, 100);
    } catch (error) {
      console.error("Error saving menu item:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error saving menu item",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setEditId(item.id);
    setItemName(item.item_name);
    setImage(item.image || "");
    setDescription(item.description || "");
    setItemType(item.type || "");
    setPrice(item.price?.toString() || "");
    setMenuId(item.menu_id || 1);
    setCategoryId(item.item_category_id || 1);
    setPrepTime(item.preparation_time || "");
    setIsAvailable(!!item.is_available);
    setTimeout(() => dialogRef.current?.showModal(), 0);
  };

  const resetForm = () => {
    setItemName("");
    setImage("");
    setDescription("");
    setItemType("");
    setPrice("");
    setPrepTime("");
    setIsAvailable(true);
  };

  const deleteItem = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this menu item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await window.api.deleteMenuItem(id);
        await loadData();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Menu item deleted successfully.",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Failed to delete menu item:", error);
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Failed to delete menu item",
        });
      }
    }
  };

  const handleSavecat = async () => {
    if (!categoryName.trim()) return;

    try {
      if (formMode === "edit" && editId !== null) {
        await window.api.updateCategory(editId, categoryName);
        Swal.fire({
          icon: "success",
          title: "Category updated",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await window.api.addCategory(categoryName);
        Swal.fire({
          icon: "success",
          title: "Category added",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      // UI reset with slight delay
      setTimeout(() => {
        setCategoryName("");
        setEditId(null);
        dialogRef1.current.close();
        loadData();
      }, 100);
    } catch (error) {
      console.error("Error saving category:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error saving category",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const handleAddNewcat = () => {
    setFormMode("add");
    setCategoryName("");
    setEditId(null);
    setTimeout(() => dialogRef1.current?.showModal(), 0);
  };

  //menu

  const handleSaveMenu = async () => {
    if (!menuName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Required",
        text: "Please enter a menu name.",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const payload = {
      menu_name: menuName,
      show_on_customer_site: showOnCustomerSite ? 1 : 0,
    };

    try {
      if (formMode === "edit" && editId !== null) {
        await window.api.updateMenu(editId, payload);
        Swal.fire({
          icon: "success",
          title: "Menu updated",
          toast: true,
          position: "top-end",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await window.api.addMenu(payload);
        Swal.fire({
          icon: "success",
          title: "Menu added",
          toast: true,
          position: "top-end",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      setTimeout(() => {
        resetMenuForm();
        dialogRefMenu.current.close();
        loadData();
      }, 100);
    } catch (error) {
      console.error("Error saving menu:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error saving menu",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const handleEditMenu = (menu) => {
    setFormMode("edit");
    setEditId(menu.id);
    setMenuName(menu.name);
    setShowOnCustomerSite(!!menu.show_on_customer_site);
    setTimeout(() => dialogRefMenu.current?.showModal(), 0);
  };

  const handleAddNewMenu = () => {
    setFormMode("add");
    resetMenuForm();
    setEditId(null);
    setTimeout(() => dialogRefMenu.current?.showModal(), 0);
  };

  const resetMenuForm = () => {
    setMenuName("");
    setShowOnCustomerSite(false);
  };

  const deleteMenu = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this menu?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await window.api.deleteMenu(id);
        await loadData();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Menu deleted successfully.",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Failed to delete menu:", error);
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Failed to delete menu",
        });
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Menus</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800 shadow-md transition">
            Organize Menu Items
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800 shadow-md transition"
            onClick={() => handleAddNewMenu()}
          >
            Add Menu
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search menu here..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Menu Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {menus.map((menu) => (
          <button
            key={menu.id}
            className={`flex items-center gap-3 px-6 py-3 min-w-[250px] rounded border transition ${
              menu.id === activeMenuId
                ? "bg-blue-900 text-white"
                : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setActiveMenuId(menu.id)}
          >
            <span className="text-lg">📋</span>
            <div className="text-left">
              <strong>{menu.name}</strong>
              <br />
              <small
                className={
                  menu.id === activeMenuId ? "text-white" : "text-gray-500"
                }
              >
                {menu.items.length} Item(s)
              </small>
            </div>
          </button>
        ))}
      </div>

      {/* Active Menu Items */}
      {activeMenu && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">{activeMenu.name}</h3>
            <div className="flex gap-2">
              <button
                className="inline-flex items-center px-3 py-1 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border"
                onClick={() => handleEditMenu(activeMenu)}
              >
                Update
              </button>
              <button
                className="inline-flex items-center px-3 py-1 text-xs text-white bg-red-600 hover:bg-red-700 rounded-md"
                onClick={() => deleteMenu(activeMenu.id)}
              >
                Delete
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-md shadow-sm">
            <table className="w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs border-b">
                <tr>
                  <th className="px-4 py-2">Item Name</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Menu</th>
                  <th className="px-4 py-2 text-center">Available</th>
                  <th className="px-4 py-2 text-center">
                    Show on Customer Site
                  </th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      {/* Item Image & Name */}
                      <td className="px-4 py-2">
                        <div className="flex items-center space-x-3">
                          <img
                            //src={item.image ? `/uploads/${item.image}` : "/images/food.svg"}
                            src={item.imagePath || foodImage}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <strong className="block text-gray-800">
                              {item.item_name}
                            </strong>
                            <p className="text-sm text-gray-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">{`AED${Number(
                        item.price
                      ).toFixed(2)}`}</td>
                      <td className="px-4 py-2">{item.category_name}</td>
                      <td className="px-4 py-2">{item.menu_name}</td>
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-3 w-3 accent-[#00006f]"
                          checked={!!item.is_available}
                        />
                      </td>

                      {/* Show on Customer Site */}
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-3 w-3 accent-[#00006f]"
                          checked={!!item.show_on_customer_site}
                        />
                      </td>

                      <td className="px-4 py-2 text-right whitespace-nowrap flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border rounded-md hover:bg-gray-200 transition-colors duration-150"
                        >
                          <Pencil size={14} className="mr-1" /> Update
                        </button>

                        <button
                          onClick={() => deleteItem(item.id)}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-150"
                        >
                          <Trash size={14} className="mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      No menu items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      {/* Modal */}
      <dialog
        ref={dialogRef}
        className="rounded-lg p-6 max-w-lg w-full bg-white shadow-lg"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {formMode === "add" ? "Add Menu Item" : "Update Menu Item"}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Fill in the details below to{" "}
            {formMode === "add" ? "add a new" : "update the"} menu item.
          </p>

          {/* Language */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Select Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="English">English</option>
              <option value="Arabic">Arabic</option>
              <option value="German">German</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>

          {/* Name */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Item Name ({language})
            </label>
            <input
              type="text"
              placeholder="e.g., Margherita Pizza"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Item Description ({language})
            </label>
            <textarea
              placeholder="e.g., A classic Italian pizza with fresh tomatoes and basil."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Menu & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Choose Menu
              </label>
              <select
                value={menuId}
                className="w-full px-3 py-2 border rounded"
                onChange={(e) => setMenuId(e.target.value)}
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
              <label className="block text-sm font-medium mb-1">
                Item Category
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={categoryId}
                  className="flex-1 px-3 py-2 border rounded"
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
                  onClick={handleAddNewcat}
                  className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  ⚙
                </button>
              </div>
            </div>
          </div>

          {/* Type Buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            {["Veg", "Non Veg", "Egg", "Drink", "Other"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setItemType(type)}
                className={`px-3 py-2 rounded ${
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
            <label className="block text-sm font-medium mb-1">
              Preparation Time
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-20 px-3 py-2 border rounded"
              />
              <span className="text-gray-600">Minutes</span>
            </div>
          </div>

          {/* Availability */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Is Available
            </label>
            <select
              value={isAvailable}
              onChange={(e) => setIsAvailable(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>

          {/* Image */}

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Item Image</label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    // Save both file name and content
                    setImage({ name: file.name, data: reader.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full"
            />
          </div>
          {/* Variations */}
          <label className="flex items-center gap-2 mb-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={hasVariations}
              onChange={(e) => setHasVariations(e.target.checked)}
            />
            Has Variations
          </label>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              placeholder="AED 0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-2">
            <form method="dialog">
              <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Cancel
              </button>
            </form>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#00006f] text-white rounded hover:bg-[#00005a]"
            >
              Save
            </button>
          </div>
        </div>
      </dialog>

      {/* Modal category*/}

      <dialog
        id="categoryModal"
        ref={dialogRef1}
        className="modal-dialog bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
      >
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {formMode === "add" ? "Add New Category" : "Update Category"}
          </h3>

          {/* Language Dropdown */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="English">English</option>
              <option value="Arabic">Arabic</option>
              <option value="German">German</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>

          {/* Category Name */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Item Category Name ({language})
            </label>
            <input
              type="text"
              placeholder="e.g., Desserts"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <form method="dialog">
              <button
                type="submit"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
              >
                Cancel
              </button>
            </form>
            <button
              onClick={handleSavecat}
              className="px-4 py-2 text-white bg-[#00006f] rounded hover:bg-[#00005a] dark:bg-blue-500 dark:hover:bg-[#00006f]"
            >
              {formMode === "add" ? "Add" : "Update"}
            </button>
          </div>
        </div>
      </dialog>

      {/* Modal menu*/}
      <dialog
        id="menuModal"
        ref={dialogRefMenu}
        className="modal-dialog bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
      >
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {formMode === "add" ? "Add New Menu" : "Update Menu"}
          </h3>

          {/* Language Dropdown */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="English">English</option>
              <option value="Arabic">Arabic</option>
              <option value="German">German</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>

          {/* Menu Name Input */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Menu Name ({language})
            </label>
            <input
              type="text"
              placeholder="e.g., Breakfast"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          {/* Show on Customer Site */}
          <div className="mb-4 flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showOnCustomerSite}
              onChange={(e) => setShowOnCustomerSite(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show on Customer Site
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <form method="dialog">
              <button
                type="submit"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
              >
                Cancel
              </button>
            </form>
            <button
              onClick={handleSaveMenu}
              className="px-4 py-2 text-white bg-[#00006f] rounded hover:bg-[#00005a] dark:bg-blue-500 dark:hover:bg-[#00006f]"
            >
              {formMode === "add" ? "Add" : "Update"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default MenuManagement;
