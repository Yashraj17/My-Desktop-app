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
  //addFrontDetailBackup
  ipcMain.handle("add-front-detail-backup", (event, data) => {
    return controller.addFrontDetailBackup(data);
  });
  //addFrontFaqSettingBackup
  ipcMain.handle("add-front-faq-setting-backup", (event, data) => {
    return controller.addFrontFaqSettingBackup(data);
  });
  //addFrontFeatureBackup
   ipcMain.handle("add-front-feature-backup", (event, data) => {
    return controller.addFrontFeatureBackup(data);
  });
  //addFrontReviewSettingBackup
  ipcMain.handle("add-front-review-setting-backup", (event, data) => {
    return controller.addFrontReviewSettingBackup(data);
  });
  //addGlobalInvoiceBackup
  ipcMain.handle("add-global-invoice-backup", (event, data) => {
    return controller.addGlobalInvoiceBackup(data);
  });
  //addGlobalSettingBackup
  ipcMain.handle("add-global-setting-backup", (event, data) => {
    return controller.addGlobalSettingBackup(data);
  });
  //addGlobalSubscriptionBackup
  ipcMain.handle("add-global-subscription-backup", (event, data) => {
    return controller.addGlobalSubscriptionBackup(data);
  });
  //addJobBackup
  ipcMain.handle("add-job-backup", (event, data) => {
    return controller.addJobBackup(data);
  });
  //addModifierOptionBackup
  ipcMain.handle("add-modifire-option-backup", (event, data) => {
    return controller.addModifierOptionBackup(data);
  });
  //addJobBatchBackup
  ipcMain.handle("add-job-batch-backup", (event, data) => {
    return controller.addJobBatchBackup(data);
  });
  //addKotBackup
  ipcMain.handle("add-kot-backup", (event, data) => {
    return controller.addKotBackup(data);
  });
  //addKotCancelReasonBackup
  ipcMain.handle("add-kot-cancel-reason-backup", (event, data) => {
    return controller.addKotCancelReasonBackup(data);
  });
  //addKotItemBackup
  ipcMain.handle("add-kot-item-backup", (event, data) => {
    return controller.addKotItemBackup(data);
  });
  //addKotItemModifierOptionBackup
  ipcMain.handle("add-kot-item-modifier-option-backup", (event, data) => {
    return controller.addKotItemModifierOptionBackup(data);
  });
  //addKotPlaceBackup
  ipcMain.handle("add-kot-place-backup", (event, data) => {
    return controller.addKotPlaceBackup(data);
  });
  //addKotSettingBackup
  ipcMain.handle("add-kot-setting-backup", (event, data) => {
    return controller.addKotSettingBackup(data);
  });
  //addLanguageSettingBackup
  ipcMain.handle("add-language-setting-backup", (event, data) => {
    return controller.addLanguageSettingBackup(data);
  });
  //addLtmTranslationBackup
  ipcMain.handle("add-ltm-translation-backup", (event, data) => {
    return controller.addLtmTranslationBackup(data);
  });
  //addMigrationBackup
  ipcMain.handle("add-migration-backup", (event, data) => {
    return controller.addMigrationBackup(data);
  });
  //addModelHasPermissionBackup
  ipcMain.handle("add-model-has-permission-backup", (event, data) => {
    return controller.addModelHasPermissionBackup(data);
  });
  //addModelHasRoleBackup
  ipcMain.handle("add-model-has-role-backup", (event, data) => {
    return controller.addModelHasRoleBackup(data);
  });
  //addModuleBackup
   ipcMain.handle("add-module-backup", (event, data) => {
    return controller.addModuleBackup(data);
  });
  //addNotificationSettingBackup
  ipcMain.handle("add-notification-setting-backup", (event, data) => {
    return controller.addNotificationSettingBackup(data);
  });
  //addOfflinePaymentMethodBackup
  ipcMain.handle("add-offline-payment-method-backup", (event, data) => {
    return controller.addOfflinePaymentMethodBackup(data);
  });
  //addOfflinePlanChangeBackup
  ipcMain.handle("add-offline-plan-change-backup", (event, data) => {
    return controller.addOfflinePlanChangeBackup(data);
  });
  //addOnboardingStepBackup
  ipcMain.handle("add-onboarding-step-backup", (event, data) => {
    return controller.addOnboardingStepBackup(data);
  });
  //saveSyncTime
  ipcMain.handle("save-sync-time", (event, data) => {
    return controller.saveSyncTime(data);
  });
}

module.exports = BackupRoutes;
