const { ipcMain } = require("electron");
const controller = require("../controllers/backupController");

function BackupRoutes() {
  ipcMain.handle("add-area-backup", (event, data) => {
    return controller.addAreaBackup(data);
  });
   ipcMain.handle("add-branch-delivery-settings-backup", (event, data) => {
    return controller.addBranchDeliverySettingBackup(data);
  });
  ipcMain.handle("add-contact-backup", (event, data) => {
    return controller.addContactBackup(data);
  });
  ipcMain.handle("add-customer-backup", (event, data) => {
    return controller.addCustomerBackup(data);
  });
   ipcMain.handle("add-delivery-executive-backup", (event, data) => {
    return controller.addDeliveryExecutiveBackup(data);
  });
  ipcMain.handle("add-desktop-application-backup", (event, data) => {
    return controller.addDesktopApplicationBackup(data);
  });
   ipcMain.handle("add-email-setting-backup", (event, data) => {
    return controller.addEmailSettingBackup(data);
  });
  ipcMain.handle("add-expense-category-backup", (event, data) => {
    return controller.addExpenseCategoryBackup(data);
  });
  ipcMain.handle("add-expense-backup", (event, data) => {
    return controller.addExpenseBackup(data);
  });
   ipcMain.handle("add-menu-item-backup", (event, data) => {
    return controller.addMenuItemBackup(data);
  });
   ipcMain.handle("add-menu-item-traslation-backup", (event, data) => {
    return controller.addMenuItemTranslationBackup(data);
  });
     ipcMain.handle("add-menu-item-variation-backup", (event, data) => {
    return controller.addMenuItemVariationBackup(data);
  });
   ipcMain.handle("add-menu-category-backup", (event, data) => {
    return controller.addMenuCategoryBackup(data);
  });
   ipcMain.handle("add-modifier-group-backup", (event, data) => {
    return controller.addModifierGroupBackup(data);
  });
   ipcMain.handle("add-item-modifier-backup", (event, data) => {
    return controller.addItemModifierBackup(data);
  });
  //addFailedJobBackup
   ipcMain.handle("add-faild-job-backup", (event, data) => {
    return controller.addFailedJobBackup(data);
  });
  //addFileStorageBackup
   ipcMain.handle("add-file-storage-backup", (event, data) => {
    return controller.addFileStorageBackup(data);
  });
  //addFileStorageSettingBackup
  ipcMain.handle("add-file-storage-setting-backup", (event, data) => {
    return controller.addFileStorageSettingBackup(data);
  });
  //addFlagBackup
  ipcMain.handle("add-flag-backup", (event, data) => {
    return controller.addFlagBackup(data);
  });
  //addTableBackup
  ipcMain.handle("add-table-backup", (event, data) => {
    return controller.addTableBackup(data);
  });
  //addInventorySettingBackup
  ipcMain.handle("add-inventory-setting-backup", (event, data) => {
    return controller.addInventorySettingBackup(data);
  });
  //addInventoryStockBackup
  ipcMain.handle("add-inventory-stock-backup", (event, data) => {
    return controller.addInventoryStockBackup(data);
  });
  //addInventoryMovementBackup
  ipcMain.handle("add-inventory-movement-backup", (event, data) => {
    return controller.addInventoryMovementBackup(data);
  });
  //addInventoryItemCategoryBackup
  ipcMain.handle("add-inventory-item-category-backup", (event, data) => {
    return controller.addInventoryItemCategoryBackup(data);
  });
  //addInventoryItemBackup
  ipcMain.handle("add-inventory-item-backup", (event, data) => {
    return controller.addInventoryItemBackup(data);
  });
  //addInventoryGlobalSettingBackup
  ipcMain.handle("add-inventory-global-setting-backup", (event, data) => {
    return controller.addInventoryGlobalSettingBackup(data);
  });
}

module.exports = BackupRoutes;
