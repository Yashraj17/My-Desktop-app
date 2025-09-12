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
    
    //addFrontDetailBackup
    addFrontDetailBackup: (Data) =>
    ipcRenderer.invoke("add-front-detail-backup", Data),
    //addFrontFaqSettingBackup
    addFrontFaqSettingBackup: (Data) =>
    ipcRenderer.invoke("add-front-faq-setting-backup", Data),
    //addFrontFeatureBackup
    addFrontFeatureBackup: (Data) =>
    ipcRenderer.invoke("add-front-feature-backup", Data),
    //addFrontReviewSettingBackup
    addFrontReviewSettingBackup: (Data) =>
    ipcRenderer.invoke("add-front-review-setting-backup", Data),
    //addGlobalInvoiceBackup
    addGlobalInvoiceBackup: (Data) =>
    ipcRenderer.invoke("add-global-invoice-backup", Data),
    //addGlobalSettingBackup
    addGlobalSettingBackup: (Data) =>
    ipcRenderer.invoke("add-global-setting-backup", Data),
    //addGlobalSubscriptionBackup
    addGlobalSubscriptionBackup: (Data) =>
    ipcRenderer.invoke("add-global-subscription-backup", Data),
    //addJobBackup
    addJobBackup: (Data) =>
    ipcRenderer.invoke("add-job-backup", Data),
    //addModifierOptionBackup
    addModifierOptionBackup: (Data) =>
    ipcRenderer.invoke("add-modifire-option-backup", Data),
    //addJobBatchBackup
    addJobBatchBackup: (Data) =>
    ipcRenderer.invoke("add-job-batch-backup", Data),
    //addKotBackup
    addKotBackup: (Data) =>
    ipcRenderer.invoke("add-kot-backup", Data),
    //addKotCancelReasonBackup
    addKotCancelReasonBackup: (Data) =>
    ipcRenderer.invoke("add-kot-cancel-reason-backup", Data),
    //addKotItemBackup
    addKotItemBackup: (Data) =>
    ipcRenderer.invoke("add-kot-item-backup", Data),
    //addKotItemModifierOptionBackup
    addKotItemModifierOptionBackup: (Data) =>
    ipcRenderer.invoke("add-kot-item-modifier-option-backup", Data),
    //addKotPlaceBackup
    addKotPlaceBackup: (Data) =>
    ipcRenderer.invoke("add-kot-place-backup", Data),
    //addKotSettingBackup
    addKotSettingBackup: (Data) =>
    ipcRenderer.invoke("add-kot-setting-backup", Data),
    //addLanguageSettingBackup
    addLanguageSettingBackup: (Data) =>
    ipcRenderer.invoke("add-language-setting-backup", Data),
    //addLtmTranslationBackup
     addLtmTranslationBackup: (Data) =>
    ipcRenderer.invoke("add-ltm-translation-backup", Data),
    //addMigrationBackup
     addMigrationBackup: (Data) =>
    ipcRenderer.invoke("add-migration-backup", Data),
     //addModelHasPermissionBackup
     addModelHasPermissionBackup: (Data) =>
    ipcRenderer.invoke("add-model-has-permission-backup", Data),
     //addModelHasRoleBackup
     addModelHasRoleBackup: (Data) =>
    ipcRenderer.invoke("add-model-has-role-backup", Data),
     //addModuleBackup
     addModuleBackup: (Data) =>
    ipcRenderer.invoke("add-module-backup", Data),
     //addNotificationSettingBackup
      addNotificationSettingBackup: (Data) =>
    ipcRenderer.invoke("add-notification-setting-backup", Data),
      //addOfflinePaymentMethodBackup
      addOfflinePaymentMethodBackup: (Data) =>
    ipcRenderer.invoke("add-offline-payment-method-backup", Data),
      //addOfflinePlanChangeBackup
      addOfflinePlanChangeBackup: (Data) =>
    ipcRenderer.invoke("add-offline-plan-change-backup", Data),
      //addOnboardingStepBackup
      addOnboardingStepBackup: (Data) =>
    ipcRenderer.invoke("add-onboarding-step-backup", Data),
      //saveSyncTime
      saveSyncTime: (Data) =>
    ipcRenderer.invoke("save-sync-time", Data),

       /// Area functions
    getAreas: () => ipcRenderer.invoke("get-areas"),
    addAreas: (area) => ipcRenderer.invoke("add-areas", area),
    updateAreas: (id, area) => ipcRenderer.invoke("update-areas", id, area),
    deleteAreas: (id) => ipcRenderer.invoke("delete-areas", id),

      /// Table functions
    getTable: (areaId =null) => ipcRenderer.invoke("get-table",areaId),
    addTable: (table) => ipcRenderer.invoke("add-table", table),
    updateTable: (id, table) => ipcRenderer.invoke("update-table", id, table),
    deleteTable: (id) => ipcRenderer.invoke("delete-table", id),

       /// Customer functions
    getCustomer: (search = "") => ipcRenderer.invoke("get-customer", search),
    addCustomer: (customer) => ipcRenderer.invoke("add-customer", customer),
    updateCustomer: (id, customer) => ipcRenderer.invoke("update-customer", id, customer),
    deleteCustomer: (id) => ipcRenderer.invoke("delete-customer", id),

          /// Delivery Executive functions
    getDeliveryExecutives: (search = "") => ipcRenderer.invoke("get-delivery-executive", search),
    addDeliveryExecutive: (deliveryExecutive) => ipcRenderer.invoke("add-delivery-executive", deliveryExecutive),
    updateDeliveryExecutive: (id, deliveryExecutive) => ipcRenderer.invoke("update-delivery-executive", id, deliveryExecutive),
    deleteDeliveryExecutive: (id) => ipcRenderer.invoke("delete-delivery-executive", id),

           /// Staff functions
    getStaffs: (search = "") => ipcRenderer.invoke("get-staff", search),

});


