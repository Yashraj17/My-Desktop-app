// backend/index.js
const { app, BrowserWindow } = require("electron");
const path = require("path");
const categoryRoutes = require("./routes/categoryRoutes");
const modifierRoutes = require("./routes/modifierRoutes");
const modifierGroupRoutes = require("./routes/modifierGroupRoutes");
const menuItemRoutes = require("./routes/menuItemRoutes");
const menuRoutes = require("./routes/menuRoutes");
const areaRoutes = require("./routes/areaRoutes");
const tableRoutes = require("./routes/tableRoutes");
const customerRoutes = require("./routes/customerRoutes");
const deliveryExecutiveRoutes = require("./routes/deliveryExecutiveRoutes");
const staffRoutes = require("./routes/staffRoutes");
const orderRoutes = require("./routes/orderRoutes");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  categoryRoutes();
  modifierRoutes(); 
  modifierGroupRoutes();
  menuItemRoutes();
  menuRoutes();
  createWindow();
  areaRoutes();
  tableRoutes();
  customerRoutes();
  deliveryExecutiveRoutes();
  staffRoutes();
  orderRoutes()
});
