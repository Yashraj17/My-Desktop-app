const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  saveLogin: (branchId, token,name) => ipcRenderer.invoke("store:setLogin", { branchId, token,name }),
  getStore: (key) => ipcRenderer.invoke("store:get", key),
  logout: () => ipcRenderer.invoke("store:logout"),
  login: (credentials) => ipcRenderer.invoke("login", credentials), // new

  setBranchId: (id) => ipcRenderer.send("set-branch-id", id),
  getCategories: () => ipcRenderer.invoke("get-categories"),
  addCategory: (name) => ipcRenderer.invoke("add-category", name),
  updateCategory: (id, name) => ipcRenderer.invoke("update-category", id, name),
  deleteCategory: (id) => ipcRenderer.invoke("delete-category", id),
  //item modifiers
  getModifiers: async () => ipcRenderer.invoke("get-modifiers"),
  addModifier: async (name) => ipcRenderer.invoke("add-modifier", name),
  updateModifier: async (id, modifier) =>
    ipcRenderer.invoke("update-modifier", { id, modifier }),
  deleteModifier: async (id) => ipcRenderer.invoke("delete-modifier", id),

  //ModifierGroups
  getModifierGroups: async () => ipcRenderer.invoke("get-modifier-groups"),
  addModifierGroup: async (name, description) =>
    ipcRenderer.invoke("add-modifier-group", name, description),
  updateModifierGroup: async (id, payload) =>
    ipcRenderer.invoke("update-modifier-group", { id, ...payload }),
  deleteModifierGroup: async (id) =>
    ipcRenderer.invoke("delete-modifier-group", id),

  getMenuItems: () => ipcRenderer.invoke("get-menu-items"),
  addMenuItem: (payload) => ipcRenderer.invoke("add-menu-item", payload),
  updateMenuItem: (id, payload) =>
    ipcRenderer.invoke("update-menu-item", { id, ...payload }),
  deleteMenuItem: (id) => ipcRenderer.invoke("delete-menu-item", id),

  getMenusWithItems: () => ipcRenderer.invoke("get-menus-with-items"),
  deleteMenuItem: (menuId, itemId) =>
    ipcRenderer.invoke("delete-menu-item", menuId, itemId),
  updateMenuItemField: (itemId, field, value) =>
    ipcRenderer.invoke("update-menu-item-field", itemId, field, value),
  // Menu functions
  addMenu: (menuData) => ipcRenderer.invoke("add-menu", menuData),
  addMenuBackup: (menuData) => ipcRenderer.invoke("add-menu-backup", menuData),
  updateMenu111: (id, menuData) => ipcRenderer.invoke("update-menu", id, menuData),
   updateMenu: (id, payload) =>
    ipcRenderer.invoke("update-menu", { id, ...payload }),
  deleteMenu: (id) => ipcRenderer.invoke("delete-menu", id),

  getUploadsPath: (filename) => ipcRenderer.invoke("get-uploads-path", filename),

 //Country Backup
  addCountryBackup: (countryData) =>
    ipcRenderer.invoke("add-country-backup", countryData),

  //Currency Backup
  addCurrencyBackup: (currencyData) =>
    ipcRenderer.invoke("add-currency-backup", currencyData),

  //Global Currency Backup
  addGlobalCurrencyBackup: (globalCurrencyData) =>
    ipcRenderer.invoke("add-global-currency-backup", globalCurrencyData),

  //Package Backup
  addPackageBackup: (packageData) =>
    ipcRenderer.invoke("add-package-backup", packageData),

  //Restaurant Backup
  addRestaurantBackup: (restaurantData) =>
    ipcRenderer.invoke("add-restaurant-backup", restaurantData),

  //Branch Backup
  addBranchBackup: (branchData) =>
    ipcRenderer.invoke("add-branch-backup", branchData),
   saveUser: (user, plainPassword) =>
    ipcRenderer.invoke("save-user", { user, plainPassword }),

   //Area Backup 
  addAreaBackup: (Data) =>
    ipcRenderer.invoke("add-area-backup", Data),
   
  //addBranchDeliverySetting Backup
  addBranchDeliverySettingBackup: (Data) =>
    ipcRenderer.invoke("add-branch-delivery-settings-backup", Data),

  //addContactBackup
  addContactBackup: (Data) =>
    ipcRenderer.invoke("add-contact-backup", Data),

  //addCustomerBackup
  addCustomerBackup: (Data) =>
    ipcRenderer.invoke("add-customer-backup", Data), 

