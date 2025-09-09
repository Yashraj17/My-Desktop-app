import React, { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import Swal from "sweetalert2";
import foodImage from "/images/food.svg";
import MenuItemForm from "../../form/menu/MenuItemForm";
import CategoryForm from "../../form/menu/CategoryForm";

function MenuItem() {
  const [items, setItems] = useState([]);
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formMode, setFormMode] = useState("add");
  const [editData, setEditData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const loadData = async () => {
    const data = await window.api.getMenuItems();
    const menus = await window.api.getMenusWithItems();
    const cats = await window.api.getCategories();

    const itemsWithPaths = await Promise.all(
      data.map(async (item) => ({
        ...item,
        imagePath: item.image
          ? await window.api.getUploadsPath(item.image)
          : null,
      }))
    );

    setItems(itemsWithPaths);
    setMenus(menus);
    setCategories(cats);
  };

  const handleSave = async (payload) => {
    try {
      if (formMode === "edit" && editData) {
        await window.api.updateMenuItem(editData.id, payload);
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
      setShowForm(false);
      setEditData(null);
      loadData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error saving menu item",
      });
    }
  };

  const handleDelete = async (id) => {
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
      await window.api.deleteMenuItem(id);
      loadData();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  // when a new category is added from CategoryForm
  const handleCategorySave = async (categoryName) => {
    try {
      await window.api.addCategory(categoryName);
      Swal.fire({
        icon: "success",
        title: "Category added",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
      setShowCategoryForm(false);
      loadData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error saving category",
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = items.filter((it) =>
    (it.item_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-800">Menu Items</h1>
        <button
          onClick={() => {
            setFormMode("add");
            setEditData(null);
            setShowForm(true);
          }}
          className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-full text-sm"
        >
          Add Menu Item
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search menu items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm mb-4"
      />

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
              <th className="px-4 py-2 text-center">Customer Site</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <img
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
                  <td className="px-4 py-2">{`AED ${Number(item.price).toFixed(
                    2
                  )}`}</td>
                  <td className="px-4 py-2">{item.category_name}</td>
                  <td className="px-4 py-2">{item.menu_name}</td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={!!item.is_available}
                      readOnly
                      className="accent-[#00006f]"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={!!item.show_on_customer_site}
                      readOnly
                      className="accent-[#00006f]"
                    />
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setFormMode("edit");
                        setEditData(item);
                        setShowForm(true);
                      }}
                      className="px-3 py-1 text-xs bg-gray-100 border rounded-full hover:bg-gray-200"
                    >
                      <Pencil size={14} className="inline mr-1" /> Update
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <Trash size={14} className="inline mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-2 text-center text-gray-500">
                  No menu items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Item Form */}
      {showForm && (
        <MenuItemForm
          formMode={formMode}
          initialData={editData}
          menus={menus}
          categories={categories}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          onAddCategory={(cat) => {
            setCategories([...categories, cat]);
          }}
        />
      )}

      {/* Category Form */}
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

export default MenuItem;