//addDeliveryExecutiveBackup
  addDeliveryExecutiveBackup: (Data) =>
    ipcRenderer.invoke("add-delivery-executive-backup", Data), 
  
  //addDesktopApplicationBackup
    addDesktopApplicationBackup: (Data) =>
    ipcRenderer.invoke("add-desktop-application-backup", Data), 

    //addEmailSettingBackup
    addEmailSettingBackup: (Data) =>
    ipcRenderer.invoke("add-email-setting-backup", Data),
    //addExpenseCategoryBackup
    addExpenseCategoryBackup: (Data) =>
    ipcRenderer.invoke("add-expense-category-backup", Data),
     //addExpenseBackup
    addExpenseBackup: (Data) =>
    ipcRenderer.invoke("add-expense-backup", Data),
     //addExpenseBackup
    addMenuItemBackup: (Data) =>
    ipcRenderer.invoke("add-menu-item-backup", Data),
     //addExpenseBackup
    addMenuItemTranslationBackup: (Data) =>
    ipcRenderer.invoke("add-menu-item-traslation-backup", Data),
    //addMenuItemVariationBackup
    addMenuItemVariationBackup: (Data) =>
    ipcRenderer.invoke("add-menu-item-variation-backup", Data),
    //addMenuCategoryBackup
    addMenuCategoryBackup: (Data) =>
    ipcRenderer.invoke("add-menu-category-backup", Data),
     //addModifierGroupBackup
    addModifierGroupBackup: (Data) =>
    ipcRenderer.invoke("add-modifier-group-backup", Data),
     //addItemModifierBackup
    addItemModifierBackup: (Data) =>
    ipcRenderer.invoke("add-item-modifier-backup", Data),
    //addFailedJobBackup
    addFailedJobBackup: (Data) =>
    ipcRenderer.invoke("add-faild-job-backup", Data),
    //addFileStorageBackup
    addFileStorageBackup: (Data) =>
    ipcRenderer.invoke("add-file-storage-backup", Data),
    //addFileStorageSettingBackup
    addFileStorageSettingBackup: (Data) =>
    ipcRenderer.invoke("add-file-storage-setting-backup", Data),
    //addFlagBackup
    addFlagBackup: (Data) =>
    ipcRenderer.invoke("add-flag-backup", Data),
    //addTableBackup
    addTableBackup: (Data) =>
    ipcRenderer.invoke("add-table-backup", Data),
    //addInventorySettingBackup
    addInventorySettingBackup: (Data) =>
    ipcRenderer.invoke("add-inventory-setting-backup", Data),
    //addInventoryStockBackup
    addInventoryStockBackup: (Data) =>
    ipcRenderer.invoke("add-inventory-stock-backup", Data),
    //addInventoryMovementBackup
    addInventoryMovementBackup: (Data) =>
    ipcRenderer.invoke("add-inventory-movement-backup", Data),
    //addInventoryItemCategoryBackup
    addInventoryItemCategoryBackup: (Data) =>
    ipcRenderer.invoke("add-inventory-item-category-backup", Data),
    //addInventoryItemBackup
    addInventoryItemBackup: (Data) =>
    ipcRenderer.invoke("add-inventory-item-backup", Data),
    //addInventoryGlobalSettingBackup
    addInventoryGlobalSettingBackup: (Data) =>
    ipcRenderer.invoke("add-inventory-global-setting-backup", Data),
});

